"""
AI Publishing Corporation - Demo Runner
Simulated version that demonstrates the system without API calls
"""

import asyncio
import random
from datetime import datetime
from typing import List, Dict
from dataclasses import dataclass, field
from enum import Enum

# ============================================================================
# SIMPLIFIED STRUCTURES FOR DEMO
# ============================================================================

class BookStatus(Enum):
    QUEUED = "queued"
    RESEARCHING = "researching"
    WRITING = "writing"
    EDITING = "editing"
    MEDIA_PRODUCTION = "media_production"
    QUALITY_ASSURANCE = "quality_assurance"
    UPLOADING = "uploading"
    COMPLETED = "completed"

@dataclass
class Book:
    id: str
    title: str
    genre: str
    status: BookStatus = BookStatus.QUEUED
    logs: List[str] = field(default_factory=list)
    chapters: List[str] = field(default_factory=list)
    qa_score: float = 0.0
    platforms: List[str] = field(default_factory=list)
    
    def log(self, msg: str):
        timestamp = datetime.now().strftime("%H:%M:%S")
        entry = f"[{timestamp}] {msg}"
        self.logs.append(entry)
        print(f"  📘 {entry}")

# ============================================================================
# SIMULATED AGENT POOLS
# ============================================================================

class AgentPool:
    def __init__(self, name: str, count: int, specialties: List[str] = None):
        self.name = name
        self.count = count
        self.specialties = specialties or []
        self.busy = 0
    
    def get_agent(self):
        if self.busy < self.count:
            self.busy += 1
            return True
        return False
    
    def release_agent(self):
        if self.busy > 0:
            self.busy -= 1

# ============================================================================
# SIMULATED ORCHESTRATOR
# ============================================================================

