import { useUser } from "@clerk/nextjs"
import { withClerkProvider } from "src/auth-clerk/helpers"

function Example() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return <div>Hello, {user.firstName} welcome to Clerk</div>
}

export default withClerkProvider(Example)
