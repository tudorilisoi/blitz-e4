import { FaceFrownIcon, FaceSmileIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"

export const ErrorIcon = () => (
  <NotificationIcon Component={FaceFrownIcon} className={"text-error"} />
)
export const SuccessIcon = () => (
  <NotificationIcon Component={FaceSmileIcon} className={"text-success"} />
)
export const InfoIcon = () => (
  <NotificationIcon Component={ExclamationCircleIcon} className={"text-info"} />
)

export const NotificationIcon = ({ Component, ...props }) => {
  const defaultCx = "h-[104px] w-[104px] inline-block "
  const cx = props.className || ""
  let p = props
  delete p.className

  return <Component {...p} className={`${defaultCx} ${cx}`} />
}
