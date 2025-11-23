function generateCommBestSplits() {
    let HTMLContent = ''
    if (commBestILsCategory.markin) {
        HTMLContent += `<div>`
        HTMLContent += `<div class='container' style='padding-bottom:10px;gap:10px'>
        <div class='button cuphead' style='width:180px' onclick="processSavFile(0,true);playSound('ready')">View WR Run Recap</div>
        <div class='grow'><a href="https://docs.google.com/spreadsheets/d/1JgTjjonfC7bh4976NI4pCPeFp8LbA3HMKdvS_47-WtQ" target="_blank"><img src='${sharedAssetsURL('sheets')}' style='height:25px'></a></div>
        </div>
        <div class='container' style='gap:30px'>
        <table>
        <tr>
        <th style='color:var(--gray)'>WR</th>
        <th colspan=5 class='gray'>Comm Best Splits</th>
        </tr>`
        splitInfo.forEach((split, index) => {
            const playerName = runRecap_markin.bestSplitsPlayers[index].split('/')[0]
            const player = players.find(player => player.name == playerName) || playerName
            const wrSplit = runRecap_markin.wrSplits[index]
            const url = runRecap_markin.bestSplitsURLs[index]
            HTMLContent += `<tr class='${getRowColor(index)} ${url ? 'clickable' : ''}' ${url ? `onclick="window.open('${url}', '_blank')"` : ''}>
            <td style='font-size:70%;color:var(--gray)'>${secondsToHMS(wrSplit, true)}</td>
            <td class='container ${split.id}'>${getImage(split.id, 24)}</td>
            <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(runRecap_markin.bestSplits[index], true)}</td>
            <td style='color:gray;padding:0 3px'>${url ? fontAwesome('video-camera') : ''}</td>
            <td>${getPlayerDisplay(player)}</td>
            </tr>`
            const nextIsle = splitInfo[index + 1]?.isle
            if (nextIsle != split.isle) HTMLContent += `<tr style='height:16px'></tr>`
        })
        HTMLContent += `</table>`
        // Segments
        HTMLContent += `
        <table>
        <tr>
        <th style='color:var(--gray)'>WR</th>
        <th colspan=5 class='gray'>Comm Best Segments</th>
        </tr>`
        let sum = 0
        splitInfo.forEach((split, index) => {
            const playerName = runRecap_markin.bestSegmentsPlayers[index].split('/')[0]
            const player = players.find(player => player.name == playerName) || playerName
            const bestSegment = runRecap_markin.bestSegments[index]
            const wrSegment = runRecap_markin.wrSegments[index]
            const url = runRecap_markin.bestSegmentsURLs[index]
            sum += bestSegment
            HTMLContent += `<tr class='${getRowColor(index)} ${url ? 'clickable' : ''}' ${url ? `onclick="window.open('${url}', '_blank')"` : ''}>
            <td style='font-size:70%;color:var(--gray)'>${secondsToHMS(wrSegment, true)}</td>
            <td class='container ${split.id}'>${getImage(split.id, 24)}</td>
            <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(bestSegment, true)}</td>
            <td style='color:gray;padding:0 3px'>${url ? fontAwesome('video-camera') : ''}</td>
            <td>${getPlayerDisplay(player ? player : playerName)}</td>
            </tr>`
            const nextIsle = splitInfo[index + 1]?.isle
            if (nextIsle != split.isle) {
                const content = index > 0 ? secondsToHMS(sum, true) : ''
                HTMLContent += `<tr style='height:16px'><td></td><td></td><td style='font-size:70%;color:var(--gray)'>${content}</td></tr>`
            }
        })
        HTMLContent += `
        </table>
        </div>
        </div>`
    } else {
        HTMLContent += `<div class='container'>Category not supported!</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
}