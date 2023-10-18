import Link from "next/link"
import { shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { PostWithIncludes } from "../helpers"
const PostCell = ({ post }: { post: PostWithIncludes }) => {
  const { images } = post
  return (
    <div className="flex flex-row flex-nowrap p-4 rounded-md  bg-primary bg-opacity-20 ">
      <div className="  text-base-content flex-shrink flex-1 ">
        <h2 className="text-xl font-semibold mb-2 text-accent hover:text-accent-focus hover:underline">
          <Link href={makePostNavUrl(post)}>{shortenText(post.title, 100)}</Link>
        </h2>
        {images.length > 0 ? (
          <span className="text-sm font-extrabold ">{post.images.length} fotografii</span>
        ) : null}
        <p className="">{shortenText(post.body, 140)}</p>
      </div>
      <div className="">Image here!!!</div>
    </div>
  )
}
export default PostCell
