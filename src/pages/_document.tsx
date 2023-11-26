import Document, { Html, Main, NextScript, Head } from "next/document"
import DocumentHead from "src/core/components/DocumentHead"

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }
  render() {
    return (
      <Html lang="ro-RO" className="text-[15px] sm:text-[18px]">
        <link
          href="https://fonts.googleapis.com/css?family=Nunito:100,200,300,400,500,600,700,800,900&display=swap&subset=latin-ext"
          rel="stylesheet"
        />

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
