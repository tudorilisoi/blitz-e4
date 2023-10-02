import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"

const Layout: BlitzLayout<{ title?: string; description?: string; children?: React.ReactNode }> = ({
  title,
  description,
  children,
}) => {
  const _title = title || "blitz-e4"
  return (
    <>
      <Head>
        <title key="title">{_title}</title>
        {!description ? null : <meta key="description" name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        {/* Top Navigation Header */}
        <header className="bg-blue-800 py-4 ">
          <nav className="container mx-auto px-6">
            {/* Add your header content here */}
            <h1 className="text-white text-2xl ml-2">{_title}</h1>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow py-6 px-6 container mx-auto">
          {/* <div className="container mx-auto py-6 px-2"> */}
          {/* Render child components */}
          {children}
          {/* </div> */}
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 py-4 px-2">
          <div className="container mx-auto">
            {/* Add your footer content here */}
            <p className="text-gray-600">© {new Date().getFullYear()} My App</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Layout
