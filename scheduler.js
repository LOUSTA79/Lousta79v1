#!/usr/bin/env node
/**
 * LOUSTA PRODUCTION SCHEDULER - TERMUX EDITION
 * Hardened for S25 Ultra / Android 15 Environment
 */

const { spawn } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// TERMUX PATH DETECTION
const TERMUX_HOME = process.env.HOME || '/data/data/com.termux/files/home';
const REPO_ROOT = path.join(TERMUX_HOME, 'LA-Nexus/ALourithm_Core');

const CONFIG = {
  dbDir: path.join(REPO_ROOT, 'RUNTIME/db'),
  db: path.join(REPO_ROOT, 'RUNTIME/db/lousta.db'),
  repoRoot: REPO_ROOT,
  swarmScript: 'LIMBS/publishing/lousta_sys_triple_threat.sh',
  checkInterval: 30000, 
  maxConcurrentProductions: 1, 
  productionTimeout: 1800000, 
};

const log = (msg) => console.log(`[SCHEDULER] ${new Date().toISOString()} - ${msg}`);
const err = (msg) => console.error(`[SCHEDULER] ❌ ${new Date().toISOString()} - ${msg}`);

class ProductionScheduler {
  constructor() {
    this.db = null;
    this.running = false;
    this.activeProductions = 0;
  }

  async init() {
    if (!fs.existsSync(CONFIG.dbDir)) {
      fs.mkdirSync(CONFIG.dbDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(CONFIG.db, async (error) => {
        if (error) reject(error);
        else {
          log('✅ Database connected');
          await this.setupTables();
          resolve();
        }
      });
    });
  }

  async setupTables() {
    const schema = `
      CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_text TEXT UNIQUE,
        status TEXT DEFAULT 'pending',
        processed_at DATETIME
      );
      CREATE TABLE IF NOT EXISTS production_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER,
        status TEXT DEFAULT 'queued',
        priority INTEGER DEFAULT 1,
        retry_count INTEGER DEFAULT 0,
        scheduled_for DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        started_at DATETIME,
        completed_at DATETIME,
        FOREIGN KEY(topic_id) REFERENCES topics(id)
      );
      CREATE TABLE IF NOT EXISTS production_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER,
        topic_text TEXT,
        status TEXT,
        started_at DATETIME,
        completed_at DATETIME,
        duration_seconds INTEGER,
        error_log TEXT
      );
    `;
    return new Promise((resolve, reject) => {
      this.db.exec(schema, (e) => e ? reject(e) : resolve());
    });
  }

  async start() {
    try {
      await this.init();
      this.running = true;
      log('🚀 LouBot Scheduler Ignited on Termux');
      this.mainLoop();
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());
    } catch (error) {
      err(`Failed to start: ${error.message}`);
      process.exit(1);
    }
  }

  async mainLoop() {
    while (this.running) {
      try {
        await this.checkQueue();
      } catch (error) {
        err(`Main loop error: ${error.message}`);
      }
      await this.sleep(CONFIG.checkInterval);
    }
  }

  async checkQueue() {
    const job = await this.dbGet(
      `SELECT pq.id, pq.topic_id, t.topic_text 
       FROM production_queue pq
       JOIN topics t ON pq.topic_id = t.id
       WHERE pq.status = 'queued' 
       AND (pq.scheduled_for IS NULL OR pq.scheduled_for <= datetime('now'))
       ORDER BY pq.priority DESC, pq.created_at ASC
       LIMIT 1`
    );

    if (!job) return;
    if (this.activeProductions >= CONFIG.maxConcurrentProductions) return;

    await this.executeProduction(job);
  }

  async executeProduction(job) {
    const runId = const runId = const runId = await this.createRun(job);
    this.activeProductions++;
    try {
      await this.dbRun("UPDATE production_queue SET status='running', started_at=datetime('now') WHERE id=?", [job.id]);
      log(`🏭 Manufacturing Batch: "${job.topic_text}"`);
      const start = Date.now();
      await this.executeSwarm(job.topic_text);
      const dur = Math.round((Date.now() - start) / 1000);
      await this.dbRun("UPDATE production_runs SET status='completed', completed_at=datetime('now'), duration_seconds=? WHERE id=?", [dur, runId]);
      await this.dbRun("UPDATE production_queue SET status='completed', completed_at=datetime('now') WHERE id=?", [job.id]);
      await this.dbRun("UPDATE topics SET status='completed', processed_at=datetime('now') WHERE id=?", [job.topic_id]);
      log(`✅ Batch Complete (${dur}s): "${job.topic_text}"`);
    } catch (e) {
      err(`Production Crash: ${e.message}`);
      await this.dbRun("UPDATE production_runs SET status='failed', error_log=? WHERE id=?", [e.message, runId]);
      await this.dbRun("UPDATE production_queue SET status='failed' WHERE id=?", [job.id]);
    } finally {
      this.activeProductions--;
    }
  }

  executeSwarm(topic) {
    return new Promise((res, rej) => {
      const script = path.join(CONFIG.repoRoot, CONFIG.swarmScript);
      const child = spawn('bash', [script, topic], { cwd: CONFIG.repoRoot });
      child.on('close', (code) => code === 0 ? res() : rej(new Error(`Code ${code}`)));
    });
  }

  createRun(job) {
    return new Promise((res, rej) => {
      this.db.run("INSERT INTO production_runs (topic_id, topic_text, status, started_at) VALUES (?, ?, 'pending', datetime('now'))",
        [job.topic_id, job.topic_text], function(e) { e ? rej(e) : res(this.lastID); });
    });
  }

  sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  dbRun(sql, params = []) { return new Promise((r, j) => { this.db.run(sql, params, (e) => e ? j(e) : r()); }); }
  dbGet(sql, params = []) { return new Promise((r, j) => { this.db.get(sql, params, (e, row) => e ? j(e) : r(row)); }); }

  async shutdown() {
    this.running = false;
    if (this.db) this.db.close();
    process.exit(0);
  }
}

new ProductionScheduler().start();
