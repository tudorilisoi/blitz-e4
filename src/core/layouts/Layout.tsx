import { BlitzLayout, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
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
      <div className="flex flex-col min-h-screen w-full">
        {/* Top Navigation Header */}
        <header className="bg-blue-800 py-4 fix-scroll">
          <nav className="container mx-auto px-6 p-1">
            {/* Add your header content here */}
            <Link href={Routes.Home()}>
              <span className="text-white text-2xl ml-1 leading-none m-0">{navTitle}</span>
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <div className="flex-grow fix-scroll">
          <main className="py-6 px-6 container mx-auto relative">
            {/* <div className="container mx-auto py-6 px-2"> */}
            {/* Render child components */}
            <OverlayProvider>{children}</OverlayProvider>
            {/* </div> */}
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 py-4 px-2 fix-scroll">
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
