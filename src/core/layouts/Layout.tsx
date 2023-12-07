import { BlitzLayout, Routes } from "@blitzjs/next"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { Suspense, useEffect } from "react"
import { OGImage } from "../components/image/OGImage"
import {
  OverlayProvider,
  useOverlay,
  useOverlayClassNames,
} from "../components/overlay/OverlayProvider"

const UserInfo = dynamic(() => import("./UserInfo"), { ssr: false })

const NavBar = () => {
  // NOTE for the bg highlight the container
  return (
    <header className="fix-scroll bg-base-200 shadow-lg">
      <div className="navbar container mx-auto px-6 py-4">
        <div className="flex-1">
          <Link href={Routes.Home()}>
            {/* <span className="btn btn-circle btn-primary normal-case">e3</span> */}
            <img src="/logo.png" className="h-14 w-14" alt="eRădăuţi: ghid rădăuţean din 2005" />
          </Link>
        </div>
        <div className="flex-none gap-2 mr-2 text-base-content">
          <Link href={Routes.NewPostPage()}>Publică anunţ</Link>
        </div>
        <div className="flex-none gap-2">
          <Suspense>
            <UserInfo />
          </Suspense>
        </div>
      </div>
    </header>
  )
}

const Layout: BlitzLayout<{
  forceOverlay?: boolean
  title?: string
  description?: string
  children?: React.ReactNode
}> = ({ title, description, children, forceOverlay }) => {
  const overlaycx = useOverlayClassNames(forceOverlay || false)
  const { toggle } = useOverlay()

  // cleanup on unmount
  const router = useRouter()
  useEffect(() => {
    router.events.on("routeChangeStart", (url, { shallow }) => {
      console.log("routeChangeStart: close overlay")
      toggle(false)
      console.log(`routing to ${url}`, `is shallow routing: ${shallow}`)
    })
  }, [])
  const navTitle = "eRădăuţi v3"
  const _title = title || navTitle
  const ogImage = OGImage(null)
  const _description =
    description ||
    `e-Rădăuţi: Anunţuri imobiliare, maşini, locuri de muncă. Anunţuri pentru Rădăuţi/Suceava`
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>{_title}</title>
        <meta name="description" content={_description} />
        {/* Ai noştri ca brazii! */}
        <meta property="og:locale" content="ro_RO" />
        <meta name="og:title" content={_title} />
        <meta name="description" content={_description} />
        {ogImage}
      </Head>
      <div className="flex flex-col min-h-screen w-full bg-base-100">
        {/* Top Navigation Header */}

        <NavBar />

        {/* Main Content; NOTE: flex-grow flex flex-col inherits height */}
        <div className={overlaycx + " flex-grow flex flex-col fix-scroll"}>
          <main className={" py-6 px-6 container mx-auto relative"}>
            {/* <div className="container mx-auto py-6 px-2"> */}
            {/* Render child components */}
            {children}
            {/* </div> */}
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-base-200  fix-scroll">
          <div className="container mx-auto py-4 px-6">
            {/* Add your footer content here */}
            <p className="text-base-content font-extrabold">
              © {new Date().getFullYear()} {"eRădăuţi v3"}
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default (props) => (
  <OverlayProvider>
    <Layout {...props} />
  </OverlayProvider>
)
