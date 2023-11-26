import React from "react"
import { Head } from "next/document"

function dedupeHead(elems) {
  const result: React.ReactElement[] = []
  const buffer: Record<string, React.ReactElement> = {}

  if (elems) {
    for (let i = 0, len = elems.length; i < len; i++) {
      const elem = elems[i],
        type = elem.type,
        props = elem.props
      let uniqueProp = props.itemprop || props.property || props.name || props.href
      let key = `${type}::uniqueProp: ${uniqueProp}`

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
          buffer[key] = elem
          break
        default:
          result.push(elem)
          console.log(`ADD/SKIP [${key}]`, elem.props)
          break
      }
    }
    Object.values(buffer).forEach((element) => {
      result.push(element)
    })
  }

  return result
}

class DocumentHead extends Head {
  render() {
    this.context.head = dedupeHead(this.context.head || [])
    return super.render()
  }
}

export default DocumentHead
