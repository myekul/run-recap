const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'

const RUNNGUNS = ['forestfollies', 'treetoptrouble', 'funfairfever', 'funhousefrazzle', 'ruggedridge', 'perilouspiers']
const OTHER_LEVELS = ['Pawns', 'Knight', 'Bishop', 'Rook', 'Queen', 'Angel & Demon', 'Treetop Trouble', 'Funfair Fever', 'Funhouse Frazzle', 'Rugged Ridge', 'Perilous Piers']

const ALT_STRAT_CATEGORIES = ['1.1+', 'Legacy', 'NMG', 'DLC L/S', 'DLC C/S', 'DLC+Base L/S', 'DLC+Base C/S']
const OTHER_CATEGORIES = ['NMG P/S', 'DLC+Base Simple C/S', 'DLC Low%', 'DLC C/T', 'DLC Expert', '300%']

let runRecapCategory
let globalCache

let allPlayers = []

// File types

let runRecap_savFile
let runRecap_lssFile = {}
let runRecap_rrcFile = {}

// .sav

let savComparisonCollection = {}
let savComparison
let savComparisonText

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
let scorecardMode = 'Default'

let dropboxEligible
let chartEligible

let runRecapTime
let runRecapExample = false
let runRecapTheoretical = false
let splitInfo = []

let deltaType

const runRecap_database = { sav: [], rrc: [] }

let databaseType = 'rrc'
let databaseCategory

let loaded

let commBestILs_readyToSubmit

let commBestILs

let onlyShowFinished = false
let onlyShowDeathless = false

// Alt Strats

let alt
let altStratNum = 0
let altStratLevel

let categoryNames = []

const copiedILs = {}

let isolatePatterns
let altStratExtra
let bonbonSort = 'Standard'

let minibossArray = []

let altStratOther = '300%'
let altStratCategory

function decimalsCriteria() {
    return runRecapCategory.name == '1.1+'
}