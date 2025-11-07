// @ts-check
const { withBlitz } = require("@blitzjs/next")
const RemoveServiceWorkerPlugin = require("webpack-remove-serviceworker-plugin")

const isDev = process.env.NODE_ENV !== "production"

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
              default-src * blob: data:;
              script-src * 'unsafe-inline' 'unsafe-eval' blob: data:;
              connect-src * ws: wss: blob: data:;
              img-src * blob: data:;
              frame-src *;
              worker-src blob:;
              style-src * 'unsafe-inline';
              object-src 'none';
            `
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
]

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
const config = {
  webpack: (config) => {
    plugins: [new RemoveServiceWorkerPlugin()]
    externals: ["@takeshape/use-cap"]
    return config
  },
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = withBlitz(config)
