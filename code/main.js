gapi.load("client", loadClient);
google.charts.load('current', { packages: ['corechart'] });
setFooter('2025')
setTabs(['home', null, [
    `<div id='savButton' onclick="playSound('category_select');showTab('sav')" class="font2 button"
        style="width:80px;font-size:120%;gap:4px;background-color:var(--cuphead)">
        <img src="images/sav.png" style="height:21px">.sav
    </div>
    <div id='lssButton' onclick="playSound('category_select');showTab('lss')" class="font2 button grayedOut"
        style="width:80px;font-size:120%;gap:4px;background-color:var(--cuphead)">
        <img src="images/lss.png" style="height:21px">.lss
    </div>`
], null, 'sums', 'grid', null, 'ballpit'])
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
    commBestILsCategory = commBestILs['1.1+']
    getCommBestILs()
})
function action() {
    switch (globalTab) {
        case 'home':
            if (runRecapExample) {
                runRecapDefault()
                runRecapUnload('sav', true)
                runRecapUnload('lss', true)
                runRecapExample = false
                hide('runRecap_example_div')
            }
            if (localStorage.getItem('username')) {
                document.getElementById('runRecap_player').innerHTML = runRecapPlayer('runRecap_player')
            }
            hide('runRecap_chart')
            break
        case 'sav':
            generate_sav()
            break
        case 'lss':
            generate_lss()
            break
        case 'sums':
            generateSums()
            break
        case 'grid':
            generateGrid()
            break
        case 'ballpit':
            generateBallpit()
            break
        case 'commBestILs':
            generateCommBestILs()
            break
        case 'commBestSplits':
            generateCommBestSplits()
            break
    }
    if (runRecap_savFile) {
        document.getElementById('savButton').classList.add('pulseSize')
    } else {
        document.getElementById('savButton').classList.remove('pulseSize')
    }
    if (runRecap_lssFile.pbSplits) {
        document.getElementById('lssButton').classList.add('pulseSize')
        document.getElementById('lssButton').classList.remove('grayedOut')
    } else {
        document.getElementById('lssButton').classList.remove('pulseSize')
        document.getElementById('lssButton').classList.add('grayedOut')
    }
    updateComparisonInfo()
    if (globalTab == 'sav') {
        show('runRecap_content')
    } else {
        hide('runRecap_content')
    }
    if (['sav', 'sums', 'grid'].includes(globalTab) || (globalTab == 'lss' && runRecap_savFile)) {
        show('runRecap_sav_comparison')
    } else {
        hide('runRecap_sav_comparison')
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
        show('runRecap_divider')
    } else {
        hide('runRecap_divider')
    }
    if (runRecapExample) {
        show('runRecap_example_div')
        // hide('runRecap_upload_div')
    } else {
        hide('runRecap_example_div')
        // show('runRecap_upload_div')
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
    if (runRecap_savFile && !['home', 'commBestILs', 'commBestSplits', 'ballpit', 'lss'].includes(globalTab)) runRecap_chart()
    if (['home', 'sav', 'lss'].includes(globalTab)) {
        hide('pageTitle')
    } else {
        show('pageTitle')
        if (fontAwesomeSet[globalTab]) {
            setPageTitle(fontAwesomeSet[globalTab][1], fontAwesomeSet[globalTab][0])
        }
    }
    if (['commBestILs'].includes(globalTab)) {
        show('viableDiv')
    } else {
        hide('viableDiv')
    }
    if (globalTab == 'home') {
        show('runRecapTab')
        hide('content')
    } else {
        hide('runRecapTab')
        show('content')
    }
    if (!['commBestILs', 'commBestSplits', 'ballpit'].includes(globalTab)) {
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
    const dropdown = document.getElementById('dropdown_runRecap_sav_comparison')
    if (commBestILsCategory.name == '1.1+') {
        dropdown.options[0].disabled = false
        dropdown.options[5].disabled = false
    } else {
        dropdown.options[0].disabled = true
        dropdown.options[5].disabled = true
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
    runRecapExamples()
    let HTMLContent = ''
    for (let i = 0; i < commBestILsCategory.numRuns; i++) {
        HTMLContent += `<option value="player_${i}">${i + 1}. ${fullgamePlayer(i)}</option>`
    }
    document.getElementById('runRecap_optgroup').innerHTML = HTMLContent
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