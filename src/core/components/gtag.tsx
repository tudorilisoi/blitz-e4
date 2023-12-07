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
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            send_to: process.env.NEXT_PUBLIC_GTAG_ID,
          }
          console.log("GTag push", page.page_title, page.page_location)
          // @ts-ignore
          //   window.dataLayer.push({
          //     event: "page_view",
          //     page,
          //   })

          gtag("config", process.env.NEXT_PUBLIC_GTAG_ID, {
            page_path: page.page_path,
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
