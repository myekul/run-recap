gapi.load("client", loadClient);
google.charts.load('current', { packages: ['corechart'] });
setFooter('2025')
initializeHash('home')
setAudio('cuphead')
generateDropbox('sav')
generateDropbox('lss')
runRecapDefault()
// setTabs(['home', null, 'ballpit'])
setTabs(['home'])
document.addEventListener('DOMContentLoaded', function () {
    getCommBestILs()
})
function action() {
    hide('loader')
    if (globalTab == 'home') {
        show('runRecapTab')
        hide('content')
    } else {
        hide('runRecapTab')
        show('content')
    }
    switch (globalTab) {
        case 'home':
            runRecapViewPage()
            break
        case 'commBestILs':
            generateCommBestILs()
            break
        case 'commBestSplits':
            generateCommBestSplits()
            break
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
    const dropdown = document.getElementById('dropdown_runRecap_sav_comparison')
    if (commBestILsCategory.name == '1.1+') {
        dropdown.options[0].disabled = false
    } else {
        dropdown.options[0].disabled = true
    }
    updateLoadouts(categoryName)
    buttonClick('commBestILs_' + commBestILsCategory.className, 'commBestILsVersionTabs', 'selected')
    players = []
    playerNames = new Set()
    const category = commBestILsCategory.category
    updateBoardTitle()
    if (category > -1) {
        if (globalCache) {
            letsGo()
        } else {
            window.firebaseUtils.firestoreRead()
        }
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
    fetchCuphead()
}
function updateLoadouts(categoryName) {
    let HTMLContent = ''
    let fullgameCategories = []
    if (commBestILsCategory.name == 'NMG') {
        fullgameCategories.push('NMG', 'NMG P/S')
    } else if (commBestILsCategory.name == 'DLC') {
        fullgameCategories.push('DLC', 'DLC L/S', 'DLC C/S', 'DLC C/T', 'DLC Low%', 'DLC Expert')
    } else if (commBestILsCategory.name == 'DLC+Base') {
        fullgameCategories.push('DLC+Base', 'DLC+Base L/S', 'DLC+Base C/S')
    }
    fullgameCategories.forEach(category => {
        const thisCategory = commBestILs[category]
        HTMLContent += `<div onclick="playSound('category_select');getCommBestILs('${category}')" class="button ${commBestILsCategory.className} container ${categoryName == category ? 'selected' : ''}">`
        HTMLContent += thisCategory.shot1 ? cupheadShot(thisCategory.shot1) : ''
        HTMLContent += thisCategory.shot2 ? cupheadShot(thisCategory.shot2) : ''
        HTMLContent += thisCategory.subcat ? thisCategory.subcat : ''
        HTMLContent += `</div>`
    })
    document.getElementById('loadouts').innerHTML = HTMLContent
}
function done() {
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
    runRecapViewPage('home')
}
function assignRuns(category, categoryIndex) {
    category.runs.forEach((run, runIndex) => {
        if (runIndex == 0) {
            run.first = true
            if (category.runs[runIndex + 1]?.place > 1 || category.runs.length == 1) {
                run.untied = true
            }
        }
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
function updateBoardTitle(category = commBestILsCategory) {
    let HTMLContent = ''
    const shotSize = 30
    HTMLContent += boardTitleCell(category.className, category.name)
    HTMLContent += category.shot1 ? `<td id='commBestILsWeapons' class='container' style='margin:0;gap:4px;padding:0 3px'>` : ''
    HTMLContent += category.shot1 ? cupheadShot(category.shot1, shotSize) : ''
    HTMLContent += category.shot2 ? cupheadShot(category.shot2, shotSize) : ''
    HTMLContent += category.shot1 ? `</td>` : ''
    HTMLContent += category.subcat ? boardTitleCell('', category.subcat) : ''
    document.getElementById('boardTitle').innerHTML = boardTitleWrapper(HTMLContent)
}