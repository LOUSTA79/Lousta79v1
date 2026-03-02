#!/usr/bin/env python3
"""
Production Example - Real Book Production with Claude API

This example shows how to use the system for actual book production.
Requires: Anthropic API key
"""

import asyncio
import os
from ai_publishing_system import PublishingOrchestrator

# ============================================================================
# CONFIGURATION
# ============================================================================

# Get API key from environment or set it here
API_KEY = os.getenv("ANTHROPIC_API_KEY", "your-api-key-here")

# Book specifications
BOOKS_TO_PRODUCE = [
    {
        "title": "The AI Revolution: A Complete Guide to Machine Learning",
        "genre": "Technology",
        "target_words": 50000
    },
    {
        "title": "Mastering Python Programming: From Basics to Advanced",
        "genre": "Technical",
        "target_words": 45000
    },
    {
        "title": "The Art of Productivity: Getting Things Done in the Modern Age",
        "genre": "Self-Help",
        "target_words": 40000
    }
]

# ============================================================================
# SINGLE BOOK PRODUCTION
# ============================================================================

async def produce_single_book():
    """Produce a single book - simplest example"""
    
    print("🚀 Single Book Production Example")
    print("="*80)
    
    # Initialize orchestrator
    orchestrator = PublishingOrchestrator(API_KEY)
    
    # Produce one book
    book = await orchestrator.produce_book(
        title="The Future of AI",
        genre="Technology",
        target_words=50000
    )
    
    # Print results
    print(f"\n{'='*80}")
    print(f"✅ BOOK PRODUCTION COMPLETED")
    print(f"{'='*80}")
    print(f"📖 Title: {book.title}")
    print(f"📈 Status: {book.status.value}")
    print(f"⭐ QA Score: {book.qa_score}/100")
    print(f"📚 Chapters: {len(book.chapters)}")
    print(f"📝 Word Count: {len(book.manuscript.split()) if book.manuscript else 0}")
    print(f"🌐 Published to: {', '.join(book.platforms_published)}")
    print(f"{'='*80}\n")
    
    return book

# ============================================================================
# BATCH PRODUCTION
# ============================================================================

async def produce_batch():
    """Produce multiple books in parallel"""
    
    print("🏭 Batch Production Example")
    print("="*80)
    print(f"📚 Queueing {len(BOOKS_TO_PRODUCE)} books for production\n")
    
    # Initialize orchestrator
    orchestrator = PublishingOrchestrator(API_KEY)
    
    # Create production tasks
    tasks = [
        orchestrator.produce_book(
            title=book["title"],
            genre=book["genre"],
            target_words=book["target_words"]
        )
        for book in BOOKS_TO_PRODUCE
    ]
    
    # Execute all in parallel
    books = await asyncio.gather(*tasks)
    
    # Print summary
    print(f"\n{'='*80}")
    print(f"🎉 BATCH PRODUCTION COMPLETED")
    print(f"{'='*80}")
    print(f"📊 Books Produced: {len(books)}")
    print(f"✅ Success Rate: {sum(1 for b in books if b.qa_passed) / len(books) * 100:.0f}%")
    print(f"⭐ Average QA Score: {sum(b.qa_score for b in books) / len(books):.1f}/100")
    print(f"\n📚 Books:")
    for i, book in enumerate(books, 1):
        print(f"   {i}. {book.title}")
        print(f"      Status: {book.status.value} | Score: {book.qa_score}/100")
        print(f"      Platforms: {', '.join(book.platforms_published)}")
    print(f"{'='*80}\n")
    
    return books

# ============================================================================
# CUSTOM BOOK PRODUCTION
# ============================================================================

async def produce_custom_book(title: str, genre: str, words: int = 50000):
    """Produce a custom book with monitoring"""
    
    print(f"📘 Custom Book Production: {title}")
    print("="*80)
    
    orchestrator = PublishingOrchestrator(API_KEY)
    
    # Produce book
    book = await orchestrator.produce_book(title, genre, words)
    
    # Detailed results
    print(f"\n{'='*80}")
    print(f"📊 DETAILED RESULTS")
    print(f"{'='*80}")
    print(f"Title: {book.title}")
    print(f"Genre: {book.genre}")
    print(f"Status: {book.status.value}")
    print(f"\n📝 Production Metrics:")
    print(f"   • Chapters Written: {len(book.chapters)}")
    print(f"   • Total Words: {len(book.manuscript.split()) if book.manuscript else 0}")
    print(f"   • QA Score: {book.qa_score}/100")
    print(f"   • QA Passed: {'Yes ✓' if book.qa_passed else 'No ✗'}")
    print(f"\n🌐 Distribution:")
    print(f"   • Platforms: {', '.join(book.platforms_published)}")
    print(f"   • Total Platforms: {len(book.platforms_published)}")
    
    # Show production log
    print(f"\n📋 Production Log (last 10 entries):")
    for log in book.logs[-10:]:
        print(f"   {log}")
    
    print(f"{'='*80}\n")
    
    return book

