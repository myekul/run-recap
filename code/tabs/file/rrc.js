function generate_rrc() {
    let HTMLContent = ''
    if (runRecap_rrcFile.attempts) {
        HTMLContent += `<div class='container'>
        <div class='grow ${rrcAttemptIndex == runRecap_rrcFile.attempts.length - 1 ? 'grayedOut' : ''}' onclick="rrcChangeIndex(${rrcAttemptIndex + 1})">${fontAwesome('chevron-left')}</div>
        <select onchange="rrcChangeIndex(parseInt(this.value),true)">`
        runRecap_rrcFile.attempts.forEach((attempt, index) => {
            let content = attempt.id
            const lastScene = attempt.scenes.at(-1)
            if (lastScene.name == 'level_devil') {
                content += ' - ' + secondsToHMS(lastScene.endTime)
            }
            HTMLContent += `<option value='${index}' ${rrcAttemptIndex == index ? 'selected' : ''}>${content}</option>`
        })
        HTMLContent += `</select>
        <div class='grow ${rrcAttemptIndex == 0 ? 'grayedOut' : ''}' onclick="rrcChangeIndex(${rrcAttemptIndex - 1})">${fontAwesome('chevron-right')}</div>
        </div>`
        HTMLContent += `<div class='container' style='gap:2px;margin:5px'>`
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
        const currentAttempt = runRecap_rrcFile.attempts[rrcAttemptIndex]
        currentAttempt.levels = []
        currentAttempt.intermissions = []
        currentAttempt.cutscenes = []
        currentAttempt.bossTime = 0
        currentAttempt.intermissionTime = 0
        currentAttempt.mapTime = 0
        currentAttempt.cutsceneTime = 0
        currentAttempt.scorecardTime = 0
        currentAttempt.scenes.forEach((scene, index) => {
            scene.segment = scene.endTime
            if (index) {
                scene.segment = convertToSeconds(scene.endTime) - convertToSeconds(currentAttempt.scenes[index - 1].endTime)
            }
        })
        let mapTime = 0
        currentAttempt.scenes.forEach((scene, index) => {
            const level = cupheadLevels[scene.name]
            if (scene.name.startsWith('map')) {
                mapTime += scene.segment
                currentAttempt.mapTime += scene.segment
            } else if (scene.name.startsWith('cutscene')) {
                currentAttempt.cutscenes.push(scene)
                currentAttempt.cutsceneTime += scene.segment
            } else if (level && level?.id != 'forestfollies') {
                currentAttempt.bossTime += scene.segment
                if (scene.levelTime) {
                    scene.map = mapTime
                    mapTime = 0
                    scene.scorecard = currentAttempt.scenes[index + 1]
                    scene.trueScorecard = index < currentAttempt.scenes.length - 1 ? scene.scorecard.segment : 0
                    if (scene.scorecard?.hp) scene.trueScorecard -= 0.8
                    if (scene.scorecard?.parries) scene.trueScorecard -= 0.8
                    if (scene.scorecard?.super) scene.trueScorecard -= 0.8
                    if (scene.scorecard?.coins) scene.trueScorecard -= 0.8
                    currentAttempt.levels.push(scene)
                }
            } else if (scene.name == 'win') {
                currentAttempt.scorecardTime += scene.segment
            } else {
                currentAttempt.intermissionTime += scene.segment
            }
        })
        HTMLContent += `<div class='container' style='gap:20px;align-items:flex-start'>`
        HTMLContent += `<table>`
        currentAttempt.scenes.forEach((scene, index) => {
            const level = cupheadLevels[scene.name]
            HTMLContent += `<tr class='${getRowColor(index)}'>
            <td class='container ${level?.id}'>${level && level?.id != 'forestfollies' ? getImage(level.id, 21) : ''}</td>
            <td class='${level?.id}'>${scene.levelTime ? secondsToHMS(scene.levelTime, true) : ''}</td>
            <td class='dim' style='font-size:70%;text-align:left'>${scene.name}</td>
            <td>${secondsToHMS(scene.segment, true)}</td>
            <td>${secondsToHMS(scene.endTime, true)}</td>
            </tr>`
        })
        HTMLContent += `</table>`
        HTMLContent += `<div>
        <table>`
        HTMLContent += `<tr class='gray'>
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
        currentAttempt.levels.forEach((scene, index) => {
            const level = cupheadLevels[scene.name]
            const split = level.id != 'thedevil' ? secondsToHMS(scene.scorecard?.endTime, true) : secondsToHMS(scene.endTime, true)
            let splitBefore = secondsToHMS(scene.endTime - 6.45, true)
            if (level.id == 'forestfollies') splitBefore = ''
            if (level.id == 'thedevil') splitBefore = split
            HTMLContent += `<tr class='${getRowColor(index)}'>
                <td>${secondsToHMS(scene.map, true)}</td>
            <td class='container ${level?.id}'>${level ? getImage(level.id, 21) : ''}</td>
            <td class='${level?.id}'>${scene.levelTime ? secondsToHMS(scene.levelTime, true) : ''}</td>
            <td class='${level?.id}' style='font-size:80%'>${scene.levelTime ? level?.id == 'thedevil' ? secondsToHMS(scene.segment, true) : secondsToHMS(scene.segment - 6.45, true) : ''}</td>
            <td>${index < currentAttempt.levels.length - 1 ? secondsToHMS(scene.scorecard.segment, true) : ''}</td>
            <td>${index < currentAttempt.levels.length - 1 ? scene.scorecard.hp : ''}</td>
            <td>${index < currentAttempt.levels.length - 1 ? scene.scorecard.parries : ''}</td>
            <td>${index < currentAttempt.levels.length - 1 ? scene.scorecard.super || scene.scorecard.coins : ''}</td>
            <td>${index < currentAttempt.levels.length - 1 ? secondsToHMS(scene.trueScorecard, true) : ''}</td>
            <td class='${level?.id}' style='padding:0 5px'>${splitBefore}</td>
            <td class='${level?.id}' style='padding:0 5px'>${split}</td>
            </tr>`
        })
        HTMLContent += `</table>`
        if (currentAttempt.scenes.at(-1).name == 'level_devil') {
            HTMLContent += fancyScorecard(currentAttempt)
        }
        HTMLContent += `</div>`
        HTMLContent += `</div>`
        // HTMLContent += fancyScorecard(currentAttempt)
        HTMLContent += `</div>`
    } else {
        HTMLContent += `<div class='container'>No .rrc file uploaded!</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
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
function fancyScorecard(currentAttempt) {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='margin-top:20px'>
        <div class='spinning-div border'>
        <div style='margin:0 auto;position:relative'>
            <img class='container' src="images/results.gif" style='height:100px;margin-bottom:8px'>
            <img id='scorecardLine' class='container' src='images/scorecard_line.png'>
            <img class='container' src="images/scorecard.png" style='height:400px'>
            <div id='scorecardText' style='color:floralwhite'>
            <p>BOSSES ${". ".repeat(12)}</p>
            <p>INTERMISSIONS ${". ".repeat(4)}</p>
            <p>MAP MOVEMENT ${". ".repeat(3)}</p>
            <p>CUTSCENES ${". ".repeat(8)}</p>
            <p>SCORECARDS ${". ".repeat(6)}</p>`
    // HTMLContent += `<p>STAR SKIPS ${". ".repeat(8)}</p>`
    HTMLContent += `</div>
            <div id='scorecardTimes' class='myekulColor'>
            <p>${secondsToHMS(currentAttempt.bossTime, true)}</p>
            <p>${secondsToHMS(currentAttempt.intermissionTime, true)}</p>
            <p>${secondsToHMS(currentAttempt.mapTime, true)}</p>
            <p>${secondsToHMS(currentAttempt.cutsceneTime, true)}</p>
            <p>${secondsToHMS(currentAttempt.scorecardTime, true)}</p>
            </div>
            <div id='scorecardFinal' class='myekulColor'>${secondsToHMS(currentAttempt.scenes.at(-1).endTime, true)}</div>
        </div>
        </div>`
    return HTMLContent
}
function read_xml(content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "application/xml");
    runRecap_xmlFile = {}
    runRecap_xmlFile.version = "1.0"
    runRecap_xmlFile.attempts = [...xmlDoc.getElementsByTagName("Attempt")].map(attempt => {
        const id = Number(attempt.getAttribute("id"))
        const scenes = [...attempt.getElementsByTagName("Scene")].map(scene => {
            const sceneObj = {
                name: scene.getAttribute("name")
            }
            const levelTimeEl = scene.getElementsByTagName("LevelTime")[0]?.textContent
            if (levelTimeEl) sceneObj.levelTime = Number(levelTimeEl)
            const endTimeEl = scene.getElementsByTagName("EndTime")[0]?.textContent
            if (endTimeEl) sceneObj.endTime = endTimeEl
            const hpEl = scene.getElementsByTagName("HPBonus")[0]?.textContent
            if (hpEl) sceneObj.hp = Number(hpEl)
            const parriesEl = scene.getElementsByTagName("Parries")[0]?.textContent
            if (parriesEl) sceneObj.parries = Number(parriesEl)
            const superEl = scene.getElementsByTagName("SuperMeter")[0]?.textContent
            if (superEl) sceneObj.super = Number(superEl)
            const coinsEl = scene.getElementsByTagName("Coins")[0]?.textContent
            if (coinsEl) sceneObj.coins = Number(coinsEl)
            return sceneObj
        })
        return { id, scenes }
    })
    console.log(JSON.stringify(runRecap_xmlFile))
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