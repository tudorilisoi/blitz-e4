import { BlitzLayout, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import React, { Suspense } from "react"
import { OverlayProvider } from "../components/overlay/OverlayProvider"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useMutation } from "@blitzjs/rpc"
import logout from "src/auth/mutations/logout"
import { useRouter } from "next/router"
import { makePostsByAuthorNavUrl } from "src/pages/anunturi/de/[[...params]]"
import { User } from "@prisma/client"

const UserInfo = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const ulClass = `mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 text-accent-focus rounded-box w-52`
  const closeDropdown = () => {
    //@ts-ignore
    document.activeElement?.blur()
  }

  if (currentUser) {
    const myPostsUrl = makePostsByAuthorNavUrl(currentUser as User)
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} id="layoutDropdown" className="btn btn-secondary">
          <span className="px-1">{currentUser.fullName}</span>
        </label>
        <ul tabIndex={0} className={ulClass}>
          {/* <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li> */}

          <li className="!hover:bg-base-200">
            <span className="py-2 text-base-content font-extrabold">{currentUser.email}</span>
          </li>

          <li>
            <a
              className="py-2 text-accent-focus hover:text-accent"
              onClick={async () => {
                closeDropdown()
                await router.push(myPostsUrl)
              }}
            >
              <strong>Anunturile mele</strong>
            </a>
          </li>

          <li>
            <a
              className="py-2 text-accent-focus hover:text-accent"
              onClick={async () => {
                closeDropdown()
                await logoutMutation()
                await router.push("/")
              }}
            >
              <strong>Deconectare</strong>
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
        <ul tabIndex={0} className={ulClass}>
          <li>
            <Link className="py-2 hover:text-accent" href={Routes.SignupPage()}>
              <strong>Creează cont</strong>
            </Link>
          </li>

          <li>
            <Link className="py-2 hover:text-accent" href={Routes.LoginPage()}>
              <strong>Conectare</strong>
            </Link>
          </li>
          <li>
            <Link className="py-2 hover:text-accent" href={Routes.ForgotPasswordPage()}>
              <strong>Am uitat parola</strong>
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
      <div className="navbar container mx-auto px-6 py-4">
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
        {/* Ai noştri ca brazii! */}
        <meta property="og:locale" content="ro_RO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {!description ? null : <meta key="description" name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen w-full bg-base-100">
        {/* Top Navigation Header */}

        <NavBar />

        {/* Main Content; NOTE: flex-grow flex flex-col inherits height */}
        <div className="flex-grow flex flex-col fix-scroll">
          <OverlayProvider className="flex-grow flex flex-col">
            <main className="py-6 px-6 container mx-auto relative">
              {/* <div className="container mx-auto py-6 px-2"> */}
              {/* Render child components */}
              {children}
              {/* </div> */}
            </main>
          </OverlayProvider>
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

export default Layout
