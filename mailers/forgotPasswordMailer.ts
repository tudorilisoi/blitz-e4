/* TODO - You need to add a mailer integration in `integrations/` and import here.
 *
 * The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */

import { sendMail } from "integrations/socketlabsEmail"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/auth/reset-password?token=${token}`

  const msg = {
    from: process.env.MAIL_FROM as string,
    to,
    subject: "eRădăuţi: resetează parola",
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
        // TODO - send the production email, like this:
        // await postmark.sendEmail(msg)
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
