import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { User } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/router"
import logout from "src/auth/mutations/logout"
import { getPostsByAuthorNavUrl } from "src/pages/anunturi/de/[[...params]]"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

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
    const myPostsUrl = getPostsByAuthorNavUrl(currentUser as User)
    return (
      // <ClerkProviderWrapper>
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
                // await logoutClerk()
                await router.push("/")
              }}
            >
              <strong>Deconectare</strong>
            </a>
          </li>
        </ul>
      </div>
      // </ClerkProviderWrapper>
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

export default UserInfo
