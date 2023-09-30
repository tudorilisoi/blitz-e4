import { useRouterQuery } from "@blitzjs/next"
import { useRouter } from "next/router"

export default function PostsNavPage() {
  const router = useRouter()
  const {
    query: { params },
  } = router
  return <pre>{JSON.stringify(params)}</pre>
}
