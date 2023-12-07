import { useRouter } from "next/router"
import { useEffect } from "react"

// const isProduction = process.env.NODE_ENV === "production";
const isProduction = true
export const GTag = () => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      /* invoke analytics function only for production */
      if (isProduction) {
        window.setTimeout(() => {
          const page = {
            url: window.location.href,
            title: document.title,
          }
          console.log("GTag push", page.title, page.url)
          // @ts-ignore
          window.dataLayer.push({
            event: "pageview",
            page,
          })
        }, 100)
      }
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])
  return <></>
}
