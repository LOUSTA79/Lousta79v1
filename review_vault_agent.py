import os
import shutil

# LOUSTA CORP | ABN 54 492 524 823
# Quality Control & Review Staging

STAGING_DIR = os.path.expanduser("~/lousta/STAGING_REVIEW")
os.makedirs(STAGING_DIR, exist_ok=True)

def stage_for_review(batch_name):
    print(f"📦 Staging Batch: {batch_name} for Lou's review...")
    
    # Create a sub-folder for this specific batch
    batch_path = os.path.join(STAGING_DIR, batch_name)
    os.makedirs(batch_path, exist_ok=True)

    # Move latest assets (Books, Storyboards, Promos) into the review folder
    # This prevents them from hitting the live site automatically
    source_dir = os.path.expanduser("~/lousta/manufacturing/books")
    for file in os.listdir(source_dir):
        if file.endswith(".txt"):
            shutil.copy(os.path.join(source_dir, file), batch_path)
            
    print(f"✅ Batch {batch_name} is locked in STAGING_REVIEW. Public site remains unchanged.")

if __name__ == "__main__":
    import sys
    batch_id = sys.argv[1] if len(sys.argv) > 1 else "Batch_01"
    stage_for_review(batch_id)
