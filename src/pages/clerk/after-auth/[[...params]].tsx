import { gSSP } from "src/blitz-server"
import Layout from "src/core/layouts/Layout"
import getCurrentUser from "src/users/queries/getCurrentUser"
export const getServerSideProps = gSSP(async (args) => {
  const { query, res, ctx } = args
  const user = await getCurrentUser(null, ctx)
  return {
    props: { user },
  }
})

export default function AfterAuthPage({ user }) {
  return (
    <Layout>
      <div>{`Un moment...`}</div>
    </Layout>
  )
}
