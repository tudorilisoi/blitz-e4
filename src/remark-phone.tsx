import { findAndReplace } from "mdast-util-find-and-replace"

/** @type {import('unified').Plugin<Array<void>, import('mdast').Root>} */
export default function remarkTelephonePlugin() {
  return (tree) => {
    // To do: fix regex.
    findAndReplace(
      tree,
      /tel:(\d+)/g,
      (_, telephoneNumber) => {
        // To do: normalize phone number. Use `libphonenumber`?
        return {
          type: "link",
          title: null,
          url: "tel:" + telephoneNumber,
          children: [telephoneNumber],
        }
      },
      { ignore: ["link", "linkReference"] },
    )
  }
}
