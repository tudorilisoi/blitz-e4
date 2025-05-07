import Link from "next/link"
import { shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { PostWithIncludes } from "../../helpers"

import { useRouter } from "next/router"
import { getImageUrl } from "src/core/components/image/helpers"
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
  const isPromoted = post.promotionLevel > 0

  return (
    <section
      onClick={() => router.push(url)}
      className={`${styles.postCell} relative min-w-0 h-full group border border-neutral hover:border-primary  flex flex-row flex-nowrap p-0 rounded-md rounded-l-2xl
max-w-[100%]
      bg-primary bg-opacity-20 shadow-sm cursor-pointer overflow-hidden`}
    >
      <div style={imgStyle} className={`${styles.bgImage} flex-none w-[30%] rounded-l-2xl`}></div>
      {/*  <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-l-[60px] border-t-red-600 border-l-transparent">
        <div className="absolute -top-10 right-0 w-auto text-white text-[10px] font-bold transform rotate-45  text-center pointer-events-none">
          PROMO
        </div>
      </div> */}
      {!isPromoted ? null : (
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[60px] border-r-[60px] border-t-red-600 border-r-transparent">
          <div className="absolute -top-10 left-0 w-auto text-white text-[10px] font-bold transform -rotate-45  text-center pointer-events-none">
            PROMO
          </div>
        </div>
      )}
      <div className="flex-none w-[70%] max-w-[70%] ">
        <div
          className={`${isPromoted ? "bg-secondary" : "bg-primary"} bg-opacity-40 group-hover:bg-opacity-80 rounded-tr-md  `}
        >
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
