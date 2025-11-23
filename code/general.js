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
function getImage(image, heightParam) {
    const height = heightParam ? heightParam : 36
    const src = `https://myekul.com/shared-assets/cuphead/images/${image}.png`
    return `<img src='${src}' style='height:${height}px;width:auto'>`
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
        HTMLContent += `<td class='${grade.className}' style='font-size:75%;text-align:left'>${grade.grade}</td>`
        HTMLContent += `<td class='clickable ${commBestILsCategory.className} ${placeClass[player.extra.place]}' style='font-size:75%;padding:0 1px;'>${getAnchor('https://www.speedrun.com/cuphead/runs/' + player.extra.id)}${trophy ? `<div class='trophy'>${trophy}</div>` : player.extra.place}</td>`
        HTMLContent += `<td class='clickable ${commBestILsCategory.className} ${placeClass[player.extra.place]}' style='padding: 0 3px'>${getAnchor(player.extra.url)}${secondsToHMS(player.extra.score)}</a></td>`
    } else {
        HTMLContent += `<td colspan=3></td>`
    }
    HTMLContent += `<td>${getPlayerDisplay(player)}</td>`
    return HTMLContent
}
function generateBoardTitle(category = commBestILsCategory) {
    let HTMLContent = ''
    const shotSize = 30
    HTMLContent += boardTitleCell(category.className, category.name)
    HTMLContent += category.shot1 ? `<td id='commBestILsWeapons' class='container' style='margin:0;gap:4px;padding:0 3px'>` : ''
    HTMLContent += category.shot1 ? cupheadShot(category.shot1, shotSize) : ''
    HTMLContent += category.shot2 ? cupheadShot(category.shot2, shotSize) : ''
    HTMLContent += category.shot1 ? `</td>` : ''
    HTMLContent += category.subcat ? boardTitleCell('', category.subcat) : ''
    return boardTitleWrapper(HTMLContent)
}
function updateBoardTitle() {
    document.getElementById('boardTitle').innerHTML = generateBoardTitle()
}