import { gSSP } from "src/blitz-server"
// export const getServerSideProps = gSSP(async (args) => {
//   const { query, ctx, res } = args
//   const user = await currentUser()
//   return {
//     props: { user },
//   }
// })

export default function AfterAuthPage({ user }) {
  return <div>{`Un moment...`}</div>
}
