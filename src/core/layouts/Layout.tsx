import { BlitzLayout, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import React, { Suspense } from "react"
import { OverlayProvider } from "../components/spinner/OverlayProvider"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useMutation } from "@blitzjs/rpc"
import logout from "src/auth/mutations/logout"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-secondary">
          <span className="px-1">{"Cont"}</span>
        </label>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 text-base-content rounded-box w-52"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>

          <li>
            <a
              onClick={async () => {
                await logoutMutation()
              }}
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-secondary">
          <span className="px-1">{"Cont"}</span>
        </label>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 text-base-content rounded-box w-52"
        >
          <li>
            <Link href={Routes.SignupPage()}>
              <strong>Creează cont</strong>
            </Link>
          </li>

          <li>
            <Link href={Routes.LoginPage()}>
              <strong>Conectare</strong>
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

const NavBar = () => {
  // NOTE for the bg highlight the container
  return (
    <header className="fix-scroll bg-base-200 shadow-lg">
      <div className="navbar container mx-auto px-2">
        <div className="flex-1">
          <Link href={Routes.Home()}>
            <span className="btn btn-circle btn-primary normal-case">e3</span>
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
      <div className="flex flex-col min-h-screen w-full bg-base-100">
        {/* Top Navigation Header */}

        <NavBar />

        {/* Main Content */}
        <div className="flex-grow fix-scroll">
          <OverlayProvider>
            <main className="py-6 px-2 container mx-auto relative">
              {/* <div className="container mx-auto py-6 px-2"> */}
              {/* Render child components */}
              {children}
              {/* </div> */}
            </main>
          </OverlayProvider>
        </div>

        {/* Footer */}
        <footer className="bg-base-200 py-4 px-2 fix-scroll">
          <div className="container mx-auto">
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

export default Layout
