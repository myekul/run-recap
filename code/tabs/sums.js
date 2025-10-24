function generateSums() {
    isles.forEach(isle => {
        isle.sum = 0
        isle.comparisonSum = 0
    })
    assignIsles()
    let sum = 0
    let comparisonSum = 0
    isles.forEach(isle => {
        isle.runRecapCategories.forEach(categoryIndex => {
            isle.comparisonSum += getComparisonTime(categoryIndex)
        })
        isle.comparisonSum = Math.floor(isle.comparisonSum)
        comparisonSum += isle.comparisonSum
    })
    let HTMLContent = ''
    HTMLContent += `<div class='container'><table>`
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
    commBestILsCategory.topRuns.forEach((run, index) => {
        sum = 0
        isles.forEach(isle => {
            isle.sum = 0
        })
        isles.forEach(isle => {
            isle.runRecapCategories.forEach(categoryIndex => {
                const bestTime = run[categoryIndex]
                isle.sum += bestTime != nullTime ? decimalsCriteria() ? bestTime : Math.floor(bestTime) : 0
            })
        })
        HTMLContent += `<tr class='hover ${getRowColor(index)}'>`
        HTMLContent += bigPlayerDisplay(players[index])
        isles.forEach((isle, isleIndex) => {
            sum += isle.sum
            HTMLContent += getIsleSum(isle, index, isleIndex)
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
    document.getElementById('content').innerHTML = HTMLContent
}
function getIsleSum(isle, index, isleIndex) {
    let HTMLContent = ''
    if (isle.sum) {
        const delta = Math.floor(isle.sum - isle.comparisonSum)
        const grade = runRecapGrade(delta)
        HTMLContent += `<td class='${grade.className}' style='text-align:left'>${savComparison != 'None' ? grade.grade : ''}</td>`
        HTMLContent += `<td class='${isle.className}' style='padding:0 5px'>${secondsToHMS(isle.sum, decimalsCriteria())}</td>`
        HTMLContent += `<td class='${deltaType ? redGreen(delta) : grade.className}' style='font-size:90%'>${savComparison != 'None' ? getDelta(delta) : ''}</td>`
        HTMLContent += commBestILsCategory.name == '1.1+' && isleIndex < 3 ? `<td style='color:gray;font-size:70%;padding:0 3px'>${commBestILsCategory.splits[index][isleIndex]}</td>` : `<td style='width:20px'></td>`
    }
    return HTMLContent
}