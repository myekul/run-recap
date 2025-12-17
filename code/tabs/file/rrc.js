function rrcOrganize(attempt) {
    attempt.bosses = []
    attempt.intermissions = []
    attempt.cutscenes = []
    attempt.runnguns = []
    attempt.dlcLevels = []
    attempt.bossTime = 0
    attempt.intermissionTime = 0
    attempt.mapTime = 0
    attempt.cutsceneTime = 0
    attempt.scorecardTime = 0
    attempt.scenes.forEach((scene, index) => {
        scene.segment = parseFloat(scene.endTime)
        if (index) {
            scene.segment = convertToSeconds(scene.endTime) - convertToSeconds(attempt.scenes[index - 1].endTime)
        }
    })
    let mapTime = 0
    let kdTotal = 0
    attempt.scenes.forEach((scene, index) => {
        const boss = cupheadBosses[scene.name]
        if (scene.name.startsWith('level_dice_palace')) {
            kdTotal += scene.segment
            if (attempt.scenes[index + 1].name == 'win') scene.kdTotal = kdTotal
        }
        if (scene.name.startsWith('map')) {
            mapTime += scene.segment
            attempt.mapTime += scene.segment
        } else if (scene.name.startsWith('cutscene')) {
            attempt.cutscenes.push(scene)
            attempt.cutsceneTime += scene.segment
        } else if (scene.name.startsWith('level_platforming')) {
            attempt.runnguns.push(scene)
            attempt.intermissionTime += scene.segment
        } else if (scene.name.startsWith('level_chess' || scene.name == 'level_graveyard')) {
            attempt.dlcLevels.push(scene)
            attempt.intermissionTime += scene.segment
        } else if (boss) {
            attempt.bossTime += scene.segment
            if (scene.levelTime) {
                scene.map = mapTime
                mapTime = 0
                scene.scorecard = attempt.scenes[index + 1]
                scene.scorecardSegment = scene.scorecard?.segment
                scene.trueScorecard = index < attempt.scenes.length - 1 ? scene.scorecard.segment : 0
                if (scene.scorecard?.hp) scene.trueScorecard -= 0.8
                if (scene.scorecard?.parries) scene.trueScorecard -= 0.8
                if (scene.scorecard?.superMeter) scene.trueScorecard -= 0.8
                if (scene.scorecard?.coins) scene.trueScorecard -= 0.8
                attempt.bosses.push(scene)
            }
        } else if (scene.name == 'win') {
            attempt.scorecardTime += scene.segment
        } else if (['level_dice_palace_cigar', 'level_dice_palace_rabbit', 'level_dice_palace_roulette'].includes(scene.name)) {
            attempt.bossTime += scene.segment
        } else {
            attempt.intermissionTime += scene.segment
            attempt.intermissions.push(scene)
        }
    })
}
function generate_rrc() {
    let HTMLContent = ''
    if (runRecap_rrcFile.attempts) {
        rrcUpdateBrowser()
        rrcCurrentAttempt = { scenes: runRecap_rrcFile.attempts[rrcAttemptIndex].scenes.map(s => ({ ...s })) }
        rrcOrganize(rrcCurrentAttempt)
        rrcComparisonAttempt = { scenes: [] }
        bossIndex = 0
        runRecapCategory.topRuns[rrcComparisonIndex].rrc.endTimes.forEach((endTime, index) => {
            const newScene = { name: rrc80[index], endTime: endTime }
            if (cupheadBosses[newScene.name]) {
                if (!(newScene.name == 'level_dice_palace_main' && rrc80[index + 1] != 'win')) {
                    newScene.levelTime = runRecapCategory.topRuns[rrcComparisonIndex].runRecap[bossIndex]
                    bossIndex++
                }
            }
            rrcComparisonAttempt.scenes.push(newScene)
        })
        rrcOrganize(rrcComparisonAttempt)
        HTMLContent += classicView()
        // HTMLContent += `<div class="container grow dim" style="margin:0;gap:10px"
        //                     onclick="openModal(rrcComparisonContent(),'RTA COMPARISON')">
        //                     &Delta;
        //                     <div>${rrcComparison}</div>
        //                 </div>`
        HTMLContent += `<div class='dim container' style='margin-top:20px'>You vs. Quincely0</div>`
        HTMLContent += `<div class='container' style='gap:20px;align-items:flex-start;margin-top:20px'>`
        HTMLContent += `</div>`
        // Levels
        HTMLContent += `<div class='container' style='align-items:flex-start;gap:30px'>
        <div class='border background1' style='padding:8px'>
        <div class='font2 container' style='font-size:150%'>Map Movement</div>`
        HTMLContent += rrcExtraTable('map', cupheadBosses)
        HTMLContent += `</div>`
        HTMLContent += `<div class='border background1' style='padding:8px'>
        <div class='font2 container' style='font-size:150%'>Boss RTA</div>`
        HTMLContent += rrcExtraTable('bosses', cupheadBosses)
        HTMLContent += `</div>`
        HTMLContent += `<div class='border background1' style='padding:8px'>
        <div class='font2 container' style='font-size:150%'>Scorecards</div>`
        HTMLContent += rrcExtraTable('scorecard', cupheadBosses)
        HTMLContent += `</div>`
        HTMLContent += `</div>`
        // Run 'n Guns
        HTMLContent += `
        <div class='container' style='align-items:flex-start;gap:30px;margin-top:20px'>
        <div class='border background1' style='padding:8px'>
        <div class='font2 container' style='font-size:150%'>Intermissions</div>
        <div class='container' style='align-items:flex-start;gap:20px'>`
        // if (rrcCurrentAttempt.runnguns.length) {
        //     HTMLContent += `<table>
        // <tr class='gray'>
        // <th colspan=2>Run 'n Guns</th>
        // <th>IGT</th>
        // <tr>`
        //     rrcCurrentAttempt.runnguns.forEach((scene, index) => {
        //         const level = cupheadRunNguns[scene.name]
        //         HTMLContent += `<tr class='${getRowColor(index)}'>
        //         <td class='container ${level?.id}'>${getImage('runnguns/' + level.id, 21)}</td>
        //         <td style='text-align:left'>${level.name}</td>
        //         <td class='${level?.id}'>${scene.levelTime ? secondsToHMS(scene.levelTime, true) : ''}</td>
        //         </tr>`
        //     })
        //     HTMLContent += `</table>`
        // }
        function rrcExtraTable(field, sceneNames) {
            let HTMLContent = ''
            let headerContent = '&nbsp;'
            HTMLContent += `<table>
            <tr class='gray'>
            <th colspan=10>${headerContent}</th>
            <tr>`
            let deltaSum = 0
            let attemptField = field
            if (field == 'map') attemptField = 'bosses'
            if (field == 'scorecard') attemptField = 'bosses'
            let thingToAnalyze = 'segment'
            if (field == 'map') thingToAnalyze = 'map'
            if (field == 'scorecard') thingToAnalyze = 'scorecardSegment'
            rrcCurrentAttempt[attemptField].forEach((scene, index) => {
                let currentSegment = scene[thingToAnalyze]
                if (field == 'bosses' && scene.name == 'level_dice_palace_main') currentSegment = scene.kdTotal - (6.45 * 4)
                if (field == 'bosses' && scene.scorecard) currentSegment -= 6.45
                let comparisonSegment = rrcComparisonAttempt[attemptField][index][thingToAnalyze]
                if (field == 'bosses' && scene.name == 'level_dice_palace_main') comparisonSegment = rrcComparisonAttempt[attemptField][index].kdTotal - (6.45 * 4)
                if (field == 'bosses' && scene.scorecard) comparisonSegment -= 6.45
                const delta = (currentSegment - comparisonSegment) || 0
                deltaSum += delta
                const content = attemptField == 'bosses' ? getImage(cupheadBosses[scene.name].id, 21) : sceneNames[scene.name]
                HTMLContent += `<tr class='${getRowColor(index)}'>
            <td class='${attemptField == 'bosses' ? 'container ' + cupheadBosses[scene.name].id : ''}' style='text-align:left'>${content}</td>
            <td style='padding:0 5px'>${currentSegment ? secondsToHMS(currentSegment, true) : ''}</td>
            <td class='${redGreen(delta)}' style='font-size:80%'>${delta ? getDelta(delta.toFixed(2)) : ''}</td>
            <td class='dim' style='font-size:80%'>${comparisonSegment ? secondsToHMS(comparisonSegment, true) : ''}</td>
            </tr>`
            })
            HTMLContent += `<tr>
            <td colspan=10 class='${redGreen(deltaSum)}'>${getDelta(deltaSum.toFixed(2))}</td>
            </tr>
            </table>`
            return HTMLContent
        }
        // Other
        HTMLContent += rrcExtraTable('intermissions', cupheadIntermissions)
        HTMLContent += `</div>
        </div>`
        // Cutscene
        HTMLContent += `<div class='border background1' style='padding:8px'>
        <div class='font2 container' style='font-size:150%'>Cutscenes</div>`
        HTMLContent += rrcExtraTable('cutscenes', cupheadCutscenes)
        HTMLContent += `</div>
        </div>`
        if (rrcCurrentAttempt.scenes.at(-1).name == 'level_devil') {
            HTMLContent += fancyScorecard()
        }
        HTMLContent += `</div>`
        HTMLContent += `<div class='container' style='gap:10px;margin-top:15px'>
        <div class='button cuphead' onclick="rrcRaw()">Show raw</div>
        <div class='button cuphead' onclick="runRecapCopy()" style='width:165px'><i class="fa fa-clone"></i>&nbsp;Copy to clipboard</div>
        </div>`
    } else {
        HTMLContent += `<div class='container'>No .rrc file uploaded!</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
}
function rrcUpdateBrowser() {
    let HTMLContent = ''
    HTMLContent += `<div class='container'>
        <div class='grow ${rrcAttemptIndex == runRecap_rrcFile.attempts.length - 1 ? 'grayedOut' : ''}' onclick="rrcChangeIndex(${rrcAttemptIndex + 1})">${fontAwesome('chevron-left')}</div>
        <select onchange="rrcChangeIndex(parseInt(this.value),true)">`
    runRecap_rrcFile.attempts.forEach((attempt, index) => {
        let content = attempt.id + ' - ' + attempt.startedAt
        const lastScene = attempt.scenes.at(-1)
        if (lastScene.name == 'level_devil') {
            content += ' - ' + secondsToHMS(lastScene.endTime)
        }
        HTMLContent += `<option value='${index}' ${rrcAttemptIndex == index ? 'selected' : ''}>${content}</option>`
    })
    HTMLContent += `</select>
        <div class='grow ${rrcAttemptIndex == 0 ? 'grayedOut' : ''}' onclick="rrcChangeIndex(${rrcAttemptIndex - 1})">${fontAwesome('chevron-right')}</div>
        </div>`
    HTMLContent += `<div class='container' style='gap:2px;margin:3px'>`
    for (let i = rrcAttemptIndex + 7; i >= rrcAttemptIndex - 7; i--) {
        const attempt = runRecap_rrcFile.attempts[i]
        if (attempt) {
            let className = ''
            if (attempt.scenes.length <= 3) className = 'dim'
            if (attempt.scenes.at(-1).name == 'level_devil') className = 'myekulColor'
            HTMLContent += `<div class='clickable ${className}' style='text-align:center;width:14px;font-size:${rrcAttemptIndex == i ? '80%' : '50%'}' onclick="rrcChangeIndex(${i})">${fontAwesome('circle')}</div>`
        } else {
            HTMLContent += `<div style='width:14px'></div>`
        }
    }
    HTMLContent += `</div>`
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
                <td>${secondsToHMS(scene.map, true)}</td>
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
function fancyScorecard() {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='margin-top:20px'>
        <div class='spinning-div border'>
        <div style='margin:0 auto;position:relative'>
            <img class='container' src="images/results.gif" style='height:100px;margin-bottom:8px'>
            <img id='scorecardLine' class='container' src='images/scorecard_line.png'>
            <img class='container' src="images/scorecard.png" style='height:400px'>
            <div id='scorecardText' style='color:floralwhite'>
            <p>BOSS RTA ${". ".repeat(10)}</p>
            <p>INTERMISSIONS ${". ".repeat(4)}</p>
            <p>MAP MOVEMENT ${". ".repeat(3)}</p>
            <p>CUTSCENES ${". ".repeat(8)}</p>
            <p>SCORECARDS ${". ".repeat(6)}</p>`
    // HTMLContent += `<p>STAR SKIPS ${". ".repeat(8)}</p>`
    HTMLContent += `</div>
            <div id='scorecardTimes' class='myekulColor'>
            <p>${secondsToHMS(rrcCurrentAttempt.bossTime, true)}</p>
            <p>${secondsToHMS(rrcCurrentAttempt.intermissionTime, true)}</p>
            <p>${secondsToHMS(rrcCurrentAttempt.mapTime, true)}</p>
            <p>${secondsToHMS(rrcCurrentAttempt.cutsceneTime, true)}</p>
            <p>${secondsToHMS(rrcCurrentAttempt.scorecardTime, true)}</p>
            </div>
            <div id='scorecardFinal' class='myekulColor'>${secondsToHMS(rrcCurrentAttempt.scenes.at(-1).endTime, true)}</div>
        </div>
        </div>`
    return HTMLContent
}
function read_rrc(content) {
    try {
        runRecap_rrcFile = JSON.parse(content)
        runRecap_rrcFile.attempts.forEach(attempt => {
            attempt.scenes.forEach(scene => {
                scene.endTime = convertToSeconds(scene.endTime.slice(3))
            })
        })
        runRecap_rrcFile.attempts.reverse()
        // console.log(JSON.stringify(runRecap_rrcFile))
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