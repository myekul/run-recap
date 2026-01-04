const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'
const MYEKUL_SHEET_ID = '14l1hkW337uiyCRkNz61MNq99AEoidZdqaQUIpH5FlGU'

const myekulSheets = {}
const markinSheets = {}
let runRecapCategory
let globalCache

let runRecap_savFile
let runRecap_lssFile = {}
let runRecap_rrcFile = {}

let rrcAttemptIndex = 0

let rrcCurrentAttempt = {}
let rrcComparisonAttempt = {}

let rrcComparisonCollection = {
    'Top 3 Average': Array.from({ length: 80 }, () => ({
        segment: 0,
        endTime: 0
    })),
    'Top Average': Array.from({ length: 80 }, () => ({
        segment: 0,
        endTime: 0
    })),
    "Top Bests": Array.from({ length: 80 }, () => ({
        segment: Infinity,
        endTime: Infinity
    })),
}
let rrcComparison = 'Top Bests'
let rrcComparisonText = 'Top Bests'
let rrcTopBests = []

let splitBefore
let scorecardMode = 'Default'

let dropboxEligible
let chartEligible

let runRecap_markin
let runRecapTime
let runRecapExample = false
let runRecapTheoretical = false
let splitInfo = []

let deltaType

let database

let savComparisonCollection = {}
let savComparison

let savComparisonView

let loaded

let commbestILs_ready

let commBestILs

// Alt Strats

let alt
let altStratNum = 0
let altStratLevel

let isolatePatterns
let baronessExtra
let bonbonSort = 'Standard'

let minibossArray = []

function decimalsCriteria() {
    return runRecapCategory.name == '1.1+'
}