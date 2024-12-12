const config = require("@blitzjs/next/eslint")
const extendedConfig = {
  ...config,
  rules: { ...config.rules, "@next/next/no-img-element": "off" },
}
module.exports = extendedConfig
