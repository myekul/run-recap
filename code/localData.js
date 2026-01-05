function prepareLocalData() {
    fetch('resources/topData.json')
        .then(response => response.json())
        .then(data => {
            for (const category in data) {
                commBestILs[category].topRuns = data[category]
            }
            fetch('resources/rrcData.json')
                .then(response => response.json())
                .then(data => {
                    for (const category in data) {
                        rrcTopBests = new Array(rrc80.length).fill([])
                        data[category].forEach((rrc, index) => {
                            commBestILs[category].topRuns[index].rrc = []
                            if (rrc.scenes) {
                                rrc.endTimes = []
                                let winIndex = 0
                                rrc.scenes.forEach(scene => {
                                    rrc.endTimes.push(scene.endTime)
                                    if (scene.name == 'win') {
                                        scene.starSkips = commBestILs[category].topRuns[index].starSkips[winIndex] * 2
                                        winIndex++
                                    }
                                })
                                runRecapCategory.topRuns[index].rrc = rrc.scenes
                            } else {
                                reconstructRRC(rrc.endTimes, index)
                            }
                            rrcSegments(runRecapCategory.topRuns[index].rrc)
                            rrcComparisonCollection['Player ' + index] = commBestILs[category].topRuns[index].rrc
                            commBestILs[category].topRuns[index].rrc.forEach((scene, sceneIndex) => {
                                const topBestScene = rrcComparisonCollection['Top Bests'][sceneIndex]
                                if (scene.segment < topBestScene.segment) {
                                    topBestScene.name = scene.name
                                    topBestScene.segment = scene.segment
                                    rrcTopBests[sceneIndex] = [index]
                                } else if (scene.segment == topBestScene.segment) {
                                    rrcTopBests[sceneIndex].push(index)
                                }
                                if (scene.endTime < topBestScene.endTime) {
                                    topBestScene.endTime = scene.endTime
                                }
                            })
                        })
                        for (let i = 0; i < rrc80.length; i++) {
                            rrcComparisonCollection['Top 3 Average'][i].name = rrc80[i]
                            rrcComparisonCollection['Top Average'][i].name = rrc80[i]
                            commBestILs[category].topRuns.forEach((run, index) => {
                                if (index < 3) {
                                    rrcComparisonCollection['Top 3 Average'][i].endTime += run.rrc[i].endTime
                                    rrcComparisonCollection['Top 3 Average'][i].segment += run.rrc[i].segment
                                }
                                rrcComparisonCollection['Top Average'][i].endTime += run.rrc[i].endTime
                                rrcComparisonCollection['Top Average'][i].segment += run.rrc[i].segment
                            })
                            rrcComparisonCollection['Top 3 Average'][i].endTime /= 3
                            rrcComparisonCollection['Top 3 Average'][i].segment /= 3
                            rrcComparisonCollection['Top Average'][i].endTime /= commBestILs[category].topRuns.length
                            rrcComparisonCollection['Top Average'][i].segment /= commBestILs[category].topRuns.length
                        }
                    }
                })
        })
    fetch('resources/alt.json')
        .then(response => response.json())
        .then(data => {
            alt = data
            organizeAltStrats()
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
            newScene.hp = true
            if (!cupheadRunNguns[rrc80[index - 1]]) newScene.superMeter = true
            if (['slime', 'flying_blimp', 'flying_bird', 'flying_genie', 'clown', 'robot', 'pirate', 'train', 'dice_palace_main'].includes(rrc80[index - 1].slice(6))) {
                newScene.parries = true
            }
            if (index == 4 && !runRecapCategory.topRuns[playerIndex].follies) newScene.parries = true
            if (index == 4) newScene.coins = true
            if (index == 56 && runRecapCategory.topRuns[playerIndex].werner) newScene.parries = true
            if (index == 62 && runRecapCategory.topRuns[playerIndex].cala) newScene.parries = true
            if (index == 76 && runRecapCategory.topRuns[playerIndex].kd) newScene.hp = false
            winIndex++
        }
        runRecapCategory.topRuns[playerIndex].rrc.push(newScene)
    })
}
function organizeAltStrats() {
    for (const category in alt) {
        for (const boss in alt[category]) {
            for (const obj of alt[category][boss]) {
                if (!obj.title) {
                    altStratNum++
                }
            }
        }
    }
    const chunks = [
        ['1.1+', 'Legacy', 'forestfollies'],
        ['1.1+', 'NMG', 'hildaberg'],
        ['1.1+', 'NMG', 'grimmatchstick'],
        ['DLC', 'DLC C/S', 'estherwinchester'],
        ['NMG', 'DLC+Base', 'hildaberg'],
        ['NMG', 'DLC+Base', 'cagneycarnation'],
        ['NMG', 'DLC+Base', 'baronessvonbonbon'],
        ['DLC+Base', 'DLC+Base C/S', 'hildaberg'],
        ['DLC+Base', 'DLC+Base C/S', 'wallywarbles'],
        ['DLC+Base', 'DLC+Base C/S', 'djimmithegreat'],
        ['DLC+Base', 'DLC+Base C/S', 'drkahlsrobot'],
        ['DLC+Base', 'DLC+Base C/S', 'calamaria'],
        ['DLC', 'DLC C/S', 'forestfollies'],
        ['DLC', 'DLC+Base', 'forestfollies'],
        ['DLC', 'DLC+Base C/S', 'forestfollies']
    ]
    for (const [copy, paste, boss] of chunks) {
        alt[paste][boss] = alt[copy][boss]
    }
    copyDLC('DLC', 'DLC+Base')
    copyDLC('DLC C/S', 'DLC+Base C/S')
}
function copyDLC(copy, paste) {
    const dlc = ['glumstonethegiant', 'mortimerfreeze', 'thehowlingaces', 'estherwinchester', 'moonshinemob', 'chefsaltbaker']
    dlc.forEach(boss => {
        alt[paste][boss] = alt[copy][boss]
    })
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