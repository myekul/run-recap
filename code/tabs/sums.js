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
    HTMLContent += `<tr style='color:gray'><td colspan=6></td>`
    isles.forEach(isle => {
        if (isle.runRecapCategories.length > 0) {
            HTMLContent += `<th colspan=3 class='${isle.className}'>${isle.name}</th>`
            HTMLContent += `<td></td>`
        }
    })
    HTMLContent += `
    <th>TOTAL</th>
    <td></td>
    <td style='width:20px'></td>
    <th>Residual</th>
    </tr>`
    commBestILsCategory.runs.forEach((run, index) => {
        sum = 0
        isles.forEach(isle => {
            isle.sum = 0
        })
        isles.forEach(isle => {
            isle.runRecapCategories.forEach(categoryIndex => {
                const bestTime = run[categoryIndex]
                isle.sum += bestTime != nullTime ? Math.floor(bestTime) : 0
            })
        })
        HTMLContent += `<tr class='${getRowColor(index)}'>`
        HTMLContent += bigPlayerDisplay(players[index])
        isles.forEach(isle => {
            sum += isle.sum
            HTMLContent += getIsleSum(isle)
        })
        const delta = sum - comparisonSum
        HTMLContent += `
        <td>${secondsToHMS(sum)}</td>
        <td class='${redGreen(delta)}'>${savComparison != 'None' ? getDelta(delta) : ''}</td>
        <td></td>
        <td>${secondsToHMS(players[index].extra.score - sum)}</td>`
        HTMLContent += `</tr>`
    })
    HTMLContent += `<tr style='color:gray'><th colspan=6 style='text-align:right'>&Delta;</th>`
    isles.forEach(isle => {
        if (isle.runRecapCategories.length > 0) {
            HTMLContent += `<th colspan=3>${secondsToHMS(isle.comparisonSum)}</th>`
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
                isle.sum += bestTime != nullTime ? Math.floor(bestTime) : 0
            })
        })
        HTMLContent += `<tr><th colspan=6 style='text-align:right'>Your run</th>`
        isles.forEach(isle => {
            sum += isle.sum
            HTMLContent += getIsleSum(isle)
        })
        if (getCupheadLevel(categories.length - 1).completed) {
            const delta = sum - comparisonSum
            HTMLContent += `
            <td>${secondsToHMS(sum)}</td>
            <td class='${redGreen(delta)}'>${savComparison != 'None' ? getDelta(delta) : ''}</td>
            <td></td>`
            if (runRecapTime != 'XX:XX') HTMLContent += `<td>${secondsToHMS(convertToSeconds(runRecapTime) - sum)}</td>`
        }
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table></div>`
    if (runRecap_savFile && !runRecapExample && runRecapTime == 'XX:XX' && getCupheadLevel(categories.length - 1).completed) {
        HTMLContent += `<div class='container' style='margin-top:10px'>Insert your run time in XX:XX above!</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
}
function getIsleSum(isle) {
    let HTMLContent = ''
    if (isle.sum) {
        const delta = isle.sum - isle.comparisonSum
        const grade = runRecapGrade(delta)
        HTMLContent += `<td class='${grade.className}' style='text-align:left'>${savComparison != 'None' ? grade.grade : ''}</td>`
        HTMLContent += `<td class='${isle.className}' style='padding:0 5px'>${secondsToHMS(isle.sum)}</td>`
        HTMLContent += `<td class='${deltaType ? redGreen(delta) : grade.className}' style='font-size:90%'>${savComparison != 'None' ? getDelta(delta) : ''}</td>`
        HTMLContent += `<td style='width:20px'></td>`
    }
    return HTMLContent
}