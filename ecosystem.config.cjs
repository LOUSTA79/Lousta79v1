module.exports = {
  apps: [
    {
      name: "Stripe_Bridge",
      script: "LIMBS/stripe/stripe_sales_bridge.js",
      cwd: "/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core",
      env: {
        STRIPE_BRIDGE_PORT: "3009",
        DOTENV_CONFIG_PATH: "/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/.env.live"
      }
    }
  ]
};
