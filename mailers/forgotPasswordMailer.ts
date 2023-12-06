import { sendMail } from "integrations/socketlabsEmail"
import { formatDate, formatDateTZ } from "src/helpers"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  // In production, set NEXT_PUBLIC_APP_URL to your production server origin
  const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/auth/reset-password?token=${token}`
  const dateStr = formatDateTZ(Date(), formatDate.longDateTime)

  const msg = {
    from: process.env.MAIL_FROM as string,
    to,
    subject: `eRădăuţi.ro: resetează parola [${dateStr}]`,
    message: `
      <h1>Resetează parola</h1>
      <p>Ai solicitat resetarea parolei</p>
      <a href="${resetUrl}">
        Click aici pentru a reseta parola
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
