import { BlitzLayout, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import { OverlayProvider } from "../components/spinner/OverlayProvider"

const NavBar = () => {
  // NOTE for the bg highlight the container
  return (
    <header className="fix-scroll bg-base-100" data-theme="dark">
      <div className="navbar container mx-auto px-2">
        <div className="flex-1">
          <a className="btn btn-circle btn-primary normal-case">e3</a>
        </div>
        <div className="flex-none gap-2 mr-2">Publică anunţ</div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn  bg-secondary-content text-primary">
              <div className="w-10 rounded-full">{"Cont"}</div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
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

        <NavBar />

        {/* Main Content */}
        <div className="flex-grow fix-scroll">
          <main className="py-6 px-2 container mx-auto relative">
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
