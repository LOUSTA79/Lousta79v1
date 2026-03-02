const fs = require('fs');
const log = (msg) => console.log(`[DRIP-MANAGER] ${new Date().toISOString()} - ${msg}`);

class DripManager {
  constructor() {
    this.queuePath = 'RUNTIME/db/upload_queue.json';
    this.configPath = 'LIMBS/sales/lousta_sys_indian_drip.json';
    if (!fs.existsSync(this.queuePath)) fs.writeFileSync(this.queuePath, '[]');
  }

  // THE MISSING LINK: Connecting the IST schedule to the engine
  syncSchedule(timezone) {
    log(`🌍 Syncing production pulse to ${timezone} markets...`);
    if (fs.existsSync(this.configPath)) {
      const schedule = JSON.parse(fs.readFileSync(this.configPath));
      log(`✅ Loaded ${schedule.schedule.length} target windows for ${schedule.market}.`);
      return true;
    }
    log("⚠️ No schedule config found to sync.");
    return false;
  }

  addToQueue(product) {
    const queue = JSON.parse(fs.readFileSync(this.queuePath));
    queue.push({ ...product, status: 'pending', addedAt: Date.now() });
    fs.writeFileSync(this.queuePath, JSON.stringify(queue, null, 2));
    log(`Added "${product.title}" to the global drip queue.`);
  }

  async processNext() {
    log("Checking queue for next scheduled release...");
    // Logic for automated platform push goes here
  }
}

// Exporting a singleton instance
module.exports = new DripManager();
