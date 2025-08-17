import { findAndReplace } from "mdast-util-find-and-replace"

/** @type {import('unified').Plugin<Array<void>, import('mdast').Root>} */
export default function remarkTelephonePlugin() {
  return (tree) => {
    findAndReplace(tree, [
      [
        /(\+?[\d\s\-\.\(\)]{10,})/g,
        (match) => {
          console.log("📞 Telephone match:", match)

          // Clean number for tel: link
          const cleanNumber = match.replace(/[^\d+]/g, "")
          // NOTE workaround for url scheme, tel: no supported
          return {
            type: "link",
            url: `http://x-tel${cleanNumber}`, // ✅ correct format
            title: null,
            children: [{ type: "text", value: match }],
          }
        },
      ],
    ])
  }
}
