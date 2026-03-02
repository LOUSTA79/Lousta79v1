const log = (msg) => console.log(`[INTL-EXPANDER] ${new Date().toISOString()} - ${msg}`);

const REGIONAL_CONFIG = {
    "IN": { currency: "INR", tax_logic: "GST-India", language: "Hindi", platform: "Amazon.in" },
    "EU": { currency: "EUR", tax_logic: "VAT-Compliance", language: "German", platform: "Amazon.de" },
    "US": { currency: "USD", tax_logic: "Nexus-Tax", language: "English", platform: "Amazon.com" }
};

class IntlExpander {
    async prepareGlobalBatch(product, regionCode) {
        const config = REGIONAL_CONFIG[regionCode] || REGIONAL_CONFIG["US"];
        log(`🌍 Optimizing "${product.title}" for ${regionCode} Market...`);
        
        return {
            ...product,
            price: this.applyPPP(product.price, regionCode),
            metadata: await this.localizeMetadata(product.metadata, config.language),
            legal_footer: `Compliance: ${config.tax_logic} | ABN: 54 492 524 823`
        };
    }

    applyPPP(basePrice, region) {
        // Purchasing Power Parity Logic
        if (region === "IN") return basePrice * 0.4; // 60% discount for India market penetration
        return basePrice;
    }
}
