import { BlitzLayout, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import { OverlayProvider } from "../components/spinner/OverlayProvider"

const NavBar = () => {
  return (
    <div className="navbar w-full mx-0">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">{"eRădăuţi"}</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>{"Publică anunţ"}</a>
          </li>
          <li>
            <details className="text-primary">
              <summary className="">{"Contul meu"}</summary>
              <ul className="p-2 bg-base-100">
                <li>
                  <a>Link 1 xxxx xxxxx</a>
                </li>
                <li>
                  <a>Link 2 xxxxx xxxxx</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}

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
      <div className="flex flex-col min-h-screen w-full bg-slate-200">
        {/* Top Navigation Header */}
        <header className="fix-scroll">
          <NavBar />
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
