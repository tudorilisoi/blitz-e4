import Link from "next/link"
import { pluralize, shortenText } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { PostWithIncludes } from "../../helpers"

import { getImageUrl } from "src/core/components/image/helpers"

const HeaderImage = ({
  url: providedURL,
  children,
  ...props
}: {
  url: string | null
  children: React.ReactNode
}) => {
  // const url = providedURL || "/logo-bg.png"
  const url = providedURL || "/logo-bg.png"
  let inner
  if (url) {
    inner = (
      <div data-url={url} className="filtered-bg-image h-[200px]">
        <div className="filtered-bg-image-inside">{children}</div>
      </div>
    )
  } else {
    inner = (
      <div className="filtered-bg-image h-[200px]">
        <div className="filtered-bg-image-inside">
          <div className="bg-neutral h-[200px]">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>
        {`
          .filtered-bg-image {
            position: relative;
          }

          .filtered-bg-image::before {
            opacity: 0.7;
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-position: center top;
            background-repeat: no-repeat;
            background-color: #333;
            filter: grayscale(100%); /* Apply a grayscale filter */
          }

          .filtered-bg-image[data-url="${url}"]::before {
            background-image: url("${url}");
            background-size: cover;
          }

          .post-cell:hover .filtered-bg-image::before {
            filter: grayscale(30%) !important;
            opacity: 0.7;
          }

          .filtered-bg-image-inside {
            /* This will make it stack on top of the ::before */
            position: relative;
          }
        `}
      </style>
      <div className="w-full overflow-hidden rounded-t-2xl" {...props}>
        <div className="relative h-[200px] w-full ">
          {inner}
          {/* <div className="absolute top-0 left-0 right-0">{children}</div> */}
        </div>
      </div>
    </>
  )
}

const PostCell = ({ post }: { post: PostWithIncludes }) => {
  const { images } = post
  const imageCount = images.length
  const firstImage = !imageCount ? null : images[0]
  return (
    <div className="post-cell p-0 rounded-b-md rounded-t-2xl  bg-primary bg-opacity-20 shadow-sm ">
      <div className="  text-base-content   ">
        <HeaderImage url={!firstImage ? null : getImageUrl(firstImage, true)}>
          <Link className="text-shadow-sm shadow-black" href={makePostNavUrl(post)}>
            <h2 className="p-2 text-xl font-semibold mb-2 text-white   hover:underline">
              {shortenText(post.title, 100)}
            </h2>
          </Link>
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
