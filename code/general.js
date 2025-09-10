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
    if (time.includes(":")) {
        const [minutes, seconds] = time.split(":").map(Number);
        return minutes * 60 + seconds;
    } else {
        return Number(time);
    }
}
function getImage(image, heightParam) {
    const height = heightParam ? heightParam : 36
    const src = `https://myekul.github.io/shared-assets/cuphead/images/${image}.png`
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
function getPlayerDisplay(player) {
    let HTMLContent = ''
    HTMLContent += globalTab != 'commBestSplits' ? `<td>${getPlayerFlag(player, 12)}</td>` : ''
    HTMLContent += `<td>${getPlayerIcon(player, 18)}</td>`
    HTMLContent += `<td style='text-align:left;font-weight: bold;font-size:80%;padding-right:5px'>${getPlayerName(player)}</td>`
    return HTMLContent
}