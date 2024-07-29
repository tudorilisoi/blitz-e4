// import "@/styles/globals.css"
import { BlitzPage } from "@blitzjs/next"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Suspense } from "react"
import { ClerkProviderWrapper } from "src/auth-clerk/helpers"
import { gSSP } from "src/blitz-server"
import Layout from "src/core/layouts/Layout"

export const getServerSideProps = gSSP(async (args) => {
  return {
    props: {
      cacheBust: `${Math.random()}-${new Date().getTime()}`,
    },
  }
})

const ClerkStatusPage: BlitzPage = ({ cacheBust }: { cacheBust: string }) => {
  return (
    <Suspense>
      <ClerkProviderWrapper>
        <h4>{cacheBust}</h4>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </ClerkProviderWrapper>
    </Suspense>
  )
}
ClerkStatusPage.getLayout = (page) => <Layout>{page}</Layout>

export default ClerkStatusPage
