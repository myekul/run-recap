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
    if (['level_devil', 'level_saltbaker'].includes(rrcCurrentAttempt.scenes.at(-1)?.name)) {
        HTMLContent += `<div class='container' style='margin-top:20px;gap:20px'>`
        HTMLContent += `<div style='width:270px'>${rrcExtraTable('SPLITS', 'split', cupheadBosses)}</div>`
        HTMLContent += fancyScorecard()
        HTMLContent += `<div style='width:270px'></div>`
        HTMLContent += `</div>`
    }
    HTMLContent += `</div>`
    if (runRecapCategory.name == '1.1+' && rrcCurrentAttempt.scenes.at(-1)?.endTime < 1680 && rrcCurrentAttempt.scenes.at(-1)?.name == 'level_devil' && rrcComparison != 'None') {
        chartEligible = true
        HTMLContent += rrcChartSection()
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
        scene.topBest = { segment: rrcTopBests[index] }
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
            if ((scene.name == 'level_devil' && index == scenes.length - 1) || scenes[index + 1]?.name == 'win') {
                scene.topBest.map = rrcTopBests[index - 1]
                scene.topBest.scorecardSegment = rrcTopBests[index + 1]
                scene.map = mapTime
                mapTime = 0
                scene.scorecard = attempt.scenes[index + 1]
                scene.scorecardSegment = scene.scorecard?.segment
                scene.trueScorecard = index < attempt.scenes.length - 1 ? scene.scorecard.segment : 0
                if (scene.scorecard?.hp) scene.trueScorecard -= 0.8
                if (scene.scorecard?.parries) scene.trueScorecard -= 0.8
                if (scene.scorecard?.superMeter) scene.trueScorecard -= 0.8
                if (scene.scorecard?.coins) scene.trueScorecard -= 0.8
                scene.split = scene.endTime
                if (!['level_devil', 'level_saltbaker'].includes(scene.name)) scene.split -= 6.45
                if (runNgun) scene.split = 0
                if (!splitBefore) scene.split = scene.scorecardSegment ? scene.endTime + scene.scorecardSegment : scene.endTime
                attempt.levels.push(scene)
                if (boss) attempt.bosses.push(scene)
                if (runNgun) attempt.runNguns.push(scene)
                scene.rta = scene.segment
                scene.topBest.rta = rrcTopBests[index]
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
function reconstructRRC(endTimes, playerIndex) {
    bossIndex = 0
    winIndex = 0
    endTimes.forEach((endTime, index) => {
        const newScene = { name: rrc80[index], endTime: convertToSeconds(endTime) }
        if (cupheadBosses[newScene.name]) {
            if (!(newScene.name == 'level_dice_palace_main' && rrc80[index + 1] != 'win')) {
                newScene.levelTime = runRecapCategory.topRuns[playerIndex].runRecap[bossIndex]
                bossIndex++
            }
        }
        if (newScene.name == 'win') {
            newScene.starSkips = runRecapCategory.topRuns[playerIndex].starSkips[winIndex] * 2
            winIndex++
        }
        runRecapCategory.topRuns[playerIndex].rrc.push(newScene)
    })
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
                    ${rrcExtraTable('Map Movement', 'map', cupheadBosses)
        + rrcExtraTable('Level RTA', 'levels', cupheadBosses)
        + rrcExtraTable('Scorecards', 'scorecard', cupheadBosses)}
                </div>
                <div class='container' style='align-items:flex-start;gap:30px;margin-top:20px'>
                    ${rrcExtraTable('Intermissions', 'intermissions', cupheadIntermissions)
        + rrcExtraTable('Cutscenes', 'cutscenes', cupheadCutscenes)}
                </div>
            </div>`
    HTMLContent += `</div>`
    return HTMLContent
}
function rrcExtraTable(title, field, sceneNames) {
    let HTMLContent = ''
    HTMLContent += `
        <div class='border background1' style='padding:8px;position:relative;min-width:225px'>
        <div class='font2 container' style='font-size:150%;gap:8px'>
            ${title}
            ${title == 'SPLITS' ? `<div class='dim grow' onclick="splitBefore=!splitBefore;playSound('move');action()">${fontAwesome(splitBefore ? 'toggle-off' : 'toggle-on')}</div>` : ''}
        </div>
        <div class='container'><table>
        <tr class='gray'>
        <td colspan=10 style='font-size:10%'>&nbsp;</td>
        <tr>`
    let deltaSum = 0
    let attemptField = field
    if (field == 'map') attemptField = 'levels'
    if (field == 'scorecard') attemptField = 'levels'
    if (field == 'split') attemptField = 'levels'
    let thingToAnalyze = 'segment'
    if (field == 'levels') thingToAnalyze = 'rta'
    if (field == 'map') thingToAnalyze = 'map'
    if (field == 'scorecard') thingToAnalyze = 'scorecardSegment'
    if (field == 'split') thingToAnalyze = 'split'
    rrcCurrentAttempt[attemptField].forEach((scene, index) => {
        const runNgun = cupheadRunNguns[scene.name]
        const level = cupheadBosses[scene.name] || cupheadRunNguns[scene.name]
        let currentSegment = scene[thingToAnalyze]
        let comparisonSegment = rrcComparisonAttempt[attemptField][index][thingToAnalyze]
        const delta = (currentSegment - comparisonSegment) || 0
        deltaSum += delta
        const content = level ? getImage(runNgun ? 'runnguns/' + level.id : level.id, 21) : sceneNames[scene.name]
        HTMLContent += `<tr class='${getRowColor(index)}'>
            <td class='${level ? 'container ' + level.id : ''}' style='text-align:left'>${content}</td>
            <td style='padding:0 5px'>${currentSegment ? secondsToHMS(currentSegment, true) : ''}</td>`
        if (rrcComparison != 'None' && !(title == 'Scorecards' && scorecardMode == 'Star Skips')) {
            HTMLContent +=
                `<td class='${redGreen(delta)}' style='font-size:80%'>${delta ? getDelta(delta.toFixed(2)) : ''}</td>
            <td class='dim' style='font-size:80%'>${comparisonSegment ? secondsToHMS(comparisonSegment, true) : ''}</td>`
            if (rrcComparison == 'Top Bests' && !(field == 'levels' && scene.name == 'level_dice_palace_main')) HTMLContent += `<td>${scene.topBest[thingToAnalyze] ? getPlayerIcon(players[scene.topBest[thingToAnalyze][0]], 21) : ''}</td>`
        }
        if (title == 'Scorecards' && scorecardMode == 'Star Skips') {
            HTMLContent += `<td>
            <div class='myekulColor container' style='gap:3px;justify-content:left'>`
            for (let i = 0; i < scene.scorecard?.starSkips; i++) {
                HTMLContent += fontAwesome('star')
            }
            HTMLContent += `</div></td>`
        }
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>`
    if (rrcComparison != 'None' && title != 'SPLITS') HTMLContent += `<div class='container ${redGreen(deltaSum)}'>${getDelta(deltaSum.toFixed(2))}</div>`
    if (title == 'Scorecards') {
        HTMLContent += `
        <div style='position:absolute;left:255px;top:25px'>
            <div class='scorecardButton button ${scorecardMode == 'Default' ? 'selected' : ''}' onclick="changeScorecardMode('Default')">${fontAwesome('tasks')}</div>
            <div id='starSkipButton' class='scorecardButton button container ${scorecardMode == 'Star Skips' ? 'selected' : ''}' onclick="changeScorecardMode('Star Skips')">
            ${fontAwesome('star')}
            ${fontAwesome('star')}
            </div>
        </div>`
        // <div class='scorecardButton button ${scorecardMode == 'Normalized' ? 'selected' : ''}' onclick="changeScorecardMode('Normalized')">${fontAwesome('balance-scale')}</div>
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
        <th>Map</th>
        <th></th>
        <th>IGT</th>
        <th>RTA</th>
        <th>Scorecard</th>
        <th>HP</th>
        <th>Parry</th>
        <th>Supers</th>
        <th>Normalized Scorecard</th>
        <th>Split Before</th>
        <th>Split After</th>
        </tr>`
    rrcCurrentAttempt.bosses.forEach((scene, index) => {
        const level = cupheadBosses[scene.name]
        const split = level.id != 'thedevil' ? secondsToHMS(scene.scorecard?.endTime, true) : secondsToHMS(scene.endTime, true)
        let splitBefore = secondsToHMS(scene.endTime - 6.45, true)
        if (level.id == 'forestfollies') splitBefore = ''
        if (level.id == 'thedevil') splitBefore = split
        HTMLContent += `<tr class='${getRowColor(index)}'>
            <td class='container ${level?.id}'>${getImage(level.id, 21)}</td>
            <td class='${level?.id}'>${scene.levelTime ? secondsToHMS(scene.levelTime, true) : ''}</td>
            <td class='${level?.id}' style='font-size:80%'>${scene.levelTime ? level?.id == 'thedevil' ? secondsToHMS(scene.segment, true) : secondsToHMS(scene.segment - 6.45, true) : ''}</td>
            <td>${index < rrcCurrentAttempt.bosses.length - 1 ? secondsToHMS(scene.scorecard.segment, true) : ''}</td>
            <td>${index < rrcCurrentAttempt.bosses.length - 1 ? scene.scorecard.hp : ''}</td>
            <td>${index < rrcCurrentAttempt.bosses.length - 1 ? scene.scorecard.parries : ''}</td>
            <td>${index < rrcCurrentAttempt.bosses.length - 1 ? scene.scorecard.superMeter || scene.scorecard.coins : ''}</td>
            <td>${index < rrcCurrentAttempt.bosses.length - 1 ? secondsToHMS(scene.trueScorecard, true) : ''}</td>
            <td class='${level?.id}' style='padding:0 5px'>${splitBefore}</td>
            <td class='${level?.id}' style='padding:0 5px'>${split}</td>
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
            <div class='spinning-div border'>
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
            ${theResults(rrcComparisonAttempt)}
        </div>`
    }
    HTMLContent += `</div>`
    return HTMLContent
}
function theResults(attempt) {
    let HTMLContent = ''
    rrcElems.forEach(elem => {
        HTMLContent += `<p>${secondsToHMS(attempt[elem], true)}</p>`
    })
    HTMLContent += `<p class='myekulColor'>${fontAwesome('star') + ` ???`}</p>`
    return HTMLContent

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
const rrc80 = [
    'cutscene_intro',
    'level_house_elder_kettle',
    'map_world_1',
    'level_platforming_1_1F',
    'win',
    'map_world_1',
    'shop',
    'map_world_1',
    'level_veggies',
    'win',
    'map_world_1',
    'level_frogs',
    'win',
    'map_world_1',
    'level_slime',
    'win',
    'map_world_1',
    'level_shmup_tutorial',
    'map_world_1',
    'level_flying_blimp',
    'win',
    'map_world_1',
    'level_flower',
    'win',
    'map_world_1',
    'level_dice_gate',
    'cutscene_world2',
    'map_world_2',
    'level_baroness',
    'win',
    'map_world_2',
    'level_flying_bird',
    'win',
    'map_world_2',
    'level_flying_genie',
    'win',
    'map_world_2',
    'level_clown',
    'win',
    'map_world_2',
    'level_dragon',
    'win',
    'map_world_2',
    'level_dice_gate',
    'cutscene_world3',
    'map_world_3',
    'level_bee',
    'win',
    'map_world_3',
    'level_robot',
    'win',
    'map_world_3',
    'level_sally_stage_play',
    'win',
    'map_world_3',
    'level_mouse',
    'win',
    'map_world_3',
    'level_pirate',
    'win',
    'map_world_3',
    'level_flying_mermaid',
    'win',
    'map_world_3',
    'level_train',
    'win',
    'map_world_3',
    'map_world_4',
    'cutscene_kingdice',
    'level_dice_palace_main',
    'level_dice_palace_cigar',
    'level_dice_palace_main',
    'level_dice_palace_rabbit',
    'level_dice_palace_main',
    'level_dice_palace_roulette',
    'level_dice_palace_main',
    'win',
    'map_world_4',
    'cutscene_devil',
    'level_devil'
]