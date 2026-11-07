function generateVanillaILs() {
    let HTMLContent = ''
    if (commBest[runRecapCategory.tabName]) {
        HTMLContent += `<table class='shadow' style='margin:0 auto'>`
        categoryLevels.forEach((level, levelIndex) => {
            const IL = vanilla[runRecapCategory.tabName] ? vanilla[runRecapCategory.tabName][level.info.id] : null
            if (IL) {
                HTMLContent += `
                <tr class='clickable ${getRowColor(levelIndex)}' onclick="window.open('${IL.url}', '_blank')">
                    <td class='${level.info.id}'><div class='container'>${getImage(level.info.id, 21)}</div></td>
                    <td class='${level.info.id}' style='padding:0 3px'>${IL.time}</td>
                    <td>${getPlayerDisplay(allPlayers.find(player => player.name == IL.player) || IL.player, true)}</td>
                    <td style='position:relative' class='${IL.copy ? allCategories[IL.copy]?.className ?? 'gray' : ''}'></td>
                </tr>`
            } else {
                HTMLContent += `
                <tr class='${getRowColor(levelIndex)}'>
                    <td class='${level.info.id}'><div class='container'>${getImage(level.info.id, 21)}</div></td>
                    <td class='${level.info.id}'></td>
                    <td></td>
                </tr>`
            }
        })
    } else {
        HTMLContent += emptyPageText('Category not supported!')
    }
    document.getElementById('content').innerHTML = HTMLContent
}