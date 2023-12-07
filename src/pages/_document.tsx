import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

function dedupeHead(elems) {
  const result: React.ReactElement[] = []
  const buffer: Record<string, React.ReactElement> = {}

  if (elems) {
    for (let i = 0, len = elems.length; i < len; i++) {
      const elem = elems[i],
        type = elem.type,
        props = elem.props
      let uniqueProp =
        props.itemprop ||
        props.property ||
        props.name ||
        props.href ||
        "props:" + Object.keys(props).join(",")
      if (!uniqueProp) {
        console.log(`🚀 ~ dedupeHead ~ elem:`, elem)
      }
      let key = `${type}::uniqueProp:${uniqueProp}`

      /** Dedupe */
      switch (type) {
        case "meta":
        case "title":
          if (uniqueProp === "article:tag") {
            console.log(`ACC/SKIP ${key}`, key, elem)
            result.push(elem)
            break
          }
          if (buffer[key] !== undefined) {
            // console.log("ADD meta", key, elem)
            console.log(`OWR [${key}]`, buffer[key]?.props, elem.props)
          }
          const newProps = { ...props, key }
          const uniqueElem = React.createElement(type, newProps)
          buffer[key] = uniqueElem
          // buffer[key] = elem
          break
        default:
          result.push(elem)
          // console.log(`ADD/SKIP [${key}]`, elem.props)
          break
      }
    }
    Object.values(buffer).forEach((element) => {
      result.push(element)
    })
    const _result = result.map((i) => {
      return JSON.stringify(i)
    })
    console.log(`🚀 ~ dedupeHead keys:`, Object.keys(buffer))
    // console.log(`🚀 ~ dedupeHead ~ result:`, _result)
  }

  return result
}

class DocumentHead extends Head {
  render() {
    this.context.head = dedupeHead(this.context.head || [])
    return super.render()
  }
}

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }
  render() {
    return (
      <Html lang="ro-RO" className="text-[15px] sm:text-[18px]">
        {/* <link
          href="https://fonts.googleapis.com/css?family=Nunito:100,200,300,400,500,600,700,800,900&display=swap&subset=latin-ext"
          rel="stylesheet"
        /> */}
        <link href="/fonts/fonts.css" rel="stylesheet" />

        <DocumentHead />

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
