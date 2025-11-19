function generateResidual() {
    let HTMLContent = ''
    if (commBestILsCategory.name == '1.1+' && residualExtra) {
        HTMLContent += `<div class='button cuphead' style='width:180px;margin:0 auto;margin-bottom:20px' onclick="residualExtra=!residualExtra;action();playSound('move')">Hide True Residual</div>`
    }
    HTMLContent += `<div class='container' style='gap:30px'>`
    if (!(commBestILsCategory.name == '1.1+' && residualExtra)) {
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
    }
    HTMLContent += `<div>`
    HTMLContent += `<table>
    <tr>
    <th colspan=4></th>
    <th class='dim' style='padding:0 10px'>IGT Sum</th>
    <th class='gray' style='padding:0 10px'>Residual</th>`
    if (commBestILsCategory.name == '1.1+' && residualExtra) {
        HTMLContent += `<th colspan=7></th>
        <th class='gray' style='padding:0 3px'>True Residual</th>`
    }
    HTMLContent += `</tr>`
    commBestILsCategory.topRuns.forEach((run, index) => {
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
        if (commBestILsCategory.name == '1.1+') {
            const starSkipCount = run.starSkips.reduce((acc, num) => acc + num, 0)
            let starSkipTime = 0
            run.starSkips.forEach(starSkip => {
                if (starSkip == 0) {
                    starSkipTime += 1.016
                } else if (starSkip == 0.5) {
                    starSkipTime += 0.5
                }
            })
            const trueResidual = calculateTrueResidual(residual, starSkipTime, run.framerule, run.follies, run.cala, run.werner, run.kd)
            HTMLContent += `<td class='dim' style='font-size:70%'>
            <div class='container' style='justify-content:left;gap:2px;padding:0 3px'>
            ${fontAwesome('star')}
            ${starSkipCount}
            </div>
            </td>`
            if (residualExtra) {
                HTMLContent += `
            <td>${run.framerule[0] ? residualImage('dicesmart') : ''}</td>
            <td>${run.framerule[1] ? residualImage('dicesmart') : ''}</td>
            <td>${run.follies ? getImage('other/forestfollies', 16) : ''}</td>
            <td>${run.cala ? residualImage('wutface') : ''}</td>
            <td>${run.werner ? residualImage('tomatosoup') : ''}</td>
            <td>${run.kd ? getImage('kingdice', 16) : ''}</td>
            <td class='myekulColor'>${trueResidual}</td>`
            }
            if (index == 0 && !residualExtra) {
                HTMLContent += `<td rowspan=10 class='clickable gray' onclick="residualExtra=!residualExtra;action();playSound('move')">${fontAwesome('chevron-right')}</td>`
            }
        }
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table>`
    if (commBestILsCategory.name == '1.1+' && residualExtra) {
        HTMLContent += `<div class='container'>
    <div style='width:680px;margin-top:20px'>
    <span style='font-size:90%'>
    The <span class='myekulColor'>True Residual</span>
    calculator takes the default Residual time and attempts to normalize it by removing expected sources of variance:
    ${myekulColor('star skips')} (0.516s / 1.016s),
    ${myekulColor('KD framerules')} (0.7s),
    ${myekulColor('Follies / Cala / Werner parries')} (0.96+),
    and
    ${myekulColor('0/3 HP on KD')} (0.8s).
    The resulting value represents every other Residual timeloss.
    <br>
    <span class='dim'>Calculations may be inaccurate.</span>
    </span>
    </div>
    </div>`
    }
    if (runRecap_savFile) {
        let residual = '???'
        let sum = 0
        if (getCupheadLevel(categories.length - 1).completed) {
            categories.forEach((category, categoryIndex) => {
                const time = decimalsCriteria() ? getCupheadLevel(categoryIndex).bestTime : Math.floor(getCupheadLevel(categoryIndex).bestTime)
                sum += time
            })
            if (runRecapTime != 'XX:XX') {
                globalResidual = convertToSeconds(runRecapTime) - sum
                residual = secondsToHMS(globalResidual, decimalsCriteria())
            }
        }
        HTMLContent += `<div class='container' style='margin-top:30px;gap:10px'>
    <div>Your run:</div>
    <table>
    <tr>
    <th class='dim'>IGT Sum</th>
    <th class='gray'>Residual</th>`
        if (commBestILsCategory.name == '1.1+' && residualExtra) {
            HTMLContent += `<th class='dim'>Star Skips</th>
            <th>${residualImage('dicesmart')}</th>
            <th>${residualImage('dicesmart')}</th>
            <th><div class='container'>${getImage('other/forestfollies', 16)}</div></th>
            <th>${residualImage('wutface')}</th>
            <th>${residualImage('tomatosoup')}</th>
            <th><div class='container'>${getImage('kingdice', 16)}</div></th>
            <th class='gray' style='padding:0 3px'>True Residual</th>`
        }
        HTMLContent += `</tr>
    <tr class='background2'>
    <td class='dim' style='padding:0 10px'>${secondsToHMS(sum, decimalsCriteria())}</td>
    <td style='font-size:150%'>${residual}</td>`
        if (commBestILsCategory.name == '1.1+' && residualExtra) {
            let dropdownContent = ''
            for (let i = 0; i <= 19; i += 0.5) {
                dropdownContent += `<option value='${i}' ${globalStarSkips == i ? 'selected' : ''}>${i}</option>`
            }
            HTMLContent += `<td class='dim' style='font-size:80%'>
            <div class='container' style='justify-content:left;gap:2px;padding:0 3px'>
            ${fontAwesome('star')}
            <select id='dropdown_starSkips' onchange="checkTrueResidual();playSound('cardflip')">
            ${dropdownContent}
            </select>
            </div>
            </td>
            <td><input id='checkbox_kd1' type='checkbox' onchange="checkTrueResidual();playSound('move')" ${kd1 ? 'checked' : ''}></td>
            <td><input id='checkbox_kd2' type='checkbox' onchange="checkTrueResidual();playSound('move')" ${kd2 ? 'checked' : ''}></td>
            <td><input id='checkbox_follies' type='checkbox' onchange="checkTrueResidual();playSound('move')" ${globalFollies ? 'checked' : ''}></td>
            <td><input id='checkbox_cala' type='checkbox' onchange="checkTrueResidual();playSound('move')" ${globalCala ? 'checked' : ''}></td>
            <td><input id='checkbox_werner' type='checkbox' onchange="checkTrueResidual();playSound('move')" ${globalWerner ? 'checked' : ''}></td>
            <td><input id='checkbox_kd' type='checkbox' onchange="checkTrueResidual();playSound('move')" ${globalKD ? 'checked' : ''}></td>
            <td id='trueResidual' class='myekulColor' style='font-size:150%'>???</td>`
        }
        HTMLContent += `</tr>
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
                        This is done to remain consistent with the Top ${commBestILsCategory.topRuns.length} example ILs, which do not contain decimals.
                        This can cause unexpected Residual variance between runs.
                        For this reason, take the Residual with a grain of salt.
                    </span>
                </div>
            </div>`
    document.getElementById('content').innerHTML = HTMLContent
}
function checkTrueResidual() {
    globalStarSkips = document.getElementById('dropdown_starSkips').value
    kd1 = document.getElementById('checkbox_kd1').checked
    kd2 = document.getElementById('checkbox_kd2').checked
    globalFollies = document.getElementById('checkbox_follies').checked
    globalCala = document.getElementById('checkbox_cala').checked
    globalWerner = document.getElementById('checkbox_werner').checked
    globalKD = document.getElementById('checkbox_kd').checked
    document.getElementById('trueResidual').innerHTML = calculateTrueResidual(globalResidual, 19 - globalStarSkips, [kd1, kd2], globalFollies, globalCala, globalWerner, globalKD)
}
function residualImage(symbol) {
    return `<div><img src='images/${symbol}.png' style='height:15px;width:15px'></div>`
}
function calculateTrueResidual(residual, starSkipTime, framerule, follies, cala, werner, kd) {
    let frameruleTime = 0
    framerule.forEach(house => {
        if (!house) frameruleTime += 0.7
    })
    follies = follies ? 0.96 : 0
    cala = cala ? 0.96 : 0
    werner = werner ? 0.96 : 0
    kd = kd ? 0.8 : 0
    return secondsToHMS(residual - starSkipTime - frameruleTime - follies - cala - werner - kd, true)
}