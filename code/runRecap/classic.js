function classicView() {
    let HTMLContent_isles = ''
    assignIsles()
    if (globalTab == 'sav') {
        HTMLContent_isles += `<div>`
        runNguns.forEach(level => {
            const levelObj = getCupheadLevel(level.levelID, true)
            if (levelObj?.bestTime != nullTime) {
                HTMLContent_isles += extraLevel(level.id, levelObj?.bestTime)
            }
        })
        const mausoleum = getCupheadLevel(mausoleumID, true)
        if (mausoleum.bestTime != nullTime && ['DLC', 'DLC+Base'].includes(runRecapCategory.name)) {
            HTMLContent_isles += extraLevel('mausoleum', mausoleum.bestTime)
        }
        HTMLContent_isles += `</div>`
    }
    isles.slice(0, 5).forEach((isle, index) => {
        HTMLContent_isles += isle.runRecapCategories.length ? isleHeader(isle) : ''
        isle.runRecapCategories.forEach(object => {
            HTMLContent_isles += savBoss(object)
        })
        if (isle.runRecapCategories.length) HTMLContent_isles += `</table>`
        if (isle.runRecapCategories.length) HTMLContent_isles += `</div>`
    })
    return `
    <div class='container'>
        ${savComparisonDisplay()}
        ${handleNumDeaths()}
    </div>
    <div class='container' style='gap:25px;margin:20px'>
        ${HTMLContent_isles}
    </div>`
}
function savBoss(levelIndex) {
    const category = categoryLevels[levelIndex]
    let savLevel
    let time
    if (globalTab == 'sav') {
        savLevel = getCupheadLevel(levelIndex)
        time = savLevel?.bestTime
    } else {
        time = rrcCurrentAttempt.bosses[levelIndex]?.levelTime
    }
    const prevCategory = categoryLevels[levelIndex - 1]
    if (prevCategory) category.time += prevCategory.time
    const done = time && time != nullTime
    const comparisonTime = savComparison != 'None' ? savComparisonCollection[savComparison][levelIndex] : ''
    const delta = runRecapDelta(time, comparisonTime)
    const grade = done ? runRecapGrade(delta) : ''
    let comparisonContent = `<div>${secondsToHMS(comparisonTime)}</div>`
    if (savComparison == 'Top Bests') {
        comparisonContent += `<div class='container'>`
        savComparisonCollection.topBestPlayers[levelIndex].forEach(playerIndex => {
            const player = players[playerIndex]
            comparisonContent += getPlayerIcon(player, 16)
        })
        comparisonContent += `</div>`
    }
    let cellContent = done ? runRecapIL(time, levelIndex) : runRecapInput(levelIndex)
    if (!done && globalTab == 'rrc') cellContent = '???'
    return `
    <tr class='${getRowColor(levelIndex)}'>
        ${savComparison != 'None' ? `<td class='${grade.className}' style='text-align:left;width:24px'><span>${done ? deltaType ? '' : grade.grade : ''}</span></td>` : ''}
        <td class='container ${category.info.id}' style='min-width:36px'>${getImage(category.info.id)}</td>
        <td id='runRecap_${levelIndex}' class='${done ? category.info.id : ''}' style='width:85px'>${cellContent}</td>
        ${savComparison != 'None' ? `<td class='${redGreen(delta)}' style='font-size:90%;width:28px'><span>${done ? getDelta(delta) : ''}</span></td>` : ''}
        ${savComparison != 'None' ? `<td class='dim' style='font-size:90%;width:30px'>${done ? comparisonContent : ''}</td>` : ''}
    </tr>`
}
function extraLevel(name, time) {
    const folder = name == 'mausoleum' ? 'other' : 'runnguns'
    return `
    <div class='container'>
        <div>${getImage(folder + '/' + name, 36)}</div>
        <div style='padding-left:8px;font-size:120%'>${secondsToHMS(time, true)}</div>
    </div>`
}
function isleHeader(isle) {
    return `
    <div style='position:relative'>
        ${isle.name == 'Hell' ? `<div id='kdPlus' class='grow dim' style='display:none;position:absolute;right:-20px;top:30px' onclick="kdPlus()">${fontAwesome('plus')}</div>` : ''}
        <table class='shadow'>
            <tr>
                <th colspan=3 class='${isle.className}'>${isle.name}</th>
                <td colspan=2></td>
            </tr>`
}
function runRecapIL(time, levelIndex) {
    return `<div ${globalTab == 'sav' ? `class='grow' onclick="runRecapPlaceholder('${time}',${levelIndex})"` : ''} style='font-size:130%'>${secondsToHMS(time, true)}</div>`
}
function runRecapInput(levelIndex, value) {
    return `<input id='input_runRecapIL_${levelIndex}' type='text' placeholder='X:XX' ${value ? `value='${value}'` : ''} style='font-size:100%;width:45px' onblur="updateRunRecapIL(${levelIndex})">`
}
function runRecapPlaceholder(time, levelIndex) {
    document.getElementById('runRecap_' + levelIndex).innerHTML = runRecapInput(levelIndex, time)
    const input = document.getElementById('input_runRecapIL_' + levelIndex)
    input.focus()
    input.setSelectionRange(0, input.value.length)
}