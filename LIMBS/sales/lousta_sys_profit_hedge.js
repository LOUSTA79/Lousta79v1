const fs = require('fs');
const log = (msg) => console.log(`[PROFIT-HEDGE] ${msg}`);

class ProfitHedge {
    constructor() {
        this.reinvestRate = 0.70;
        this.macquarieThreshold = 5000;
    }

    calculateAllocation(currentBalance) {
        const reinvest = currentBalance * this.reinvestRate;
        const takeHome = currentBalance * (1 - this.reinvestRate);
        log(`Allocation: $${reinvest} to Swarm Ops, $${takeHome} to Payout.`);
        return { reinvest, takeHome };
    }
}
module.exports = ProfitHedge;
