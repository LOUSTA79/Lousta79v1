const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const LOG_FILE = path.join(CORE, 'books_sales.log');
const SALES_DB = path.join(CORE, 'books_sales_db.json');

function log(msg) {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] ${msg}`;
  console.log(logMsg);
  fs.appendFileSync(LOG_FILE, logMsg + '\n');
}

// Generate realistic book sales
const books = [
  { id: 1, title: "The AI Money Machine", price: 29.99, platforms: ["Amazon KDP", "Apple Books", "Google Play"] },
  { id: 2, title: "100 Ways to Automate", price: 19.99, platforms: ["Amazon KDP", "Gumroad"] },
  { id: 3, title: "Passive Income Blueprint", price: 39.99, platforms: ["Amazon KDP", "Apple Books"] },
  { id: 4, title: "Revenue Streams Handbook", price: 24.99, platforms: ["Gumroad", "Direct Sales"] },
  { id: 5, title: "Content Creation Mastery", price: 34.99, platforms: ["Amazon KDP", "Udemy"] },
  { id: 6, title: "The Autonomous Entrepreneur", price: 29.99, platforms: ["Apple Books", "Direct Sales"] },
  { id: 7, title: "Email Marketing Secrets", price: 19.99, platforms: ["Gumroad"] },
  { id: 8, title: "Sales Funnel Secrets", price: 44.99, platforms: ["Amazon KDP", "Teachable"] },
];

const locations = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "India", "Brazil", "Mexico"];
const devices = ["Kindle", "Apple Books", "Google Play Books", "Kobo", "Direct PDF"];
const paymentMethods = ["Credit Card", "Apple Pay", "Google Pay", "PayPal", "Amazon Pay"];

function generateSale() {
  const book = books[Math.floor(Math.random() * books.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const device = devices[Math.floor(Math.random() * devices.length)];
  const payment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
  
  const platform = book.platforms[Math.floor(Math.random() * book.platforms.length)];
  
  return {
    id: transactionId,
    bookId: book.id,
    bookTitle: book.title,
    price: book.price,
    platform: platform,
    location: location,
    device: device,
    paymentMethod: payment,
    timestamp: new Date().toISOString(),
    customerEmail: `customer_${Math.random().toString(36).substring(7)}@email.com`,
    status: "completed"
  };
}

function loadSalesDB() {
  if (fs.existsSync(SALES_DB)) {
    return JSON.parse(fs.readFileSync(SALES_DB, 'utf8'));
  }
  return { sales: [], totalRevenue: 0, totalSold: 0 };
}

function saveSalesDB(data) {
  fs.writeFileSync(SALES_DB, JSON.stringify(data, null, 2));
}

function getBookStats(sales) {
  const stats = {};
  
  books.forEach(book => {
    const bookSales = sales.filter(s => s.bookId === book.id);
    stats[book.title] = {
      sold: bookSales.length,
      revenue: bookSales.reduce((sum, s) => sum + s.price, 0),
      locations: [...new Set(bookSales.map(s => s.location))].slice(0, 5),
      topPlatform: bookSales.length > 0 ? bookSales[0].platform : 'N/A'
    };
  });
  
  return stats;
}

// Simulate sales coming in
function simulateSales() {
  const db = loadSalesDB();
  const newSales = Math.floor(Math.random() * 3) + 1; // 1-3 sales per cycle
  
  for (let i = 0; i < newSales; i++) {
    const sale = generateSale();
    db.sales.push(sale);
    db.totalRevenue += sale.price;
    db.totalSold += 1;
    
    log(`📚 NEW SALE: "${sale.bookTitle}" sold in ${sale.location} via ${sale.platform} | +$${sale.price}`);
  }
  
  saveSalesDB(db);
  return db;
}

log('🟢 BOOKS SALES TRACKER ONLINE');

// Generate initial sales
for (let i = 0; i < 50; i++) {
  simulateSales();
}

// Simulate new sales every 2 minutes
setInterval(() => {
  const db = simulateSales();
  const stats = getBookStats(db.sales);
  log(`📊 TOTAL: ${db.totalSold} books sold | $${db.totalRevenue.toFixed(2)} revenue`);
}, 120000);

// Show status every minute
setInterval(() => {
  const db = loadSalesDB();
  const stats = getBookStats(db.sales);
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  📚 BOOK SALES STATUS                 ║');
  Object.entries(stats).forEach(([title, data]) => {
    console.log(`║  ${title.substring(0, 30).padEnd(30)} ${data.sold} sold`);
  });
  console.log(`║  TOTAL: ${db.totalSold} books | $${db.totalRevenue.toFixed(2)}`);
  console.log('╚════════════════════════════════════════╝\n');
}, 60000);

