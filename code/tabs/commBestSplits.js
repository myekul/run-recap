function generateCommBestSplits() {
    const cardinality = splitBefore ? 'before' : 'after'
    let HTMLContent = ''
    HTMLContent += horiztonalCategories()
    if (commBest[runRecapCategory.tabName]) {
        HTMLContent += splitBeforeAfter()
        if (commBest[runRecapCategory.tabName][cardinality]) {
            HTMLContent += `
            <div>
                <div class='container' style='gap:30px'>
                    <table class='shadow'>
                        <tr>
                            <th class='dim'>WR</th>
                            <th colspan=5 class='gray'>Comm Best Splits</th>
                        </tr>`
            splitInfo.forEach((split, index) => {
                const thisSplit = commBest[runRecapCategory.tabName][cardinality][index]
                const playerName = thisSplit.splitRunner
                const player = allPlayers.find(player => player.name == playerName) || playerName
                const wrSplit = runRecapCategory.topRuns[0][splitBefore ? 'splitBefore' : 'splitAfter'][index]
                const url = commBest[runRecapCategory.tabName][cardinality][index].splitURL
                HTMLContent += `
                <tr class='${getRowColor(index)} ${url ? 'grow' : ''}' ${url ? `onclick="window.open('${url}', '_blank')"` : ''}>
                    <td class='dim' style='font-size:70%'>${wrSplit ? secondsToHMS(wrSplit, true) : ''}</td>
                    <td class='container ${split.id}'>${getImage(split.id, 24)}</td>
                    <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(convertToSeconds(thisSplit.split), true)}</td>
                    <td style='color:gray;padding:0 3px'>${url ? fontAwesome('video-camera') : ''}</td>
                    <td>${getPlayerDisplay(player)}</td>
                </tr>`
                const nextIsle = splitInfo[index + 1]?.isle
                if (nextIsle != split.isle) HTMLContent += `<tr style='height:16px'></tr>`
            })
            HTMLContent += `</table>`
            // Segments
            HTMLContent += `
            <table class='shadow'>
                <tr>
                    <th class='dim'>WR</th>
                    <th colspan=5 class='gray'>Comm Best Segments</th>
                </tr>`
            let sum = 0
            splitInfo.forEach((split, index) => {
                const thisSplit = commBest[runRecapCategory.tabName][cardinality][index]
                const playerName = thisSplit.segmentRunner
                const player = allPlayers.find(player => player.name == playerName) || playerName
                const bestSegment = convertToSeconds(thisSplit.segment)
                const wrSegment = runRecapCategory.topRuns[0][splitBefore ? 'segmentBefore' : 'segmentAfter'][index]
                const url = commBest[runRecapCategory.tabName][cardinality][index].segmentURL
                sum += bestSegment
                HTMLContent += `
                <tr class='${getRowColor(index)} ${url ? 'grow' : ''}' ${url ? `onclick="window.open('${url}', '_blank')"` : ''}>
                    <td class='dim' style='font-size:70%'>${wrSegment ? secondsToHMS(wrSegment, true) : ''}</td>
                    <td class='container ${split.id}'>${getImage(split.id, 24)}</td>
                    <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(bestSegment, true)}</td>
                    <td style='color:gray;padding:0 3px'>${url ? fontAwesome('video-camera') : ''}</td>
                    <td>${getPlayerDisplay(player ? player : playerName)}</td>
                </tr>`
                const nextIsle = splitInfo[index + 1]?.isle
                if (nextIsle != split.isle) {
                    const content = index > 0 ? secondsToHMS(sum, true) : ''
                    HTMLContent += `<tr style='height:16px'><td></td><td></td><td class='dim' style='font-size:70%'>${content}</td></tr>`
                }
            })
            HTMLContent += `
                    </table>
                </div>
            </div>
            <div class='container' style='margin-top:20px'>
                <button class='button cuphead' style='width:180px' onclick="processSavFile(0,true);playSound('ready')">View WR Run Recap</button>
            </div>`
        } else {
            HTMLContent += emptyPageText('No submissions for Split ' + (splitBefore ? 'Before' : 'After') + '...')
        }
    } else {
        HTMLContent += emptyPageText('Category not supported!')
    }
    document.getElementById('content').innerHTML = HTMLContent
    buttonShots()
}
function splitBeforeAfter() {
    return `
        <div class='container' style='gap:10px;margin:15px 0'>
            <div ${splitBefore ? '' : 'class="dim"'}>Split Before</div>
            <button class='dim grow' style='font-size:130%' onclick="splitBeforeAfterHelper()">${fontAwesome('toggle-' + (splitBefore ? 'off' : 'on'))}</button>
            <div ${!splitBefore ? '' : 'class="dim"'}>Split After</div>
        </div>`
}
function splitBeforeAfterHelper() {
    splitBefore = !splitBefore
    toast(splitBefore ? 'Split Before (Old Timing)' : 'Split After')
    playSound('move')
    if (globalTab == 'lss' && runRecapExample) lssExample(lssPlayerIndex)
    action()
}