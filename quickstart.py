#!/usr/bin/env python3
"""
AI Publishing Corporation - Quick Start Guide
Run this to see the system in action!
"""

print("""
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║              🏢 AI PUBLISHING CORPORATION                                 ║
║              Multi-Agent Book Production System v2.0                       ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

📚 WHAT THIS SYSTEM DOES:
   Automates complete book production from concept to publication using
   48+ specialized AI agents working across 6 production phases.

🤖 AGENT BREAKDOWN:
   • Research Agents (12) - Market analysis & planning
   • Writing Agents (12) - Parallel chapter generation
   • Editing Agents (4) - Multi-tier manuscript refinement
   • Media Agents (12) - Audiobook & video production
   • QA Agents (2) - Quality assurance & scoring
   • Upload Agents (3) - Multi-platform distribution

⚙️  PRODUCTION PIPELINE:
   Phase 1: Research → Phase 2: Writing → Phase 3: Editing →
   Phase 4: Media Production → Phase 5: QA → Phase 6: Upload

📊 CAPACITY:
   • Target: 12 books per day
   • Word Count: 50,000 words per book
   • Quality Threshold: 85/100 minimum
   • Platforms: Amazon, Apple, Google (+ more)

═══════════════════════════════════════════════════════════════════════════

🚀 GETTING STARTED:

Option 1: DEMO MODE (No API Key Required)
─────────────────────────────────────────
Run the simulated demo to see how the system works:

   python demo_system.py

This will produce a complete book with simulated agents showing
all 6 phases of production in action.


Option 2: PRODUCTION MODE (Requires Anthropic API Key)
───────────────────────────────────────────────────────
For real AI-powered book production:

1. Get your API key from: https://console.anthropic.com
2. Set your API key:
   export ANTHROPIC_API_KEY="your-key-here"
3. Run production:
   python production_example.py


Option 3: WEB DASHBOARD
────────────────────────
View the interactive visual dashboard:

   Open: ai-publishing-corporation.html in your browser

═══════════════════════════════════════════════════════════════════════════

📁 FILES IN THIS SYSTEM:

1. demo_system.py
   → Simulated demo (no API needed)
   → Perfect for understanding the workflow
   → Shows all phases and agent interactions

2. ai_publishing_system.py
   → Full production system
   → Requires Anthropic API key
   → Real AI-powered book generation

3. ai-publishing-corporation.html
   → Interactive web dashboard
   → Visualize agent types and phases
   → System capabilities overview

4. README.md
   → Complete documentation
   → Technical details
   → API usage examples

5. quickstart.py (this file)
   → Getting started guide
   → Quick reference

═══════════════════════════════════════════════════════════════════════════

💡 EXAMPLE: Producing Your First Book

from ai_publishing_system import PublishingOrchestrator
import asyncio

async def produce_book():
    # Initialize orchestrator
    orch = PublishingOrchestrator("your-api-key")
    
    # Produce a book
    book = await orch.produce_book(
        title="The Future of AI: A Complete Guide",
        genre="Technology",
        target_words=50000
    )
    
    # Check results
    print(f"✅ Book: {book.title}")
    print(f"📊 Status: {book.status}")
    print(f"⭐ QA Score: {book.qa_score}/100")
    print(f"🌐 Platforms: {', '.join(book.platforms_published)}")

# Run it
asyncio.run(produce_book())

═══════════════════════════════════════════════════════════════════════════

🎯 NEXT STEPS:

1. Run the demo to understand the workflow:
   → python demo_system.py

2. Explore the web dashboard:
   → Open ai-publishing-corporation.html

3. Read the documentation:
   → Check README.md for technical details

4. Try production mode (with API key):
   → Set API key and run ai_publishing_system.py

═══════════════════════════════════════════════════════════════════════════

📞 NEED HELP?

• Demo not working? Make sure Python 3.8+ is installed
• API errors? Check your API key and credits
• Want to customize? See README.md for architecture details

═══════════════════════════════════════════════════════════════════════════

🎉 Let's start by running the demo!

   python demo_system.py

═══════════════════════════════════════════════════════════════════════════
""")

# Auto-run demo if executed directly
if __name__ == "__main__":
    import sys
    
    print("\n🎬 Would you like to run the demo now? (y/n): ", end="")
    response = input().strip().lower()
    
    if response == 'y':
        print("\n🚀 Starting demo...\n")
        import subprocess
        subprocess.run([sys.executable, "demo_system.py"])
    else:
        print("\n👍 No problem! Run 'python demo_system.py' whenever you're ready.\n")
