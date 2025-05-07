import Link from "next/link"
import { pluralize, shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { PostWithIncludes } from "../../helpers"

import { getImageUrl } from "src/core/components/image/helpers"
import { Router, useRouter } from "next/router"
import styles from "./PostCell.module.css"

const PostCell = ({ post }: { post: PostWithIncludes }) => {
  const router = useRouter()
  const { images } = post
  const imageCount = images.length
  const firstImage = !imageCount ? null : images[0]
  const url = makePostNavUrl(post)
  const imageUrl = encodeURI(firstImage ? getImageUrl(firstImage, true) : "/logo-bg.png")
  const imgStyle = {
    backgroundImage: `url("${imageUrl}")`,
  }

  return (
    <section
      onClick={() => router.push(url)}
      className={`${styles.postCell} min-w-0 h-full group border border-neutral hover:border-primary  flex flex-row flex-nowrap p-0 rounded-md rounded-l-2xl
max-w-[100%]
      bg-primary bg-opacity-20 shadow-sm cursor-pointer`}
    >
      <div style={imgStyle} className={`${styles.bgImage} flex-none w-[30%] rounded-l-2xl`}></div>
      <div className="flex-none w-[70%] max-w-[70%] ">
        <div className="bg-primary bg-opacity-40 group-hover:bg-opacity-80 rounded-tr-md  ">
          <div className="p-2 pl-3">
            <Link href={url}>
              <h2 className="text-lg  font-semibold text-primary-content  break-words line-clamp-2 min-h-[3.2rem] ">
                {post.title}
              </h2>
            </Link>
          </div>
        </div>
        <div className="p-2">
          <p className="line-clamp-2 break-words">{shortenText(post.body, 200, "")}</p>
        </div>
      </div>
    </section>
  )
}

export default PostCell
