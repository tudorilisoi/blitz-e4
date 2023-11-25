import Link from "next/link"

const SimpleNav = ({
  prevLink,
  nextLink,
  prevText = "Înapoi" as React.ReactNode,
  nextText = "Înainte" as React.ReactNode,
}) => {
  return (
    <nav className="join grid grid-cols-2 mt-6">
      <Link
        className={`btn btn-outline join-item bg-primary bg-opacity-30 text-xl ${
          !prevLink ? "btn-disabled" : " border-primary hover:btn-primary"
        }`}
        key={"simplenav-prev"}
        href={prevLink || "#"}
      >
        « {prevText}
      </Link>
      <Link
        className={`btn btn-outline join-item bg-primary bg-opacity-30 text-xl ${
          !nextLink ? "btn-disabled" : " border-primary hover:btn-primary"
        }`}
        key={"simplenav-next"}
        href={nextLink || "#"}
      >
        {nextText} »
      </Link>
    </nav>
  )
}

export default SimpleNav
