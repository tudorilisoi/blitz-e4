import { Category } from "@prisma/client"
import Link from "next/link"
import { shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { PostWithIncludes } from "../helpers"
const PostCell = ({ post }: { post: PostWithIncludes }) => {
  const { images } = post
  return (
    <div key={post.id} className="p-4 rounded-lg shadow-md shadow-neutral-500 bg-primary-content">
      <h2 className="text-xl font-semibold mb-2 text-primary">
        <Link href={makePostNavUrl(post)}>{shortenText(post.title, 100)}</Link>
      </h2>
      {images.length > 0 ? <span className="text-sm ">{post.images.length} fotografii</span> : null}
      <p className="text-neutral">{shortenText(post.body, 140)}</p>
    </div>
  )
}
export default PostCell
