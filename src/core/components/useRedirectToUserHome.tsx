import { useRouter } from "next/router"
import { makePostsByAuthorNavUrl } from "src/pages/anunturi/de/[[...params]]"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useRedirectToUserHome = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  if (currentUser) {
    router.push(makePostsByAuthorNavUrl(currentUser))
  }
}
