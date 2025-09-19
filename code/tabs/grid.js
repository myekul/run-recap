function generateGrid() {
    let HTMLContent = `<div class='container' style='overflow-x:auto'>`
    HTMLContent += `<table class='shadow'>`
    HTMLContent += `<tr><td colspan=6></td>`
    categories.forEach(category => {
        HTMLContent += `<td colspan=2 class='${category.info.id}'>${getImage(category.info.id)}</td>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `<tr><th colspan=6 style='text-align:right'>&Delta;</th>`
    categories.forEach((category, categoryIndex) => {
        HTMLContent += `<th colspan=2 class='cuphead'>${secondsToHMS(getComparisonTime(categoryIndex))}</th>`
    })
    HTMLContent += `</tr>`
    commBestILsCategory.runs.forEach((run, index) => {
        const player = players[index]
        HTMLContent += `<tr class='${getRowColor(index)} hover'>`
        HTMLContent += bigPlayerDisplay(player)
        categories.forEach((category, categoryIndex) => {
            const ILtime = run[categoryIndex]
            const comparisonTime = getComparisonTime(categoryIndex)
            const delta = runRecapDelta(ILtime, comparisonTime)
            const grade = runRecapGrade(delta)
            HTMLContent += `<td class='${grade.className}' style='font-size:70%;text-align:left'>${grade.grade}</td>`
            HTMLContent += `<td style='color:${ILtime == commBestILsCategory.topBest[categoryIndex] ? 'lightgray' : 'gray'}'>${secondsToHMS(ILtime)}</td>`
        })
        HTMLContent += `</tr>`
    })
    if (commBestILsCategory.numRuns > 3) {
        HTMLContent += `<tr><th colspan=6 style='text-align:right'>&Delta;</th>`
        categories.forEach((category, categoryIndex) => {
            HTMLContent += `<th colspan=2 class='cuphead'>${secondsToHMS(getComparisonTime(categoryIndex))}</th>`
        })
        HTMLContent += `</tr>`
        HTMLContent += `<tr><td colspan=6></td>`
        categories.forEach(category => {
            HTMLContent += `<td colspan=2 class='${category.info.id}'>${getImage(category.info.id)}</td>`
        })
        HTMLContent += `</tr>`
    }
    if (runRecap_savFile) {
        HTMLContent += `<tr><th colspan=6 style='text-align:right'>Your run</th>`
        categories.forEach((category, categoryIndex) => {
            let ILtime = getCupheadLevel(categoryIndex)?.bestTime
            if (ILtime == nullTime) ILtime = NaN
            const comparisonTime = getComparisonTime(categoryIndex)
            const delta = runRecapDelta(ILtime, comparisonTime)
            const grade = runRecapGrade(delta)
            HTMLContent += `<td class='${grade.className}' style='font-size:70%;text-align:left'>${grade.grade}</td>`
            HTMLContent += `<td class='${category.info.id}'>${ILtime ? secondsToHMS(ILtime) : ILtime}</td>`
        })
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table>`
    HTMLContent += `</div>`
    document.getElementById('content').innerHTML = HTMLContent
}