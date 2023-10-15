import { Category, Post, Image } from "@prisma/client"
import Link from "next/link"
import { shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
const PostCell = ({ post, category }: { post: Post & { images: Image[] }; category: Category }) => {
  const { images } = post
  return (
    <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">
        <Link href={makePostNavUrl(post.slug, category.slug, post.id)}>
          {shortenText(post.title, 100)}
        </Link>
      </h2>
      {images.length > 0 ? (
        <span className="text-sm text-blue-500">{post.images.length} fotografii</span>
      ) : null}
      <p className="text-gray-600">{shortenText(post.body, 140)}</p>
    </div>
  )
}
export default PostCell
