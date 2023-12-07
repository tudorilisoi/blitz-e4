import Link from "next/link"
export const prevSymbol = "« "
export const nextSymbol = " »"
const SimpleNav = ({
  prevLink,
  nextLink,
  prevText = (
    <span className="flex-grow">
      {prevSymbol}
      {"Înapoi"}
    </span>
  ) as React.ReactNode,
  nextText = (
    <span className="flex-grow">
      {"Înainte"}
      {nextSymbol}
    </span>
  ) as React.ReactNode,
}) => {
  return (
    <nav className="join grid grid-cols-2 mt-6">
      <Link
        className={`btn btn-outline join-item bg-primary bg-opacity-30 text-xl p-2 ${
          !prevLink ? "btn-disabled" : " border-primary hover:btn-primary"
        }`}
        key={"simplenav-prev"}
        href={prevLink || "#"}
      >
        {prevText}
      </Link>
      <Link
        className={`btn btn-outline join-item bg-primary bg-opacity-30 text-xl p-2 ${
          !nextLink ? "btn-disabled" : " border-primary hover:btn-primary"
        }`}
        key={"simplenav-next"}
        href={nextLink || "#"}
      >
        {nextText}
      </Link>
    </nav>
  )
}

export default SimpleNav
