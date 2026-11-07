let rrcChartSeries
function generateTheTop() {
    let HTMLContent = ''
    if (runRecapCategory.name != 'Other') {
        chartEligible = (rrcComparison != 'None')
        isles.forEach(isle => {
            isle.sum = 0
            isle.comparisonSum = 0
            isle.sums = []
        })
        assignIsles()
        runRecapCategory.topRuns.forEach((run, index) => {
            isles.forEach(isle => {
                isle.sum = 0
                isle.sums[index] = 0
            })
            isles.forEach(isle => {
                isle.runRecapCategories.forEach(levelIndex => {
                    const bestTime = run.igt[levelIndex]
                    const content = bestTime != nullTime ? bestTime : 0
                    isle.sum += content
                    isle.sums[index] += content
                })
            })
        })
        HTMLContent += chartEligible ? rrcChartSection() : ''
        HTMLContent += topGrid()
            + savComparisonDisplay()
            + rtaSums()
            + topResidual()
        HTMLContent += `
        <div class='container' style='margin-top:100px'>
            <table class='shadow'>
                <tr>
                    <td><td>`
        players.slice(0, runRecapCategory.topRuns.length).forEach(player => {
            HTMLContent += `
            <td>
                <div style='position:absolute;transform:rotate(-30deg) translate(-13px,-30px);transform-origin:bottom left'>${getPlayerDisplay(player, true)}</div>
            </td>`
        })
        HTMLContent += `
        <tr>
            <td><div class='container'>${getImage('runnguns/forestfollies', 21)}</div></td>`
        runRecapCategory.topRuns.forEach((run, index) => {
            let starSkip = ''
            if (run.starSkips[0]) starSkip = fontAwesome('star')
            if (run.starSkips[0] == 1) starSkip += fontAwesome('star')
            HTMLContent += `<td class='${getRowColor(index)}' style='color:var(--cuphead);font-size:80%;gap:3px;text-align:left;padding:0 5px'>${starSkip}</td>`
        })
        HTMLContent += `<tr>`
        categoryLevels.forEach((level, levelIndex) => {
            if (levelIndex < categoryLevels.length - 1) {
                HTMLContent += `
                <tr>
                    <td class='${level.info.id}'>
                        <div class='container'>${getImage(level.info.id, 21)}</div>
                    </td>`
                runRecapCategory.topRuns.forEach((run, index) => {
                    let starSkip = ''
                    if (run.starSkips[levelIndex + 1]) starSkip = fontAwesome('star')
                    if (run.starSkips[levelIndex + 1] == 1) starSkip += fontAwesome('star')
                    HTMLContent += `<td class='${getRowColor(index)}' style='color:var(--cuphead);font-size:80%;gap:3px;text-align:left;padding:0 5px'>${starSkip}</td>`
                })
                HTMLContent += `</tr>`
            }
        })
        HTMLContent += `
        <tr>
            <td></td>`
        runRecapCategory.topRuns.forEach((run, index) => {
            HTMLContent += `<td class='dim ${getRowColor(index)}'>${run.starSkips.reduce((acc, num) => acc + num, 0)}</td>`
        })
        HTMLContent += `
            </tr>
        </table>`
        HTMLContent += `</div>`
    } else {
        HTMLContent += emptyPageText('Category not supported!')
    }
    document.getElementById('content').innerHTML = HTMLContent
    if (chartEligible && runRecapCategory.name != 'Other') rrcChart()
}
function rtaSums() {
    if (runRecapCategory.name == 'DLC') return ''
    let HTMLContent = `
    <div class='container' style='margin-top:20px'>
        <table class='shadow'>
            <tr>
                <td colspan=4></td>`
    isles.forEach(isle => {
        if (isle.runRecapCategories.length) {
            HTMLContent += `<th class='${isle.className}'>${isle.name}</th>`
        }
    })
    HTMLContent += `<td style='padding:0px 30px'></td>`
    isles.forEach(isle => {
        if (isle.runRecapCategories.length) {
            HTMLContent += `<th class='${isle.className}'>${isle.name}</th>`
        }
    })
    HTMLContent += `</tr>`
    runRecapCategory.topRuns.forEach((run, index) => {
        HTMLContent += `<tr class='hover ${getRowColor(index)}'>
                ${bigPlayerDisplay(players[index])}`
        run.splits = []
        isles.forEach((isle, isleIndex) => {
            if (isle.runRecapCategories.length) {
                const level = categoryLevels[isle.runRecapCategories.at(-1)]
                let time = convertToSeconds(runRecapCategory.topRuns[index].rrc.find(scene => scene.name == 'level_' + level.info.internal).endTime)
                if (runRecapCategory.name != 'DLC' && isleIndex < 3) {
                    time -= runRecapCategory.name == 'DLC+Base' && isleIndex == 0 ? 8.45 : 6.45
                }
                run.splits.push(time)
            }
        })
        run.splits.forEach((time, isleIndex) => {
            const isle = isles[isleIndex]
            const isleRTA = convertToSeconds(time) - convertToSeconds(run.splits[isleIndex - 1])
            HTMLContent += `<td class='${isle.className}' style='padding:0 3px'>${secondsToHMS(isleRTA || convertToSeconds(time), true)}</td>`
        })
        HTMLContent += `<td></td>`
        run.splits.forEach((time, isleIndex) => {
            const isle = isles[isleIndex]
            HTMLContent += `<td class='${isle.className}' style='padding:0 3px'>${secondsToHMS(convertToSeconds(time), true)}</td>`
        })
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>`
    return HTMLContent
}
function topGrid() {
    let HTMLContent = `
    <div class='container' style='overflow-x:auto;margin:20px 0'>
        <table class='shadow'>
            <tr>
                <td colspan=4></td>`
    categoryLevels.forEach(level => {
        HTMLContent += `<td ${savComparison != 'None' ? 'colspan=2' : ''} class='${level.info.id}'>${getImage(level.info.id)}</td>`
    })
    HTMLContent += `</tr>`
    const comparisonCollection = savComparisonCollection[savComparison]
    if (savComparison != 'None') {
        HTMLContent += `<tr><th colspan=4 style='text-align:right'>&Delta;</th>`
        for (let i = 0; i < categoryLevels.length; i++) {
            HTMLContent += `<th colspan=2 class='cuphead'>${secondsToHMS(comparisonCollection[i])}</th>`
        }
        HTMLContent += `</tr>`
    }
    runRecapCategory.topRuns.forEach((run, index) => {
        const player = players[index]
        HTMLContent += `<tr class='${getRowColor(index)} hover'>`
        HTMLContent += bigPlayerDisplay(player)
        for (let i = 0; i < categoryLevels.length; i++) {
            const ILtime = run.igt[i]
            const comparisonTime = savComparison != 'None' ? comparisonCollection[i] : ''
            const delta = runRecapDelta(ILtime, comparisonTime)
            const grade = runRecapGrade(delta)
            HTMLContent += savComparison != 'None' ? `<td class='${grade.className}' style='width:5px'></td>` : ''
            HTMLContent += `<td style='color:${Math.floor(ILtime) == Math.floor(savComparisonCollection['Top Bests'][i]) ? 'lightgray' : 'gray'}'>${secondsToHMS(ILtime)}</td>`
        }
        HTMLContent += `</tr>`
    })
    if (runRecapCategory.topRuns.length > 3) {
        if (savComparison != 'None') {
            HTMLContent += `<tr><th colspan=4 style='text-align:right'>&Delta;</th>`
            for (let i = 0; i < categoryLevels.length; i++) {
                HTMLContent += `<th colspan=2 class='cuphead'>${secondsToHMS(comparisonCollection[i])}</th>`
            }
            HTMLContent += `</tr>`
        }
        HTMLContent += `<tr><td colspan=4></td>`
        categoryLevels.forEach(level => {
            HTMLContent += `<td ${savComparison != 'None' ? 'colspan=2' : ''} class='${level.info.id}'>${getImage(level.info.id)}</td>`
        })
        HTMLContent += `</tr>`
    }
    if (runRecap_savFile) {
        HTMLContent += `<tr><th colspan=4 style='text-align:right'>Your run</th>`
        categoryLevels.forEach((level, levelIndex) => {
            let ILtime = getCupheadLevel(levelIndex)?.bestTime
            if (ILtime == nullTime) ILtime = NaN
            const comparisonTime = savComparison != 'None' ? comparisonCollection[levelIndex] : ''
            const delta = runRecapDelta(ILtime, comparisonTime)
            const grade = runRecapGrade(delta)
            HTMLContent += `
            <td class='${grade.className}' style='font-size:70%;text-align:left'></td>
            <td class='${level.info.id}'>${ILtime ? secondsToHMS(ILtime) : ILtime}</td>`
        })
        HTMLContent += `</tr>`
    }
    HTMLContent += `
        </table>
    </div>`
    return HTMLContent
}
function getIsleSum(isle) {
    let HTMLContent = ''
    if (isle.sum) {
        const delta = Math.floor(isle.sum - isle.comparisonSum)
        const grade = runRecapGrade(delta)
        HTMLContent += `
        <td class='${grade.className}' style='text-align:left'><span>${savComparison != 'None' ? grade.grade : ''}</span></td>
        <td class='${isle.className}' style='padding:0 5px'>${secondsToHMS(isle.sum, true)}</td>
        <td class='${deltaType ? redGreen(delta) : grade.className}' style='font-size:90%'><span>${savComparison != 'None' ? getDelta(delta) : ''}</span></td>
        <td style='width:20px'></td>`
    }
    return HTMLContent
}
function topResidual() {
    let HTMLContent = `
    <div class='container' style='margin-top:30px'>
        <table class='shadow'>
            <tr>
                <th colspan=4></th>
                <th class='gray' style='width:110px'>Level RTA</th>
                <th class='gray' style='width:110px'>Intermissions</th>
                <th class='gray' style='width:110px'>Map Movement</th>
                <th class='gray' style='width:110px'>Cutscenes</th>
                <th class='gray' style='width:110px'>Scorecards</th>`
    runRecapCategory.topRuns.forEach((run, index) => {
        const player = players[index]
        HTMLContent += `<tr class='${getRowColor(index)}'>`
        HTMLContent += bigPlayerDisplay(player)
        rrcOrganize(run, run.rrc, true)
        HTMLContent += `
            <td>${secondsToHMS(run.levelTime, true)}</td>
            <td>${secondsToHMS(run.intermissionTime, true)}</td>
            <td>${secondsToHMS(run.mapTime, true)}</td>
            <td>${secondsToHMS(run.cutsceneTime, true)}</td>
            <td>${secondsToHMS(run.scorecardTime, true)}</td>
        </tr>`
    })
    HTMLContent += `</table>
    </div>`
    return HTMLContent
}