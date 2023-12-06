import { useRouter } from "next/router"
import { useEffect } from "react"
import { makePostsByAuthorNavUrl } from "src/pages/anunturi/de/[[...params]]"
import { CurrentUser, useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useRedirectToUserHome = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  if (currentUser) {
    router.push(makePostsByAuthorNavUrl(currentUser))
  }
}
