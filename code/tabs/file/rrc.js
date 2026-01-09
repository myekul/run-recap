function generate_rrc() {
    dropboxEligible = false
    chartEligible = false
    let HTMLContent = ''
    if (runRecap_rrcFile.attempts) {
        rrcUpdateBrowser()
        HTMLContent += rrcView()
    } else {
        HTMLContent += emptyFile('rrc')
    }
    document.getElementById('content').innerHTML = HTMLContent
    if (dropboxEligible) initializeDropbox()
    if (chartEligible) rrcChart()
}
function rrcView() {
    let HTMLContent = ''
    rrcCurrentAttempt = { scenes: runRecap_rrcFile.attempts[rrcAttemptIndex].scenes.map(s => ({ ...s })) }
    rrcOrganize(rrcCurrentAttempt, rrcCurrentAttempt.scenes, true)
    if (rrcComparison != 'None') rrcOrganize(rrcComparisonAttempt, rrcComparisonCollection[rrcComparison])
    HTMLContent += classicView()
    HTMLContent += rrcComparisonDisplay()
    HTMLContent += rrcRTA()
    const runFinished = ['level_devil', 'level_saltbaker'].includes(rrcCurrentAttempt.scenes.at(-1)?.name)
    const finalTableName = segmentToggle ? 'SEGMENTS' : 'SPLITS'
    const finalTableThing = segmentToggle ? 'trueSegment' : 'split'
    HTMLContent += `<div class='container' style='margin-top:20px;gap:20px'>`
    HTMLContent += `<div style='width:270px'>${rtaTable(finalTableName, finalTableThing, cupheadBosses)}</div>`
    if (runFinished) HTMLContent += fancyScorecard()
    if (runFinished) HTMLContent += `<div style='width:270px'></div>`
    HTMLContent += `</div>`
    HTMLContent += `</div>`
    if (rrcCompatible && runFinished && rrcComparison != 'None') {
        const finalTime = rrcCurrentAttempt.scenes.at(-1)?.endTime
        const timeRequirement = runRecapCategory.name == '1.1+' && finalTime < 1680 || runRecapCategory.name == 'DLC' && finalTime < 660
        if (timeRequirement) {
            chartEligible = true
            HTMLContent += rrcChartSection()
        }
    }
    HTMLContent += `<div class='container' style='gap:10px;margin-top:15px'>
        <div class='button cuphead' onclick="rrcRaw()">Show raw</div>
        <div class='button cuphead' onclick="runRecapCopy()" style='width:165px'><i class="fa fa-clone"></i>&nbsp;Copy to clipboard</div>
        </div>`
    return HTMLContent
}
function rrcSegments(scenes) {
    scenes.forEach((scene, index) => {
        scene.segment = parseFloat(scene.endTime)
        if (index) {
            scene.segment = convertToSeconds(scene.endTime) - convertToSeconds(scenes[index - 1].endTime)
        }
    })
}
function rrcOrganize(attempt, scenes, doSegments) {
    attempt.scenes = scenes
    attempt.levels = []
    attempt.runNguns = []
    attempt.bosses = []
    attempt.intermissions = []
    attempt.cutscenes = []
    attempt.levelTime = 0
    attempt.intermissionTime = 0
    attempt.mapTime = 0
    attempt.cutsceneTime = 0
    attempt.scorecardTime = 0
    if (doSegments) rrcSegments(scenes)
    let mapTime = 0
    let kdTotal = 0
    // Separate bosses, map, scorecards?
    scenes.forEach((scene, index) => {
        if (rrcCompatible) scene.topBest = { segment: runRecapCategory.rrcTopBests[index] }
        const boss = cupheadBosses[scene.name]
        const runNgun = cupheadRunNguns[scene.name]
        if (scene.name.startsWith('level_dice_palace')) {
            kdTotal += scene.segment
            if (scenes[index + 1].name == 'win') scene.kdTotal = kdTotal
        }
        if (scene.name.startsWith('map')) {
            mapTime += scene.segment
            attempt.mapTime += scene.segment
        } else if (scene.name.startsWith('cutscene')) {
            attempt.cutscenes.push(scene)
            attempt.cutsceneTime += scene.segment
        } else if (boss || runNgun) {
            attempt.levelTime += scene.segment
            if ((['level_devil', 'level_saltbaker'].includes(scene.name) && index == scenes.length - 1) || scenes[index + 1]?.name == 'win') {
                if (rrcCompatible) {
                    scene.topBest.map = runRecapCategory.rrcTopBests[index - 1]
                    scene.topBest.scorecardSegment = runRecapCategory.rrcTopBests[index + 1]
                }
                scene.map = mapTime
                mapTime = 0
                scene.scorecard = attempt.scenes[index + 1]
                scene.scorecardSegment = calculateScorecard(scene.scorecard)
                // Split
                scene.split = scene.endTime
                if (!['level_devil', 'level_saltbaker'].includes(scene.name)) scene.split -= 6.45
                if (runNgun) scene.split = 0
                if (!splitBefore) scene.split = scene.scorecardSegment ? scene.endTime + scene.scorecardSegment : scene.endTime
                // Segment
                scene.trueSegment = scene.scorecard?.endTime
                if (scene.scorecard) {
                    if (attempt.levels.length) scene.trueSegment = scene.scorecard.endTime - attempt.levels.at(-1).scorecard.endTime
                } else {
                    scene.trueSegment = scene.endTime - attempt.levels.at(-1).scorecard.endTime
                }
                if (splitBefore) scene.trueSegment = scene.endTime - attempt.levels.at(-1)?.endTime
                if (splitBefore && ['level_devil', 'level_saltbaker'].includes(scene.name)) scene.trueSegment += 6.45
                //
                attempt.levels.push(scene)
                if (boss) attempt.bosses.push(scene)
                if (runNgun) attempt.runNguns.push(scene)
                scene.rta = scene.segment
                if (rrcCompatible) scene.topBest.rta = runRecapCategory.rrcTopBests[index]
                if (boss) {
                    if (scene.scorecard) scene.rta -= 6.45
                    if (scene.kdTotal) scene.rta = scene.kdTotal - 6.45 * 5
                }
            }
        } else if (scene.name == 'win') {
            attempt.scorecardTime += scene.segment
        } else if (['level_dice_palace_cigar', 'level_dice_palace_rabbit', 'level_dice_palace_roulette'].includes(scene.name)) {
            attempt.levelTime += scene.segment
        } else {
            attempt.intermissionTime += scene.segment
            attempt.intermissions.push(scene)
        }
    })
}
function calculateScorecard(scorecard) {
    if (scorecardMode != 'Normalized') return scorecard?.segment
    let segment = scorecard?.segment
    if (scorecard?.hp) segment -= 0.8
    if (scorecard?.parries) segment -= 0.8
    if (scorecard?.superMeter) segment -= 0.8
    if (scorecard?.coins) segment -= 0.8
    if (scorecard?.starSkips == 1) segment += 0.516
    if (scorecard?.starSkips == 2) segment += 1.016
    if (scorecard?.starSkips == 3) segment += 1.516
    return segment
}
function rrcComparisonDisplay() {
    return `<div class="container grow dim" style="margin:20px;gap:10px"
                onclick="openModal(rrcComparisonContent(),'RTA COMPARISON')">
                &Delta;
                <div>${rrcComparisonText}</div>
            </div>`
}
function rrcRTA() {
    let HTMLContent = ''
    HTMLContent += `
        <div class='container'>
            <div>
                <div class='container' style='align-items:flex-start;gap:30px'>
                    ${rtaTable('Map Movement', 'map', cupheadBosses)
        + rtaTable('Level RTA', 'levels', cupheadBosses)
        + rtaTable('Scorecards', 'scorecard', cupheadBosses)}
                </div>
                <div class='container' style='align-items:flex-start;gap:30px;margin-top:20px'>
                    ${rtaTable('Intermissions', 'intermissions', cupheadIntermissions)
        + rtaTable('Cutscenes', 'cutscenes', cupheadCutscenes)}
                </div>
            </div>`
    HTMLContent += `</div>`
    return HTMLContent
}
function rtaTable(title, field, sceneNames) {
    let HTMLContent = ''
    HTMLContent += `
        <div class='border background1 shadow' style='padding:8px;position:relative;min-width:225px'>
        <div class='font2 container' style='font-size:150%'>
            ${['SPLITS', 'SEGMENTS'].includes(title) ? `<div class='dim grow' onclick="segmentToggle=!segmentToggle;playSound('move');action()">${fontAwesome('exchange')}</div>` : ''}
            <div class='container' style='min-width:165px;margin:0'>${title}</div>
            ${['SPLITS', 'SEGMENTS'].includes(title) ? `<div class='dim grow' onclick="splitBefore=!splitBefore;playSound('move');action()">${fontAwesome(splitBefore ? 'toggle-off' : 'toggle-on')}</div>` : ''}
        </div>
        <div class='container'><table>
        <tr class='gray'>
        <td colspan=10 style='font-size:10%'>&nbsp;</td>
        <tr>`
    let deltaSum = 0
    let attemptField = field
    if (['map', 'scorecard', 'split', 'trueSegment'].includes(field)) attemptField = 'levels'
    let thingToAnalyze = 'segment'
    if (field == 'levels') thingToAnalyze = 'rta'
    if (field == 'map') thingToAnalyze = 'map'
    if (field == 'scorecard') thingToAnalyze = 'scorecardSegment'
    if (field == 'split') thingToAnalyze = 'split'
    if (field == 'trueSegment') thingToAnalyze = 'trueSegment'
    let min
    let max
    if (field == 'scorecard' && scorecardMode == 'Normalized') {
        min = Math.min(...rrcCurrentAttempt[attemptField].filter(obj => obj.scorecardSegment).map(obj => obj.scorecardSegment))
        max = Math.max(...rrcCurrentAttempt[attemptField].filter(obj => obj.scorecardSegment).map(obj => obj.scorecardSegment))
    }
    rrcCurrentAttempt[attemptField].forEach((scene, index) => {
        const runNgun = cupheadRunNguns[scene.name]
        const level = cupheadBosses[scene.name] || cupheadRunNguns[scene.name]
        let currentSegment = scene[thingToAnalyze]
        let comparisonSegment = rrcComparisonAttempt[attemptField][index][thingToAnalyze]
        const delta = (currentSegment - comparisonSegment) || 0
        deltaSum += delta
        const content = level ? getImage(runNgun ? 'runnguns/' + level.id : level.id, 21) : sceneNames[scene.name]
        HTMLContent += `<tr class='${getRowColor(index)}'>
            <td class='${level ? 'container ' + level.id : ''}' style='text-align:left'>${content}</td>`
        if (title == 'Scorecards' && scorecardMode == 'Normalized') HTMLContent += normalizedColorCell(currentSegment, min, max)
        if (!(title == 'Scorecards' && scorecardMode == 'Star Skips')) HTMLContent += `<td style='padding:0 5px'>${currentSegment ? secondsToHMS(currentSegment, true) : ''}</td>`
        if (rrcComparison != 'None'
            && !(title == 'Scorecards' && scorecardMode == 'Star Skips')
            && !(title == 'Scorecards' && scorecardMode == 'Normalized' && ['Top Average', 'Top 3 Average', 'Top Bests'].includes(rrcComparison))) {
            HTMLContent += `<td class='${redGreen(delta)}' style='font-size:80%'>${delta ? getDelta(delta.toFixed(2)) : ''}</td>`
            if (title == 'Scorecards' && scorecardMode == 'Normalized') HTMLContent += normalizedColorCell(comparisonSegment, min, max)
            HTMLContent += `<td class='dim' style='font-size:80%'>${comparisonSegment ? secondsToHMS(comparisonSegment, true) : ''}</td>`
            if (rrcComparison == 'Top Bests' && !(field == 'levels' && scene.name == 'level_dice_palace_main')) HTMLContent += `<td>${scene.topBest[thingToAnalyze] ? getPlayerIcon(players[scene.topBest[thingToAnalyze][0]], 21) : ''}</td>`
        }
        if (title == 'Scorecards' && scorecardMode == 'Star Skips') {
            HTMLContent += `<td>
            <div class='myekulColor container' style='gap:3px;justify-content:left;padding:0 5px'>`
            for (let i = 0; i < scene.scorecard?.starSkips; i++) {
                HTMLContent += fontAwesome('star')
            }
            HTMLContent += `</div></td>`
            if (!['None', 'Top Average', 'Top 3 Average', 'Top Bests'].includes(rrcComparison)) {
                HTMLContent += `<td>
                <div class='dim container' style='gap:3px;justify-content:left;padding:0 5px;font-size:80%'>`
                for (let i = 0; i < rrcComparisonAttempt.levels[index].scorecard?.starSkips; i++) {
                    HTMLContent += fontAwesome('star')
                }
                HTMLContent += `</div></td>`
            }
        }
        HTMLContent += `</tr>`
    })
    if (title == 'Scorecards' && scorecardMode == 'Star Skips') {
        HTMLContent += `<tr>
        <td></td>
        <td>${starSkipCount(rrcCurrentAttempt)}</td>
        <td class='dim'>${['None', 'Top Average', 'Top 3 Average', 'Top Bests'].includes(rrcComparison) ? '' : starSkipCount(rrcComparisonAttempt)}</td>
        </tr>`
    }
    if (rrcComparison != 'None' && title != 'SPLITS'
        && title != 'SEGMENTS'
        && !(title == 'Scorecards' && scorecardMode == 'Star Skips')
        && !(title == 'Scorecards' && ['Top Average', 'Top 3 Average', 'Top Bests'].includes(rrcComparison) && scorecardMode == 'Normalized')
    ) {
        HTMLContent += `<tr><td colspan=10 class='${redGreen(deltaSum)}'>${getDelta(deltaSum.toFixed(2))}</td></tr>`
    }
    HTMLContent += `</table></div>`
    if (title == 'Scorecards') {
        HTMLContent += `
        <div style='position:absolute;left:255px;top:25px'>
            <div class='scorecardButton button ${scorecardMode == 'Default' ? 'selected' : ''}' onclick="changeScorecardMode('Default')">${fontAwesome('tasks')}</div>
            <div class='scorecardButton button ${scorecardMode == 'Normalized' ? 'selected' : ''}' onclick="changeScorecardMode('Normalized')">${fontAwesome('balance-scale')}</div>
            <div id='starSkipButton' class='scorecardButton button container ${scorecardMode == 'Star Skips' ? 'selected' : ''}' onclick="changeScorecardMode('Star Skips')">
            ${fontAwesome('star')}
            ${fontAwesome('star')}
            </div>
        </div>`
    }
    HTMLContent += `</div>`
    return HTMLContent
}
function changeScorecardMode(mode) {
    scorecardMode = mode
    playSound('move')
    action()
}
function rrcUpdateBrowser() {
    let HTMLContent = ''
    HTMLContent += `<div class='container'>
        <select onchange="rrcChangeIndex(parseInt(this.value),true)">`
    runRecap_rrcFile.attempts.forEach((attempt, index) => {
        let content = attempt.lssAttemptId + ' - ' + attempt.startedAt
        const lastScene = attempt.scenes.at(-1)
        if (lastScene?.name == 'level_devil') {
            content += ' - ' + secondsToHMS(lastScene.endTime)
        }
        HTMLContent += `<option value='${index}' ${rrcAttemptIndex == index ? 'selected' : ''}>${content}</option>`
    })
    HTMLContent += `</select>
        </div>`
    HTMLContent += `<div class='container' style='gap:2px;margin:3px'>
            <div class='grow ${rrcAttemptIndex == runRecap_rrcFile.attempts.length - 1 ? 'grayedOut' : ''}' onclick="rrcChangeIndex(${rrcAttemptIndex + 1})">${fontAwesome('chevron-left')}</div>`
    for (let i = rrcAttemptIndex + 7; i >= rrcAttemptIndex - 7; i--) {
        const attempt = runRecap_rrcFile.attempts[i]
        if (attempt) {
            let className = ''
            if (attempt.scenes.length <= 3) className = 'dim'
            if (attempt.scenes.at(-1)?.name == 'level_devil') className = 'myekulColor'
            HTMLContent += `<div class='clickable ${className}' style='text-align:center;width:14px;font-size:${rrcAttemptIndex == i ? '80%' : '50%'}' onclick="rrcChangeIndex(${i})">${fontAwesome('circle')}</div>`
        } else {
            HTMLContent += `<div style='width:14px'></div>`
        }
    }
    HTMLContent += `<div class='grow ${rrcAttemptIndex == 0 ? 'grayedOut' : ''}' onclick="rrcChangeIndex(${rrcAttemptIndex - 1})">${fontAwesome('chevron-right')}</div>
    </div>`
    document.getElementById('rrcBrowser').innerHTML = HTMLContent
}
function rrcRaw() {
    let HTMLContent = ''
    HTMLContent += `
        <table style='margin:0 auto'>
        <tr class='gray'>
        <th></th>
        <th>IGT</th>
        <th>RTA</th>
        <th>HP</th>
        <th>P</th>
        <th>EX</th>
        </tr>`
    rrcCurrentAttempt.bosses.forEach((scene, index) => {
        const level = cupheadBosses[scene.name]
        HTMLContent += `<tr class='${getRowColor(index)}'>
            <td class='container ${level?.id}'>${getImage(level.id, 21)}</td>
            <td class='${level?.id}'>${scene.levelTime ? secondsToHMS(scene.levelTime, true) : ''}</td>
            <td class='${level?.id}' style='font-size:80%'>${scene.levelTime ? level?.id == 'thedevil' ? secondsToHMS(scene.segment, true) : secondsToHMS(scene.segment - 6.45, true) : ''}</td>
            <td>${index < rrcCurrentAttempt.bosses.length - 1 ? scene.scorecard.hp : ''}</td>
            <td>${index < rrcCurrentAttempt.bosses.length - 1 ? scene.scorecard.parries : ''}</td>
            <td>${index < rrcCurrentAttempt.bosses.length - 1 ? scene.scorecard.superMeter || scene.scorecard.coins : ''}</td>
            </tr>`
    })
    HTMLContent += `</table>`
    HTMLContent += `<table style='margin:0 auto'>`
    rrcCurrentAttempt.scenes.forEach((scene, index) => {
        const level = cupheadBosses[scene.name]
        HTMLContent += `<tr class='${getRowColor(index)}'>
            <td class='dim' style='font-size:50%'>${index}</td>
            <td class='container ${level?.id}'>${level && level?.id != 'forestfollies' ? getImage(level.id, 21) : ''}</td>
            <td class='${level?.id}'>${scene.levelTime ? secondsToHMS(scene.levelTime, true) : ''}</td>
            <td class='dim' style='font-size:70%;text-align:left'>${scene.name}</td>
            <td>${secondsToHMS(scene.segment, true)}</td>
            <td>${secondsToHMS(scene.endTime, true)}</td>
            </tr>`
    })
    HTMLContent += `</table>`
    openModal(HTMLContent, 'RAW')
}
function rrcChangeIndex(index, dropdown) {
    if (runRecap_rrcFile.attempts[index]) {
        rrcAttemptIndex = index
        action()
        if (dropdown) {
            playSound('cardflip')
        } else {
            playSound('move')
        }
    } else {
        playSound('locked')
    }
}
const rrcElems = ['levelTime', 'intermissionTime', 'mapTime', 'cutsceneTime', 'scorecardTime']
function fancyScorecard() {
    let HTMLContent = ''
    HTMLContent += `
        <div class='container' style='position:relative;width:600px;margin:0'>
            <div class='spinning-div border shadow'>
                <div style='position:relative'>
                    <img class='container' src="images/results.gif" style='height:100px;margin-bottom:8px'>
                    <img id='scorecardLine' class='container' src='images/scorecard_line.png'>
                    <img class='container' src="images/scorecard.png" style='height:400px;-webkit-user-drag: none'>
                    <div id='scorecardText' style='color:floralwhite'>
                        <p>LEVEL RTA ${". ".repeat(9)}</p>
                        <p>INTERMISSIONS ${". ".repeat(4)}</p>
                        <p>MAP MOVEMENT ${". ".repeat(3)}</p>
                        <p>CUTSCENES ${". ".repeat(8)}</p>
                        <p>SCORECARDS ${". ".repeat(6)}</p>
                        <p>STAR SKIPS ${". ".repeat(8)}</p>
                    </div>
                    <div id='scorecardFinal' class='myekulColor'>${secondsToHMS(convertToSeconds(rrcCurrentAttempt.scenes.at(-1).endTime), true)}</div>
                </div>
            </div>
            <div class='scorecardTimes myekulColor'>
                ${theResults(rrcCurrentAttempt)}
            </div>`
    if (rrcComparison != 'None') {
        HTMLContent += `<div style='position:absolute;left:600px;top:130px;width:300px'>${rrcComparisonDisplay()}</div>`
        HTMLContent += `<div class='scorecardTimes myekulColor' style='left:650px'>`
        rrcElems.forEach(field => {
            const delta = rrcCurrentAttempt[field] - rrcComparisonAttempt[field]
            HTMLContent += `<p class='${redGreen(delta)}'>${getDelta(delta.toFixed(2))}</p>`
        })
        HTMLContent += `</div>
        <div class='scorecardTimes dim' style='left:780px'>
            ${theResults(rrcComparisonAttempt, true)}
        </div>`
    }
    HTMLContent += `</div>`
    return HTMLContent
}
function theResults(attempt, comparison) {
    let HTMLContent = ''
    rrcElems.forEach(elem => {
        HTMLContent += `<p>${secondsToHMS(attempt[elem], true)}</p>`
    })
    if (!(comparison && ['Top Average', 'Top 3 Average', 'Top Bests'].includes(rrcComparison))) {
        let starSkipNum = starSkipCount(attempt)
        let icon = 'star'
        if (!starSkipNum) icon += '-o'
        HTMLContent += `
        <p class='container ${starSkipNum ? 'myekulColor' : ''}' style='gap:3px;justify-content:left'>
            ${fontAwesome(icon)
            + fontAwesome(icon)
            + '&nbsp;' + starSkipNum}
        </p>`
    }
    return HTMLContent
}
function starSkipCount(attempt) {
    let starSkipNum = 0
    attempt.levels.forEach(level => {
        const numStarSkips = level.scorecard?.starSkips
        starSkipNum += numStarSkips / 2 || 0
    })
    return starSkipNum
}
function read_rrc(content) {
    try {
        rrcAttemptIndex = 0
        runRecap_rrcFile = JSON.parse(content)
        runRecap_rrcFile.attempts.forEach(attempt => {
            attempt.scenes.forEach(scene => {
                scene.endTime = convertToSeconds(scene.endTime.slice(3))
            })
        })
        runRecap_rrcFile.attempts.reverse()
    } catch (error) {
        console.error('Error parsing JSON file:', error)
    }
}