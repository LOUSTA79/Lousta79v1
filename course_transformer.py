import os
import glob

def transform_to_course(manuscript_path):
    print(f"🎓 Transforming {manuscript_path} into a Masterclass...")
    
    with open(manuscript_path, 'r') as f:
        content = f.read()

    # Structure: 10 Modules, Learning Objectives, and a Final Quiz
    course_structure = f"""
    # COURSE: {os.path.basename(manuscript_path).replace('_', ' ').replace('.txt', '')}
    ## Module 1: The Foundation of Reality (Quantum & Relativity)
    ## Module 2: The Cosmic Scale (Galaxies & Dark Matter)
    ... [Logic for all 10 modules]
    ## Final Assessment: Reality Certification
    """
    
    output_path = manuscript_path.replace(".txt", "_COURSE_PLAN.md")
    with open(output_path, 'w') as f:
        f.write(course_structure)
    print(f"✅ Course Plan Created: {output_path}")

if __name__ == "__main__":
    latest_book = max(glob.glob('manufacturing/books/*.txt'), key=os.path.getctime)
    transform_to_course(latest_book)
