function generate_sav() {
    dropboxEligible = false
    let HTMLContent = ''
    if (runRecap_savFile) {
        handleNumDeaths()
        HTMLContent += classicView()
    } else {
        HTMLContent += emptyFile('sav')
    }
    document.getElementById('content').innerHTML = HTMLContent
    if (dropboxEligible) initializeDropbox(true)
}
function handleNumDeaths() {
    const numDeaths = runRecap_savFile.statictics.playerOne.numDeaths
    if (numDeaths) {
        show('runRecap_ghost')
        document.getElementById('runRecap_numDeaths').innerHTML = numDeaths
        let char = runRecap_savFile.isPlayer1Mugman ? 'mugman' : 'cuphead'
        if (['DLC', 'DLC+Base'].includes(runRecapCategory.name)) {
            char = 'chalice'
        }
        document.getElementById('runRecap_ghost').src = `https://myekul.com/shared-assets/cuphead/images/extra/ghost_${char}.png`
    } else {
        document.getElementById('runRecap_numDeaths').innerHTML = ''
        hide('runRecap_ghost')
    }
}
function processSavFile(playerIndex, display) {
    fetch('https://myekul.com/shared-assets/cuphead/sav.json')
        .then(response => response.json())
        .then(data => {
            runRecap_savFile = data
            if (playerIndex != null) {
                runRecapUnload('lss')
                runRecapExample = true
                const player = players[playerIndex]
                document.getElementById('runRecap_player').innerHTML = playerDisplay(player.name)
                const time = secondsToHMS(player.extra.score)
                runRecapTime = time
                setRunRecapTime(runRecapTime)
                document.getElementById('input_runRecap_time').value = time
                categories.forEach((category, categoryIndex) => {
                    const level = getCupheadLevel(categoryIndex)
                    level.bestTime = runRecapCategory.topRuns[playerIndex].runRecap[categoryIndex]
                    level.played = true
                    level.completed = true
                })
                if (runRecapCategory.name == '1.1+') runRecap_rrcFile.attempts = [{ scenes: runRecapCategory.topRuns[playerIndex].rrc }]
                if (playerIndex == 0 && runRecapCategory.markin) {
                    bootMarkinExample()
                    if (display) {
                        showTab('lss')
                    } else {
                        if (runRecapCategory.name == '1.1+') {
                            showTab('rrc')
                        } else {
                            showTab('sav')
                        }
                    }
                }
                if (playerIndex > 0 || !runRecapCategory.markin) {
                    if (runRecapCategory.name == '1.1+') {
                        showTab('rrc')
                    } else {
                        showTab('sav')
                    }
                }
            } else {
                showTab('sav')
            }
        })
}
function bootMarkinExample() {
    markinExample()
    document.querySelectorAll('.lss_recentRuns').forEach(elem => {
        elem.innerHTML = ''
        hide(elem)
    })
    document.getElementById('dropdown_runRecap_lss_current').value = 'yourPB'
    document.getElementById('dropdown_runRecap_lss_comparison').value = 'commBest'
}
function assignIsles() {
    isles.forEach(isle => {
        isle.runRecapCategories = []
    })
    categories.forEach((category, categoryIndex) => {
        isles[category.info.isle - 1].runRecapCategories.push(categoryIndex)
    })
}
function getCupheadLevel(param, other) {
    const id = other ? param : categories[param].info.levelID
    return runRecap_savFile.levelDataManager.levelObjects.find(level => level.levelID == id)
}
function updateRunRecapIL(categoryIndex) {
    playSound('category_select')
    const level = getCupheadLevel(categoryIndex)
    let userInput = document.getElementById('input_runRecapIL_' + categoryIndex).value
    if (userInput?.includes(':')) userInput = convertToSeconds(userInput)
    if (!userInput) {
        userInput = nullTime
        level.completed = false
        level.played = false
    } else {
        level.completed = true
        level.played = true
    }
    level.bestTime = parseFloat(userInput)
    action()
}