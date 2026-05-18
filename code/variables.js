const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'

let runRecapCategory
let globalCache

let allPlayers = []

// File types

let runRecap_savFile
let runRecap_lssFile = {}
let runRecap_rrcFile = {}

// .rrc

let rrcAttemptIndex = 0

let rrcCurrentAttempt = {}
let rrcComparisonAttempt = {}

let rrcComparisonCollection = {}
let rrcComparison = 'Top Bests'
let rrcComparisonText = 'Top Bests'

let lssPlayerIndex = 0

let commSob = []

let splitBefore
let segmentToggle
let scorecardMode = 'Default'

let dropboxEligible
let chartEligible

let runRecapTime
let runRecapExample = false
let runRecapTheoretical = false
let splitInfo = []

let deltaType

let truncatedDLCBase

const runRecap_database = { sav: [], rrc: [] }

let databaseType = 'rrc'
let databaseCategory

let savComparisonCollection = {}
let savComparison
let savComparisonText

let loaded

let commbestILs_ready

let commBestILs

let onlyShowFinished = false
let onlyShowDeathless = false

// Alt Strats

let alt
let altStratNum = 0
let altStratLevel

const copiedILs = {}

let isolatePatterns
let altStratExtra
let bonbonSort = 'Standard'

let minibossArray = []

function decimalsCriteria() {
    return runRecapCategory.name == '1.1+'
}