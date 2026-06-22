async function prepareLocalData() {
    const [scenes, rrcData, commBestData, runViableData, altData] = await Promise.all([
        fetch('resources/scenes.json').then(r => r.json()),
        fetch('resources/rrcData.json').then(r => r.json()),
        fetch('resources/commBest.json').then(r => r.json()),
        fetch('resources/runViable.json').then(r => r.json()),
        fetch('resources/alt.json').then(r => r.json())
    ])
    commBest = commBestData
    runViable = runViableData
    alt = altData
    runViable['DLC+Base L/S'].unshift(...runViable['DLC L/S'])
    runViable['DLC+Base C/S'].unshift(...runViable['DLC C/S'])
    // scenes
    scenes['DLC+Base'] = scenes['DLC+Base C/S']
    for (const category in scenes) {
        if (commBestILs[category]) commBestILs[category].scenes = scenes[category]
    }
    commBestILs['Legacy'].scenes = [...commBestILs['1.1+'].scenes]
    commBestILs['Legacy'].scenes[70] = 'level_dice_palace_chips'
    commBestILs['Legacy'].scenes[72] = 'level_dice_palace_domino'
    commBestILs['Legacy'].scenes[74] = 'level_dice_palace_flying_memory'
    commBestILs['NMG'].scenes = commBestILs['1.1+'].scenes
    commBestILs['DLC'].scenes = commBestILs['DLC L/S'].scenes
    commBestILs['DLC+Base'].scenes = commBestILs['DLC+Base C/S'].scenes
    // rrcData
    rrcData['DLC+Base'] = rrcData['DLC+Base C/S']
    rrcData['DLC'] = rrcData['DLC L/S']
    for (const category in rrcData) {
        commBestILs[category].topRuns = rrcData[category]
        const categoryScenes = commBestILs[category].scenes
        commBestILs[category].rrcTopBests = new Array(categoryScenes.length).fill([])
        rrcData[category].forEach((rrc, index) => {
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
            let segmentSumBefore = 0
            let segmentSumAfter = 0
            let nextNull = false
            currentRun.splitBefore = []
            currentRun.splitAfter = []
            currentRun.segmentBefore = []
            currentRun.segmentAfter = []
            currentRun.rrc.forEach((scene, sceneIndex) => {
                const segment = sceneIndex == 0 ? scene.endTime : scene.endTime - currentRun.rrc[sceneIndex - 1].endTime
                segmentSumBefore += segment
                segmentSumAfter += segment
                if (scene.name == 'win' || ['level_platforming_1_1F', 'level_mausoleum', 'level_chalice_tutorial', 'level_devil', 'level_saltbaker'].includes(scene.name)) {
                    if (['level_devil', 'level_saltbaker'].includes(scene.name)) {
                        let endTime = scene.endTime
                        if (scene.name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base') {
                            endTime -= 8.45
                        }
                        currentRun.splitBefore.push(endTime)
                    } else if (['level_platforming_1_1F', 'level_mausoleum', 'level_chalice_tutorial'].includes(scene.name)) {
                        currentRun.splitBefore.push(null)
                    } else if (currentRun.rrc[sceneIndex - 1].name != 'level_platforming_1_1F' && !(currentRun.rrc[sceneIndex - 1].name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base')) {
                        currentRun.splitBefore.push(currentRun.rrc[sceneIndex - 1].endTime - 6.45)
                    }
                    if (['level_platforming_1_1F', 'level_mausoleum', 'level_chalice_tutorial'].includes(scene.name)) {
                        currentRun.segmentBefore.push(null)
                        nextNull = true
                    } else if (currentRun.rrc[sceneIndex - 1].name != 'level_platforming_1_1F' && !(scene.name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base')) {
                        if (nextNull) {
                            currentRun.segmentBefore.push(null)
                            segmentSumBefore = segment
                            nextNull = false
                        } else {
                            let result = segmentSumBefore
                            if (sceneIndex < currentRun.rrc.length - 1) {
                                result -= segment
                                if (currentRun.rrc[sceneIndex - 1].name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base') result -= 2
                                if (currentRun.rrc[sceneIndex - 1].name == 'level_veggies' && commBestILs[category].name == 'DLC+Base') result += 2
                            } else {
                                result += 6.45
                            }
                            currentRun.segmentBefore.push(result)
                            segmentSumBefore = segment
                        }
                    }
                    let splitAfter = scene.endTime
                    if (scene.name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base') splitAfter -= 8.45
                    if (scene.name != 'level_platforming_1_1F' && currentRun.rrc[sceneIndex - 1].name != 'level_saltbaker') {
                        currentRun.splitAfter.push(splitAfter)
                        if (scene.name == 'level_saltbaker' && commBestILs[category].name == 'DLC+Base') segmentSumAfter -= 8.45
                        if (currentRun.rrc[sceneIndex - 1].name == 'level_veggies' && commBestILs[category].name == 'DLC+Base') segmentSumAfter += 8.45
                        currentRun.segmentAfter.push(segmentSumAfter)
                        segmentSumAfter = 0
                    }
                }
            })
        })
    }
    commBest['DLC+Base L/S'].before.unshift(...commBest['DLC L/S'].before)
    commBest['DLC+Base C/S'].before.unshift(...commBest['DLC C/S'].before)
    commBest['DLC+Base C/S'].after.unshift(...commBest['DLC C/S'].after);
    ['NMG', 'DLC L/S', 'DLC+Base L/S'].forEach(category => {
        commBest[category].after = []
        const WR = commBestILs[category].topRuns[0]
        for (let i = 0; i < WR.splitAfter.length; i++) {
            commBest[category].after.push({
                segment: WR.segmentAfter[i],
                segmentRunner: commBestILs[category].topRuns[0].name,
                split: WR.splitAfter[i],
                splitRunner: commBestILs[category].topRuns[0].name
            })
        }
    })
    organizeAltStrats()
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
    const uniqueURLs = new Set()
    for (const category in alt) {
        for (const boss in alt[category]) {
            for (const obj of alt[category][boss]) {
                if (!obj.title && !uniqueURLs.has(obj.url)) {
                    altStratNum++
                    uniqueURLs.add(obj.url)
                }
            }
        }
    }
    const chunks = [
        ['1.1+', 'Legacy', 'forestfollies'],
        ['1.1+', '1.1+ All Flags', 'forestfollies'],
        ['1.1+', 'OG Charge', 'hildaberg'],
        ['1.1+', '1.1+ Low%', 'hildaberg'],
        ['1.1+', 'NMG', 'hildaberg'],
        ['1.1+', 'NMG', 'grimmatchstick'],
        ['1.1+', 'NMG', 'rumorhoneybottoms'],
        ['1.1+', 'DLC+Base L/S', 'hildaberg'],
        ['Legacy', 'Low% 1.0', 'hildaberg'],
        ['NMG', 'DLC+Base L/S', 'cagneycarnation'],
        ['NMG', 'DLC+Base L/S', 'baronessvonbonbon'],
        ['1.1+ Low%', 'OG Charge', 'djimmithegreat'],
        ['DLC L/S', 'DLC OG Charge', 'mausoleum'],
        ['DLC Expert', '300%', 'glumstonethegiant'],
        ['DLC Expert', '300%', 'mortimerfreeze'],
        ['DLC Expert', '300%', 'thehowlingaces'],
        ['DLC Expert', '300%', 'moonshinemob'],
        ['DLC Expert', '300%', 'chefsaltbaker']
    ]
    for (const [copy, paste, boss] of chunks) {
        alt[paste][boss] = alt[copy][boss].map(strat => ({ ...strat, copy: copy }))
    }
    alt['NMG'].captainbrineybeard = alt['1.1+'].captainbrineybeard
        .filter(strat => strat.title || !strat.name.includes('Squid'))
        .map(strat => ({ ...strat, copy: '1.1+' }))
    copyDuplicate('1.1+', DUPLICATE_FOLLIES_1_1, 'forestfollies')
    copyDuplicate('NMG', DUPLICATE_FOLLIES_NMG, 'forestfollies')
    copyDuplicate('DLC L/S', DUPLICATE_FOLLIES_MAUS, 'forestfollies')
    copyDuplicate('DLC L/S', DUPLICATE_FOLLIES_MAUS, 'mausoleum')
    copyDuplicate('DLC L/S', DUPLICATE_ESTHER, 'estherwinchester')
    const dlc = bosses.slice(19, 25).map(boss => boss.id)
    const plane = ['hildaberg', 'wallywarbles', 'djimmithegreat', 'drkahlsrobot', 'calamaria']
    copyBulk('1.1+', '1.1+ All Flags', bosses.slice(0, 19).map(boss => boss.id))
    copyBulk('DLC L/S', 'DLC+Base L/S', dlc)
    copyBulk('DLC C/S', 'DLC+Base C/S', dlc)
    copyBulk('DLC+Base L/S', 'DLC+Base C/S', plane)
    copyBulk('NMG', 'NMG P/S', plane)
    copyBulk('NMG', 'NMG R/S', plane)
    ALT_STRAT_CATEGORIES.forEach(categoryName => {
        const category = commBestILs[categoryName]
        buttonID = category.className
        if (['dlc', 'dlcbase'].includes(buttonID) && category.shot1) {
            buttonID = category.className + (category.shot1?.charAt(0) || '') + (category.shot2?.charAt(0) || '')
        }
        document.getElementById(buttonID + 'Button').insertAdjacentHTML(
            'afterend',
            `<div class='altStratNum dim' style='display:none'>${altStratSum(categoryName)}</div>`
        )
    })
    let sum = 0
    OTHER_CATEGORIES.forEach(categoryArray => {
        categoryArray.forEach((altStratCategory, index) => {
            const category = commBestILs[altStratCategory]
            const altStrats = alt[altStratCategory]
            for (const boss in altStrats) {
                for (const obj of altStrats[boss]) {
                    if (!obj.title && !obj.copy) {
                        sum++
                    }
                }
            }
        })
    })
    document.getElementById('otherCategoryButton').insertAdjacentHTML(
        'afterend',
        `<div class='altStratNum dim' style='display:none'>${sum}</div>`
    )
}
function copyBulk(copy, paste, bosses) {
    bosses.forEach(boss => {
        alt[paste][boss] = alt[copy][boss].map(strat => ({ ...strat, copy: copy }))
    })
}
function copyDuplicate(copy, pasteArray, boss) {
    pasteArray.forEach(category => {
        alt[category][boss] = alt[copy][boss].map(strat => ({ ...strat, copy: copy }))
    })
}
function organizeCategories() {
    categories = []
    categoryNames = []
    bossesCopy = [...bosses]
    if (runRecapCategory.name == 'DLC' || (runRecapCategory.name == 'Other' && JUST_DLC.includes(altStratOther))) {
        bossesCopy = bossesCopy.slice(19, 25)
    } else if (runRecapCategory.name != 'DLC+Base' && !(runRecapCategory.name == 'Other' && altStratOther == '300%')) {
        bossesCopy = bossesCopy.slice(0, 19)
    }
    if (runRecapCategory.name == 'Other' && altStratOther == 'DLC+Base Simple C/S') bossesCopy = [...bosses.slice(0, 17), ...bosses.slice(19, 24)]
    bossesCopy.sort((a, b) => (a.order || 0) - (b.order || 0));
    if (runRecapCategory.name == 'Other' && altStratOther == '300%') {
        const elem = bossesCopy.splice(18, 1)[0];
        bossesCopy.splice(21, 0, elem);
    }
    // OOB Route
    if (runRecapCategory.tabName == 'DLC+Base L/S OoB') {
        const elementsToMove = bossesCopy.slice(0, 6);
        bossesCopy.splice(0, 6);
        bossesCopy.splice(8, 0, ...elementsToMove);
        const elem = bossesCopy.splice(2, 1)[0];
        bossesCopy.unshift(elem);
    }
    bossesCopy.forEach(boss => {
        categories.push({ name: boss.name, info: boss, runs: [] })
        categoryNames.push(boss.id)
    })
}
function loadRunViableILs() {
    players.forEach(player => {
        player.ILs = new Array(categories.length).fill(0)
    })
    const numRuns = runRecapCategory.topRuns.length
    categories.forEach((category, categoryIndex) => {
        const time = runViable[runRecapCategory.tabName][categoryIndex].time
        const ILs = runViable[runRecapCategory.tabName][categoryIndex].ILs
        ILs.forEach(IL => {
            let playerName = IL.name
            const url = IL.url
            let debug = false
            if (playerName.startsWith("*")) {
                playerName = playerName.slice(1);
                // debug = true
            }
            addPlayer({ name: playerName })
            function addPlayer(player) {
                const initialSize = playerNames.size
                playerNames.add(player.name)
                if (playerNames.size > initialSize) {
                    const playerCopy = { ...player }
                    playerCopy.ILs = new Array(categories.length).fill(0)
                    players.push(playerCopy)
                    return true
                }
            }
            category.runs.push({ debug: debug, player: { name: playerName }, score: time, url: url })
        })
    })
    savComparisonCollection = {
        "Top Average": [],
        "Top 3 Average": [],
        "Top Bests": new Array(categories.length).fill(Infinity),
        topBestPlayers: new Array(categories.length).fill(null),
        "Theory Run": [],
        "Run Viable ILs": []
    }
    runRecapCategory.topRuns.forEach((run, index) => {
        savComparisonCollection['Player ' + (index)] = run.igt
    })
    categories.forEach((category, categoryIndex) => {
        let topSum = 0
        let top3Sum = 0
        runRecapCategory.topRuns.forEach((run, index) => {
            const time = run.igt[categoryIndex]
            topSum += time
            if (index < 3) top3Sum += time
            if (Math.floor(time) < savComparisonCollection['Top Bests'][categoryIndex]) {
                savComparisonCollection['Top Bests'][categoryIndex] = Math.floor(time)
                savComparisonCollection.topBestPlayers[categoryIndex] = [index]
            } else if (Math.floor(time) == savComparisonCollection['Top Bests'][categoryIndex]) {
                savComparisonCollection.topBestPlayers[categoryIndex].push(index)
            }
        })
        savComparisonCollection['Top Average'].push(topSum / numRuns)
        savComparisonCollection['Top 3 Average'].push(top3Sum / (numRuns > 3 ? 3 : numRuns))
        savComparisonCollection['Theory Run'].push((top3Sum + categories[categoryIndex].runs[0].score) / ((numRuns > 3 ? 3 : numRuns) + 1))
        savComparisonCollection['Run Viable ILs'].push(category.runs[0].score)
    })
    if (runRecapCategory.name == '1.1+') savComparisonCollection['TAS'] = runRecapCategory.tas
    commSob = []
    const arr = commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after']
    arr.forEach((split, index) => {
        commSob.push(index == 0 ? convertToSeconds(split.segment) : (convertToSeconds(commSob[index - 1]) + convertToSeconds(split.segment)))
    })
}