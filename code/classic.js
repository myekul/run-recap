function classicView() {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='gap:25px'>`
    assignIsles()
    if (globalTab == 'sav') {
        const follies = getCupheadLevel(runNguns[0].levelID, true)
        const treetop = getCupheadLevel(runNguns[1].levelID, true)
        HTMLContent += `<div>`
        if (follies.bestTime != nullTime && treetop.bestTime == nullTime) {
            HTMLContent += extraLevel('forestfollies', follies.bestTime)
        }
        const mausoleum = getCupheadLevel(mausoleumID, true)
        if (mausoleum.bestTime != nullTime && ['DLC', 'DLC+Base'].includes(runRecapCategory.name)) {
            HTMLContent += extraLevel('mausoleum', mausoleum.bestTime)
        }
        HTMLContent += `</div>`
    }
    if (['DLC', 'DLC+Base'].includes(runRecapCategory.name)) {
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
    // HTMLContent += `
    //     <div class='container grow' style='color:gray;font-size:120%;width:50px' onclick="savComparisonView=!savComparisonView;playSound('move');action()">
    //     ${fontAwesome('ellipsis-h')}
    //     </div>`
    if (savComparisonView) HTMLContent += savComparisonContent()
    return HTMLContent
}
function savBoss(categoryIndex) {
    const category = categories[categoryIndex]
    let level
    let runTime
    if (globalTab == 'sav') {
        level = getCupheadLevel(categoryIndex)
        runTime = level?.bestTime
    } else {
        runTime = rrcCurrentAttempt.bosses[categoryIndex]?.levelTime
    }
    const prevCategory = categories[categoryIndex - 1]
    if (prevCategory) category.runTime += prevCategory.runTime
    let HTMLContent = ''
    const done = runTime && runTime != nullTime
    const comparisonTime = savComparisonCollection[savComparison][categoryIndex]
    const delta = runRecapDelta(runTime, comparisonTime)
    const grade = done ? runRecapGrade(delta) : ''
    let comparisonContent = `<div>${secondsToHMS(comparisonTime)}</div>`
    if (savComparison == 'Top Bests') {
        comparisonContent += `<div class='container'>`
        savComparisonCollection.topBestPlayers[categoryIndex].forEach(playerIndex => {
            const player = players[playerIndex]
            comparisonContent += getPlayerIcon(player, 16)
        })
        comparisonContent += `</div>`
    }
    let cellContent = done ? runRecapIL(runTime, categoryIndex) : runRecapInput(categoryIndex)
    if (!done && globalTab == 'rrc') cellContent = '???'
    HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
    HTMLContent += `<td class='${grade.className}' style='text-align:left;width:24px'>${done ? deltaType ? '' : grade.grade : ''}</td>`
    HTMLContent += `<td class='container ${category.info.id}' style='min-width:36px'>${getImage(category.info.id)}</td>`
    HTMLContent += `<td id='runRecap_${categoryIndex}' class='${done ? category.info.id : ''}' style='width:85px'>${cellContent}</td>`
    HTMLContent += `<td class='${deltaType ? redGreen(delta) : grade?.className}' style='font-size:90%;width:28px'>${done ? getDelta(delta) : ''}</td>`
    HTMLContent += `<td class='dim' style='font-size:90%;width:30px'>${done ? comparisonContent : ''}</td>`
    HTMLContent += `</tr>`
    return HTMLContent
}
function extraLevel(name, time) {
    const folder = name == 'mausoleum' ? 'other' : 'runnguns'
    return `<div class='container'>
        <div>${getImage(folder + '/' + name, 36)}</div>
        <div style='padding-left:8px;font-size:120%'>${secondsToHMS(time, true)}</div>
        </div>`
}
function isleHeader(isle) {
    return `<div><table class='shadow'><tr><th colspan=4 class='${isle.className}'>${isle.name}</th></td>`
}
function runRecapIL(runTime, categoryIndex) {
    return `<div ${globalTab == 'sav' ? `class='grow' onclick="runRecapPlaceholder('${runTime}',${categoryIndex})"` : ''} style='font-size:130%'>${secondsToHMS(runTime, true)}</div>`
}
function runRecapInput(categoryIndex, value) {
    return `<input id='input_runRecapIL_${categoryIndex}' type='text' placeholder='X:XX' ${value ? `value='${value}'` : ''} style='font-size:100%;width:45px' onblur="updateRunRecapIL(${categoryIndex})">`
}
function runRecapPlaceholder(runTime, categoryIndex) {
    document.getElementById('runRecap_' + categoryIndex).innerHTML = runRecapInput(categoryIndex, runTime)
    const input = document.getElementById('input_runRecapIL_' + categoryIndex)
    input.focus()
    input.setSelectionRange(0, input.value.length)
}