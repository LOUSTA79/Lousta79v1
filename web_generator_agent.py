import os
import glob

# LOUSTA CORP | GLOBAL WEB-CORE v5.2
# ABN: 54 492 524 823

def generate_site():
    print("🌐 Website Agent: Building Multilingual Storefront...")
    output_dir = os.path.expanduser('~/lousta/output')
    os.makedirs(output_dir, exist_ok=True)

    # Scrape English Books
    book_source = os.path.expanduser('~/lousta/manufacturing/books/*.txt')
    books = [os.path.basename(b).replace('.txt', '') for b in glob.glob(book_source)]
    
    # Scrape Translations
    trans_source = os.path.expanduser('~/lousta/manufacturing/translations/*.txt')
    translations = [os.path.basename(t).replace('.txt', '') for t in glob.glob(trans_source)]

    content_html = ""
    for book in books:
        display_name = book.replace('_', ' ')
        flags = "🇺🇸 "
        if f"{book}_es" in translations: flags += "🇪🇸 "
        if f"{book}_ja" in translations: flags += "🇯🇵 "
        
        content_html += f"""
        <div class="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500 transition">
            <h3 class="text-lg font-bold">{display_name}</h3>
            <div class="mt-4 flex space-x-2 text-xl cursor-pointer">{flags}</div>
            <button class="mt-4 w-full bg-blue-600 py-2 rounded text-sm font-bold">BUY NOW</button>
        </div>
        """

    template = f"""
    <html>
    <head><script src="https://cdn.tailwindcss.com"></script></head>
    <body class="bg-black text-white p-10 font-sans">
        <h1 class="text-4xl font-black text-blue-500 mb-10">LOUSTA SPECIALISTS GLOBAL</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">{content_html}</div>
        <footer class="mt-20 text-gray-600 text-xs">ABN: 54 492 524 823</footer>
    </body>
    </html>
    """
    
    with open(os.path.join(output_dir, 'index.html'), 'w') as f:
        f.write(template)
    print(f"✅ Multilingual Storefront Generated: {output_dir}/index.html")

if __name__ == "__main__":
    generate_site()
