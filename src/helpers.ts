import { decode } from "html-entities"
import truncate from "lodash/truncate"
import upperFirst from "lodash/upperFirst"
import slugify from "slugify"
import striptags from "striptags"
import dayjs from "dayjs"
import "dayjs/locale/ro"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale("ro")

export const makeSlug = (str) => {
  // TODO copy sanitization from e3-razzle
  let ret = str
  ret = ret.trim()
  ret = slugify(ret)
  ret = ret.replace(/[^A-Za-z0-9|-]+/g, "")
  ret = ret.replace(/[-]+/g, "-")
  return ret
}

export const cleanText = (str) => {
  //TODO use lodash unescape
  let text = str
  text = text.replace("&emdash;", "-")
  text = text.replace("&dash;", "-")
  text = text.replace("&nbsp", " ")
  return text
}
function HTMLToText(s) {
  return decode(striptags(s))
}

export const shortenText = (str, maxLength, omission = "...") => {
  return truncate(str, { length: maxLength, separator: /(\W+)/, omission })
}

export const nl2space = (str) => {
  const RE = /[\r|\n|\s|\W|\t]+/gm
  const ret = str.replace(RE, " ")
  return ret
}

export const nl2br = (str) => {
  // console.log(str)
  return str
    .split(/(\r|\n)+/m)
    .filter((i) => {
      // console.log(`[${i}]`)
      return i.trim() !== ""
    })
    .map(function (item, key) {
      return `
              <span>
                  ${item}
                  <br />
              </span>
          `
    })
    .join("")
}

export const obscurePhoneNumbers = (str) => {
  let retStr = str
  let re = /([+](\s+)?)?\d(\d|\s|[.-/]){8,}\d/gm
  const matches = str.matchAll(re)
  for (const match of matches) {
    const matchedStr = match[0]
    const digits = matchedStr.replace(/[^\d]/gm, "")

    // a phone numbar must have 10 digits
    if (digits.length === 10) {
      retStr = retStr.replace(matchedStr, "**********")
    }
  }

  return retStr
}

export const S = function (str) {
  if (!(this instanceof S)) {
    // @ts-ignore
    return new S(str)
  }
  this._str = str
  this.str = str

  this.trim = function () {
    this.str = this.str.trim()
    return this
  }
  const funcs = {
    HTMLToText: HTMLToText,
    nl2space: nl2space,
    nl2br: nl2br,
    shortenText: shortenText,
    upperFirst: upperFirst,
    obscurePhoneNumbers: obscurePhoneNumbers,
  }
  for (let k in funcs) {
    this[k] = function (...args) {
      this.str = funcs[k].apply(null, [this.str, ...args])
      return this
    }
  }
  this.get = () => this.str
  return this
}

interface PluralizeArgs {
  none?: string
  one: string
  many: string
}

export const pluralize = (count: number, { none, one, many }: PluralizeArgs) => {
  let prefix = ``
  const cstr = `${count}`
  if (count > 19) {
    const last2digits = cstr.substring(cstr.length - 2)
    const suff = parseInt(last2digits)
    // ends in 01-19
    const e = suff >= 1 && suff <= 19
    if (!e) {
      prefix = "de"
    }
  }

  switch (count) {
    case 0:
      return none || ""
      break
    case 1:
      return one
      break

    default:
      return `${many.replace(cstr, `${cstr} ${prefix}`)}`
      break
  }
}

export const formatDate = (dateStr, formatStr) => {
  const _formatStr = formatStr || formatDate.longDate
  if (formatStr === "ISO") {
    return dayjs.utc(dateStr).toISOString()
  }
  return dayjs.utc(dateStr).format(_formatStr)
}

export const formatDateTZ = (dateStr, formatStr, tz = "Europe/Bucharest") => {
  const _formatStr = formatStr || formatDate.longDate
  return dayjs.utc(dateStr).tz(tz).format(_formatStr)
}

formatDate.ISO = `ISO`
formatDate.short = `D MMM YYYY`
formatDate.longDateTime = "D MMMM YYYY h:mm a"
formatDate.longDate = "D MMMM YYYY"

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const canonical = (url: string) => {
  return process.env.NEXT_PUBLIC_APP_URL + url
}
