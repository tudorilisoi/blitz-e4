import { AuthServerPlugin, PrismaStorage, simpleRolesIsAuthorized } from "@blitzjs/auth"
import { setupBlitzServer } from "@blitzjs/next"
import { BlitzLogger, createSetupServer } from "blitz"
import db from "db"
import { IncomingMessage, createServer } from "http"
import next from "next"
import { parse } from "url"
import { authConfig } from "./src/blitz-client"

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
export const authPlugin = AuthServerPlugin({
  ...authConfig,
  storage: PrismaStorage(db),
  isAuthorized: simpleRolesIsAuthorized,
})

export const { gSSP, gSP, api } = setupBlitzServer({
  plugins: [authPlugin],
  // NOTE tslog comes with default log level 0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal.
  logger: BlitzLogger({
    minLevel: 3,
  }),
})
createSetupServer
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    createServer(async (req: IncomingMessage, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url!, true)
      const { pathname } = parsedUrl

      // await api(handle)

      if (pathname === "/hello") {
        res.writeHead(200).end("world")
        return
      }

      return handle(req, res, parsedUrl)
    }).listen(PORT, () => {
      console.log(`Ready on http://localhost:${PORT}`)
    })
  })
  .catch(() => {
    console.log(`FAILED to start app on http://localhost:${PORT}`)
  })
