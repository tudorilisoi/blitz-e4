import { Category, Post } from "@prisma/client"
import Link from "next/link"
import { shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
const PostCell = ({ post, category }: { post: Post; category: Category }) => {
  return (
    <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">
        <Link href={makePostNavUrl(post.slug, category.slug, post.id)}>
          {shortenText(post.title, 100)}
        </Link>
      </h2>
      <p className="text-gray-600">{shortenText(post.body, 140)}</p>
    </div>
  )
}
export default PostCell
