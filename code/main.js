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
            commBestILs = data
            prepareLocalData()
            runRecapCategory = commBestILs['1.1+']
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

        runViableILs: generateRunViableILs,
        altStrats: generateAltStrats,
        commBestSplits: generateCommBestSplits,
        theTop: generateTheTop,

        info: generateInfo
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
    ['altStrats', 'runViableILs', 'commBestSplits', 'theTop'].forEach(page => {
        document.getElementById(page + 'Button').classList.remove('activeBanner')
        if (page == globalTab) document.getElementById(globalTab + 'Button')?.classList.add('activeBanner')
    })
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
    } else {
        show('pageTitle')
        if (fontAwesomeSet[globalTab]) {
            setPageTitle(fontAwesomeSet[globalTab][1], fontAwesomeSet[globalTab][0])
        }
    }
    if (['altStrats', 'runViableILs', 'commBestSplits'].includes(globalTab)) {
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
    document.getElementById('boardTitle').classList.remove('grayedOut')
    if (globalTab == 'altStrats') {
        document.querySelectorAll('.altStratNum').forEach(elem => { show(elem) })
        show('commBestILsAll')
        if (commBestILsAll) document.getElementById('boardTitle').classList.add('grayedOut')
    } else {
        document.querySelectorAll('.altStratNum').forEach(elem => { hide(elem) })
        hide('commBestILsAll')
    }
    const grayButtons = ['leaderboards', 'runViableILs', 'commBestSplits', 'theTop', 'sav', 'lss', 'rrc', 'ballpit']
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
    rrcComparison = 'Top Bests'
    rrcComparisonText = 'Top Bests'
    altStratLevel = null
    if (commBest[runRecapCategory.tabName]) {
        if (!commBest[runRecapCategory.tabName]['after'] && !splitBefore) splitBefore = true
    }
    if (categoryName != 'Other') rrcComparisonCollectionPrepare()
    const category = runRecapCategory.category
    updateBoardTitle()
    const musicID = ['DLC', 'DLC+Base'].includes(runRecapCategory.name) ? 'L6T3fpUGSmE' : 'cdvSNkW3Uyk'
    document.getElementById('musicDiv').href = `https://youtu.be/${musicID}`
    // if (runRecapExample) showTab('home')
    organizeCategories()
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
    categories.forEach((category, categoryIndex) => {
        assignRuns(category, categoryIndex)
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
function assignRuns(category, categoryIndex) {
    category.runs.forEach(run => {
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
        if (categoryIndex != null) {
            thePlayer.ILs ? thePlayer.ILs[categoryIndex] = run : ''
        } else {
            if (!(runRecapCategory.extraRuns && !runRecapCategory.extraPlayers?.includes(thePlayer.name))) {
                thePlayer.extra = run
            }
        }
        const runTime = run.score
        run.percentage = getScore(category, runTime)
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
    <a onclick="showTab('commBestSplits');playSound('category_select')">here</a></span>.</span>`,
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
const filePrice = {
    sav: 9,
    lss: 15,
    rrc: 24
};
function fileTitle(type, origin) {
    return `
    ${origin ? `<div class="container dim" style="font-size:80%">${fileOrigin[type]}</div>` : ''}
    <div class='font2 container' style='gap:5px;font-size:200%'>
        <img src='https://myekul.com/shared-assets/cuphead/images/extra/${type}.png'
            style='height:40px;filter: brightness(0) invert(1)'>
        .${type}
    </div>`
}
function fileInfoCard(type) {
    return `
    <div ${aprilFools ? `class='border background1'` : ''} style='width:330px;${aprilFools ? 'padding:12px;height:330px;margin-top:20px;position:relative' : ''}'>
        ${fileTitle(type, true)}
        ${aprilFools ? `<div class='container' style='font-size:200%;margin-top:10px'>$${filePrice[type]}<span style='font-size:50%;margin-bottom:8px'>.99</span>/mo</div>` : ''}
        <div class='fileType textBlock' style="margin-top:10px;font-size:90%">
        ${fileInfo[type]}
        ${aprilFools ? `<button class='button cuphead font2' style='position:absolute;bottom:24px;left:100px;font-size:170%;height:50px;width:150px;border-radius:40px' onclick="aprilFoolsReveal()">BUY NOW</button>` : ''}
        </div>
    </div>`
}
function aprilFoolsPopup() {
    let HTMLContent = `
    <div style='width:400px;padding:10px'>
        Hello vibrant community!
        <br><br>
        Thank you for using Run Recap. Due to the extremely positive reception of the site and the widespread impact it has had on the community,
        the myekul.com board of executives has decided to make Run Recap a ${myekulColor('premium, subscription-based service')}.
        Given the site's popularity, we figured this would be an excellent opportunity to capitalize on our lucrative run analysis tools.
        <br>${myekulColor('Pricing plans now available!')}
        <br><br>
        -myekul
    </div>`
    openModal(HTMLContent, 'UPDATE')
}
function aprilFoolsReveal() {
    let HTMLContent = `
    <div style='width:450px;padding:10px'>
    APRIL FOOLS! ${myekulColor('myekul.com will ALWAYS be free and open source.')}
    Thank you everyone for visiting the site. It truly means a lot for my work to get appreciated the way it does.
    <br><br>
    ...If you would like to actually support the myekul project though, a donation would be greatly appreciated.
    It costs me ${myekulColor('$10/year')} to keep the myekul.com domain name, and if we could get that community-funded, that would mean a lot.
    Anything beyond that is not necessary, but would put a smile on my silly face.
    ${myekulColor('For donations of $5 or more, you will receive a special supporter badge on the Combined Leaderboard!')}
    <a href="https://ko-fi.com/myekul" target="_blank" class='button cuphead font2' style='margin:10px auto;font-size:170%;height:50px;width:150px;border-radius:40px'>DONATE</a>`
    openModal(HTMLContent, 'APRIL FOOLS!', '', true)
    playSound('ready')
    aprilFools = false
    action()
}
function emptyFile(type) {
    dropboxEligible = true
    return `
    <div class='container' style='gap:30px;margin-top:8px'>
        ${fileInfoCard(type)}
        ${!aprilFools ? `<div id='dropbox'></div>` : ''}
    </div>`
}
fetch('https://api.github.com/repos/SBDWolf/Run-Recap-Component/tags')
    .then(response => response.json())
    .then(data => {
        rrcComponentVersion = data[0].name
    })