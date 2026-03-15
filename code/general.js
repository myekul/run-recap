function secondsToHMS(seconds, exception, raw) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    let HTMLContent = ''
    if (hours > 0) {
        HTMLContent = `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
        HTMLContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    if (exception) HTMLContent += displayDecimals(seconds, raw)
    return HTMLContent
}
function displayDecimals(value, raw) {
    let msString = value.toString().split('.')[1] || '';
    msString = msString.padEnd(3, '0').slice(0, 2);
    if (parseInt(msString)) {
        return raw ? '.' + msString : `.<span style='font-size:75%'>${msString}</span>`;
    }
    return '';
}
function convertToSeconds(time) {
    if (time?.toString().includes(":")) {
        const [minutes, seconds] = time.split(":").map(Number);
        return minutes * 60 + seconds;
    } else {
        return Number(time);
    }
}
function getImage(image, height = 36) {
    return `<img src='https://myekul.com/shared-assets/cuphead/images/${image}.png' style='height:${height}px;width:auto'>`
}
function getTrophy(place) {
    let placeText = ''
    if (place == 1) {
        placeText = '1st'
    } else if (place == 2) {
        placeText = '2nd'
    } else if (place == 3) {
        placeText = '3rd'
    } else {
        return ''
    }
    if (place) {
        return `<img src='images/${place}.png' title='${placeText}' style='height:14px'>`
    }
    return ''
}
function getPlayerDisplay(player, exception) {
    let HTMLContent = `
    <div class='container' style='justify-content:left;gap:4px;text-align:left;font-weight: bold;font-size:80%;padding:0 3px'>`
    HTMLContent += ['commBestSplits'].includes(globalTab) || exception ? '' : `<div style='width:18px'>${getPlayerFlag(player, 12)}</div>`
    HTMLContent += `${getPlayerIcon(player, 21)}`
    HTMLContent += `${getPlayerName(player)}`
    HTMLContent += `</div>`
    return HTMLContent
}
function bigPlayerDisplay(player) {
    let HTMLContent = ''
    if (player.extra) {
        const grade = getLetterGrade(player.extra.percentage)
        const trophy = getTrophy(player.extra.place)
        HTMLContent += `<td class='${grade.className}' style='font-size:75%;text-align:left'><span>${grade.grade}</span></td>`
        HTMLContent += `<td class='clickable ${runRecapCategory.className} ${placeClass[player.extra.place]}' style='font-size:75%;padding:0 1px;'>${getAnchor('https://www.speedrun.com/cuphead/runs/' + player.extra.id)}${trophy ? `<div class='trophy'>${trophy}</div>` : player.extra.place}</td>`
        HTMLContent += `<td class='clickable ${runRecapCategory.className} ${placeClass[player.extra.place]}' style='padding: 0 3px'>${getAnchor(player.extra.url)}${secondsToHMS(player.extra.score)}</a></td>`
    } else {
        HTMLContent += `<td colspan=3></td>`
    }
    HTMLContent += `<td>${getPlayerDisplay(player)}</td>`
    return HTMLContent
}
function generateBoardTitle(category = runRecapCategory) {
    let HTMLContent = ''
    const shotSize = 30
    HTMLContent += boardTitleCell(category.className, category.name)
    HTMLContent += category.shot1 ? `<td id='commBestILsWeapons' class='container' style='margin:0;gap:4px;padding:0 3px'>` : ''
    HTMLContent += category.shot1 ? cupheadShot(category.shot1, shotSize) : ''
    HTMLContent += category.shot2 ? cupheadShot(category.shot2, shotSize) : ''
    HTMLContent += category.shot1 ? `</td>` : ''
    HTMLContent += category.subcat ? boardTitleCell('', category.subcat) : ''
    HTMLContent += category.name == 'Other' ? boardTitleCell('', altStratOther) : ''
    return boardTitleWrapper(HTMLContent)
}
function updateBoardTitle() {
    document.getElementById('boardTitle').innerHTML = generateBoardTitle()
}
function normalizeTime(time, min, max) {
    return (time - min) / (max - min);
}
function getColor(normalized) {
    let r, g;
    if (normalized < 0.5) {
        r = Math.round(255 * (normalized * 2))
        g = 255;
    } else {
        r = 255;
        g = Math.round(255 * (1 - (normalized - 0.5) * 2))
    }
    return `rgb(${r},${g},0)`;
}
function normalizedColorCell(num, min, max) {
    return `<td style='width:5px;background-color:${getColor(normalizeTime(num, min, max))}'></td>`
}
function categorySelect(database) {
    let functionName = ""
    functionName += database ? 'databaseCategorySwitch' : `playSound('category_select');changeCategory`
    return `<div class="categorySelect">
                <div class="container">
                    <button id='onePointOneButton' onclick="${functionName}('1.1+',true)" class="button onePointOne">1.1+</button>
                </div>
                <div class="container">
                    <button id='legacyButton' onclick="${functionName}('Legacy',true)" class="button legacy">Legacy</button>
                </div>
                <div class="container">
                    <button id='nmgButton' onclick="${functionName}('NMG',true)" class="button nmg">NMG</button>
                </div>
                <div class="container">
                    <button id='dlcButton' class="dlc button" onclick="${functionName}('DLC',true)">DLC</button>
                    <button id='dlclsButton' class="dlc lobber button" onclick="${functionName}('DLC L/S',true)"></button>
                    <button id='dlccsButton' class="dlc charge button" onclick="${functionName}('DLC C/S',true)"></button>
                </div>
                <div class="container">
                    <button id='dlcbaseButton' class="dlcbase button" onclick="${functionName}('DLC+Base',true)">DLC+Base</button>
                    <button id='dlcbaselsButton' class="dlcbase lobber button" onclick="${functionName}('DLC+Base L/S',true)"></button>
                    <button id='dlcbasecsButton' class="dlcbase charge button" onclick="${functionName}('DLC+Base C/S',true)"></button>
                </div>
                <div class="container">
                    <button id='grayButton' onclick="${functionName}('Other',true)" class="button gray" style='width:80px;height:20px;font-size:80%;margin-left:13px'>Other</button>
                </div>
            </div>`
}
function databaseCategorySwitch(category) {
    databaseCategory = category
    openDatabase(databaseType, null, true)
}
function emptyPageText(text) {
    return `<div class='container' style='margin-top:20px'>${text}</div>`
}