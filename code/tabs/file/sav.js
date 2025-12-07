function generate_sav() {
    let HTMLContent = ''
    if (runRecap_savFile) {
        const numDeaths = runRecap_savFile.statictics.playerOne.numDeaths
        if (numDeaths) {
            show('runRecap_ghost')
            document.getElementById('runRecap_numDeaths').innerHTML = numDeaths
            let char = runRecap_savFile.isPlayer1Mugman ? 'mugman' : 'cuphead'
            if (['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
                char = 'chalice'
            }
            document.getElementById('runRecap_ghost').src = `https://myekul.com/shared-assets/cuphead/images/extra/ghost_${char}.png`
        } else {
            document.getElementById('runRecap_numDeaths').innerHTML = ''
            hide('runRecap_ghost')
        }
        assignIsles()
        HTMLContent += `<div class='container' style='gap:25px'>`
        const follies = getCupheadLevel(runNguns[0].levelID, true)
        const treetop = getCupheadLevel(runNguns[1].levelID, true)
        HTMLContent += `<div>`
        if (follies.bestTime != nullTime && treetop.bestTime == nullTime) {
            HTMLContent += extraLevel('forestfollies', follies.bestTime)
        }
        const mausoleum = getCupheadLevel(mausoleumID, true)
        if (mausoleum.bestTime != nullTime && ['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
            HTMLContent += extraLevel('mausoleum', mausoleum.bestTime)
        }
        HTMLContent += `</div>`
        if (['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
            const isle = isles[4]
            HTMLContent += isleHeader(isle)
            isle.runRecapCategories.forEach(object => {
                HTMLContent += savBoss(object)
            })
            HTMLContent += `</table></div>`
        }
        isles.slice(0, 4).forEach((isle, index) => {
            HTMLContent += isle.runRecapCategories.length ? isleHeader(isle) : ''
            isle.runRecapCategories.forEach(object => {
                HTMLContent += savBoss(object)
            })
            HTMLContent += `</table>`
            // const levels = [['forestfollies', 'treetoptrouble'], ['funfairfever', 'funhousefrazzle'], ['ruggedridge', 'perilouspiers']]
            // levels.forEach((levelPair, levelIndex) => {
            //     if (index == levelIndex) {
            //         HTMLContent += `<div style='padding-top:15px'>`
            //         levelPair.forEach(level => {
            //             const levelObj = getCupheadLevel(runNguns[level], true)
            //             if (levelObj.bestTime != nullTime && !(level == 'forestfollies' && treetop.bestTime == nullTime)) {
            //                 HTMLContent += extraLevel(level, levelObj.bestTime)
            //             }
            //         })
            //         HTMLContent += `</div>`
            //     }
            // })
            HTMLContent += `</div>`
        })
        HTMLContent += `</div>`
        HTMLContent += `
        <div class='container grow' style='color:gray;font-size:120%;width:50px' onclick="savComparisonView=!savComparisonView;playSound('move');action()">
        ${fontAwesome('ellipsis-h')}
        </div>`
        if (savComparisonView) HTMLContent += savComparisonContent()
    } else {
        HTMLContent += `<div class='container'>No .sav file uploaded!</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
}
function processSavFile(playerIndex, display) {
    fetch('https://myekul.com/shared-assets/cuphead/sav.json')
        .then(response => response.json())
        .then(data => {
            runRecap_savFile = data
            if (playerIndex != null) {
                runRecapUnload('lss', true)
                runRecapExample = true
                const player = players[playerIndex]
                document.getElementById('runRecap_player').innerHTML = playerDisplay(player.name)
                const time = secondsToHMS(player.extra.score)
                runRecapTime = time
                setRunRecapTime(runRecapTime)
                document.getElementById('input_runRecap_time').value = time
                categories.forEach((category, categoryIndex) => {
                    const level = getCupheadLevel(categoryIndex)
                    level.bestTime = commBestILsCategory.topRuns[playerIndex].runRecap[categoryIndex]
                    level.played = true
                    level.completed = true
                })
                if (playerIndex == 0 && commBestILsCategory.markin) {
                    bootMarkinExample()
                    if (display) {
                        showTab('lss')
                    } else {
                        showTab('sav')
                    }
                }
                if (playerIndex > 0 || !commBestILsCategory.markin) {
                    showTab('sav')
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
function extraLevel(name, time) {
    return `<div class='container'>
        <div>${getImage('other/' + name, 36)}</div>
        <div style='padding-left:8px;font-size:120%'>${secondsToHMS(time, true)}</div>
        </div>`
}
function isleHeader(isle) {
    return `<div><table class='shadow'><tr><th colspan=4 class='${isle.className}'>${isle.name}</th></td>`
}
function savBoss(categoryIndex) {
    const category = categories[categoryIndex]
    const level = getCupheadLevel(categoryIndex)
    const runTime = level?.bestTime
    const prevCategory = categories[categoryIndex - 1]
    if (prevCategory) category.runTime += prevCategory.runTime
    let HTMLContent = ''
    const done = runTime && runTime != nullTime
    const comparisonTime = getComparisonTime(categoryIndex)
    const delta = runRecapDelta(runTime, comparisonTime)
    const grade = runRecapGrade(delta)
    let comparisonContent = `<div>${secondsToHMS(comparisonTime)}</div>`
    if (savComparison == 'Top Bests') {
        comparisonContent += `<div class='container'>`
        commBestILsCategory.topBestPlayers[categoryIndex].forEach(playerIndex => {
            const player = players[playerIndex]
            comparisonContent += getPlayerIcon(player, 16)
        })
        comparisonContent += `</div>`
    }
    HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
    HTMLContent += done ? `<td class='${grade.className}' style='text-align:left;padding:0 2px'>${deltaType ? '' : grade.grade}</td>` : `<td></td>`
    HTMLContent += `<td class='container ${category.info.id}' style='min-width:36px'>${getImage(category.info.id)}</td>`
    HTMLContent += `<td id='runRecap_${categoryIndex}' class='${category.info.id}'>${done ? runRecapIL(runTime, categoryIndex) : runRecapInput(categoryIndex)}</td>`
    HTMLContent += done ? `<td class='${deltaType ? redGreen(delta) : grade.className}' style='font-size:90%'>${getDelta(delta)}</td>` : `<td></td>`
    HTMLContent += done ? `<td class='dim' style='font-size:90%;padding:0 2px'>${comparisonContent}</td>` : `<td></td>`
    HTMLContent += `</tr>`
    return HTMLContent
}
function getComparisonTime(categoryIndex) {
    if (savComparison == 'Top Average') {
        return commBestILsCategory.top[categoryIndex]
    } else if (savComparison == 'Top 3 Average') {
        return commBestILsCategory.top3[categoryIndex]
    } else if (savComparison == 'Top Bests') {
        return commBestILsCategory.topBest[categoryIndex]
    } else if (savComparison == 'Theory Run') {
        return commBestILsCategory.theoryRun[categoryIndex]
    } else if (savComparison == 'Run Viable ILs') {
        return categories[categoryIndex].runs[0].score
    } else if (savComparison == 'TAS') {
        return commBestILsCategory.tas[categoryIndex]
    } else if (savComparison.split('_')[0] == 'player') {
        return commBestILsCategory.topRuns[parseInt(savComparison.split('_')[1])].runRecap[categoryIndex]
    } else if (savComparison.split('_')[0] == 'database') {
        return commBestILsCategory.database[categoryIndex]
    }
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
function runRecapIL(runTime, categoryIndex) {
    return `<div class='grow' onclick="runRecapPlaceholder('${runTime}',${categoryIndex})" style='font-size:130%;padding:0 8px'>${secondsToHMS(runTime, true)}</div>`
}
function runRecapInput(categoryIndex, value) {
    return `<input id='input_runRecapIL_${categoryIndex}' type='text' placeholder='X:XX' ${value ? `value='${value}'` : ''} style='font-size:100%;width:45px;margin:0 5px' onblur="updateRunRecapIL(${categoryIndex})">`
}
function runRecapPlaceholder(runTime, categoryIndex) {
    document.getElementById('runRecap_' + categoryIndex).innerHTML = runRecapInput(categoryIndex, runTime)
    const input = document.getElementById('input_runRecapIL_' + categoryIndex)
    input.focus()
    input.setSelectionRange(0, input.value.length)
}
function runRecapCopy() {
    let clipboardContent = ''
    categories.forEach((category, categoryIndex) => {
        // let time = secondsToHMS(category.runTime, true, true)
        // if (!runRecapExample) {
        //     time = time.replace(/^0:/, "");
        // }
        // clipboardContent += `[${time}] ${category.name}\n`
        clipboardContent += `${getCupheadLevel(categoryIndex).bestTime.toString().split('.')[0] + '.' + getCupheadLevel(categoryIndex).bestTime.toString().split('.')[1].slice(0, 2)}${categoryIndex == categories.length - 1 ? '' : ', '}`
    })
    navigator.clipboard.writeText(clipboardContent)
        .then(() => {
            // Success!
        })
}
function savComparisonContent() {
    const savComparisonInfo = {
        'Top Average': `Average of top ${commBestILsCategory.topRuns.length} players' boss times in their PBs`,
        'Top 3 Average': "Average of top 3 players' boss times in their PBs",
        'Top Bests': "Best of top players' boss times in their PBs",
        'Theory Run': "Top 3 players' PB boss times averaged with Run Viable ILs",
        'Run Viable ILs': "Community best ILs with run viable strategies",
        'TAS': "Tool-Assisted Speedrun (by SBDWolf)"
    }
    let HTMLContent = `<div class='container' style='gap:10px'><div style='width:250px'>`;
    // ['None', 'Top 10 Average', 'Top 3 Average', 'Top Bests', 'Theory Run', 'Run Viable ILs', 'TAS'].forEach((option, index) => {
    ['Top Average', 'Top 3 Average', 'Top Bests', 'Theory Run', 'Run Viable ILs', 'TAS'].forEach((option, index) => {
        if (!(!['1.1+'].includes(commBestILsCategory.name) && ['TAS'].includes(option))) {
            HTMLContent += `
        <div class='grow ${getRowColor(index)} ${savComparison == option ? 'cuphead' : ''}' style='padding:8px 6px' onclick="changeComparison('${option}');action()">
        <div>${option}</div>
        <div style='color:gray;font-size:70%;'>${savComparisonInfo[option] || ''}</div>
        </div>`
        }
    })
    HTMLContent += `</div>`
    HTMLContent += runRecapExamples(true)
    HTMLContent += `</div>`
    return HTMLContent
}
function changeComparison(comparison, playerName, time) {
    let HTMLContent = comparison
    if (playerName && time) {
        HTMLContent = playerName + ' - ' + time
        deltaType = true
    } else {
        deltaType = false
    }
    document.getElementById('savComparison').innerText = HTMLContent;
    savComparison = comparison;
    closeModal(true)
    if (!(playerName && !time)) playSound('cardflip')
}