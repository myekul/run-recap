function prepareLocalData() {
    fetch('resources/topData.json')
        .then(response => response.json())
        .then(data => {
            data['DLC+Base'] = data['DLC+Base C/S']
            data['DLC'] = data['DLC L/S']
            for (const category in data) {
                commBestILs[category].topRuns = data[category]
            }
            fetch('resources/scenes.json')
                .then(response => response.json())
                .then(data => {
                    data['DLC+Base'] = data['DLC+Base C/S']
                    for (const category in data) {
                        commBestILs[category].scenes = data[category]
                    }
                    commBestILs['Legacy'].scenes = [...commBestILs['1.1+'].scenes]
                    commBestILs['Legacy'].scenes[70] = 'level_dice_palace_chips'
                    commBestILs['Legacy'].scenes[72] = 'level_dice_palace_domino'
                    commBestILs['Legacy'].scenes[74] = 'level_dice_palace_flying_memory'
                    commBestILs['NMG'].scenes = commBestILs['1.1+'].scenes
                    commBestILs['DLC'].scenes = commBestILs['DLC L/S'].scenes
                    commBestILs['DLC+Base'].scenes = commBestILs['DLC+Base C/S'].scenes
                    fetch('resources/rrcData.json')
                        .then(response => response.json())
                        .then(data => {
                            data['DLC+Base'] = data['DLC+Base C/S']
                            data['DLC'] = data['DLC L/S']
                            for (const category in data) {
                                const categoryScenes = commBestILs[category].scenes
                                commBestILs[category].rrcTopBests = new Array(categoryScenes.length).fill([])
                                data[category].forEach((rrc, index) => {
                                    const currentRun = commBestILs[category].topRuns[index]
                                    currentRun.rrc = []
                                    if (rrc.scenes) {
                                        const savStarSkips = currentRun.starSkips
                                        if (!savStarSkips) currentRun.starSkips = []
                                        const rrcStarSkips = rrc.scenes.some(scene => scene.starSkips)
                                        const savLevelsNeeded = !currentRun.igt
                                        if (savLevelsNeeded) currentRun.igt = []
                                        rrc.endTimes = []
                                        let winIndex = 0
                                        rrc.scenes.forEach((scene, sceneIndex) => {
                                            rrc.endTimes.push(scene.endTime)
                                            if (savLevelsNeeded && cupheadBosses[scene.name] && (rrc.scenes[sceneIndex + 1]?.name == 'win' || ['level_devil', 'level_saltbaker'].includes(scene.name))) {
                                                currentRun.igt.push(scene.levelTime)
                                            }
                                            if (scene.name == 'win') {
                                                if (!rrcStarSkips) {
                                                    scene.starSkips = currentRun.starSkips[winIndex] * 2
                                                } else if (!savStarSkips) {
                                                    currentRun.starSkips.push(scene.starSkips / 2 || 0)
                                                }
                                                winIndex++
                                            }
                                        })
                                        currentRun.rrc = rrc.scenes
                                    } else {
                                        reconstructRRC(category, rrc.endTimes, index)
                                    }
                                })
                                worldRecordData[category] = { splitBefore: [], splitAfter: [], segmentBefore: [], segmentAfter: [] }
                                const rrc = commBestILs[category].topRuns[0].rrc
                                let segmentSumBefore = 0
                                let segmentSumAfter = 0
                                let nextNull = false
                                rrc.forEach((scene, index) => {
                                    const segment = index == 0 ? scene.endTime : scene.endTime - rrc[index - 1].endTime
                                    segmentSumBefore += segment
                                    segmentSumAfter += segment
                                    if (scene.name == 'win' || ['level_platforming_1_1F', 'level_mausoleum', 'level_chalice_tutorial', 'level_devil', 'level_saltbaker'].includes(scene.name)) {
                                        if (['level_devil', 'level_saltbaker'].includes(scene.name)) {
                                            let endTime = scene.endTime
                                            if (scene.name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base') {
                                                endTime -= 8.45
                                            }
                                            worldRecordData[category].splitBefore.push(endTime)
                                        } else if (['level_platforming_1_1F', 'level_mausoleum', 'level_chalice_tutorial'].includes(scene.name)) {
                                            worldRecordData[category].splitBefore.push(null)
                                        } else if (rrc[index - 1].name != 'level_platforming_1_1F' && !(rrc[index - 1].name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base')) {
                                            worldRecordData[category].splitBefore.push(rrc[index - 1].endTime - 6.45)
                                        }
                                        if (['level_platforming_1_1F', 'level_mausoleum', 'level_chalice_tutorial'].includes(scene.name)) {
                                            worldRecordData[category].segmentBefore.push(null)
                                            nextNull = true
                                        } else if (rrc[index - 1].name != 'level_platforming_1_1F' && !(scene.name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base')) {
                                            if (nextNull) {
                                                worldRecordData[category].segmentBefore.push(null)
                                                segmentSumBefore = segment
                                                nextNull = false
                                            } else {
                                                let result = segmentSumBefore
                                                if (index < rrc.length - 1) {
                                                    result -= segment
                                                    if (rrc[index - 1].name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base') result -= 2
                                                    if (rrc[index - 1].name == 'level_veggies' && commBestILs[category].name == 'DLC+Base') result += 2
                                                } else {
                                                    result += 6.45
                                                }
                                                worldRecordData[category].segmentBefore.push(result)
                                                segmentSumBefore = segment
                                            }
                                        }
                                        let splitAfter = scene.endTime
                                        if (scene.name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base') splitAfter -= 8.45
                                        if (scene.name != 'level_platforming_1_1F' && rrc[index - 1].name != 'level_saltbaker') {
                                            worldRecordData[category].splitAfter.push(splitAfter)
                                            if (scene.name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base') segmentSumAfter -= 8.45
                                            if (rrc[index - 1].name == 'level_veggies' && commBestILs[category].name == 'DLC+Base') segmentSumAfter += 8.45
                                            worldRecordData[category].segmentAfter.push(segmentSumAfter)
                                            segmentSumAfter = 0
                                        }
                                    }
                                })
                            }
                        })
                })
        })
    fetch('resources/commBest.json')
        .then(response => response.json())
        .then(data => {
            commBest = data
            commBest['DLC+Base L/S'].before.unshift(...commBest['DLC L/S'].before)
            commBest['DLC+Base C/S'].before.unshift(...commBest['DLC C/S'].before)
            commBest['DLC+Base C/S'].after.unshift(...commBest['DLC C/S'].after)
            fetch('resources/runViable.json')
                .then(response => response.json())
                .then(data => {
                    runViable = data
                    fetch('resources/alt.json')
                        .then(response => response.json())
                        .then(data => {
                            alt = data
                            organizeAltStrats()
                        })
                })
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
    const tempTop = runRecapCategory.topRuns.map(run => run.rrc.map(scene => ({ ...scene })))
    tempTop.forEach(run => rrcSegments(run))
    tempTop.forEach((run, index) => {
        rrcComparisonCollection['Player ' + index] = run
        run.forEach((scene, sceneIndex) => {
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
        tempTop.forEach((run, index) => {
            if (index < 3) {
                rrcComparisonCollection['Top 3 Average'][i].endTime += run[i].endTime
                rrcComparisonCollection['Top 3 Average'][i].segment += run[i].segment
            }
            rrcComparisonCollection['Top Average'][i].endTime += run[i].endTime
            rrcComparisonCollection['Top Average'][i].segment += run[i].segment
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
                newScene.levelTime = commBestILs[category].topRuns[playerIndex].igt[bossIndex]
                bossIndex++
            }
        }
        if (newScene.name == 'win') {
            const hasStarSkips = commBestILs[category].topRuns[playerIndex].starSkips
            if (hasStarSkips) {
                newScene.starSkips = hasStarSkips[winIndex] * 2
            }
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
        ['1.1+', 'NMG', 'rumorhoneybottoms'],
        ['DLC L/S', 'DLC C/S', 'estherwinchester'],
        ['NMG', 'DLC+Base L/S', 'hildaberg'],
        ['NMG', 'DLC+Base L/S', 'cagneycarnation'],
        ['NMG', 'DLC+Base L/S', 'baronessvonbonbon'],
        ['DLC+Base L/S', 'DLC+Base C/S', 'hildaberg'],
        ['DLC+Base L/S', 'DLC+Base C/S', 'wallywarbles'],
        ['DLC+Base L/S', 'DLC+Base C/S', 'djimmithegreat'],
        ['DLC+Base L/S', 'DLC+Base C/S', 'drkahlsrobot'],
        ['DLC+Base L/S', 'DLC+Base C/S', 'calamaria'],
        ['DLC L/S', 'DLC C/S', 'forestfollies'],
        ['DLC L/S', 'DLC+Base L/S', 'forestfollies'],
        ['DLC L/S', 'DLC+Base C/S', 'forestfollies'],
        ['DLC L/S', '300%', 'forestfollies'],
        ['DLC Expert', '300%', 'glumstonethegiant'],
        ['DLC Expert', '300%', 'mortimerfreeze'],
        ['DLC Expert', '300%', 'thehowlingaces'],
        ['DLC Expert', '300%', 'moonshinemob'],
        ['DLC Expert', '300%', 'chefsaltbaker']
    ]
    for (const [copy, paste, boss] of chunks) {
        alt[paste][boss] = alt[copy][boss]
    }
    const temp = []
    alt['1.1+'].captainbrineybeard.forEach(strat => {
        if (strat.title || !strat.name.includes('Squid')) {
            temp.push(strat)
        }
    })
    alt['NMG'].captainbrineybeard = temp
    copyDLC('DLC L/S', 'DLC+Base L/S')
    copyDLC('DLC C/S', 'DLC+Base C/S')
}
function copyDLC(copy, paste) {
    const dlc = ['glumstonethegiant', 'mortimerfreeze', 'thehowlingaces', 'estherwinchester', 'moonshinemob', 'chefsaltbaker']
    dlc.forEach(boss => {
        alt[paste][boss] = alt[copy][boss]
    })
}