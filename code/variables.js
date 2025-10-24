const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'
const MYEKUL_SHEET_ID = '14l1hkW337uiyCRkNz61MNq99AEoidZdqaQUIpH5FlGU'

const myekulSheets = {}
const markinSheets = {}
let commBestILsCategory
let globalCache
let runRecap_savFile
let runRecap_lssFile = {}
let runRecap_markin
let runRecapTime
let runRecapExample = false
let runRecapTheoretical = false
let splitInfo = []

let globalCategory = {}

let deltaType

let database

let savComparison

let savComparisonView

let loaded

let commbestILs_ready

let altStratIndex = -1

let alt

function decimalsCriteria() {
    return commBestILsCategory.name == '1.1+'
}