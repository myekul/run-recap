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
                isle.runRecapCategories.forEach(categoryIndex => {
                    const bestTime = run.runRecap[categoryIndex]
                    const content = bestTime != nullTime ? decimalsCriteria() ? bestTime : Math.floor(bestTime) : 0
                    isle.sum += content
                    isle.sums[index] += content
                })
            })
        })
        HTMLContent += chartEligible ? rrcChartSection() : ''
        HTMLContent += topGrid()
        HTMLContent += topSums()
        // HTMLContent += `<div class='container' style='margin-top:20px'><table>
        //     <tr>
        //     <td colspan=4></td>
        //     <th colspan=2 class='isle1'>Isle 1</th>
        //     <th colspan=4 class='expert'>Isle 2</th>
        //     <th colspan=4 class='isle3'>Isle 3</th>
        //     <th colspan=4 class='hell'>Hell</th>
        //     </tr>
        //     <tr>
        //     <td colspan=4>
        //     <th class='gray'>RTA</th>
        //     <th class='gray'>IGT</th>`
        // for (let i = 0; i < 3; i++) {
        //     HTMLContent += `
        //         <th class='gray'>RTA</th>
        //         <th class='gray'>IGT</th>
        //         <th colspan=2 class='gray'>Sum</th>`
        // }
        // runRecapCategory.topRuns.forEach((run, index) => {
        //     HTMLContent += `<tr class='hover ${getRowColor(index)}'>
        //         ${bigPlayerDisplay(players[index])}`
        //     let sum = 0
        //     run.splits = [
        //         convertToSeconds(runRecapCategory.topRuns[index].rrc[22].endTime) - 6.45,
        //         convertToSeconds(runRecapCategory.topRuns[index].rrc[40].endTime) - 6.45,
        //         convertToSeconds(runRecapCategory.topRuns[index].rrc[64].endTime) - 6.45,
        //         runRecapCategory.runs[index].score
        //     ]
        //     run.splits.forEach((time, isleIndex) => {
        //         const isle = isles[isleIndex]
        //         const isleRTA = convertToSeconds(time) - convertToSeconds(run.splits[isleIndex - 1])
        //         const isleIGT = isle.sums[index]
        //         sum += isleIGT
        //         HTMLContent += `<td class='${isle.className}' style='padding:0 3px'>${secondsToHMS(isleRTA || convertToSeconds(time), true)}</td>`
        //         HTMLContent += `<td class='${isle.className}' style='font-size:80%;opacity:80%'>${secondsToHMS(isleIGT, true)}</td>`
        //         HTMLContent += isleIndex > 0 ? `<td class='${isle.className}' style='padding:0 3px'>${secondsToHMS(convertToSeconds(time), true)}</td>` : ''
        //         HTMLContent += isleIndex > 0 ? `<td style='font-size:80%;opacity:80%' class='${isle.className}'>${secondsToHMS(sum, true)}</td>` : ''
        //     })
        //     HTMLContent += `</tr>`
        // })
        // HTMLContent += `</table></div>`
        HTMLContent += `<div class='container' style='margin-top:100px'>`
        HTMLContent += `<table>
    <tr>
    <td><td>`
        players.slice(0, runRecapCategory.topRuns.length).forEach(player => {
            HTMLContent += `<td><div style='position:absolute;transform:rotate(-30deg) translate(-13px,-30px);transform-origin:bottom left'>${getPlayerDisplay(player, true)}</div></td>`
        })
        HTMLContent += `<tr>
    <td><div class='container'>${getImage('runnguns/forestfollies', 21)}</div></td>`
        runRecapCategory.topRuns.forEach((run, index) => {
            let starSkip = ''
            if (run.starSkips[0]) starSkip = fontAwesome('star')
            if (run.starSkips[0] == 1) starSkip += fontAwesome('star')
            HTMLContent += `<td class='${getRowColor(index)}' style='color:var(--cuphead);font-size:80%;gap:3px;text-align:left;padding:0 5px'>${starSkip}</td>`
        })
        HTMLContent += `<tr>`
        categories.forEach((category, categoryIndex) => {
            if (categoryIndex < categories.length - 1) {
                HTMLContent += `<tr>
            <td class='${category.info.id}'><div class='container'>${getImage(category.info.id, 21)}</div></td>`
                runRecapCategory.topRuns.forEach((run, index) => {
                    let starSkip = ''
                    if (run.starSkips[categoryIndex + 1]) starSkip = fontAwesome('star')
                    if (run.starSkips[categoryIndex + 1] == 1) starSkip += fontAwesome('star')
                    HTMLContent += `<td class='${getRowColor(index)}' style='color:var(--cuphead);font-size:80%;gap:3px;text-align:left;padding:0 5px'>${starSkip}</td>`
                })
                HTMLContent += `</tr>`
            }
        })
        HTMLContent += `<tr>
    <td></td>`
        runRecapCategory.topRuns.forEach((run, index) => {
            HTMLContent += `<td class='dim ${getRowColor(index)}'>${run.starSkips.reduce((acc, num) => acc + num, 0)}</td>`
        })
        HTMLContent += `</tr>
    </table>`
        HTMLContent += `</table>`
        HTMLContent += `</div>`
    } else {
        HTMLContent += emptyPageText('Category not supported!')
    }
    document.getElementById('content').innerHTML = HTMLContent
    if (chartEligible && runRecapCategory.name != 'Other') rrcChart()
}
function topGrid() {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='overflow-x:auto;margin-top:30px'>`
    HTMLContent += `<table class='shadow'>`
    HTMLContent += `<tr><td colspan=4></td>`
    categories.forEach(category => {
        HTMLContent += `<td colspan=2 class='${category.info.id}'>${getImage(category.info.id)}</td>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `<tr><th colspan=4 style='text-align:right'>&Delta;</th>`
    categories.forEach((category, categoryIndex) => {
        HTMLContent += `<th colspan=2 class='cuphead'>${secondsToHMS(savComparisonCollection[savComparison][categoryIndex])}</th>`
    })
    HTMLContent += `</tr>`
    runRecapCategory.topRuns.forEach((run, index) => {
        const player = players[index]
        HTMLContent += `<tr class='${getRowColor(index)} hover'>`
        HTMLContent += bigPlayerDisplay(player)
        categories.forEach((category, categoryIndex) => {
            const ILtime = run.runRecap[categoryIndex]
            const comparisonTime = savComparisonCollection[savComparison][categoryIndex]
            const delta = runRecapDelta(ILtime, comparisonTime)
            const grade = runRecapGrade(delta)
            HTMLContent += `<td class='${grade.className}' style='width:5px'></td>`
            HTMLContent += `<td style='color:${Math.floor(ILtime) == Math.floor(savComparisonCollection['Top Bests'][categoryIndex]) ? 'lightgray' : 'gray'}'>${secondsToHMS(ILtime)}</td>`
        })
        HTMLContent += `</tr>`
    })
    if (runRecapCategory.topRuns.length > 3) {
        HTMLContent += `<tr><th colspan=4 style='text-align:right'>&Delta;</th>`
        categories.forEach((category, categoryIndex) => {
            HTMLContent += `<th colspan=2 class='cuphead'>${secondsToHMS(savComparisonCollection[savComparison][categoryIndex])}</th>`
        })
        HTMLContent += `</tr>`
        HTMLContent += `<tr><td colspan=4></td>`
        categories.forEach(category => {
            HTMLContent += `<td colspan=2 class='${category.info.id}'>${getImage(category.info.id)}</td>`
        })
        HTMLContent += `</tr>`
    }
    if (runRecap_savFile) {
        HTMLContent += `<tr><th colspan=4 style='text-align:right'>Your run</th>`
        categories.forEach((category, categoryIndex) => {
            let ILtime = getCupheadLevel(categoryIndex)?.bestTime
            if (ILtime == nullTime) ILtime = NaN
            const comparisonTime = savComparisonCollection[savComparison][categoryIndex]
            const delta = runRecapDelta(ILtime, comparisonTime)
            const grade = runRecapGrade(delta)
            HTMLContent += `<td class='${grade.className}' style='font-size:70%;text-align:left'></td>`
            HTMLContent += `<td class='${category.info.id}'>${ILtime ? secondsToHMS(ILtime) : ILtime}</td>`
        })
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table>`
    HTMLContent += `</div>`
    return HTMLContent
}
function topSums() {
    let HTMLContent = ''
    isles.forEach(isle => {
        isle.sum = 0
        isle.comparisonSum = 0
        isle.sums = []
    })
    assignIsles()
    let sum = 0
    let comparisonSum = 0
    isles.forEach(isle => {
        isle.runRecapCategories.forEach(categoryIndex => {
            isle.comparisonSum += savComparisonCollection[savComparison][categoryIndex]
        })
        isle.comparisonSum = Math.floor(isle.comparisonSum)
        comparisonSum += isle.comparisonSum
    })
    HTMLContent += `<div class='container' style='margin-top:30px'>
    <table class='shadow'>`
    HTMLContent += `<tr style='color:gray'><td colspan=4></td>`
    isles.forEach(isle => {
        if (isle.runRecapCategories.length > 0) {
            HTMLContent += `<th colspan=3 class='${isle.className}'>${isle.name}</th>`
            HTMLContent += `<td></td>`
        }
    })
    HTMLContent += `
    <th>TOTAL</th>
    <td></td>
    </tr>`
    runRecapCategory.topRuns.forEach((run, index) => {
        sum = 0
        isles.forEach(isle => {
            isle.sum = 0
            isle.sums[index] = 0
        })
        isles.forEach(isle => {
            isle.runRecapCategories.forEach(categoryIndex => {
                const bestTime = run.runRecap[categoryIndex]
                const content = bestTime != nullTime ? decimalsCriteria() ? bestTime : Math.floor(bestTime) : 0
                isle.sum += content
                isle.sums[index] += content
            })
        })
        HTMLContent += `<tr class='hover ${getRowColor(index)}'>`
        HTMLContent += bigPlayerDisplay(players[index])
        isles.forEach(isle => {
            sum += isle.sum
            HTMLContent += getIsleSum(isle)
        })
        const delta = Math.floor(sum - comparisonSum)
        HTMLContent += `
        <td>${secondsToHMS(sum, decimalsCriteria())}</td>
        <td class='${redGreen(delta)}'>${savComparison != 'None' ? getDelta(delta) : ''}</td>
        </tr>`
    })
    HTMLContent += `<tr style='color:gray'><th colspan=4 style='text-align:right'>&Delta;</th>`
    isles.forEach(isle => {
        if (isle.runRecapCategories.length > 0) {
            HTMLContent += `<th colspan=3>${secondsToHMS(isle.comparisonSum, decimalsCriteria())}</th>`
            HTMLContent += `<td></td>`
        }
    })
    HTMLContent += `
    <th>${savComparison != 'None' ? secondsToHMS(comparisonSum) : ''}</th>
    <td></td>
    </tr>`
    if (runRecap_savFile) {
        sum = 0
        isles.forEach(isle => {
            isle.sum = 0
        })
        isles.forEach(isle => {
            isle.runRecapCategories.forEach(categoryIndex => {
                const bestTime = getCupheadLevel(categoryIndex).bestTime
                isle.sum += bestTime != nullTime ? decimalsCriteria() ? bestTime : Math.floor(bestTime) : 0
            })
        })
        HTMLContent += `<tr><th colspan=4 style='text-align:right'>Your run</th>`
        isles.forEach(isle => {
            sum += isle.sum
            HTMLContent += getIsleSum(isle)
        })
        if (getCupheadLevel(categories.length - 1).completed) {
            const delta = Math.floor(sum - comparisonSum)
            HTMLContent += `
            <td>${secondsToHMS(sum, decimalsCriteria())}</td>
            <td class='${redGreen(delta)}'>${savComparison != 'None' ? getDelta(delta) : ''}</td>`
        }
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table></div>`
    return HTMLContent
}
function getIsleSum(isle) {
    let HTMLContent = ''
    if (isle.sum) {
        const delta = Math.floor(isle.sum - isle.comparisonSum)
        const grade = runRecapGrade(delta)
        HTMLContent += `<td class='${grade.className}' style='text-align:left'><span>${savComparison != 'None' ? grade.grade : ''}</span></td>`
        HTMLContent += `<td class='${isle.className}' style='padding:0 5px'>${secondsToHMS(isle.sum, decimalsCriteria())}</td>`
        HTMLContent += `<td class='${deltaType ? redGreen(delta) : grade.className}' style='font-size:90%'><span>${savComparison != 'None' ? getDelta(delta) : ''}</span></td>`
        HTMLContent += `<td style='width:20px'></td>`
    }
    return HTMLContent
}