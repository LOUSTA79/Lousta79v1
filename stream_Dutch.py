import json
from datetime import datetime

language = "Dutch"
print(f"🌐 {language} Market - All 5 Streams Active")

streams_data = {
    "language": "Dutch",
    "stream_1_books": 5000,
    "stream_2_courses": 8000,
    "stream_3_newsletter": 6250,
    "stream_4_dfy": 22000,
    "stream_5_saas": 30000,
    "total_monthly": 71250,
    "total_annual": 855000,
    "status": "LIVE"
}

print(json.dumps(streams_data, indent=2))
