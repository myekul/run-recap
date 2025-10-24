function generateResidual() {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='gap:30px'>`
    HTMLContent += `<div class='textBlock' style='width:420px'>
    When you subtract your ${myekulColor('boss IL sum')} from your ${myekulColor('total run time')},
    you get your ${myekulColor('Residual')} timeloss.
    Your ${myekulColor('Residual')} is the time spent everywhere outside of boss fights.
    This includes:
    <div class='container' style='gap:20px'>
        <div>
            <br>-${myekulColor("Run 'n Guns")}*
            <br>-${myekulColor("Mausoleums")}*
            <br>-Scorecards
            <br>-Map movement
            <br>-Cutscenes
            <br>-NPC dialogue
        </div>
        <div>
            <br>-Tutorials
            <br>-Pause buffers
            <br>-Parry lag
            <br>-Nuke startup
            <br>-Super Art startup
        </div>
    </div>
    <br>Comparing your ${myekulColor('Residual')}
    to other runners can inform you about potential timelosses and opportunities to save time outside of boss fights.**
    </div>`
    HTMLContent += `<div>`
    HTMLContent += `<table>
    <tr>
    <th colspan=4></th>
    <th style='color:gray;padding:0 10px'>IGT Sum</th>
    <th class='gray' style='padding:0 10px'>Residual</th>
    </tr>`
    commBestILsCategory.topRuns.forEach((run, index) => {
        let sum = 0
        run.forEach(time => {
            sum += time
        })
        HTMLContent += `
        <tr class='${getRowColor(index)}'>
        ${bigPlayerDisplay(players[index])}
        <td style='color:gray;font-size:80%'>${secondsToHMS(sum, commBestILsCategory.name == '1.1+')}</td>
        <td>${secondsToHMS(Math.floor(globalCategory.runs[index].score) - sum, commBestILsCategory.name == '1.1+')}</td>
        </tr>`
    })
    HTMLContent += `</table>`
    if (runRecap_savFile) {
        let residual = '???'
        let sum = 0
        if (getCupheadLevel(categories.length - 1).completed) {
            categories.forEach((category, categoryIndex) => {
                const time = commBestILsCategory.name == '1.1+' ? getCupheadLevel(categoryIndex).bestTime : Math.floor(getCupheadLevel(categoryIndex).bestTime)
                sum += time
            })
            if (runRecapTime != 'XX:XX') {
                residual = secondsToHMS(convertToSeconds(runRecapTime) - sum, commBestILsCategory.name == '1.1+')
            }
        }
        HTMLContent += `<div class='container' style='margin-top:30px;gap:10px'>
    <div>Your run:</div>
    <table>
    <tr>
    <th style='color:gray'>IGT Sum</th>
    <th class='gray'>Residual</th>
    </tr>
    <tr>
    <td class='background2' style='color:gray;padding:0 10px'>${secondsToHMS(sum, commBestILsCategory.name == '1.1+')}</td>
    <td class='background2' style='font-size:150%'>${residual}</td>
    </tr>
    </table>
    </div>`
        if (!runRecapExample && runRecapTime == 'XX:XX' && getCupheadLevel(categories.length - 1).completed) {
            HTMLContent += `<div class='container' style='margin-top:10px;gap:8px'>
        <div class='myekulColor'>${fontAwesome('exclamation-triangle')}</div>
        <div>Insert your run time in XX:XX above!</div>
        </div>`
        }
    }
    HTMLContent += `</div>`
    HTMLContent += `</div>`
    HTMLContent += `<div class='container'>
    <div style='width:680px;margin-top:20px'>
    *<span style='color:gray;font-size:70%'>
    The Cuphead .sav contains IL information for Run 'n Guns and Mausoleum 1,
    but I've decided to exclude them from the default IGT Sum calculation because they are not required in Any% categories.
    </span>
    <br><br>
    **<span style='color:gray;font-size:70%'>
    For all categories except 1.1+, Residual calculation uses Math.floor() on every IL time, which chops off the decimals.
    This is done to remain consistent with the Top ${commBestILsCategory.topRuns.length} example ILs, which do not contain decimals.
    This can cause unexpected Residual variance between runs.
    For this reason, take the Residual with a grain of salt.
    </span>
    </div>
    </div>`
    document.getElementById('content').innerHTML = HTMLContent
}