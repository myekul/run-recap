function generateVanillaILs() {
    let HTMLContent = ''
    if (commBest[runRecapCategory.tabName]) {
        HTMLContent += `<table class='shadow' style='margin:0 auto'>`
        categories.forEach((category, categoryIndex) => {
            let run
            if (vanilla[runRecapCategory.tabName]) run = vanilla[runRecapCategory.tabName][category.info.id]
            if (run) {
                HTMLContent += `
                <tr class='clickable ${getRowColor(categoryIndex)}' onclick="window.open('${run.url}', '_blank')">
                    <td class='${category.info.id}'><div class='container'>${getImage(category.info.id, 21)}</div></td>
                    <td class='${category.info.id}' style='padding:0 3px'>${run.time}</td>
                    <td>${getPlayerDisplay(allPlayers.find(player => player.name == run.player) || run.player, true)}</td>
                    <td style='position:relative' class='${run.copy ? allCategories[run.copy]?.className ?? 'gray' : ''}'></td>
                </tr>`
            } else {
                HTMLContent += `
                <tr class='${getRowColor(categoryIndex)}'>
                    <td class='${category.info.id}'><div class='container'>${getImage(category.info.id, 21)}</div></td>
                    <td class='${category.info.id}'></td>
                    <td></td>
                </tr>`
            }
        })
    } else {
        HTMLContent += emptyPageText('Category not supported!')
    }
    document.getElementById('content').innerHTML = HTMLContent
}