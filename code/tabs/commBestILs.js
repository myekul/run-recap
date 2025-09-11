function generateCommBestILs() {
    let HTMLContent = `<div class='container'><table><tr>`
    HTMLContent += `<td></td>`.repeat(6)
    categories.forEach(category => {
        HTMLContent += `<td class='${category.info.id}' style='width:36px'>${getImage(category.info.id)}</td>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `<tr>`
    HTMLContent += `<td></td>`.repeat(6)
    categories.forEach(category => {
        HTMLContent += `<th class='cuphead'>${secondsToHMS(category.runs[0].score)}</th>`
    })
    players.slice(0, 100).forEach((player, index) => {
        HTMLContent += `<tr class='${getRowColor(index)}'>`
        HTMLContent += bigPlayerDisplay(player)
        categories.forEach((category, index2) => {
            const run = player.runs[index2]
            if (run) {
                HTMLContent += `<td class='clickable'>${getAnchor(run.url)}${getTrophy(1)}<a></td>`
            } else {
                HTMLContent += `<td></td>`
            }
        })
    })
    HTMLContent += `</table></div>`
    document.getElementById('content').innerHTML = HTMLContent
}