const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'

const CHESS = ['pawns', 'knight', 'bishop', 'rook', 'queen']
const RUNNGUNS = ['forestfollies', 'treetoptrouble', 'funfairfever', 'funhousefrazzle', 'ruggedridge', 'perilouspiers']
const OTHER_LEVELS = ['Pawns', 'Knight', 'Bishop', 'Rook', 'Queen', 'Angel & Demon', 'Treetop Trouble', 'Funfair Fever', 'Funhouse Frazzle', 'Rugged Ridge', 'Perilous Piers']

const ALT_STRAT_CATEGORIES = ['1.1+', 'Legacy', 'NMG', 'DLC L/S', 'DLC C/S', 'DLC+Base L/S', 'DLC+Base C/S']
const OTHER_CATEGORIES = [
    ['1.1+ All Flags', '1.1+ Low%', '1.1+ Expert', 'Legacy Low%', 'NMG P/S', 'NMG R/S', 'NMG Expert', 'OG Charge'],
    ['DLC Low%', 'DLC C/T', 'DLC R/S', 'DLC P/S', 'DLC OG Charge', 'DLC Expert', 'DLC+Base Simple L/S', 'DLC+Base Simple C/S', '300%'],
]
const MISC_DLC = ['DLC Low%', 'DLC C/T', 'DLC R/S', 'DLC P/S', 'DLC Expert', 'DLC+Base Simple L/S', 'DLC+Base Simple C/S', '300%']

const JUST_DLC = ['DLC Low%', 'DLC C/T', 'DLC R/S', 'DLC P/S', 'DLC OG Charge', 'DLC Expert']
const DUPLICATE_FOLLIES_1_1 = ['1.1+ Expert']
const DUPLICATE_FOLLIES_NMG = ['NMG P/S', 'NMG R/S', 'NMG Expert']
const DUPLICATE_FOLLIES_MAUS = ['DLC C/S', 'DLC+Base L/S', 'DLC+Base C/S', ...MISC_DLC]
const DUPLICATE_ESTHER = ['DLC C/S', 'DLC Low%', 'DLC C/T', 'DLC R/S', 'DLC P/S', 'DLC OG Charge']

const ODDS_BOSSES = ['captainbrineybeard', 'grimmatchstick', 'ribbyandcroaks', 'mrwheezy']

const LOADOUTS = {
    'NMG P/S': ['peashooter', 'spread'],
    'NMG R/S': ['roundabout', 'spread'],
    'DLC C/T': ['charge', 'twist-up'],
    'DLC R/S': ['roundabout', 'spread'],
    'DLC P/S': ['peashooter', 'spread'],
    'DLC+Base Simple C/S': ['charge', 'spread'],
}

const IMG_LOCATION = {
    chipsbettigan: 'phase/kingdice2',
    mrwheezy: 'phase/kingdice3',
    pipanddot: 'phase/kingdice4',
    hopuspocus: 'phase/kingdice5',
    pirouletta: 'phase/kingdice7',
    kingdice2: 'kingdice'
}

const OTHER_NAMES = {
    forestfollies: 'Forest Follies',
    chipsbettigan: 'Chips Bettigan',
    mrwheezy: 'Mr. Wheezy',
    pipanddot: 'Pip and Dot',
    hopuspocus: 'Hopus Pocus',
    pirouletta: 'Pirouletta',
    kingdice2: 'King Dice (Final)'
}

const MINIBOSSES = {
    'Waffle': 'waffle',
    'Candy Corn': 'candycorn',
    'Cupcake': 'cupcake',
    'Gumball': 'gumball',
    'Jawbreaker': 'jawbreaker'
}

const ATTACKS = {
    ribbyandcroaks: ['5 Flies', '6 Flies', '7 Flies', 'Punches', 'Snakes', 'Tigers', 'Bulls'],
    hildaberg: ['Gemini', 'Sagittarius'],
    cagneycarnation: ['Lunge', 'Pods', 'Seeds'],
    baronessvonbonbon: ['Waffle', 'Candy Corn', 'Cupcake', 'Gumball', 'Jawbreaker'],
    grimmatchstick: ['1 Laser', '2 Lasers', '3 Lasers', '2 Meteors', '3 Meteors', '4 Meteors'],
    rumorhoneybottoms: ['Middle', 'Orbs', 'Triangles'],
    drkahlsrobot: ['Red Gem', 'Blue Gem'],
    wernerwerman: ['Catapult', 'Cherry Bombs', 'Charge'],
    captainbrineybeard: ['Gun', '2-Gun', '4-Gun', 'Squid', 'Shark', 'Dogfish'],
    calamaria: ['Pufferfish', 'Turtle', 'Seahorse', 'Ghosts', 'Red Fish', 'Yellow Fish'],
    thedevil: ['Clap', 'Bubbles', 'Ring', 'Pinwheel', 'Dragon', 'Spider'],
    glumstonethegiant: ['Cauldron', 'Geese', 'Bear'],
    chefsaltbaker: ['L', 'S', 'D', '-']
}

const STATS_CONFIG = {
    baronessvonbonbon: {
        minibosses: MINIBOSSES,
        fields: ['overall', 'minion1', 'minion2', 'minion3'],
        groupSize: 3,
        groupLabels: ['', '1st', '2nd', '3rd'],
        startIndex: 0,
        limit: null
    },
    captainbrineybeard: {
        minibosses: { '2-Gun': '2-Gun', '4-Gun': '4-Gun', 'Squid': 'Squid', 'Shark': 'Shark', 'Dogfish': 'Dogfish', 'Gun': 'Gun' },
        fields: ['overall', 'minion1', 'minion2'],
        groupSize: 2,
        groupLabels: ['', '1st', '2nd'],
        startIndex: 1,
        limit: 20
    }
}

const KD_MINIBOSSES = {
    booze: 'tipsytroop',
    chips: 'chipsbettigan',
    cigar: 'mrwheezy',
    domino: 'pipanddot',
    rabbit: 'hopuspocus',
    flying_horse: 'phearlap',
    roulette: 'pirouletta',
    eight_ball: 'mangosteen',
    flying_memory: 'mrchimes'
}
const KD_MINIBOSS_ID = {
    booze: 1,
    chips: 2,
    cigar: 3,
    domino: 4,
    rabbit: 5,
    flying_horse: 6,
    roulette: 7,
    eight_ball: 8,
    flying_memory: 9
}