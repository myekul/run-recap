google.charts.load('current', { packages: ['corechart'] });
setFooter('2025')
setTabs(['home', null, [
    `<div id='savButton' onclick="playSound('category_select');showTab('sav')" class="font2 button grayedOut"
        style="width:80px;font-size:120%;gap:4px;background-color:var(--cuphead)">
        <img src="images/sav.png" style="height:21px">.sav
    </div>
    <div id='lssButton' onclick="playSound('category_select');showTab('lss')" class="font2 button grayedOut"
        style="width:80px;font-size:120%;gap:4px;background-color:var(--cuphead)">
        <img src="images/lss.png" style="height:21px">.lss
    </div>`
], null, 'sums', 'residual', 'grid', null, 'ballpit'])
initializeHash('home')
setAudio('cuphead')
runRecapDefault()
const dropbox = document.getElementById('dropbox');
const dropboxClass = 'dropboxHover'
dropbox.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropbox.classList.add(dropboxClass);
});
dropbox.addEventListener('dragleave', () => {
    dropbox.classList.remove(dropboxClass);
});
dropbox.addEventListener('drop', (event) => {
    event.preventDefault();
    dropbox.classList.remove(dropboxClass);
    const files = event.dataTransfer.files;
    runRecapHandleFile(files[0])
});
document.addEventListener('DOMContentLoaded', function () {
    fetch('resources/alt.json')
        .then(response => response.json())
        .then(data => {
            alt = data
            const chunks = [
                ['1.1+', 'Legacy', 'forestfollies'],
                ['1.1+', 'NMG', 'hildaberg'],
                ['1.1+', 'NMG', 'grimmatchstick'],
                ['DLC', 'DLC C/S', 'estherwinchester'],
                ['NMG', 'DLC+Base', 'hildaberg'],
                ['NMG', 'DLC+Base', 'cagneycarnation'],
                ['NMG', 'DLC+Base', 'baronessvonbonbon'],
                ['DLC+Base', 'DLC+Base C/S', 'hildaberg'],
                ['DLC+Base', 'DLC+Base C/S', 'wallywarbles'],
                ['DLC+Base', 'DLC+Base C/S', 'djimmithegreat'],
                ['DLC+Base', 'DLC+Base C/S', 'drkahlsrobot'],
                ['DLC+Base', 'DLC+Base C/S', 'calamaria'],
                ['DLC', 'DLC C/S', 'forestfollies'],
                ['DLC', 'DLC+Base', 'forestfollies'],
                ['DLC', 'DLC+Base C/S', 'forestfollies']
            ]
            for (const [copy, paste, boss] of chunks) {
                alt[paste][boss] = alt[copy][boss]
            }
            copyDLC('DLC', 'DLC+Base')
            copyDLC('DLC C/S', 'DLC+Base C/S')
            function copyDLC(copy, paste) {
                const dlc = ['glumstonethegiant', 'mortimerfreeze', 'thehowlingaces', 'estherwinchester', 'moonshinemob', 'chefsaltbaker']
                dlc.forEach(boss => {
                    alt[paste][boss] = alt[copy][boss]
                })
            }
        })
    commBestILsCategory = commBestILs['1.1+']
    window.firebaseUtils.firestoreRead()
})
function action() {
    loaded = true
    const tabActions = {
        home: generateHome,
        sav: generate_sav,
        lss: generate_lss,
        sums: generateSums,
        residual: generateResidual,
        grid: generateGrid,
        ballpit: generateBallpit,
        commBestILs: generateCommBestILs,
        altStrats: generateAltStrats,
        commBestSplits: generateCommBestSplits
    }
    tabActions[globalTab]?.()
    if (localStorage.getItem('username') && !runRecapExample) {
        document.getElementById('runRecap_player').innerHTML = runRecapPlayer()
    }
    if (runRecap_savFile) {
        document.getElementById('savButton').classList.add('pulseSize')
        document.getElementById('savButton').classList.remove('grayedOut')
    } else {
        document.getElementById('savButton').classList.remove('pulseSize')
        document.getElementById('savButton').classList.add('grayedOut')
    }
    if (runRecap_lssFile.pbSplits) {
        document.getElementById('lssButton').classList.add('pulseSize')
        document.getElementById('lssButton').classList.remove('grayedOut')
    } else {
        document.getElementById('lssButton').classList.remove('pulseSize')
        document.getElementById('lssButton').classList.add('grayedOut')
    }
    ['commBestILs', 'altStrats', 'commBestSplits'].forEach(page => {
        document.getElementById(page + 'Button').classList.remove('activeBanner')
        document.getElementById(globalTab + 'Button').classList.add('activeBanner')
    })
    if (globalTab == 'sav') {
        show('runRecap_content')
    } else {
        hide('runRecap_content')
    }
    if (['sav', 'sums', 'grid'].includes(globalTab) || (globalTab == 'lss' && runRecap_savFile)) {
        show('runRecap_sav_section')
    } else {
        hide('runRecap_sav_section')
    }
    if (globalTab == 'lss') {
        if (runRecapExample) {
            hide('runRecap_lss_comparison')
        } else {
            show('runRecap_lss_comparison')
        }
    } else {
        hide('runRecap_lss_comparison')
    }
    if (globalTab == 'lss' && runRecap_savFile && !runRecapExample) {
        show('sav_divider')
    } else {
        hide('sav_divider')
    }
    if (runRecapExample) {
        show('runRecap_example_div')
        hide('runRecap_upload_div')
    } else {
        hide('runRecap_example_div')
        if (runRecap_savFile) {
            if (getCupheadLevel(categories.length - 1).completed) {
                show('runRecap_upload_div')
            } else {
                hide('runRecap_upload_div')
            }
        }
    }
    if (runRecap_savFile) {
        if (getCupheadLevel(categories.length - 1).completed) {
            show('completedRun')
        }
    } else {
        hide('completedRun')
    }
    if (globalTab == 'lss' && runRecapTheoretical) {
        show('runRecap_theoretical_div')
    } else {
        hide('runRecap_theoretical_div')
    }
    if (!['home', 'commBestILs', 'commBestSplits', 'ballpit'].includes(globalTab)) {
        show('runRecap_bar')
    } else {
        hide('runRecap_bar')
    }
    if (runRecap_savFile && ['sav', 'sums', 'grid'].includes(globalTab)) {
        runRecap_chart()
    } else {
        hide('runRecap_chart')
    }
    if (['home'].includes(globalTab)) {
        hide('pageTitle')
    } else if (['sav', 'lss'].includes(globalTab)) {
        show('pageTitle')
        let HTMLContent = `<div class='font2 container' style='gap:12px;font-size:200%;padding:15px 0'>
        <img src='images/${globalTab}.png' style='height:40px;filter: brightness(0) invert(1)'>
        .${globalTab}
        </div>`
        document.getElementById('pageTitle').innerHTML = HTMLContent
    } else {
        show('pageTitle')
        if (fontAwesomeSet[globalTab]) {
            setPageTitle(fontAwesomeSet[globalTab][1], fontAwesomeSet[globalTab][0])
            if (globalTab == 'commBestSplits') {
                const pageTitle = document.getElementById('pageTitle')
                let HTMLContent = ''
                HTMLContent += `
                <div class='container' style='position:absolute;top:22px;right:100px;gap:8px'>
                <div>by</div>
                <img src='https://www.speedrun.com/static/user/8l0yyz28/image?v=6e8c7d2' style='height:32px;border-radius:50%'>
                <div>${getPlayerName(players.find(player => player.name == 'MarkinSws') || 'MarkinSws')}</div>
                </div>`
                pageTitle.innerHTML += HTMLContent
            }
        }
    }
    if (['commBestILs', 'altStrats'].includes(globalTab)) {
        show('commBestSubmit')
    } else {
        hide('commBestSubmit')
    }
    if (globalTab == 'home') {
        show('runRecapTab')
        hide('content')
    } else {
        hide('runRecapTab')
        show('content')
    }
    if (!['commBestILs', 'altStrats', 'commBestSplits', 'ballpit'].includes(globalTab)) {
        show('runRecap_details')
    } else {
        hide('runRecap_details')
    }
}
document.querySelectorAll('select').forEach(elem => {
    elem.addEventListener('change', () => {
        playSound('cardflip')
        action()
    })
})
function getCommBestILs(categoryName = commBestILsCategory.tabName) {
    commBestILsCategory = commBestILs[categoryName]
    let buttonName = commBestILsCategory.className
    if (['dlc', 'dlcbase'].includes(buttonName) && commBestILsCategory.shot1) {
        buttonName = commBestILsCategory.className + (commBestILsCategory.shot1?.charAt(0) || '') + (commBestILsCategory.shot2?.charAt(0) || '')
    }
    buttonClick(buttonName + 'Button', 'categoryTabs', 'selected')
    players = []
    playerNames = new Set()
    changeComparison('Top 3 Average', true)
    altStratIndex = -1
    const category = commBestILsCategory.category
    updateBoardTitle()
    // if (runRecapExample) showTab('home')
    if (category > -1) {
        letsGo()
    } else {
        let variables = `var-${category.var}=${category.subcat}`
        if (category.var2) variables += `&var-${category.var2}=${category.subcat2}`
        getLeaderboard(category, `category/${category.id}`, variables, true)
    }
}
function letsGo() {
    globalCategory.players = globalCache[commBestILsCategory.category].players
    globalCategory.runs = globalCache[commBestILsCategory.category].runs
    globalCategory.className = commBestILsCategory.className
    globalCategory.players.forEach(player => {
        const initialSize = playerNames.size
        playerNames.add(player.name)
        if (playerNames.size > initialSize) {
            const playerCopy = { ...player }
            playerCopy.runs = []
            players.push(playerCopy)
            return true
        }
    })
    loadMyekul()
}
function done() {
    loadSheets()
    categories.forEach((category, categoryIndex) => {
        assignRuns(category, categoryIndex)
    })
    assignRuns(globalCategory)
    if (commBestILsCategory.extraRuns || commBestILsCategory.extraPlayers) {
        const morePlayers = []
        commBestILsCategory.extraRuns?.forEach(run => {
            morePlayers.push(run.playerName)
        })
        players = players.filter(player => commBestILsCategory.extraPlayers?.includes(player.name) || morePlayers.includes(player.name) || player.runs.some(run => run != 0))
        const worldRecord = globalCategory.runs[0].score
        commBestILsCategory.extraRuns?.forEach(run => {
            const player = players.find(player => player.name == run.playerName)
            run.score = run.score > 0 ? run.score : convertToSeconds(run.score)
            run.percentage = (worldRecord / run.score) * 100
            player.extra = run
        })
        const newPlayers = []
        const badPlayers = []
        players.forEach(player => {
            if (player.extra) {
                newPlayers.push(player)
            } else {
                badPlayers.push(player)
            }
        })
        players = newPlayers
        badPlayers.forEach(badPlayer => {
            players.push(badPlayer)
        })
        players.sort((a, b) => a.extra?.score - b.extra?.score)
        players.forEach((player, playerIndex) => {
            if (player.extra) {
                player.extra.place = playerIndex + 1
            }
        })
    }
    document.getElementById('runRecap_examples').innerHTML = runRecapExamples()
    let HTMLContent = ''
    for (let i = 0; i < commBestILsCategory.topRuns.length; i++) {
        HTMLContent += `<option value="player_${i}">${i + 1}. ${secondsToHMS(globalCategory.runs[i].score)} - ${fullgamePlayer(i)}</option>`
    }
    // document.getElementById('runRecap_optgroup').innerHTML = HTMLContent
    const username = localStorage.getItem('username').trim()
    if (username) {
        localStorage.setItem('username', username)
        document.getElementById('input_username').value = username
        document.getElementById('username').innerHTML = runRecapPlayer()
    }
    show('username')
}
function fullgamePlayer(playerIndex) {
    return commBestILsCategory.players ? commBestILsCategory.players[playerIndex] : players[playerIndex].name
}
function assignRuns(category, categoryIndex) {
    category.runs.forEach(run => {
        const runPlayer = run.player
        let thePlayer = ''
        for (const player of players) {
            if (player.id && runPlayer.id) {
                if (player.id == runPlayer.id) {
                    thePlayer = player;
                    break;
                }
            } else if (player.name == runPlayer.name && player.rel == runPlayer.rel) {
                thePlayer = player;
                break;
            } else if (player.name == runPlayer.name) {
                thePlayer = player;
                break;
            }
        }
        if (categoryIndex != null) {
            thePlayer.runs ? thePlayer.runs[categoryIndex] = run : ''
        } else {
            if (!(commBestILsCategory.extraRuns && !commBestILsCategory.extraPlayers?.includes(thePlayer.name))) {
                thePlayer.extra = run
            }
        }
        const runTime = run.score
        run.percentage = getScore(category, runTime)
        if (thePlayer.bestScore) {
            if (run.percentage > thePlayer.bestScore) {
                thePlayer.bestScore = run.percentage
            }
        } else {
            thePlayer.bestScore = run.percentage
        }
        run.playerName = thePlayer ? thePlayer.name : null
    })
}
const reloadTimeout = setTimeout(() => {
    if (!loaded) {
        location.reload();
    }
}, 3000)
document.querySelectorAll('.lobber').forEach(button => {
    button.innerHTML = cupheadShot('lobber', 21)
})
document.querySelectorAll('.charge').forEach(button => {
    button.innerHTML = cupheadShot('charge', 21)
})
// const allButtons = document.querySelector('#categoryTabs').querySelectorAll('.button')
// allButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         allButtons.forEach(button2 => {
//             button2.classList.remove('selected')
//         })
//         button.classList.add('selected')
//     });
// })