# ============================================================================
# SYSTEM MONITORING
# ============================================================================

async def monitor_production():
    """Example with system monitoring"""
    
    print("📊 Production with System Monitoring")
    print("="*80)
    
    orchestrator = PublishingOrchestrator(API_KEY)
    
    # Get initial stats
    stats_before = orchestrator.get_system_stats()
    print("\n🔍 System Status (Before):")
    print(f"   • Total Agents: {stats_before['total_agents']}")
    print(f"   • Books in Production: {stats_before['books_in_production']}")
    print(f"   • Books Completed: {stats_before['books_completed']}")
    
    # Produce book
    print("\n🚀 Starting production...\n")
    book = await orchestrator.produce_book(
        "Monitoring Demo Book",
        "Technology",
        30000
    )
    
    # Get final stats
    stats_after = orchestrator.get_system_stats()
    print(f"\n🔍 System Status (After):")
    print(f"   • Total Agents: {stats_after['total_agents']}")
    print(f"   • Books in Production: {stats_after['books_in_production']}")
    print(f"   • Books Completed: {stats_after['books_completed']}")
    
    print(f"\n📈 Agent Utilization:")
    for agent_type, count in stats_after['agent_utilization'].items():
        print(f"   • {agent_type.capitalize()}: {count} agents busy")
    
    print(f"{'='*80}\n")
    
    return book

# ============================================================================
# MAIN MENU
# ============================================================================

async def main():
    """Main entry point with menu"""
    
    print("""
╔════════════════════════════════════════════════════════════════════════════╗
║                   AI PUBLISHING CORPORATION                                ║
║                   Production Example Menu                                  ║
╚════════════════════════════════════════════════════════════════════════════╝

Select an example to run:

1. Single Book Production
   → Produce one book from start to finish
   
2. Batch Production  
   → Produce multiple books in parallel
   
3. Custom Book Production
   → Specify your own book details
   
4. Production with Monitoring
   → See system statistics during production

5. Exit

═══════════════════════════════════════════════════════════════════════════
    """)
    
    choice = input("Enter your choice (1-5): ").strip()
    
    if choice == "1":
        await produce_single_book()
        
    elif choice == "2":
        await produce_batch()
        
    elif choice == "3":
        title = input("\nEnter book title: ").strip()
        genre = input("Enter genre: ").strip()
        words = int(input("Enter target word count (default 50000): ").strip() or 50000)
        await produce_custom_book(title, genre, words)
        
    elif choice == "4":
        await monitor_production()
        
    elif choice == "5":
        print("\n👋 Goodbye!\n")
        return
        
    else:
        print("\n❌ Invalid choice. Please run again and select 1-5.\n")

# ============================================================================
# RUN
# ============================================================================

if __name__ == "__main__":
    # Check for API key
    if API_KEY == "your-api-key-here":
        print("""
╔════════════════════════════════════════════════════════════════════════════╗
║                         ⚠️  API KEY REQUIRED                               ║
╚════════════════════════════════════════════════════════════════════════════╝

This production example requires an Anthropic API key.

To get started:

1. Get your API key from: https://console.anthropic.com

2. Set it in one of two ways:
   
   Option A - Environment Variable:
   export ANTHROPIC_API_KEY="your-key-here"
   
   Option B - Edit this file:
   Open production_example.py and replace:
   API_KEY = "your-api-key-here"
   with your actual key

3. Run again: python production_example.py

═══════════════════════════════════════════════════════════════════════════

Want to try the system without an API key?
Run the demo instead: python demo_system.py

═══════════════════════════════════════════════════════════════════════════
        """)
    else:
        # Run main menu
        asyncio.run(main())
