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
      <div data-url={url} className="filtered-bg-image h-[300px]">
        {children}
      </div>
    )
  } else {
    inner = (
      <div className="filtered-bg-image h-[300px]">
        <div className="filtered-bg-image-inside">
          <div className="bg-neutral h-[300px]">{children}</div>
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
            transition: all 0.3s ease-in-out;
          }

          .filtered-bg-image[data-url="${url}"]::before {
            background-image: url("${url}");
            background-size: cover;
          }

          .post-cell:hover .filtered-bg-image::before {
            filter: grayscale(0%);
          }

          .filtered-bg-image-inside {
            /* This will make it stack on top of the ::before */
            position: relative;
          }
        `}
      </style>
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
  const { images } = post
  const imageCount = images.length
  const firstImage = !imageCount ? null : images[0]
  return (
    <section className="post-cell p-0 rounded-b-md rounded-t-2xl  bg-primary bg-opacity-20 shadow-sm ">
      <HeaderImage url={!firstImage ? null : getImageUrl(firstImage, true)}>
        <div className="filtered-bg-image-inside h-[300px] flex flex-col content-start">
          <Link
            className="  bg-primary bg-opacity-70 text-shadow-sm shadow-black "
            href={makePostNavUrl(post)}
          >
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
          <p className="">{shortenText(post.body, 140)}</p>
        </div>
      </div>
      {/* {!imageCount ? null : <div className="w-20">19 oct.</div>} */}
    </section>
  )
}
export default PostCell
