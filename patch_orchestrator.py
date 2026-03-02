import os
path = os.path.expanduser('~/LA-Nexus/ALourithm_Core/orchestrator.js')
with open(path, 'r') as f:
    content = f.read()

# The "Surgical Bypass" logic
old_block = """const msg = await anthropic.messages.create({
            model: "gemini-3-5-sonnet-20240620",
            max_tokens: 1000,
            messages: [{ role: "user", content: `Create a 3-chapter outline for "${bookTitle}". Return ONLY JSON array: [{"title": "...", "description": "..."}]` }]
        });
        const outline = JSON.parse(msg.content[0].text);"""

new_block = """const genAIArchitect = new GoogleGenerativeAI(geminiKeys[0]);
        const modelArchitect = genAIArchitect.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultArchitect = await modelArchitect.generateContent(`Create a 3-chapter outline for "${bookTitle}". Return ONLY JSON array string: [{"title": "...", "description": "..."}]`);
        const responseText = resultArchitect.response.text().replace(/```json/g, '').replace(/```/g, '');
        const outline = JSON.parse(responseText);"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(path, 'w') as f:
        f.write(content)
    print("✅ Logic Re-Wired to Gemini!")
else:
    print("❌ Block not found - manual check needed.")