class SimulatedOrchestrator:
    """Simulated version that demonstrates system behavior"""
    
    def __init__(self):
        # Initialize agent pools
        self.research_pool = AgentPool("Research", 12, 
            ["fiction", "non-fiction", "technical", "self-help"])
        self.writing_pool = AgentPool("Writing", 12)
        self.editing_pool = AgentPool("Editing", 4, 
            ["structure", "copy", "fact-check", "format"])
        self.media_pool = AgentPool("Media", 12, 
            ["audiobook (8)", "video (4)"])
        self.qa_pool = AgentPool("QA", 2)
        self.upload_pool = AgentPool("Upload", 3, 
            ["Amazon", "Apple", "Google"])
        
        self.books_completed = []
        
        print("🚀 AI Publishing Corporation - Multi-Agent System")
        print("="*80)
        print(f"📊 System Initialized:")
        print(f"   🔍 Research Agents: {self.research_pool.count}")
        print(f"   ✍️  Writing Agents: {self.writing_pool.count}")
        print(f"   📝 Editing Agents: {self.editing_pool.count}")
        print(f"   🎬 Media Agents: {self.media_pool.count}")
        print(f"   ✅ QA Agents: {self.qa_pool.count}")
        print(f"   📤 Upload Agents: {self.upload_pool.count}")
        print(f"   📊 Total: {sum([p.count for p in [self.research_pool, self.writing_pool, self.editing_pool, self.media_pool, self.qa_pool, self.upload_pool]])} agents")
        print("="*80)
    
    async def phase_1_research(self, book: Book):
        """Phase 1: Research"""
        book.status = BookStatus.RESEARCHING
        book.log("🔍 PHASE 1: RESEARCH - Starting market analysis")
        
        if self.research_pool.get_agent():
            await asyncio.sleep(0.5)
            book.log("  ├─ Target audience analysis completed")
            await asyncio.sleep(0.5)
            book.log("  ├─ Competitive landscape mapped")
            await asyncio.sleep(0.5)
            book.log("  ├─ Chapter outline created (12 chapters)")
            await asyncio.sleep(0.5)
            book.log("  └─ Market opportunity assessment: HIGH")
            self.research_pool.release_agent()
        
        book.log("✅ PHASE 1 COMPLETED")
    
    async def phase_2_writing(self, book: Book):
        """Phase 2: Writing"""
        book.status = BookStatus.WRITING
        book.log("✍️  PHASE 2: WRITING - Parallel chapter generation")
        
        # Simulate 12 chapters written by multiple agents
        num_chapters = 12
        agents_needed = min(6, self.writing_pool.count)  # Use 6 agents (2 per book)
        
        book.log(f"  ├─ Deploying {agents_needed} writing agents")
        
        for i in range(agents_needed):
            self.writing_pool.get_agent()
        
        # Simulate parallel writing
        for i in range(1, num_chapters + 1):
            await asyncio.sleep(0.3)
            book.chapters.append(f"Chapter {i}")
            if i % 3 == 0:
                book.log(f"  ├─ Chapters {i-2}-{i} completed (~12,500 words)")
        
        for i in range(agents_needed):
            self.writing_pool.release_agent()
        
        book.log(f"  └─ Manuscript complete: {num_chapters} chapters, ~50,000 words")
        book.log("✅ PHASE 2 COMPLETED")
    
    async def phase_3_editing(self, book: Book):
        """Phase 3: Editing"""
        book.status = BookStatus.EDITING
        book.log("📝 PHASE 3: EDITING - 4-tier sequential process")
        
        tiers = ["Structure", "Copy", "Fact-check", "Format"]
        
        for tier in tiers:
            if self.editing_pool.get_agent():
                await asyncio.sleep(0.5)
                book.log(f"  ├─ {tier} editing completed")
                self.editing_pool.release_agent()
        
        book.log("  └─ All editing tiers complete")
        book.log("✅ PHASE 3 COMPLETED")
    
    async def phase_4_media(self, book: Book):
        """Phase 4: Media Production"""
        book.status = BookStatus.MEDIA_PRODUCTION
        book.log("🎬 PHASE 4: MEDIA PRODUCTION - Parallel processing")
        
        # Parallel: Audiobook + Video
        tasks = []
        
        async def audiobook():
            if self.media_pool.get_agent():
                await asyncio.sleep(0.7)
                book.log("  ├─ Audiobook: TTS narration generated")
                await asyncio.sleep(0.3)
                book.log("  ├─ Audiobook: 8 hours of content ready")
                self.media_pool.release_agent()
        
        async def video():
            if self.media_pool.get_agent():
                await asyncio.sleep(0.6)
                book.log("  ├─ Video: Trailer concept created")
                await asyncio.sleep(0.4)
                book.log("  ├─ Video: 60-second promotional video ready")
                self.media_pool.release_agent()
        
        await asyncio.gather(audiobook(), video())
        
        book.log("✅ PHASE 4 COMPLETED")
    
    async def phase_5_qa(self, book: Book):
        """Phase 5: Quality Assurance"""
        book.status = BookStatus.QUALITY_ASSURANCE
        book.log("✅ PHASE 5: QUALITY ASSURANCE - Automated checks")
        
        if self.qa_pool.get_agent():
            await asyncio.sleep(0.4)
            book.log("  ├─ Content quality: Analyzing...")
            await asyncio.sleep(0.3)
            book.log("  ├─ Writing quality: Analyzing...")
            await asyncio.sleep(0.3)
            book.log("  ├─ Structure quality: Analyzing...")
            await asyncio.sleep(0.3)
            
            # Simulated QA score
            book.qa_score = random.randint(88, 97)
            
            passed = book.qa_score >= 85
            status = "PASSED ✓" if passed else "FAILED ✗"
            
            book.log(f"  └─ Overall Score: {book.qa_score}/100 - {status}")
            self.qa_pool.release_agent()
            
            if not passed:
                book.log("⚠️  PHASE 5 FAILED - Requires revision")
                return False
        
        book.log("✅ PHASE 5 COMPLETED")
        return True
    
    async def phase_6_upload(self, book: Book):
        """Phase 6: Platform Upload"""
        book.status = BookStatus.UPLOADING
        book.log("📤 PHASE 6: PLATFORM UPLOAD - Multi-platform distribution")
        
        platforms = ["Amazon KDP", "Apple Books", "Google Play"]
        
        tasks = []
        
        async def upload_to_platform(platform):
            if self.upload_pool.get_agent():
                await asyncio.sleep(0.5)
                book.platforms.append(platform)
                book.log(f"  ├─ Published to {platform}")
                self.upload_pool.release_agent()
        
        for platform in platforms:
            tasks.append(upload_to_platform(platform))
        
        await asyncio.gather(*tasks)
        
        book.status = BookStatus.COMPLETED
        book.log("✅ PHASE 6 COMPLETED")
        book.log(f"🎉 BOOK PUBLISHED - Live on {len(book.platforms)} platforms!")
    
    async def produce_book(self, title: str, genre: str) -> Book:
        """Complete production pipeline"""
        book = Book(
            id=f"book_{len(self.books_completed) + 1}",
            title=title,
            genre=genre
        )
        
        print(f"\n{'='*80}")
        print(f"🚀 STARTING PRODUCTION: \"{title}\"")
        print(f"{'='*80}\n")
        
        try:
            # Execute all phases
            await self.phase_1_research(book)
            await self.phase_2_writing(book)
            await self.phase_3_editing(book)
            await self.phase_4_media(book)
            
            if await self.phase_5_qa(book):
                await self.phase_6_upload(book)
            
            self.books_completed.append(book)
            return book
            
        except Exception as e:
            book.log(f"❌ ERROR: {str(e)}")
            raise
    
    def print_summary(self, book: Book):
        """Print production summary"""
        print(f"\n{'='*80}")
        print(f"📊 PRODUCTION SUMMARY")
        print(f"{'='*80}")
        print(f"📖 Title: {book.title}")
        print(f"🎭 Genre: {book.genre}")
        print(f"📈 Status: {book.status.value.upper()}")
        print(f"⭐ QA Score: {book.qa_score}/100")
        print(f"📚 Chapters: {len(book.chapters)}")
        print(f"🌐 Platforms: {', '.join(book.platforms)}")
        print(f"\n⏱️  Production Time: {len(book.logs)} steps")
        print(f"{'='*80}\n")

