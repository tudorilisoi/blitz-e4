import Link from "next/link"
import { pluralize, shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { PostWithIncludes } from "../../helpers"

import { getImageUrl } from "src/core/components/image/helpers"
import { Router, useRouter } from "next/router"
import styles from "./PostCell.module.css"

const HeaderImage = ({
  url: providedURL,
  children,
  ...props
}: {
  url: string | null
  children: React.ReactNode
}) => {
  console.log("styles", styles)
  // const url = providedURL || "/logo-bg.png"
  const url = encodeURI(providedURL || "/logo-bg.png")

  const bgClass = `${styles["bgImageOuter"]} h-[300px]`
  let inner
  inner = (
    <div data-url={url} className={bgClass}>
      {children}
    </div>
  )

  const bgStyle = `
  [data-url="${url}"]::before { background-image: url("${url}") !important; }
  `
  return (
    <>
      <style key={url}>{bgStyle}</style>
      <div className="w-full overflow-hidden rounded-t-2xl" {...props}>
        <div className="relative h-[300px] w-full ">
          {inner}
          {/* <div className="absolute top-0 left-0 right-0">{children}</div> */}
        </div>
      </div>
    </>
  )
}

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
      className={`${styles.postCell} group border border-neutral hover:border-primary  flex flex-row flex-nowrap p-0 rounded-md rounded-l-2xl

      bg-primary bg-opacity-20 shadow-sm cursor-pointer`}
    >
      <div style={imgStyle} className={`${styles.bgImage} flex-none w-[30%] rounded-l-2xl`}></div>
      <div className="flex-none w-[70%]  ">
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
          <p className="line-clamp-2">{shortenText(post.body, 200, "")}</p>
        </div>
      </div>
    </section>
  )
}

const _PostCell = ({ post }: { post: PostWithIncludes }) => {
  const router = useRouter()
  const { images } = post
  const imageCount = images.length
  const firstImage = !imageCount ? null : images[0]
  const url = makePostNavUrl(post)
  return (
    <section
      className={`${styles["postCell"]} p-0 rounded-b-md rounded-t-2xl  bg-primary bg-opacity-20 shadow-sm cursor-pointer `}
      onClick={() => router.push(url)}
    >
      <HeaderImage url={!firstImage ? null : getImageUrl(firstImage, true)}>
        <div className={`${styles["bgImageInner"]} h-[300px] flex flex-col content-start`}>
          <Link className="  bg-primary bg-opacity-80 text-shadow-sm shadow-black " href={url}>
            {/* NOTE line-clamp gets confused with padding so wrap text with a div */}
            <div className="p-2">
              <h2 className="text-xl  font-semibold text-white hover:underline break-words line-clamp-2 min-h-[3.5rem] ">
                {post.title}
              </h2>
            </div>
          </Link>
        </div>
      </HeaderImage>

      <div className="  text-base-content   ">
        <div className="p-2">
          <span className="text-sm font-extrabold ">
            {pluralize(imageCount, {
              none: "",
              one: "1 fotografie",
              many: `${imageCount} fotografii`,
            })}
          </span>
          <p className="line-clamp-2">{shortenText(post.body, 200, "")}</p>
        </div>
      </div>
      {/* {!imageCount ? null : <div className="w-20">19 oct.</div>} */}
    </section>
  )
}
export default PostCell
