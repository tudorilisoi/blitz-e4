import Link from "next/link"
import { pluralize, shortenText } from "src/helpers"
import { makePostsNavUrl } from "src/pages/anunturi/[[...params]]"
import { CategoryWithCounters } from "../helpers"
import { useRouter } from "next/router"
import CategoryIcon from "src/core/components/CategoryIcon"
const CategoryCell = ({ category }: { category: CategoryWithCounters }) => {
  const { postCount } = category
  const router = useRouter()
  const url = makePostsNavUrl(category.slug, 1)
  return (
    <section
      key={category.id}
      className="p-4 rounded-md  bg-primary bg-opacity-20  text-base-content cursor-pointer "
      onClick={() => router.push(url)}
    >
      <h2 className="text-xl font-semibold mb-2 text-accent hover:text-accent-focus hover:underline">
        <CategoryIcon categoryId={category.id} />
        <Link rel="prefetch" href={url}>
          {shortenText(category.title, 100)}
        </Link>
      </h2>

      <span className="text-sm font-extrabold ">
        {pluralize(postCount, {
          none: "niciun anunţ",
          one: "1 anunţ",
          many: `${postCount} anunţuri`,
        })}
      </span>

      <p className="line-clamp-2">{shortenText(category.description, 140, "")}</p>
    </section>
  )
}
export default CategoryCell
