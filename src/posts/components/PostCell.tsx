import Link from "next/link"
import { pluralize, shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { PostWithIncludes } from "../helpers"

import Image from "next/image"
import { getImageUrl } from "src/core/components/image/helpers"

const HeaderImage = ({
  url,
  children,
  ...props
}: {
  url: string | null
  children: React.ReactNode
}) => {
  let inner
  if (url) {
    inner = (
      <img
        className={"opacity-20"}
        src={url}
        alt="Your Image"
        // layout="responsive"
        width={400}
      />
    )
  } else {
    inner = <div className="bg-neutral opacity-30 h-[100%]"></div>
  }

  return (
    <div className="w-full overflow-hidden rounded-t-2xl" {...props}>
      <div className="relative h-[200px] w-full ">
        {inner}
        <div className="absolute top-0 left-0 right-0">{children}</div>
      </div>
    </div>
  )
}

const PostCell = ({ post }: { post: PostWithIncludes }) => {
  const { images } = post
  const imageCount = images.length
  const firstImage = !imageCount ? null : images[0]
  return (
    <div className=" p-0 rounded-b-md rounded-t-2xl  bg-primary bg-opacity-20 ">
      <div className="  text-base-content   ">
        <HeaderImage url={!firstImage ? null : getImageUrl(firstImage, true)}>
          <h2 className="p-2 text-xl font-semibold mb-2 text-accent hover:text-accent-focus hover:underline">
            <Link className="text-shadow-sm shadow-black" href={makePostNavUrl(post)}>
              {shortenText(post.title, 100)}
            </Link>
          </h2>
        </HeaderImage>

        <div className="p-2">
          <span className="text-sm font-extrabold ">
            {pluralize(imageCount, {
              none: "",
              one: "1 fotografie",
              many: `${imageCount} fotografii`,
            })}
          </span>
          <p className="">{shortenText(post.body, 140)}</p>
        </div>
      </div>
      {/* {!imageCount ? null : <div className="w-20">19 oct.</div>} */}
    </div>
  )
}
export default PostCell
