import { SocketLabsClient, BasicMessage } from "@socketlabs/email"
import { sleep } from "src/helpers"

const client = new SocketLabsClient(
  parseInt(process.env.SOCKETLABS_SERVER_ID as string),
  process.env.SOCKETLABS_INJECTION_API_KEY
)

interface mailArgs {
  from: string
  to: string
  subject: string
  message: string
  textMessage?: string | undefined
}

const sendMail = async (args: mailArgs, throttle = true) => {
  const { to, subject, message, textMessage } = args

  let basicMessage = new BasicMessage()

  basicMessage.from = process.env.MAIL_FROM
  basicMessage.subject = subject
  basicMessage.htmlBody = message
  if (textMessage) {
    basicMessage.textBody = textMessage
  }

  //Add a recipient by pushing a string to the To array
  basicMessage.to.push(to)
  if (to !== process.env.MAIL_BCC) {
    basicMessage.addBccEmailAddress(process.env.MAIL_BCC)
  }

  // poor man's throttle
  if (throttle) {
    await sleep(5000)
  }
  return client.send(basicMessage)
}

export { sendMail }
