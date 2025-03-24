import { Frown, Smile, CircleAlert } from "lucide-react"

export const ErrorIcon = () => <NotificationIcon Component={Frown} className={"text-error"} />
export const SuccessIcon = () => <NotificationIcon Component={Smile} className={"text-success"} />
export const InfoIcon = () => <NotificationIcon Component={CircleAlert} className={"text-info"} />

export const NotificationIcon = ({ Component, ...props }) => {
  const defaultCx = "h-[104px] w-[104px] inline-block "
  const cx = props.className || ""
  let p = props
  delete p.className

  return <Component {...p} className={`${defaultCx} ${cx}`} />
}
