import { decode } from "html-entities"
import truncate from "lodash/truncate"
import upperFirst from "lodash/upperFirst"
import slugify from "slugify"
import striptags from "striptags"
import dayjs from "dayjs"
import "dayjs/locale/ro"
import relativeTime from "dayjs/plugin/relativeTime"
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
  const RE = /[\r|\n|\s|\W|\t]+/gmu
  const ret = str.replace(RE, " ")
  return ret
}

export const nl2br = (str) => {
  // console.log(str)
  return str
    .split(/(\r|\n)+/mu)
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
  let re = /([+](\s+)?)?\d(\d|\s|[.-/]){8,}\d/gmu
  return str.replace(re, "********")
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
  return dayjs(dateStr).format(_formatStr)
}

formatDate.short = `D MMM YYYY`
formatDate.longDateTime = "D MMMM YYYY h:mm a"
formatDate.longDate = "D MMMM YYYY"

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
