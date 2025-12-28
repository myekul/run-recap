google.charts.load('current', { packages: ['corechart'] });
setFooter('2025')
setTabs(['home', null, [fancyTab('sav'), fancyTab('lss'), fancyTab('rrc')], null, 'sums', 'residual', 'grid', null, 'ballpit'])
initializeHash('home')
setAudio('cuphead')
runRecapDefault()
setDropbox()
document.addEventListener('DOMContentLoaded', function () {
    fetch('resources/categoryData.json')
        .then(response => response.json())
        .then(data => {
            commBestILs = data
            fetch('resources/topData.json')
                .then(response => response.json())
                .then(data => {
                    for (const category in data) {
                        commBestILs[category].topRuns = data[category]
                    }
                    fetch('resources/rrcData.json')
                        .then(response => response.json())
                        .then(data => {
                            for (const category in data) {
                                rrcTopBests = new Array(rrc80.length).fill([])
                                data[category].forEach((rrc, index) => {
                                    commBestILs[category].topRuns[index].rrc = []
                                    if (rrc.scenes) {
                                        rrc.endTimes = []
                                        rrc.scenes.forEach(scene => {
                                            rrc.endTimes.push(scene.endTime)
                                        })
                                        runRecapCategory.topRuns[index].rrc = rrc.scenes
                                    } else {
                                        reconstructRRC(rrc.endTimes, index)
                                    }
                                    rrcSegments(runRecapCategory.topRuns[index].rrc)
                                    rrcComparisonCollection['Player ' + index] = commBestILs[category].topRuns[index].rrc
                                    commBestILs[category].topRuns[index].rrc.forEach((scene, sceneIndex) => {
                                        if (scene.segment < rrcComparisonCollection['Top Bests'][sceneIndex].segment) {
                                            rrcComparisonCollection['Top Bests'][sceneIndex] = { name: scene.name, segment: scene.segment }
                                            rrcTopBests[sceneIndex] = [index]
                                        } else if (scene.segment == rrcComparisonCollection['Top Bests'][sceneIndex].segment) {
                                            rrcTopBests[sceneIndex].push(index)
                                        }
                                    })
                                })
                            }
                        })
                })
            fetch('resources/alt.json')
                .then(response => response.json())
                .then(data => {
                    alt = data
                    organizeAltStrats()
                })
            runRecapCategory = commBestILs['1.1+']
            window.firebaseUtils.firestoreRead()
        })
})
function organizeAltStrats() {
    for (const category in alt) {
        for (const boss in alt[category]) {
            for (const obj of alt[category][boss]) {
                if (!obj.title) {
                    altStratNum++
                }
            }
        }
    }
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
}
function action() {
    loaded = true
    const tabActions = {
        home: generateHome,

        sav: generate_sav,
        lss: generate_lss,
        rrc: generate_rrc,

        sums: generateSums,
        residual: generateResidual,
        grid: generateGrid,

        ballpit: generateBallpit,

        commBestILs: generateCommBestILs,
        altStrats: generateAltStrats,
        commBestSplits: generateCommBestSplits,
        top10: generateTop10
    }
    tabActions[globalTab]?.()
    if (localStorage.getItem('username') && !runRecapExample) {
        document.getElementById('runRecap_player').innerHTML = playerDisplay()
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
    if (runRecap_rrcFile.attempts) {
        document.getElementById('rrcButton').classList.add('pulseSize')
        document.getElementById('rrcButton').classList.remove('grayedOut')
    } else {
        document.getElementById('rrcButton').classList.remove('pulseSize')
        document.getElementById('rrcButton').classList.add('grayedOut')
    }
    ['commBestILs', 'altStrats', 'commBestSplits', 'top10'].forEach(page => {
        document.getElementById(page + 'Button').classList.remove('activeBanner')
        document.getElementById(globalTab + 'Button').classList.add('activeBanner')
    })
    if (globalTab == 'sav') {
        show('runRecap_content')
    } else {
        hide('runRecap_content')
    }
    if (['sav', 'sums', 'grid'].includes(globalTab) || (globalTab == 'lss' && runRecap_savFile || globalTab == 'rrc')) {
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
    } else if (['sav', 'lss', 'rrc'].includes(globalTab)) {
        show('pageTitle')
        let HTMLContent = `<div class='font2 container' style='gap:8px;font-size:200%;padding:15px 0'>
        <img src='https://myekul.com/shared-assets/cuphead/images/extra/${globalTab}.png' style='height:40px;filter: brightness(0) invert(1)'>
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
    if (!['home', 'commBestILs', 'altStrats', 'commBestSplits', 'top10', 'ballpit'].includes(globalTab)) {
        show('runRecap_details')
    } else {
        hide('runRecap_details')
    }
    if (globalTab == 'rrc' && !runRecapExample) {
        show('rrcBrowser')
        hide('runRecap_time')
    } else {
        hide('rrcBrowser')
        show('runRecap_time')
    }
}
document.querySelectorAll('select').forEach(elem => {
    elem.addEventListener('change', () => {
        playSound('cardflip')
        action()
    })
})
function getCommBestILs(categoryName = runRecapCategory.tabName) {
    runRecapCategory = commBestILs[categoryName]
    let buttonName = runRecapCategory.className
    if (['dlc', 'dlcbase'].includes(buttonName) && runRecapCategory.shot1) {
        buttonName = runRecapCategory.className + (runRecapCategory.shot1?.charAt(0) || '') + (runRecapCategory.shot2?.charAt(0) || '')
    }
    buttonClick(buttonName + 'Button', 'categoryTabs', 'selected')
    players = []
    playerNames = new Set()
    savComparison = 'Top 3 Average'
    altStratLevel = null
    const category = runRecapCategory.category
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
    runRecapCategory.players = globalCache[runRecapCategory.category].players
    runRecapCategory.runs = globalCache[runRecapCategory.category].runs
    runRecapCategory.players.forEach(player => {
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
    assignRuns(runRecapCategory)
    if (runRecapCategory.extraRuns || runRecapCategory.extraPlayers) {
        const morePlayers = []
        runRecapCategory.extraRuns?.forEach(run => {
            morePlayers.push(run.playerName)
        })
        players = players.filter(player => runRecapCategory.extraPlayers?.includes(player.name) || morePlayers.includes(player.name) || player.runs.some(run => run != 0))
        const worldRecord = runRecapCategory.runs[0].score
        runRecapCategory.extraRuns?.forEach(run => {
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
    for (let i = 0; i < runRecapCategory.topRuns.length; i++) {
        HTMLContent += `<option value="Player ${i}">${i + 1}. ${secondsToHMS(runRecapCategory.runs[i].score)} - ${fullgamePlayer(i)}</option>`
    }
    // document.getElementById('runRecap_optgroup').innerHTML = HTMLContent
    const usernameAttempt = localStorage.getItem('username')
    const username = usernameAttempt ? localStorage.getItem('username').trim() : ''
    if (username) {
        localStorage.setItem('username', username)
        document.getElementById('input_username').value = username
        document.getElementById('username').innerHTML = playerDisplay()
    }
    show('username')
}
function fullgamePlayer(playerIndex) {
    return runRecapCategory.players ? runRecapCategory.players[playerIndex] : players[playerIndex].name
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
            if (!(runRecapCategory.extraRuns && !runRecapCategory.extraPlayers?.includes(thePlayer.name))) {
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
const fileInfo = {
    sav: `The easiest way to get started.
    When a Cuphead save file is created, all data is stored in a ${myekulColor('Cuphead .sav')}.
    Locate and upload this file to view your boss times!
    <br>
    <span class='dim'>
    You can either upload an existing .sav file from
    <span class="myekulColor clickable" style="text-decoration:underline" onclick="openModal(savInfo(),'INFO')">
    %appdata%</span>
    to automatically retrieve IL times,
    or create an empty file and insert IL times manually.
    </span>`,
    lss: `Upload your ${myekulColor('LiveSplit .lss')} splits file to view your attempt history,
    browse your top segments,
    compare against community best splits,
    and more.
    <br>
    <span class='dim'>
    To ensure file compatibility,
    please upload a .lss with the standard split configuration,
    as seen
    <span class="myekulColor clickable" style="text-decoration: underline">
    ${getAnchor('https://docs.google.com/spreadsheets/d/1JgTjjonfC7bh4976NI4pCPeFp8LbA3HMKdvS_47-WtQ')}here</a></span>.`,
    rrc: `A powerful new file type, ${myekulColor('Run Recap .rrc')}. Designed exclusively for detailed analysis of Cuphead runs.
    <br>
    <span class='dim'>
    This requires the
    <span class="myekulColor clickable" style="text-decoration: underline">
    ${getAnchor('https://github.com/SBDWolf/Run-Recap-Component')}Run Recap Component</a></span>
    memory reader developed by SBDWolf.
    </span>
    `
}
const fileOrigin = {
    sav: 'Cuphead',
    lss: 'LiveSplit',
    rrc: 'Run Recap'
};
let HTMLContent = '';
['sav', 'lss', 'rrc'].forEach(type => {
    HTMLContent += fileInfoCard(type)
})
document.getElementById('fileTypes').innerHTML = HTMLContent
function fileInfoCard(type) {
    return `<div style='width:330px'>
                <div class="container dim" style="font-size:80%">${fileOrigin[type]}</div>
                <div class='font2 container' style='gap:8px;font-size:200%;margin-bottom:5px'>
                    <img src='https://myekul.com/shared-assets/cuphead/images/extra/${type}.png'
                        style='height:40px;filter: brightness(0) invert(1)'>
                    .${type}
                </div>
                <div class='fileType textBlock' style="font-size:90%">
                ${fileInfo[type]}
                </div>
            </div>`
}