import { useRouter } from "next/router"
import { getPostsByAuthorNavUrl } from "src/pages/anunturi/de/[[...params]]"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useRedirectToUserHome = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  if (currentUser) {
    void router.push(getPostsByAuthorNavUrl(currentUser))
  }
}

export const useUserHome = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  if (!currentUser) {
    return {
      url: null,
      redirect: () => null,
    }
  }
  const url = getPostsByAuthorNavUrl(currentUser)
  const redirect = () => router.push(url)
  return {
    url,
    redirect,
  }
}
