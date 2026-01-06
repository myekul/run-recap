function generateResidual() {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='gap:30px'>`
    HTMLContent += `<div class='textBlock' style='width:420px'>
    When you subtract your ${myekulColor('boss IGT sum')} from your ${myekulColor('total run time')},
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
    <th class='dim' style='padding:0 10px'>IGT Sum</th>
    <th class='gray' style='padding:0 10px'>Residual</th>`
    HTMLContent += `</tr>`
    runRecapCategory.topRuns.forEach((run, index) => {
        let sum = 0
        run.runRecap.forEach(time => {
            const newTime = decimalsCriteria() ? time : Math.floor(time)
            sum += newTime
        })
        const residual = Math.floor(players[index].extra.score) - sum
        HTMLContent += `
        <tr class='${getRowColor(index)}'>
        ${bigPlayerDisplay(players[index])}
        <td class='dim' style='font-size:80%'>${secondsToHMS(sum, decimalsCriteria())}</td>
        <td>${secondsToHMS(residual, decimalsCriteria())}</td>`
        if (runRecapCategory.name == '1.1+') {
            const starSkipCount = run.starSkips.reduce((acc, num) => acc + num, 0)
            let starSkipTime = 0
            run.starSkips.forEach(starSkip => {
                if (starSkip == 0) {
                    starSkipTime += 1.016
                } else if (starSkip == 0.5) {
                    starSkipTime += 0.5
                }
            })
            HTMLContent += `<td class='dim' style='font-size:70%'>
            <div class='container' style='justify-content:left;gap:2px;padding:0 3px'>
            ${fontAwesome('star')}
            ${starSkipCount}
            </div>
            </td>`
        }
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table>`
    if (runRecap_savFile) {
        let residual = '???'
        let sum = 0
        if (getCupheadLevel(categories.length - 1).completed) {
            categories.forEach((category, categoryIndex) => {
                const time = decimalsCriteria() ? getCupheadLevel(categoryIndex).bestTime : Math.floor(getCupheadLevel(categoryIndex).bestTime)
                sum += time
            })
            if (runRecapTime != 'XX:XX') {
                residual = secondsToHMS(convertToSeconds(runRecapTime) - sum, decimalsCriteria())
            }
        }
        HTMLContent += `<div class='container' style='margin-top:30px;gap:10px'>
    <div>Your run:</div>
    <table>
    <tr>
    <th class='dim'>IGT Sum</th>
    <th class='gray'>Residual</th>
    </tr>
    <tr class='background2'>
    <td class='dim' style='padding:0 10px'>${secondsToHMS(sum, decimalsCriteria())}</td>
    <td style='font-size:150%'>${residual}</td>
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
                *<span class='dim' style='font-size:70%'>
                    The Cuphead .sav contains IL information for Run 'n Guns and Mausoleum 1,
                    but I've decided to exclude them from the default IGT Sum calculation because they are not required in Any% categories.
                </span>
                <br><br>
                    **<span class='dim' style='font-size:70%'>
                        For all categories except 1.1+, Residual calculation uses Math.floor() on every IL time, which chops off the decimals.
                        This is done to remain consistent with the Top ${runRecapCategory.topRuns.length} example ILs, which do not contain decimals.
                        This can cause unexpected Residual variance between runs.
                        For this reason, take the Residual with a grain of salt.
                    </span>
                </div>
            </div>`
    document.getElementById('content').innerHTML = HTMLContent
}