import { loadEnvConfig } from "@next/env"
import { MeiliSearch } from "meilisearch"
// https://raw.githubusercontent.com/stopwords-iso/stopwords-ro/master/raw/stopwords-filter-ro.txt
const stopWords = `
acea
aceasta
această
aceea
acei
aceia
acel
acela
acele
acelea
acest
acesta
aceste
acestea
aceşti
aceştia
ai
aia
aibă
aici
al
ăla
ale
alea
ălea
am
ar
are
aş
asta
ăsta
astăzi
astea
ăstea
ăştia
aţi
au
avea
avem
aveţi
azi
bine
ca
că
căci
când
care
cărei
căror
cărui
cât
câte
câţi
către
câtva
caut
ce
cel
ceva
chiar
cinci
cînd
cine
cît
cîte
cîţi
cîtva
cu
da
dă
dacă
dar
dată
dau
de
deci
deja
deşi
din
dintr-
dintre
ea
ei
el
ele
eram
este
eşti
eu
face
fără
fata
fi
fie
fii
fim
fiţi
fiu
iar
ieri
îi
îl
îmi
în
încât
încît
încotro
între
întrucât
întrucît
îţi
la
le
li
lor
lui
mă
mai
mâine
mea
mei
mele
mereu
meu
mi
mie
mine
mult
multă
mulţi
ne
nici
nişte
noastră
noastre
noi
noştri
nostru
nouă
nu
opt
ori
oricând
oricare
oricât
orice
oricînd
oricine
oricît
oricum
oriunde
până
patra
patru
patrulea
pe
pentru
peste
pic
pînă
poate
pot
prea
prin
puţin
puţina
puţină
sa
să
săi
sale
şapte
şase
sau
său
se
şi
sînt
sîntem
sînteţi
ştiu
sunt
suntem
sunteţi
sută
ta
tăi
tale
tău
te
ţi
ţie
tine
toată
toate
tot
toţi
totuşi
trei
treia
treilea
tu
un
una
unde
undeva
unei
uneia
unele
uneori
unii
unor
unora
unu
unui
unuia
unul
vă
vi
voastră
voastre
voi
voştri
vostru
vouă
vreme
vreo
vreun
zece
zero
zi
zice
`
  .split("\n")
  .filter(Boolean)
const allowedWords = ["două", "trei", "patru", "cinci", "halbă"]
const stopwordsFiltered = stopWords.filter((w) => !allowedWords.includes(w))

const root = process.cwd()

loadEnvConfig(process.cwd())
const client = new MeiliSearch({
  host: process.env.MEILI_URL || "http://localhost:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
})

const logger = (...args) => {
  if (!process.env.MEILI_VERBOSE) {
    return null
  }
  return console.log.apply(console.log, args)
}

logger(`MEILI: root`, root)

export const init = async () => {
  const indexes = ["Post"]

  const keys = await client.getKeys()
  let searchKey = keys.results.find((k) => k.name === "PublicKeySearchAllIndexes")
  logger(`MEILI: EXISTING searchKey:`, searchKey)

  if (!searchKey) {
    // NOTE the actual searchKey.key which is used client-side is deterministic based on given uid
    await client
      .createKey({
        uid: "4c607b1e15ccb4b1e0453d369039268d",
        name: "PublicKeySearchAllIndexes",
        actions: ["search"],
        indexes: ["*"],
        expiresAt: null,
      })
      .then((key) => {
        searchKey = key
        logger("MEILI: CREATED searchKey::", key)
        // replaceEnv(".env", "NEXT_PUBLIC_MEILI_SEARCH_KEY", key.key)
      })
      .catch((err) => {
        logger("MEILI: CREATE KEY ERR:", err)
      })
  }

  if (searchKey && searchKey.key !== process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY) {
    console.error(`MEILI: Please update your env file by setting this:

    NEXT_PUBLIC_MEILI_SEARCH_KEY=${searchKey.key}

    `)
  }

  const { results: existingIndexes } = await client.getIndexes()

  for (let index of indexes) {
    let idx = existingIndexes.find((i) => i.uid === index)
    if (idx) {
      logger(`MEILI: EXISTING INDEX`, index)
      if (index === "Post") {
        await client.index(index).updateSynonyms({
          chirie: ["închiriez", "închiriere", "închiriază", "închiriat"],
          "de vinzare": ["vand"],
          vand: ["de vanzare", "vanzare", "vandut", "vinde", "vind"],
          "vand telefon": ["vand telefon mobil", "vand smartphone"],
          "vind telefon": ["vand telefon mobil", "vand smartphone"],
          vinzare: ["de vinzare", "de vanzare", "vanzare", "vandut", "vinde", "vand"],
          munca: ["angajare", "angajeaza", "angajari"],
        })
        const synonims = await client.index(index).getSynonyms()
        logger(`MEILI: INDEX ${index} SYNONIMS:`, synonims)
        let settings = await client.index(index).getSettings()
        settings.stopWords = stopwordsFiltered
        await client.index(index).updateSettings(settings)
        settings = await client.index(index).getSettings()
        logger(`MEILI: ${index} SETTINGS`, settings)
      }
      continue
    }
    try {
      const res = await client.createIndex(index, { primaryKey: "id" })
      logger(`MEILI: CREATE INDEX ${index}:`, res)
    } catch (error) {
      logger(`MEILI: ERROR ${index} index `, error)
    }
  }
  try {
    await client
      .index("Post")
      .updateLocalizedAttributes([{ locales: ["ron"], attributePatterns: ["*"] }])
    await client.index("Post").updateSortableAttributes(["title", "updatedTimestamp"])
    await client
      .index("Post")
      .updateSearchableAttributes([
        "title",
        "body",
        "category.title",
        "author.fullName",
        "author.phone",
        "author.email",
      ])
    await client
      .index("Post")
      .updateRankingRules([
        "updatedTimestamp:desc",
        "words",
        "proximity",
        "attribute",
        "typo",
        "sort",
        "exactness",
      ])
    logger(`MEILI: Settings updated`)
  } catch (error) {
    logger(`MEILI: ERROR on Post index `, error)
  }
}
process.env.__MEILI_INITIALIZED = ""
if (!process.env.__MEILI_INITIALIZED) {
  process.env.__MEILI_INITIALIZED = "true"

  init()
    .then((res) => {
      logger(`MEILI: INIT DONE`, res)
    })
    .catch((error) => {
      console.error(`MEILI: INIT ERROR`, error)
    })
}

export { client as meiliClient }

function replaceEnv(envFilePath, targetVariable, newValue) {
  const fs = require("fs")

  // Specify the .env file path
  // const envFilePath = '.env';

  // Specify the variable you want to replace
  // const targetVariable = "MY_VARIABLE"

  // Specify the new value for the variable
  // const newValue = "new_value"

  fs.readFile(envFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading ${envFilePath}: ${err}`)
      return
    }

    // Use regular expressions to replace the variable's value
    let updatedEnv = data.replace(
      new RegExp(`${targetVariable}=.+`),
      `${targetVariable}=${newValue}`
    )

    if (data === updatedEnv && !updatedEnv.includes(`${targetVariable}=`)) {
      updatedEnv = `
      ${updatedEnv}
      ${targetVariable}=${newValue}
      `
    }

    // Write the updated .env file
    fs.writeFile(envFilePath, updatedEnv, "utf8", (writeErr) => {
      if (writeErr) {
        console.error(`Error writing ${envFilePath}: ${writeErr}`)
      } else {
        logger(`Updated ${envFilePath}: ${targetVariable}=${newValue}`)
      }
    })
  })
}
