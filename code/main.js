google.charts.load('current', { packages: ['corechart'] });
setFooter('2025')
setTabs(['info', 'home', 'leaderboards', null, [fancyTab('sav'), fancyTab('lss'), fancyTab('rrc')], null, 'ballpit'])
const today = new Date()
initializeHash('home')
let aprilFools = today.getMonth() == 3 && today.getDate() == 1
setAudio('cuphead')
runRecapDefault()
grades.unshift({ grade: 'S', className: 'grade-s grade', threshold: 100 })
document.getElementById('categorySelect').innerHTML = categorySelect()
document.addEventListener('DOMContentLoaded', function () {
    fetch('resources/categoryData.json')
        .then(response => response.json())
        .then(data => {
            allCategories = data
            prepareLocalData()
            runRecapCategory = allCategories['1.1+']
            window.firebaseUtils.firestoreRead()
        })
})
function action() {
    if (!loaded) {
        if (aprilFools) aprilFoolsPopup()
        loaded = true
        document.getElementById('boardTitleSrc').innerHTML = `<div>${getAnchor('https://www.speedrun.com/cuphead') + `<div class='grow'>${sharedAssetsImg('src')}</div>`}</div>`
    }
    const tabActions = {
        home: generateHome,
        leaderboards: generateLeaderboards,

        sav: generate_sav,
        lss: generate_lss,
        rrc: generate_rrc,

        ballpit: generateBallpit,

        altStrats: generateAltStrats,
        runViableILs: generateRunViableILs,
        vanillaILs: generateVanillaILs,
        commBestSplits: generateCommBestSplits,
        theTop: generateTheTop,

        info: generateInfo
    }
    tabActions[globalTab]?.()
    if (localStorage.getItem('username') && !runRecapExample) {
        document.getElementById('runRecap_player').innerHTML = playerDisplay()
    }
    const typeCriteria = [
        { type: 'sav', criteria: runRecap_savFile?.levelDataManager?.levelObjects?.length > 0 },
        { type: 'lss', criteria: runRecap_lssFile.pbSplits?.length > 0 },
        { type: 'rrc', criteria: runRecap_rrcFile.attempts?.length > 0 }
    ]
    typeCriteria.forEach(({ type, criteria }) => {
        const button = document.getElementById(type + 'Button')
        button.classList.toggle('pulseSize', criteria)
        button.style.backgroundColor = criteria ? 'var(--cuphead)' : ''
    });
    ['altStrats', 'runViableILs', 'vanillaILs', 'commBestSplits', 'theTop'].forEach(page => {
        document.getElementById(page + 'Button').classList.toggle('activeBanner', globalTab == page)
    })
    if (runRecapExample) {
        show('runRecap_example_div')
        hide('upload_div')
    } else {
        hide('runRecap_example_div')
        if (runRecap_savFile) {
            if (getCupheadLevel(categoryLevels.length - 1).completed) {
                show('upload_div')
            } else {
                hide('upload_div')
            }
        }
        if (globalTab == 'rrc') {
            if (rrcCurrentAttempt.scenes?.length == runRecapCategory.scenes?.length && lastBossDone()) {
                show('upload_div')
            } else {
                hide('upload_div')
            }
        }
    }
    if (globalTab == 'info') {
        hide('boardTitleDiv')
    } else {
        show('boardTitleDiv')
    }
    if (!['sav', 'rrc'].includes(globalTab)) hide('upload_div')
    if (globalTab == 'lss' && runRecapTheoretical) {
        show('runRecap_theoretical_div')
    } else {
        hide('runRecap_theoretical_div')
    }
    if (globalTab == 'lss' && runRecap_lssFile.pbSplits) {
        show('runRecap_lss')
    } else {
        hide('runRecap_lss')
    }
    if (runRecap_savFile && ['sav'].includes(globalTab)) {
        runRecap_chart()
    } else {
        hide('runRecap_chart')
    }
    if (['home'].includes(globalTab)) {
        hide('pageTitle')
    } else if (['sav', 'lss', 'rrc'].includes(globalTab)) {
        show('pageTitle')
        document.getElementById('pageTitle').innerHTML = `<div style='padding:15px 0'>${fileTitle(globalTab)}</div>`
    } else if (globalTab == 'vanillaILs') {
        show('pageTitle')
        document.getElementById('pageTitle').innerHTML = `<div style='padding:15px 0'>${otherTitle('Vanilla ILs')}</div>`
    } else {
        show('pageTitle')
        if (fontAwesomeSet[globalTab]) {
            setPageTitle(fontAwesomeSet[globalTab][1], fontAwesomeSet[globalTab][0])
        }
    }
    if (['altStrats', 'runViableILs', 'vanillaILs'].includes(globalTab)) {
        show('commBestSubmit')
    } else {
        hide('commBestSubmit')
    }
    if (['sav', 'lss', 'rrc', 'theTop'].includes(globalTab)) {
        show('runRecap_details')
    } else {
        hide('runRecap_details')
    }
    if (globalTab == 'rrc' && !runRecapExample) {
        if (runRecap_rrcFile.attempts) show('rrcBrowser')
        hide('runRecap_time')
    } else {
        hide('rrcBrowser')
        show('runRecap_time')
    }
    if (['sav', 'lss', 'rrc'].includes(globalTab)) {
        show('backButton')
    } else {
        hide('backButton')
    }
    if ((['sav', 'lss', 'rrc'].includes(globalTab) && runRecapExample) || (globalTab == 'altStrats' && altStratCategory[altStratLevel])) {
        show('primaryThumbnail')
        hide('musicDiv')
    } else {
        hide('primaryThumbnail')
        show('musicDiv')
    }
    if (['sav', 'lss', 'rrc'].includes(globalTab) && (savComparison.split(' ')[0] == 'Player' || rrcComparison.split(' ')[0] == 'Player')) {
        show('comparisonThumbnail')
        if (savComparison.split(' ')[0] == 'Player') {
            document.getElementById('comparisonThumbnail').innerHTML = getThumbnail(runRecapCategory.runs[savComparison.split(' ')[1]].url)
        }
        if (rrcComparison.split(' ')[0] == 'Player') {
            document.getElementById('comparisonThumbnail').innerHTML = getThumbnail(runRecapCategory.runs[rrcComparison.split(' ')[1]].url)
        }
    } else {
        hide('comparisonThumbnail')
    }
    document.getElementById('boardTitle').classList.toggle('grayedOut', globalTab == 'altStrats' && altStratsAll)
    if (globalTab == 'altStrats') {
        document.querySelectorAll('.altStratNum').forEach(elem => { show(elem) })
        show('altStratsAll')
    } else {
        document.querySelectorAll('.altStratNum').forEach(elem => { hide(elem) })
        hide('altStratsAll')
    }
    const grayButtons = ['leaderboards', 'runViableILs', 'vanillaILs', 'commBestSplits', 'theTop', 'sav', 'lss', 'rrc', 'ballpit']
    grayButtons.forEach(page => {
        document.getElementById(page + 'Button').classList.toggle('grayedOut', runRecapCategory.name == 'Other')
    })
}
document.querySelectorAll('select').forEach(elem => {
    elem.addEventListener('change', () => {
        playSound('cardflip')
        action()
    })
})
function changeCategory(categoryName = runRecapCategory.tabName, forceHome) {
    if (forceHome && runRecapExample && ['sav', 'lss', 'rrc'].includes(globalTab)) showTab('home')
    if (runRecapExample) unloadExample()
    runRecapCategory = allCategories[categoryName]
    categoryButtonClick(runRecapCategory)
    players = []
    playerNames = new Set()
    savComparison = 'Top 3 Average'
    savComparisonText = 'Top 3 Average'
    rrcComparison = 'Top Bests'
    rrcComparisonText = 'Top Bests'
    srcLoaded = false
    altStratLevel = null
    if (commBest[runRecapCategory.tabName]) {
        if (!commBest[runRecapCategory.tabName]['after'] && !splitBefore) splitBefore = true
    }
    if (categoryName != 'Other') rrcComparisonCollectionPrepare()
    const category = runRecapCategory.category
    updateBoardTitle()
    const musicID = ['DLC', 'DLC+Base'].includes(runRecapCategory.name) ? 'L6T3fpUGSmE' : 'cdvSNkW3Uyk'
    document.getElementById('musicDiv').href = `https://youtu.be/${musicID}`
    organizeCategoryLevels()
    if (category > -1) prepareData()
    let HTMLContent = ''
    runRecapCategory.topRuns?.forEach((run, index) => {
        HTMLContent += `<option value="top${index}">${secondsToHMS(run.rrc.at(-1).endTime)} - ${players[index].name}</option>`
    })
    document.getElementById('lss_topRuns').innerHTML = HTMLContent
    action()
}
function categoryButtonClick(category, database) {
    let buttonID
    let buttonSection = 'categorySelect'
    if (database) buttonSection += 'Database'
    if (category) {
        buttonID = category.className
        if (['dlc', 'dlcbase'].includes(buttonID) && category.shot1) {
            buttonID = category.className + (category.shot1?.charAt(0) || '') + (category.shot2?.charAt(0) || '')
            if (category.tabName == 'DLC+Base L/S DLC First') {
                buttonID = 'dlcbaseFirst'
            }
        }
    }
    document.getElementById('allButtonDatabase')?.classList.toggle('grayedOut', !category)
    buttonID += 'Button'
    if (database) buttonID += 'Database'
    buttonClick(buttonID, buttonSection, 'selected')
    if (['dlc', 'dlcbase'].includes(category?.className)) {
        buttonID = category.className + 'Button'
        if (database) buttonID += 'Database'
        document.getElementById(buttonID).classList.add('selected')
    }
}
function prepareData() {
    runRecapCategory.players = globalCache[runRecapCategory.category].players
    runRecapCategory.runs = globalCache[runRecapCategory.category].runs
    if (runRecapCategory.extraRuns || runRecapCategory.extraPlayers) {
        runRecapCategory.runs = runRecapCategory.runs.filter(run => runRecapCategory.extraPlayers.includes(run.playerName))
        runRecapCategory.players = runRecapCategory.players.filter(player => runRecapCategory.extraPlayers.includes(player.name))
    }
    runRecapCategory.extraRuns?.forEach(run => {
        const player = allPlayers.find(player => player.name == run.playerName)
        const newRun = { score: convertToSeconds(run.score), playerName: run.playerName, player: { player }, date: run.date, url: run.url }
        runRecapCategory.runs.push(newRun)
        runRecapCategory.players.push({ ...player, extra: newRun })
    })
    runRecapCategory.players.forEach(player => {
        const initialSize = playerNames.size
        playerNames.add(player.name)
        if (playerNames.size > initialSize) {
            const playerCopy = { ...player }
            playerCopy.ILs = []
            players.push(playerCopy)
            return true
        }
    })
    loadRunViableILs()
    runRecap_lss_splitInfo()
    done()
}

