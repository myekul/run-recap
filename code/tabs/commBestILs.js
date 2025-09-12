function generateCommBestILs() {
    let HTMLContent = `<div class='container'><table><tr>`
    HTMLContent += `<td colspan=6></td>`
    categories.forEach(category => {
        HTMLContent += `<td class='${category.info.id}' style='width:36px'>${getImage(category.info.id)}</td>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `<tr>`
    HTMLContent += `<td colspan=6></td>`
    categories.forEach(category => {
        HTMLContent += `<th class='cuphead'>${secondsToHMS(category.runs[0].score)}</th>`
    })
    players.slice(0, 100).forEach((player, index) => {
        HTMLContent += `<tr class='${getRowColor(index)}'>`
        HTMLContent += bigPlayerDisplay(player)
        categories.forEach((category, index2) => {
            const run = player.runs[index2]
            if (run) {
                const debug = run.debug ? '*' : ''
                HTMLContent += `<td class='clickable'>${getAnchor(run.url)}${getTrophy(1)}${debug}<a></td>`
            } else {
                HTMLContent += `<td></td>`
            }
        })
    })
    HTMLContent += `</table></div>`
    document.getElementById('content').innerHTML = HTMLContent
}
// if (['DLC', 'DLC+Base'].includes(commBestILsCategory.tabName) && !commBestILsCategory.extraPlayers) {
//     if (player.extra?.percentage >= 90) {
//         HTMLContent += `<td>${cupheadShot(determineShot1(player), 20, true)}</td>`
//         HTMLContent += `<td>${cupheadShot('spread', 20, true)}</td>`
//     } else {
//         HTMLContent += `<td></td><td></td>`
//     }
// }
// function determineShot1(player, categoryName) {
//     const category = categoryName ? categoryName : commBestILsCategory.name
//     if (commBestILs[category + ' L/S'].extraPlayers?.includes(player.name)) {
//         return 'lobber'
//     } else if (commBestILs[category + ' C/S'].extraPlayers?.includes(player.name)) {
//         return 'charge'
//     }
// }