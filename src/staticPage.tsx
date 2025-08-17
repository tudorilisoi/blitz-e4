import fs from "fs"
import path from "path"
import { remark } from "remark"
import remarkHtml from "remark-html"
import remarkTelephonePlugin from "./remark-phone"

const STATIC_PAGE_DIR = "static-pages"

const getFirstHeading = (root, acc = { heading: {} }) => {
  let first = root.children[0]
  if (first && first.type === "heading") {
    acc.heading = first
  }
}

const getFirstHeadingPlugin = function attacher(options = { acc: { heading: {} } }) {
  return (root) => {
    getFirstHeading(root, options.acc)
  }
}

export async function getMarkDownAsHTML(fileName) {
  const fullPath = path.resolve(process.cwd(), path.join(STATIC_PAGE_DIR, `${fileName}.md`))
  const fileContents = fs.readFileSync(fullPath, "utf8")

  const headingRef = { heading: {} }

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(getFirstHeadingPlugin, { acc: headingRef })
    .use(remarkTelephonePlugin)
    .use(remarkHtml, { sanitize: false })
    .process(fileContents)

  let rawHtml = processedContent.toString()

  // 🔎 Replace plain numbers with tel: links
  rawHtml = rawHtml.replace(/http:\/\/x-tel(\+?[\d\s\-\.\(\)]{6,})/g, (match) => {
    console.log(`🚀 ~ getMarkDownAsHTML ~ match:`, match)
    // Clean up the number for the tel link
    const clean = match.replace("http://x-tel", "")
    return `tel:${clean}`
  })

  //@ts-ignore
  const firstHeadingText = headingRef.heading.children[0].value
  return {
    rawHtml,
    firstHeadingText,
  }
}
