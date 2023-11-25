// @ts-check
const { withBlitz } = require("@blitzjs/next")
const RemoveServiceWorkerPlugin = require("webpack-remove-serviceworker-plugin")

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
const config = {
  webpack: (config) => {
    plugins: [new RemoveServiceWorkerPlugin()]
    return config
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = withBlitz(config)
