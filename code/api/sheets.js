function organizeCategories() {
    categories = []
    bossesCopy = [...bosses]
    if (runRecapCategory.name == 'DLC') {
        bossesCopy = bossesCopy.slice(19, 25)
    } else if (runRecapCategory.name != 'DLC+Base' && !(runRecapCategory.name == 'Other' && altStratOther == '300%')) {
        bossesCopy = bossesCopy.slice(0, 19)
    }
    bossesCopy.sort((a, b) => (a.order || 0) - (b.order || 0));
    if (runRecapCategory.name == 'Other' && altStratOther == '300%') {
        const elem = bossesCopy.splice(18, 1)[0];
        bossesCopy.splice(21, 0, elem);
    }
    // OOB Route
    if (runRecapCategory.tabName == 'DLC+Base 2') {
        const elementsToMove = bossesCopy.slice(0, 6);
        bossesCopy.splice(0, 6);
        bossesCopy.splice(8, 0, ...elementsToMove);
        const elem = bossesCopy.splice(2, 1)[0];
        bossesCopy.unshift(elem);
    }
    bossesCopy.forEach(boss => {
        categories.push({ name: boss.name, info: boss, runs: [] })
    })
}
function loadRunViableILs() {
    organizeCategories()
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
    if (runRecapCategory.markin) {
        loadMarkin()
    } else {
        action()
    }
}