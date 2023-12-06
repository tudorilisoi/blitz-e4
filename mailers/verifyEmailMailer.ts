import { sendMail } from "integrations/socketlabsEmail"
import { formatDate, formatDateTZ } from "src/helpers"

type VerifyEmailMailerParams = {
  to: string
  activationKey: string
}

export function verifyEmailMailer({ to, activationKey }: VerifyEmailMailerParams) {
  // In production, set NEXT_PUBLIC_APP_URL to your production server origin
  const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.BLITZ_DEV_SERVER_ORIGIN
  const dateStr = formatDateTZ(Date(), formatDate.longDateTime)
  const verifyUrl = `${origin}/auth/verify?activationKey=${encodeURIComponent(
    activationKey
  )}&email=${encodeURIComponent(to)}`

  const msg = {
    from: process.env.MAIL_FROM as string,
    to,
    subject: `eRădăuţi.ro: activează contul [${dateStr}]`,
    message: `
      <h1>Activează contul</h1>
      <p>Ai solicitat înregistrarea pe situl eRădăuţi.ro</p>
      <a href="${verifyUrl}">
        Click aici pentru a activa contul
      </a>
    `,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === "production") {
        await sendMail(msg)
        // throw new Error("No production email implementation in mailers/forgotPasswordMailer")
      } else {
        // Preview email in the browser
        const previewEmail = (await import("preview-email")).default
        await previewEmail(msg, { open: true })
        await sendMail(msg)
      }
    },
  }
}
