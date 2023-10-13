import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import { OverlayProvider } from "../components/spinner/OverlayProvider"

const Layout: BlitzLayout<{ title?: string; description?: string; children?: React.ReactNode }> = ({
  title,
  description,
  children,
}) => {
  const navTitle = "eRădăuţi v3"
  const _title = title || navTitle
  return (
    <>
      <Head>
        <title key="title">{_title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {!description ? null : <meta key="description" name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        {/* Top Navigation Header */}
        <header className="bg-blue-800 py-4 ">
          <nav className="container mx-auto px-6 p-1">
            {/* Add your header content here */}
            <h1 className="text-white text-2xl ml-1 leading-none m-0">{navTitle}</h1>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow py-6 px-6 container mx-auto relative">
          {/* <div className="container mx-auto py-6 px-2"> */}
          {/* Render child components */}
          <OverlayProvider>{children}</OverlayProvider>
          {/* </div> */}
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 py-4 px-2">
          <div className="container mx-auto">
            {/* Add your footer content here */}
            <p className="text-gray-600">
              © {new Date().getFullYear()} {"eRădăuţi v3"}
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Layout
