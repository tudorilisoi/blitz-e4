import fs from "fs"
import path from "path"
import { remark } from "remark"
import remarkHtml from "remark-html"

const STATIC_PAGE_DIR = "src/static-pages"

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
    .use(remarkHtml)
    .process(fileContents)
  const rawHtml = processedContent.toString()

  //@ts-ignore
  const firstHeadingText = headingRef.heading.children[0].value
  return {
    rawHtml,
    firstHeadingText,
  }
}