function done() {
    categoryLevels.forEach((level, levelIndex) => {
        assignRuns(level, levelIndex)
    })
    assignRuns(runRecapCategory)
    if (runRecapCategory.extraRuns || runRecapCategory.extraPlayers) {
        const yesRun = []
        const noRun = []
        players.forEach(player => {
            if (player.extra) {
                yesRun.push(player)
            } else {
                noRun.push(player)
            }
        })
        players = [...yesRun, ...noRun]
        runRecapCategory.runs.sort((a, b) => a.score - b.score)
        runRecapCategory.players.sort((a, b) => a.extra?.score - b.extra?.score)
        players.sort((a, b) => a.extra?.score - b.extra?.score)
        players.forEach((player, playerIndex) => {
            if (player.extra) {
                player.extra.place = playerIndex + 1
            }
        })
    }
    let HTMLContent = ''
    for (let i = 0; i < runRecapCategory.topRuns.length; i++) {
        HTMLContent += `<option value="Player ${i}">${i + 1}. ${secondsToHMS(runRecapCategory.runs[i].score)} - ${fullgamePlayer(i)}</option>`
    }
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
function assignRuns(level, levelIndex) {
    level.runs.forEach(run => {
        const runPlayer = run.player
        let thePlayer = ''
        for (const player of players) {
            if (player.id && runPlayer?.id) {
                if (player.id == runPlayer?.id) {
                    thePlayer = player;
                    break;
                }
            } else if (player.name == runPlayer?.name && player.rel == runPlayer?.rel) {
                thePlayer = player;
                break;
            } else if (player.name == runPlayer?.name) {
                thePlayer = player;
                break;
            }
        }
        if (levelIndex != null) {
            thePlayer.ILs ? thePlayer.ILs[levelIndex] = run : ''
        } else {
            if (!(runRecapCategory.extraRuns && !runRecapCategory.extraPlayers?.includes(thePlayer.name))) {
                thePlayer.extra = run
            }
        }
        run.percentage = getScore(level, run.score)
        run.playerName = thePlayer ? thePlayer.name : null
    })
}
const reloadTimeout = setTimeout(() => {
    if (!loaded) {
        location.reload();
    }
}, 3000)
function buttonShots() {
    document.querySelectorAll('.lobber').forEach(button => {
        button.innerHTML = cupheadShot('lobber', 21)
    })
    document.querySelectorAll('.charge').forEach(button => {
        button.innerHTML = cupheadShot('charge', 21)
    })
    document.querySelectorAll('.sai').forEach(button => {
        button.innerHTML = cupheadItem('superarti', 21, true, 'super')
    })
}
buttonShots()
function otherTitle(text) {
    return `
    <div class='font2 container' style='gap:10px;font-size:200%'>
        <svg style='width:32px;height:32px;filter: brightness(0) invert(1)'>
            <use href='#vanilla-icon'></use>
        </svg>
        ${text}
    </div>`
}
fetch('https://api.github.com/repos/SBDWolf/Run-Recap-Component/tags')
    .then(response => response.json())
    .then(data => {
        rrcComponentVersion = data[0].name
    })