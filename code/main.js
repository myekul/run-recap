google.charts.load('current', { packages: ['corechart'] });
setFooter('2025')
setTabs(['home', null, [fancyTab('sav'), fancyTab('lss'), fancyTab('rrc')], null, 'ballpit'])
initializeHash('home')
setAudio('cuphead')
runRecapDefault()
grades.unshift({ grade: 'S', className: 'grade-s grade', threshold: 100 })
document.getElementById('categorySelect').innerHTML = categorySelect()
document.addEventListener('DOMContentLoaded', function () {
    fetch('resources/categoryData.json')
        .then(response => response.json())
        .then(data => {
            commBestILs = data
            prepareLocalData()
            runRecapCategory = commBestILs['1.1+']
            window.firebaseUtils.firestoreRead()
        })
})
function action() {
    loaded = true
    const tabActions = {
        home: generateHome,

        sav: generate_sav,
        lss: generate_lss,
        rrc: generate_rrc,

        residual: generateResidual,

        ballpit: generateBallpit,

        commBestILs: generateCommBestILs,
        altStrats: generateAltStrats,
        commBestSplits: generateCommBestSplits,
        theTop: generateTheTop
    }
    tabActions[globalTab]?.()
    if (localStorage.getItem('username') && !runRecapExample) {
        document.getElementById('runRecap_player').innerHTML = playerDisplay()
    }
    const typeCriteria = [
        { type: 'sav', criteria: runRecap_savFile },
        { type: 'lss', criteria: runRecap_lssFile.pbSplits },
        { type: 'rrc', criteria: runRecap_rrcFile.attempts }
    ]
    typeCriteria.forEach(({ type, criteria }) => {
        if (criteria) {
            document.getElementById(type + 'Button').classList.add('pulseSize')
            document.getElementById(type + 'Button').style.backgroundColor = 'var(--cuphead)'
        } else {
            document.getElementById(type + 'Button').classList.remove('pulseSize')
            document.getElementById(type + 'Button').style.backgroundColor = ''
        }
    });
    ['commBestILs', 'altStrats', 'commBestSplits', 'theTop'].forEach(page => {
        document.getElementById(page + 'Button').classList.remove('activeBanner')
        document.getElementById(globalTab + 'Button').classList.add('activeBanner')
    })
    if (globalTab == 'lss') {
        if (runRecapExample) {
            hide('runRecap_lss_comparison')
        } else {
            show('runRecap_lss_comparison')
        }
    } else {
        hide('runRecap_lss_comparison')
    }
    if (runRecapExample) {
        show('runRecap_example_div')
        hide('upload_div')
    } else {
        hide('runRecap_example_div')
        if (runRecap_savFile) {
            if (getCupheadLevel(categories.length - 1).completed) {
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
    if (!['sav', 'rrc'].includes(globalTab)) hide('upload_div')
    if (globalTab == 'lss' && runRecapTheoretical) {
        show('runRecap_theoretical_div')
    } else {
        hide('runRecap_theoretical_div')
    }
    if (!['home', 'altStrats', 'commBestILs', 'commBestSplits', 'ballpit'].includes(globalTab)) {
        show('runRecap_bar')
    } else {
        hide('runRecap_bar')
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
    } else {
        show('pageTitle')
        if (fontAwesomeSet[globalTab]) {
            setPageTitle(fontAwesomeSet[globalTab][1], fontAwesomeSet[globalTab][0])
            if (globalTab == 'commBestSplits' && runRecapCategory.markin) {
                tabCredit(getPlayerName(allPlayers.find(player => player.name == 'MarkinSws')), 'by', '8l0yyz28/image?v=6e8c7d2')
            }
        }
    }
    if (['commBestILs', 'altStrats'].includes(globalTab)) {
        show('commBestSubmit')
    } else {
        hide('commBestSubmit')
    }
    if (!['home', 'commBestILs', 'altStrats', 'commBestSplits', 'ballpit'].includes(globalTab)) {
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
    const grayButtons = ['commBestILs', 'commBestSplits', 'theTop', 'sav', 'lss', 'rrc', 'ballpit']
    if (runRecapCategory.name == 'Other') {
        grayButtons.forEach(page => {
            document.getElementById(page + 'Button').classList.add('grayedOut')
        })
    } else {
        grayButtons.forEach(page => {
            document.getElementById(page + 'Button').classList.remove('grayedOut')
        })
    }
}
document.querySelectorAll('select').forEach(elem => {
    elem.addEventListener('change', () => {
        playSound('cardflip')
        action()
    })
})
function changeCategory(categoryName = runRecapCategory.tabName, forceHome) {
    if (forceHome && runRecapExample) showTab('home')
    runRecapCategory = commBestILs[categoryName]
    categoryButtonClick(runRecapCategory)
    players = []
    playerNames = new Set()
    savComparison = 'Top 3 Average'
    savComparisonText = 'Top 3 Average'
    altStratLevel = null
    if (categoryName != 'Other') rrcComparisonCollectionPrepare()
    const category = runRecapCategory.category
    updateBoardTitle()
    const musicID = ['DLC', 'DLC+Base'].includes(runRecapCategory.name) ? 'L6T3fpUGSmE' : 'cdvSNkW3Uyk'
    document.getElementById('musicDiv').href = `https://youtu.be/${musicID}`
    // if (runRecapExample) showTab('home')
    if (category > -1) {
        letsGo()
    } else if (categoryName != 'Other') {
        let variables = `var-${category.var}=${category.subcat}`
        if (category.var2) variables += `&var-${category.var2}=${category.subcat2}`
        getLeaderboard(category, `category/${category.id}`, variables, true)
    } else {
        organizeCategories()
        action()
    }
}
function categoryButtonClick(category, database) {
    let buttonID
    let buttonSection = 'categorySelect'
    if (database) buttonSection += 'Database'
    if (category) {
        buttonID = category.className
        if (['dlc', 'dlcbase'].includes(buttonID) && category.shot1) {
            buttonID = category.className + (category.shot1?.charAt(0) || '') + (category.shot2?.charAt(0) || '')
        }
        document.getElementById('allButtonDatabase')?.classList.remove('grayedOut')
    } else {
        document.getElementById('allButtonDatabase')?.classList.add('grayedOut')
    }
    buttonID += 'Button'
    if (database) buttonID += 'Database'
    buttonClick(buttonID, buttonSection, 'selected')
    if (['dlc', 'dlcbase'].includes(category?.className)) {
        buttonID = category.className + 'Button'
        if (database) buttonID += 'Database'
        document.getElementById(buttonID).classList.add('selected')
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
        players.forEach(player => {
            if (!(runRecapCategory.extraPlayers?.includes(player.name) || morePlayers.includes(player.name))) {
                delete player.extra
            }
        })
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
        players = [...newPlayers, ...badPlayers]
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
function buttonShots() {
    document.querySelectorAll('.lobber').forEach(button => {
        button.innerHTML = cupheadShot('lobber', 21)
    })
    document.querySelectorAll('.charge').forEach(button => {
        button.innerHTML = cupheadShot('charge', 21)
    })
}
buttonShots()
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
function fileTitle(type) {
    return `<div class='font2 container' style='gap:5px;font-size:200%'>
                    <img src='https://myekul.com/shared-assets/cuphead/images/extra/${type}.png'
                        style='height:40px;filter: brightness(0) invert(1)'>
                    .${type}
                </div>`
}
function fileInfoCard(type) {
    return `<div style='width:330px'>
                <div class="container dim" style="font-size:80%">${fileOrigin[type]}</div>
                ${fileTitle(type)}
                <div class='fileType textBlock' style="margin-top:10px;font-size:90%">
                ${fileInfo[type]}
                </div>
            </div>`
}
function emptyFile(type) {
    dropboxEligible = true
    return `<div class='container' style='gap:30px;margin-top:8px'>
        ${fileInfoCard(type)}
        <div id='dropbox'></div>
        </div>`
}
fetch('https://api.github.com/repos/SBDWolf/Run-Recap-Component/tags')
    .then(response => response.json())
    .then(data => {
        rrcComponentVersion = data[0].name
    })