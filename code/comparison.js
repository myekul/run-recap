function savComparisonContent() {
    const savComparisonInfo = {
        'Top Average': `Average of top ${runRecapCategory.topRuns.length} players' boss times in their PBs`,
        'Top 3 Average': "Average of top 3 players' boss times in their PBs",
        'Top Bests': "Best of top players' boss times in their PBs",
        'Theory Run': "Top 3 players' PB boss times averaged with Run Viable ILs",
        'Run Viable ILs': "Community best ILs with run viable strategies",
        'TAS': "Tool-Assisted Speedrun (by SBDWolf)"
    }
    let HTMLContent = `<div class='container' style='gap:10px'><div style='width:250px'>`;
    // ['None', 'Top 10 Average', 'Top 3 Average', 'Top Bests', 'Theory Run', 'Run Viable ILs', 'TAS'].forEach((option, index) => {
    ['Top Average', 'Top 3 Average', 'Top Bests', 'Theory Run', 'Run Viable ILs', 'TAS'].forEach((option, index) => {
        if (!(!['1.1+'].includes(runRecapCategory.name) && ['TAS'].includes(option))) {
            HTMLContent += `
        <div class='grow ${getRowColor(index)} ${savComparison == option ? 'cuphead' : ''}' style='padding:8px 6px' onclick="changeComparison('sav','${option}');action()">
            <div>${option}</div>
            <div style='color:gray;font-size:70%;'>${savComparisonInfo[option] || ''}</div>
        </div>`
        }
    })
    HTMLContent += `</div>`
    HTMLContent += runRecapExamples('sav')
    HTMLContent += `</div>`
    return HTMLContent
}
function rrcComparisonContent() {
    const rrcComparisonInfo = {
        // 'Top Average': `Average of top ${runRecapCategory.topRuns.length} players' segment times in their PBs`,
        // 'Top 3 Average': "Average of top 3 players' segment times in their PBs",
        'Top Bests': "Best of top players' segment times in their PBs"
    }
    let HTMLContent = `<div class='container' style='gap:10px'><div style='width:250px'>`;
    ['None', 'Top Bests'].forEach((option, index) => {
        HTMLContent += `
        <div class='grow ${getRowColor(index)} ${rrcComparison == option ? 'cuphead' : ''}' style='padding:8px 6px' onclick="changeComparison('rrc','${option}');action()">
            <div>${option}</div>
            <div style='color:gray;font-size:70%;'>${rrcComparisonInfo[option] || ''}</div>
        </div>`
    })
    HTMLContent += `</div>`
    HTMLContent += runRecapExamples('rrc')
    HTMLContent += `</div>`
    return HTMLContent
}
function changeComparison(type, comparison, custom) {
    let HTMLContent = custom || comparison
    if (type == 'sav') {
        deltaType = custom
        document.getElementById('savComparison').innerText = HTMLContent
        savComparison = comparison
    }
    if (type == 'rrc') {
        rrcComparison = comparison
        rrcComparisonText = HTMLContent
    }
    closeModal(true)
    playSound('cardflip')
}
function runRecapExamples(type) {
    let HTMLContent = `<div><table>`
    players.slice(0, runRecapCategory.topRuns.length).forEach((player, playerIndex) => {
        if (player.extra) {
            const comparison = type == 'sav' ? savComparison : rrcComparison
            const onclick = type ? `playerComparison('${type}',${playerIndex},'${player.name} - ${secondsToHMS(player.extra.score)}')` : `processSavFile(${playerIndex});playSound('ready')`
            HTMLContent += `<tr class='${comparison == 'Player ' + playerIndex ? 'cuphead' : ''} ${getRowColor(playerIndex)} grow' onclick="${onclick}">`
            HTMLContent += `<td style='font-size:70%'>${getTrophy(playerIndex + 1) || playerIndex + 1}</td>`
            HTMLContent += `<td class='${placeClass[playerIndex + 1]}' style='padding:0 4px'>${secondsToHMS(player.extra.score)}</td>`
            HTMLContent += `<td class='container' style='justify-content:left'>${playerDisplay(player.name)}</td>`
            HTMLContent += `</tr>`
        }
    })
    HTMLContent += `</table>`
    if (type == 'sav') {
        HTMLContent += `
    <div class='container' style='margin-top:10px'>
        <div class='button cuphead' style='gap:5px;width:170px' onclick="savDatabase('${type}')">
            ${fontAwesome('cloud')}
            Browse database
        </div>
    </div>`
    }
    HTMLContent += `</div>`
    return HTMLContent
}
function playerComparison(type, playerIndex, custom) {
    changeComparison(type, 'Player ' + playerIndex, custom)
    action()
}