function fetchCuphead(markin) {
    const sheetSrc = markin ? markinSheets : myekulSheets
    const sheetID = markin ? '1JgTjjonfC7bh4976NI4pCPeFp8LbA3HMKdvS_47-WtQ' : MYEKUL_SHEET_ID
    return gapi.client.sheets.spreadsheets.get({
        spreadsheetId: sheetID,
        fields: `sheets(properties.title,data(rowData(values(userEnteredValue,textFormatRuns))))`
    }).then(response => {
        const sheets = response.result.sheets
        sheets.forEach(sheet => {
            const sheetName = sheet.properties.title
            let rowData = sheet.data[0].rowData
            if (markin) {
                rowData = rowData.slice(3)
                rowData = rowData.filter(row => row.values && row.values[0] && row.values[0].userEnteredValue)
            }
            rowData.forEach(row => {
                if (row.values) {
                    const startIndex = markin ? 1 : 2
                    row.values = row.values.slice(startIndex)
                }
            })
            sheetSrc[sheetName] = rowData
        })
        if (!markin) {
            fetchCuphead(true)
        } else {
            getCommBestILs()
        }
    })
}
function loadMyekul() {
    const values = myekulSheets[runRecapCategory.tabName]
    // console.log(values)
    categories = []
    bossesCopy = [...bosses]
    if (runRecapCategory.name == 'DLC') {
        bossesCopy = bossesCopy.slice(19, 25)
    } else if (runRecapCategory.name != 'DLC+Base') {
        bossesCopy = bossesCopy.slice(0, 19)
    }
    bossesCopy.sort((a, b) => (a.order || 0) - (b.order || 0));
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
    players.forEach(player => {
        player.runs = new Array(categories.length).fill(0)
    })
    const numRuns = runRecapCategory.topRuns.length
    categories.forEach((category, categoryIndex) => {
        category.difficulty = 'regular'
        if (values[categoryIndex]) {
            if (values[categoryIndex].values) {
                if (values[categoryIndex].values[0]) {
                    const rawTime = values[categoryIndex].values[0].userEnteredValue?.numberValue
                    const time = convertToSeconds(secondsToHMS(Math.round(rawTime * 24 * 60)))
                    const runs = values[categoryIndex].values.slice(1)
                    runs.forEach(column => {
                        if (column.userEnteredValue) {
                            let playerName = column.userEnteredValue.formulaValue.split(',')[1].trim().slice(1).split('"')[0]
                            const url = column.userEnteredValue.formulaValue.slice(12).split('"')[0]
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
                                    playerCopy.runs = new Array(categories.length).fill(0)
                                    players.push(playerCopy)
                                    return true
                                }
                            }
                            category.runs.push({ place: 1, debug: debug, player: { name: playerName }, score: time, date: category.runs.length, url: url })
                        }
                    })
                }
            }
        }
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
        savComparisonCollection['Player ' + (index)] = run.runRecap
    })
    categories.forEach((category, categoryIndex) => {
        let topSum = 0
        let top3Sum = 0
        runRecapCategory.topRuns.forEach((run, index) => {
            const time = run.runRecap[categoryIndex]
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
function loadSheets() {
    let url = 'https://docs.google.com/spreadsheets/d/' + MYEKUL_SHEET_ID
    loadSheetIcon(url)
    gapi.client.sheets.spreadsheets.get({
        spreadsheetId: MYEKUL_SHEET_ID
    }).then(response => {
        const sheets = response.result.sheets;
        const tabMap = {};
        sheets.forEach(sheet => {
            const name = sheet.properties.title;
            const gid = sheet.properties.sheetId;
            tabMap[name] = gid;
        });
        url += '/edit?gid=' + tabMap[runRecapCategory.tabName]
        loadSheetIcon(url)
    });
}
function loadSheetIcon(url) {
    const boardTitleSrc = document.getElementById('boardTitleSrc')
    boardTitleSrc.innerHTML = `<div class='grow flash'>${getAnchor(url)}${sharedAssetsImg('sheets')}</div>`
    boardTitleSrc.innerHTML += `<div style='margin-left:5px'>${getAnchor('https://www.speedrun.com/cuphead') + `<div class='grow'>${sharedAssetsImg('src')}</div>`}</div>`
}