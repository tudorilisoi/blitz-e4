import slugify from "slugify"
import truncate from "lodash/truncate"
import upperFirst from "lodash/upperFirst"

export const makeSlug = (str) => {
  // TODO copy sanitization from ert2-now
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

export const shortenText = (str, maxLength) => {
  return truncate(str, { length: maxLength, separator: /(\W+)/ })
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
  let text = cleanText(str)
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
