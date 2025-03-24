import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { useClerk } from "@clerk/nextjs"
import { User } from "@prisma/client"
import { CircleUserRound, Files, KeyRound, Power, PowerOff, UserRoundPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import logout from "src/auth/mutations/logout"
import { getPostsByAuthorNavUrl } from "src/pages/anunturi/de/[[...params]]"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const UserInfo = () => {
  const router = useRouter()
  const { signOut } = useClerk()
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const ulClass = `mt-3 z-[1] p-2 shadow-md shadow-secondary  menu menu-sm dropdown-content bg-base-200 text-accent-focus rounded-box w-[80vw] sm:w-[30vw]`
  const closeDropdown = () => {
    //@ts-ignore
    document.activeElement?.blur()
  }

  if (currentUser) {
    const myPostsUrl = getPostsByAuthorNavUrl(currentUser as User)
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} id="layoutDropdown" className="btn btn-secondary">
          <CircleUserRound />
          <span className="pl-0 px-1">{currentUser.fullName}</span>
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
              <Files />
              <strong>Anunturile mele</strong>
            </a>
          </li>

          <li>
            <a
              className="py-2 text-accent-focus hover:text-accent"
              onClick={async () => {
                closeDropdown()
                await signOut().catch((e) => {
                  console.error("CLERK signOut err", e)
                })
                await logoutMutation()
                await router.push("/")
              }}
            >
              <PowerOff />
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
          <CircleUserRound />
          <span className="px-1">{"Cont"}</span>
        </label>
        <ul tabIndex={0} className={ulClass}>
          <li>
            <Link
              onClick={closeDropdown}
              className="py-2 hover:text-accent"
              href={Routes.SignupPage()}
            >
              <UserRoundPlus />
              <strong>Creează cont</strong>
            </Link>
          </li>

          <li>
            <Link
              onClick={closeDropdown}
              className="py-2 hover:text-accent"
              href={Routes.LoginPage()}
            >
              <Power />
              <strong>Conectare</strong>
            </Link>
          </li>
          <li>
            <Link
              onClick={closeDropdown}
              className="py-2 hover:text-accent"
              href={Routes.ForgotPasswordPage()}
            >
              <KeyRound />
              <strong>Am uitat parola</strong>
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default UserInfo