# ============================================================================
# DEMO
# ============================================================================

async def demo():
    """Run demonstration"""
    orchestrator = SimulatedOrchestrator()
    
    # Produce a book
    book = await orchestrator.produce_book(
        title="The AI Revolution: A Complete Guide to Machine Learning",
        genre="Technical Non-Fiction"
    )
    
    orchestrator.print_summary(book)
    
    # Show complete log
    print("📋 COMPLETE PRODUCTION LOG:")
    print("="*80)
    for log in book.logs:
        print(log)
    print("="*80)

async def demo_batch():
    """Demo producing multiple books"""
    orchestrator = SimulatedOrchestrator()
    
    books = [
        ("The Future of AI", "Technology"),
        ("Mastering Python Programming", "Technical"),
        ("The Art of Productivity", "Self-Help")
    ]
    
    print("\n🏭 BATCH PRODUCTION MODE")
    print("="*80)
    print(f"📚 Queueing {len(books)} books for production\n")
    
    # Produce all books in parallel
    tasks = [orchestrator.produce_book(title, genre) for title, genre in books]
    completed_books = await asyncio.gather(*tasks)
    
    # Summary
    print(f"\n{'='*80}")
    print(f"🎉 BATCH PRODUCTION COMPLETED")
    print(f"{'='*80}")
    print(f"📊 Books Produced: {len(completed_books)}")
    print(f"✅ Success Rate: 100%")
    print(f"⭐ Average QA Score: {sum(b.qa_score for b in completed_books) / len(completed_books):.1f}/100")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    print("🏢 AI Publishing Corporation - Demo System")
    print("="*80)
    print("Choose demo mode:")
    print("1. Single Book Production")
    print("2. Batch Production (3 books)")
    print("="*80)
    
    # Run single book demo
    asyncio.run(demo())
    
    # Uncomment to run batch demo:
    # asyncio.run(demo_batch())
