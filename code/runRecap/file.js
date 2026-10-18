const fileInfo = {
    sav: `The easiest way to get started.
    When a Cuphead save file is created, all data is stored in a ${myekulColor('Cuphead .sav')}.
    Locate and upload this file to view your boss times!
    <br>
    <span class='dim'>
    You can either upload an existing .sav file from
    <span class="myekulColor clickable" style="text-decoration:underline" onclick="openModal(savInfo(),'INFO')">
    %appdata%</span>
    to automatically retrieve IL times,
    or create an empty file and insert IL times manually.
    </span>`,
    lss: `Upload your ${myekulColor('LiveSplit .lss')} splits file to view your attempt history,
    browse your top segments,
    compare against community best splits,
    and more.
    <br>
    <span class='dim'>
    To ensure file compatibility,
    please upload a .lss with the standard split configuration,
    as seen
    <span class="myekulColor clickable" style="text-decoration: underline">
    <a onclick="showTab('commBestSplits');playSound('category_select')">here</a></span>.</span>`,
    rrc: `A powerful new file type, ${myekulColor('Run Recap .rrc')}. Designed exclusively for the most detailed analysis of Cuphead runs.
    <br>
    <span class='dim'>
    This requires the
    <span class="myekulColor clickable" style="text-decoration: underline">
    ${getAnchor('https://github.com/SBDWolf/Run-Recap-Component')}Run Recap Component</a></span>
    memory reader developed by SBDWolf.
    </span>
    `
}
const fileOrigin = {
    sav: 'Cuphead',
    lss: 'LiveSplit',
    rrc: 'Run Recap'
};
const filePrice = {
    sav: 9,
    lss: 15,
    rrc: 24
};
function fileTitle(type, origin) {
    return `
    ${origin ? `<div class="container dim" style="font-size:80%">${fileOrigin[type]}</div>` : ''}
    <div class='font2 container' style='gap:5px;font-size:200%'>
        <img src='https://myekul.com/shared-assets/cuphead/images/extra/${type}.png'
            style='height:40px;filter: brightness(0) invert(1)'>
        .${type}
    </div>`
}
function fileInfoCard(type) {
    return `
    <div ${aprilFools ? `class='border background1'` : ''} style='width:330px;${aprilFools ? 'padding:12px;height:330px;margin-top:20px;position:relative' : ''}'>
        ${fileTitle(type, true)}
        ${aprilFools ? `<div class='container' style='font-size:200%;margin-top:10px'>$${filePrice[type]}<span style='font-size:50%;margin-bottom:8px'>.99</span>/mo</div>` : ''}
        <div class='fileType textBlock' style="margin-top:10px;font-size:90%">
        ${fileInfo[type]}
        ${aprilFools ? `<button class='button cuphead font2' style='position:absolute;bottom:24px;left:100px;font-size:170%;height:50px;width:150px;border-radius:40px' onclick="aprilFoolsReveal()">BUY NOW</button>` : ''}
        </div>
    </div>`
}
function emptyFile(type) {
    dropboxEligible = true
    return `
    <div class='container' style='gap:30px;margin-top:8px'>
        ${fileInfoCard(type)}
        ${!aprilFools ? `<div id='dropbox'></div>` : ''}
    </div>`
}