const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'
const MYEKUL_SHEET_ID = '14l1hkW337uiyCRkNz61MNq99AEoidZdqaQUIpH5FlGU'

const myekulSheets = {}
const markinSheets = {}
let commBestILsCategory
let globalCache

let runRecap_savFile
let runRecap_lssFile = {}
let runRecap_rrcFile = {}

let rrcAttemptIndex = 0

let runRecap_markin
let runRecapTime
let runRecapExample = false
let runRecapTheoretical = false
let splitInfo = []

let deltaType

let database

let savComparison

let savComparisonView

let loaded

let commbestILs_ready

let altStratLevel

let commBestILs
let alt

let commBestILSum = 0

let isolatePatterns
let residualExtra
let baronessExtra
let bonbonSort = 'Standard'

let globalStarSkips = 0
let kd1
let kd2
let globalFollies
let globalCala
let globalWerner
let globalKD

let globalResidual

let minibossArray = []

function decimalsCriteria() {
    return commBestILsCategory.name == '1.1+'
}