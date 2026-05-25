function generateLeaderboards() {
    let HTMLContent = ''
    if (runRecapCategory.name != 'Other') {
        const runs = runRecapCategory.runs.slice(0, 10)
        const newRuns = []
        runs.forEach((run, index) => {
            newRuns.push({ run: run, playerIndex: index, categoryIndex: runRecapCategory.category })
        })
        HTMLContent += `
        ${horiztonalCategories()}
        <div class='container' style='align-items:flex-start;margin-top:45px'>
            <div style='width:450px'>
                <table class='shadow'>`
        const newPlayers = players.filter(player => player.extra).slice(0, 100)
        newPlayers.forEach((player, index) => {
            HTMLContent += `
            <tr class='${getRowColor(index)}'>
                <td class='dim' style='font-size:80%;padding:0 3px;white-space:nowrap'>${player.extra.date}</td>
                ${bigPlayerDisplay(player)}
                <td>${player.extra.comment ? `<div class='grow dim' onclick="runModal('${player.name}')">${fontAwesome('commenting-o')}</div>` : ''}</td>
                <td>${index < runRecapCategory.topRuns.length ? `<img src='images/rrc.png' class='container grow' style='height:18px' onclick="processSavFile(${index}),playSound('ready')">` : ''}</td>
            </tr>`
        })
        HTMLContent += `
                </table>
            </div>
            <div style='width:750px'>${podium(newRuns)}</div>
        </div>`
        HTMLContent += ``
        HTMLContent += ``
    } else {
        HTMLContent += emptyPageText('Category not supported!')
    }
    document.getElementById('content').innerHTML = HTMLContent
    buttonShots()
}
function fancyRun(run) {
    return fancyDate(run) + fancyTime(run) + fancyThumbnail(run)
}
function fancyTime(run) {
    const trophy = getTrophy(run.place)
    return `
    <td style='padding:0 5px'>
        <div class='container' ${trophy ? `style='gap:5px'` : ''}>
            <div>${trophy}</div>
            <div class='${runRecapCategory.className}' style='font-size:140%;border-radius:5px;padding:0 4px'>${secondsToHMS(run.score)}</div>
        </div>
        <div style='font-size:80%;padding-top:4px'>${scoreGradeSpan(run.percentage)}</div>
    </td>`
}
let sortCategoryIndex
function horiztonalCategories() {
    functionName = `playSound('category_select');changeCategory`
    return `
    <div class="container categorySelect background1 shadow" style='width:700px;border-radius:25px;padding:8px'>
        <button id='onePointOneButton' onclick="${functionName}('1.1+',true)" class="button onePointOne ${runRecapCategory.tabName == '1.1+' ? 'selected' : ''}">1.1+</button>
        <button id='legacyButton' onclick="${functionName}('Legacy',true)" class="button legacy ${runRecapCategory.tabName == 'Legacy' ? 'selected' : ''}">Legacy</button>
        <button id='nmgButton' onclick="${functionName}('NMG',true)" class="button nmg ${runRecapCategory.tabName == 'NMG' ? 'selected' : ''}">NMG</button>
        <button id='dlcButton' class="dlc button ${runRecapCategory.name == 'DLC' ? 'selected' : ''}" onclick="${functionName}('DLC',true)">DLC</button>
        <button id='dlclsButton' class="dlc lobber button ${runRecapCategory.tabName == 'DLC L/S' ? 'selected' : ''}" onclick="${functionName}('DLC L/S',true)"></button>
        <button id='dlccsButton' class="dlc charge button ${runRecapCategory.tabName == 'DLC C/S' ? 'selected' : ''}" onclick="${functionName}('DLC C/S',true)"></button>
        <button id='dlcbaseButton' class="dlcbase button ${runRecapCategory.name == 'DLC+Base' ? 'selected' : ''}" onclick="${functionName}('DLC+Base',true)">DLC+Base</button>
        <button id='dlcbaselsButton' class="dlcbase lobber button ${runRecapCategory.tabName == 'DLC+Base L/S' ? 'selected' : ''}" onclick="${functionName}('DLC+Base L/S',true)"></button>
        <button id='dlcbasecsButton' class="dlcbase charge button ${runRecapCategory.tabName == 'DLC+Base C/S' ? 'selected' : ''}" onclick="${functionName}('DLC+Base C/S',true)"></button>
    </div>`
}