import { Category, Post, Image } from "@prisma/client"
import Link from "next/link"
import { shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { PostWithIncludes } from "../helpers"
const PostCell = ({ post, category }: { post: PostWithIncludes; category: Category }) => {
  const { images } = post
  return (
    <div key={post.id} className="bg-neutral-50 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-primary">
        <Link href={makePostNavUrl(post)}>{shortenText(post.title, 100)}</Link>
      </h2>
      {images.length > 0 ? <span className="text-sm ">{post.images.length} fotografii</span> : null}
      <p className="text-neutral-800">{shortenText(post.body, 140)}</p>
    </div>
  )
}
export default PostCell
