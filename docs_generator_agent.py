import os
import glob

def generate_technical_docs():
    book_files = glob.glob(os.path.expanduser("~/lousta/manufacturing/books/*.txt"))
    docs_html = ""
    if not book_files:
        return "<p class='text-gray-500'>No industrial assets found in vault yet.</p>"
    
    for path in book_files:
        title = os.path.basename(path).replace(".txt", "").replace("_", " ")
        docs_html += f"""
        <section class="mb-12 border-b border-gray-100 pb-8">
            <h2 class="text-xl font-bold text-blue-700 mb-2">{title}</h2>
            <div class="flex gap-2 mb-4">
                <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">Technical Spec</span>
                <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase">v2026.1</span>
            </div>
            <p class="text-gray-600 text-sm mb-4">Implementation reference for industrial automation.</p>
            <div class="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
                <h4 class="text-xs font-bold text-gray-400 uppercase mb-2">Key Industrial Protocol</h4>
                <code class="text-sm text-pink-600 font-mono">OEE_OPTIMIZATION_ALPHA_V1</code>
            </div>
        </section>
        """
    return docs_html

if __name__ == "__main__":
    html_content = generate_technical_docs()
    with open(os.path.expanduser("~/lousta/templates/docs_content.html"), "w") as f:
        f.write(html_content)
    print("✅ Technical Documentation manufactured.")
