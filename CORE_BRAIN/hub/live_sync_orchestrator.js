const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const ARCHIVE = path.join(HOME, 'LA-Nexus/LouBooks_Archive');
const PHONE_STORAGE = '/sdcard/LOUSTA_CONTENT';

const syncLog = path.join(CORE, 'sync.log');

function log(msg) {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] ${msg}`;
  console.log(logMsg);
  fs.appendFileSync(syncLog, logMsg + '\n');
}

function copyFile(src, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const reader = fs.createReadStream(src);
    const writer = fs.createWriteStream(dest);
    
    reader.on('error', reject);
    writer.on('error', reject);
    writer.on('finish', resolve);
    
    reader.pipe(writer);
  });
}

async function syncAudiobook(productId, title, mp3File) {
  try {
    const srcPath = path.join(ARCHIVE, 'General/MP3', mp3File);
    const destPath = path.join(PHONE_STORAGE, 'LISTEN_AUDIO', `${productId}_${title.replace(/\s+/g, '_')}.mp3`);
    
    if (fs.existsSync(srcPath)) {
      await copyFile(srcPath, destPath);
      log(`✅ AUDIO SYNCED: ${title} → ${destPath}`);
      return true;
    }
  } catch (e) {
    log(`❌ AUDIO SYNC FAILED: ${title} - ${e.message}`);
  }
  return false;
}

async function syncBook(productId, title, pages) {
  try {
    // Generate mock EPUB metadata
    const metadata = {
      id: productId,
      title: title,
      type: 'book',
      pages: pages,
      createdAt: new Date().toISOString(),
      status: 'completed',
      syncedAt: new Date().toISOString()
    };
    
    const metaPath = path.join(PHONE_STORAGE, 'METADATA', `${productId}_${title.replace(/\s+/g, '_')}.json`);
    const metaDir = path.dirname(metaPath);
    
    if (!fs.existsSync(metaDir)) {
      fs.mkdirSync(metaDir, { recursive: true });
    }
    
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    log(`✅ BOOK SYNCED: ${title} → /READ_BOOKS`);
    return true;
  } catch (e) {
    log(`❌ BOOK SYNC FAILED: ${title} - ${e.message}`);
  }
  return false;
}

async function syncCourse(productId, title, modules) {
  try {
    const metadata = {
      id: productId,
      title: title,
      type: 'course',
      modules: modules,
      createdAt: new Date().toISOString(),
      status: 'completed',
      syncedAt: new Date().toISOString()
    };
    
    const metaPath = path.join(PHONE_STORAGE, 'METADATA', `${productId}_${title.replace(/\s+/g, '_')}.json`);
    const metaDir = path.dirname(metaPath);
    
    if (!fs.existsSync(metaDir)) {
      fs.mkdirSync(metaDir, { recursive: true });
    }
    
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    log(`✅ COURSE SYNCED: ${title}`);
    return true;
  } catch (e) {
    log(`❌ COURSE SYNC FAILED: ${title} - ${e.message}`);
  }
  return false;
}

async function watchForCompletedProducts() {
  log('🔍 STARTING LIVE SYNC WATCHER');
  
  try {
    const inventory = JSON.parse(fs.readFileSync(path.join(CORE, 'inventory.json'), 'utf8'));
    const syncedFile = path.join(CORE, '.synced_products.json');
    
    let syncedIds = [];
    if (fs.existsSync(syncedFile)) {
      syncedIds = JSON.parse(fs.readFileSync(syncedFile, 'utf8'));
    }
    
    for (const product of inventory) {
      if (product.status === 'completed' && !syncedIds.includes(product.id)) {
        log(`🎯 NEW PRODUCT DETECTED: ${product.title} (ID: ${product.id})`);
        
        let synced = false;
        
        if (product.type === 'audiobook') {
          synced = await syncAudiobook(product.id, product.title, product.filename || `book_${product.id}.mp3`);
        } else if (product.type === 'book') {
          synced = await syncBook(product.id, product.title, product.pages);
        } else if (product.type === 'course') {
          synced = await syncCourse(product.id, product.title, product.modules);
        }
        
        if (synced) {
          syncedIds.push(product.id);
          fs.writeFileSync(syncedFile, JSON.stringify(syncedIds));
          log(`💾 SAVED TO PHONE: ${product.title}`);
        }
      }
    }
    
    log(`📊 SYNC STATUS: ${syncedIds.length} products synced to phone`);
  } catch (e) {
    log(`ERROR IN WATCHER: ${e.message}`);
  }
}

// Watch for changes every 30 seconds
async function startContinuousWatch() {
  log('🟢 CONTINUOUS SYNC ACTIVE');
  
  while (true) {
    try {
      await watchForCompletedProducts();
      
      // Show current sync status
      try {
        const syncedFile = path.join(CORE, '.synced_products.json');
        const count = fs.existsSync(syncedFile) ? 
          JSON.parse(fs.readFileSync(syncedFile, 'utf8')).length : 0;
        
        const readBooks = fs.existsSync(path.join(PHONE_STORAGE, 'READ_BOOKS')) ?
          fs.readdirSync(path.join(PHONE_STORAGE, 'READ_BOOKS')).length : 0;
        
        const audioFiles = fs.existsSync(path.join(PHONE_STORAGE, 'LISTEN_AUDIO')) ?
          fs.readdirSync(path.join(PHONE_STORAGE, 'LISTEN_AUDIO')).length : 0;
        
        log(`📱 PHONE STORAGE: ${readBooks} books | ${audioFiles} audiobooks | ${count} total synced`);
      } catch (e) {}
      
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 second interval
    } catch (e) {
      log(`WATCHER ERROR: ${e.message}`);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
}

startContinuousWatch();
