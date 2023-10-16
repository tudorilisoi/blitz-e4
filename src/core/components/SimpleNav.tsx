import Link from "next/link"

const SimpleNav = ({ prevLink, nextLink }) => {
  return (
    <nav className="join grid grid-cols-2 mt-6">
      <Link
        className={`btn btn-outline join-item ${
          !prevLink ? "btn-disabled" : " border-primary hover:btn-primary"
        }`}
        key={"simplenav-prev"}
        href={prevLink || "#"}
      >
        « Înapoi
      </Link>
      <Link
        className={`btn btn-outline join-item ${
          !nextLink ? "btn-disabled" : " border-primary hover:btn-primary"
        }`}
        key={"simplenav-prev"}
        href={nextLink || "#"}
      >
        Înainte »
      </Link>
    </nav>
  )
}

export default SimpleNav
