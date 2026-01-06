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
                        const categoryScenes = commBestILs[category].scenes
                        commBestILs[category].rrcTopBests = new Array(categoryScenes.length).fill([])
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
                                commBestILs[category].topRuns[index].rrc = rrc.scenes
                            } else {
                                reconstructRRC(category, rrc.endTimes, index)
                            }
                            rrcSegments(commBestILs[category].topRuns[index].rrc)
                        })
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
function rrcComparisonCollectionPrepare() {
    rrcComparisonCollection = {
        'Top 3 Average': Array.from({ length: runRecapCategory.scenes.length }, () => ({
            segment: 0,
            endTime: 0
        })),
        'Top Average': Array.from({ length: runRecapCategory.scenes.length }, () => ({
            segment: 0,
            endTime: 0
        })),
        "Top Bests": Array.from({ length: runRecapCategory.scenes.length }, () => ({
            segment: Infinity,
            endTime: Infinity
        })),
    }
    runRecapCategory.topRuns.forEach((player, index) => {
        rrcComparisonCollection['Player ' + index] = runRecapCategory.topRuns[index].rrc
        runRecapCategory.topRuns[index].rrc.forEach((scene, sceneIndex) => {
            const topBestScene = rrcComparisonCollection['Top Bests'][sceneIndex]
            if (scene.segment < topBestScene.segment) {
                topBestScene.name = scene.name
                topBestScene.segment = scene.segment
                runRecapCategory.rrcTopBests[sceneIndex] = [index]
            } else if (scene.segment == topBestScene.segment) {
                runRecapCategory.rrcTopBests[sceneIndex].push(index)
            }
            if (scene.endTime < topBestScene.endTime) {
                topBestScene.endTime = scene.endTime
            }
        })
    })
    for (let i = 0; i < runRecapCategory.scenes.length; i++) {
        rrcComparisonCollection['Top 3 Average'][i].name = runRecapCategory.scenes[i]
        rrcComparisonCollection['Top Average'][i].name = runRecapCategory.scenes[i]
        runRecapCategory.topRuns.forEach((run, index) => {
            if (index < 3) {
                rrcComparisonCollection['Top 3 Average'][i].endTime += run.rrc[i].endTime
                rrcComparisonCollection['Top 3 Average'][i].segment += run.rrc[i].segment
            }
            rrcComparisonCollection['Top Average'][i].endTime += run.rrc[i].endTime
            rrcComparisonCollection['Top Average'][i].segment += run.rrc[i].segment
        })
        rrcComparisonCollection['Top 3 Average'][i].endTime /= 3
        rrcComparisonCollection['Top 3 Average'][i].segment /= 3
        rrcComparisonCollection['Top Average'][i].endTime /= runRecapCategory.topRuns.length
        rrcComparisonCollection['Top Average'][i].segment /= runRecapCategory.topRuns.length
    }
}
function reconstructRRC(category, endTimes, playerIndex) {
    const categoryScenes = commBestILs[category].scenes
    bossIndex = 0
    winIndex = 0
    endTimes.forEach((endTime, index) => {
        const newScene = { name: categoryScenes[index], endTime: convertToSeconds(endTime) }
        if (cupheadBosses[newScene.name]) {
            if (!(newScene.name == 'level_dice_palace_main' && categoryScenes[index + 1] != 'win')) {
                newScene.levelTime = commBestILs[category].topRuns[playerIndex].runRecap[bossIndex]
                bossIndex++
            }
        }
        if (newScene.name == 'win') {
            newScene.starSkips = commBestILs[category].topRuns[playerIndex].starSkips[winIndex] * 2
            newScene.hp = true
            if (!cupheadRunNguns[categoryScenes[index - 1]]) newScene.superMeter = true
            if (category == '1.1+') {
                if (['slime', 'flying_blimp', 'flying_bird', 'flying_genie', 'clown', 'robot', 'pirate', 'train', 'dice_palace_main'].includes(categoryScenes[index - 1].slice(6))) {
                    newScene.parries = true
                }
                if (index == 4 && !commBestILs[category].topRuns[playerIndex].follies) newScene.parries = true
                if (index == 4) newScene.coins = true
                if (index == 56 && commBestILs[category].topRuns[playerIndex].werner) newScene.parries = true
                if (index == 62 && commBestILs[category].topRuns[playerIndex].cala) newScene.parries = true
                if (index == 76 && commBestILs[category].topRuns[playerIndex].kd) newScene.hp = false
            }
            winIndex++
        }
        commBestILs[category].topRuns[playerIndex].rrc.push(newScene)
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