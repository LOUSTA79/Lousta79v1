
# 6. LIVE FEED
echo "📡 Starting Live Feed (port 5002)..."
nohup node live_feed.js > live_feed.log 2>&1 &
LIVE_PID=$!
echo "✅ Live Feed (PID: $LIVE_PID)"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  📡 LIVE FEED: http://localhost:5002       ║"
echo "╚════════════════════════════════════════════╝"

# 7. BOOKS SALES TRACKER
echo "📚 Starting Books Sales Tracker..."
nohup node books_sales_tracker.js > books_sales.log 2>&1 &
BOOKS_PID=$!
echo "✅ Books Sales Tracker (PID: $BOOKS_PID)"
sleep 1

# 8. BOOKS SALES DASHBOARD
echo "📊 Starting Books Sales Dashboard (port 5003)..."
nohup node books_sales_dashboard.js > books_sales_dashboard.log 2>&1 &
SALES_DASH_PID=$!
echo "✅ Books Sales Dashboard (PID: $SALES_DASH_PID)"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  📚 BOOKS SALES: http://localhost:5003     ║"
echo "╚════════════════════════════════════════════╝"
