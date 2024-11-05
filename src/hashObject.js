import CryptoJS from "crypto-js"

export function hashObject(obj) {
  const jsonString = JSON.stringify(obj)
  const secret = process.env.SESSION_SECRET_KEY
  return CryptoJS.SHA256(jsonString + "@@@" + secret).toString(CryptoJS.enc.Hex)
}
