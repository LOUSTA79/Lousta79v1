const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');

const anthropic = new Anthropic({ apiKey: 'REDACTED_ANTHROPIC_KEY-2NE7SboCjT0NHz771dko9voBBPkT7AujTlc755gTYeB6IUgRgMzPadlSeJ91yrYbrljI1RjwJRSa7MJGAKNJWQ-8yxRRAAA' });
const geminiKeys = ['PASTE_YOUR_KEY_HERE'];
let currentGeminiIndex = 0;

async function runEmpire(bookTitle) {
    try {
        console.log(`🏗️  [Architect - Gemini] Designing: ${bookTitle}`);
        const genAIArchitect = new GoogleGenerativeAI(geminiKeys[0]);
        const modelArchitect = genAIArchitect.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultArchitect = await modelArchitect.generateContent(`Create a 3-chapter outline for "${bookTitle}". Return ONLY JSON array string: [{"title": "...", "description": "..."}]`);
        const responseText = resultArchitect.response.text().replace(/```json/g, '').replace(/```/g, '');
        const outline = JSON.parse(responseText);

        let fullBook = `# ${bookTitle}\n\n`;
        for (const chapter of outline) {
            console.log(`✍️  [Factory - Gemini] Writing: ${chapter.title}`);
            const genAI = new GoogleGenerativeAI(geminiKeys[currentGeminiIndex]);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`Write chapter: ${chapter.title}. Context: ${chapter.description}`);
            fullBook += `## ${chapter.title}\n\n${result.response.text()}\n\n`;
            currentGeminiIndex = (currentGeminiIndex + 1) % geminiKeys.length;
        }

        const product = await stripe.products.create({ name: bookTitle });
        const price = await stripe.prices.create({ product: product.id, unit_amount: 1999, currency: 'aud' });
        const paymentLink = await stripe.paymentLinks.create({ line_items: [{ price: price.id, quantity: 1 }] });
        
        fullBook += `\n\n---\n### 🛒 Buy the full version here:\n${paymentLink.url}`;
        const fileName = `${bookTitle.replace(/\s/g, '_')}.md`;
        fs.writeFileSync(fileName, fullBook);
        console.log(`✅ [Success] Generated & Monetized via Gemini/Gemini: ${bookTitle}\n`);
    } catch (error) { console.error(`❌ [Error]:`, error.message); }
}

runEmpire("The Autonomous Wealth Revolution");
