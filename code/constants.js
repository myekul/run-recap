const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'

const RUNNGUNS = ['forestfollies', 'treetoptrouble', 'funfairfever', 'funhousefrazzle', 'ruggedridge', 'perilouspiers']
const OTHER_LEVELS = ['Pawns', 'Knight', 'Bishop', 'Rook', 'Queen', 'Angel & Demon', 'Treetop Trouble', 'Funfair Fever', 'Funhouse Frazzle', 'Rugged Ridge', 'Perilous Piers']

const ALT_STRAT_CATEGORIES = ['1.1+', 'Legacy', 'NMG', 'DLC L/S', 'DLC C/S', 'DLC+Base L/S', 'DLC+Base C/S']
const OTHER_CATEGORIES = ['1.1+ All Flags', 'NMG P/S', 'NMG R/S', 'DLC Low%', 'DLC C/T', 'DLC R/S', 'DLC Expert', 'DLC+Base Simple C/S', '300%']
const MISC_DLC = ['DLC Low%', 'DLC C/T', 'DLC R/S', 'DLC Expert', 'DLC+Base Simple C/S', '300%']

const LOADOUTS = {
    'NMG P/S': ['peashooter', 'spread'],
    'NMG R/S': ['roundabout', 'spread'],
    'DLC C/T': ['charge', 'twist-up'],
    'DLC R/S': ['roundabout', 'spread'],
    'DLC+Base Simple C/S': ['charge', 'spread'],
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
    cagneycarnation: ['Lunge', 'Pods', 'Seeds'],
    captainbrineybeard: ['Gun', '2-Gun', '4-Gun', 'Squid', 'Shark', 'Dogfish'],
    calamaria: ['Pufferfish', 'Turtle', 'Seahorse', 'Ghosts', 'Red Fish', 'Yellow Fish'],
    thedevil: ['Clap', 'Bubbles', 'Ring', 'Pinwheel', 'Dragon', 'Spider']
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