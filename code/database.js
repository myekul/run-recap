function runRecapDatabase(sav) {
    if (!database) {
        window.firebaseUtils.firestoreReadRR(sav)
    } else {
        openDatabase(sav)
    }
}
function openDatabase(sav) {
    let HTMLContent = `<table style='padding:10px'>`
    database.forEach((run, index) => {
        if (!(sav && commBestILsCategory.tabName != run.category)) {
            const category = commBestILs[run.category]
            const onclick = sav ? `databaseComparison('${run.sav}','${run.player}','${run.time}')` : `processDatabaseFile(${index},'${run.player}','${run.time}','${category.tabName}')`
            HTMLContent += `<tr class='${getRowColor(index)} grow' onclick="${onclick}">
        <td><div class='container'>${generateBoardTitle(category)}</div></td>
        <td style='padding:0 5px'><div>${run.date}</div><div style='font-size:60%'>${daysAgo(getDateDif(new Date(), new Date(run.date)))}</div></td>
        <td class='${category.className}' style='font-size:120%;padding:0 5px'>${run.time}</td>
        <td>${runRecapPlayer(run.player)}</td>
        </tr>`
        }
    })
    HTMLContent += `</table>`
    if (sav) playSound('category_select')
    openModal(HTMLContent, 'DATABASE', '', sav)
}
function databaseComparison(sav, player, time) {
    commBestILsCategory.database = []
    sav.split(',').forEach((time, index) => {
        commBestILsCategory.database[index] = time
    })
    changeComparison('database', player, time)
    action()
}
function runRecapUploadButton() {
    if (localStorage.getItem('username') && runRecapTime != 'XX:XX') {
        window.firebaseUtils.firestoreWriteRR()
    } else {
        let HTMLContent = `
    <div style='margin-bottom:20px'>${myekulColor(fontAwesome('warning'))} Please insert your run time and username.</div>
    <div>Fraudulent or duplicate submissions are subject to deletion.</div>`
        openModal(HTMLContent, 'UPLOAD')
    }
}
function processDatabaseFile(databaseIndex, player, time, categoryName) {
    fetch('https://myekul.github.io/shared-assets/cuphead/sav.json')
        .then(response => response.json())
        .then(data => {
            runRecapUnload('lss', true)
            document.getElementById('runRecap_player').innerHTML = runRecapPlayer(player)
            runRecapTime = time
            setRunRecapTime(runRecapTime)
            document.getElementById('input_runRecap_time').value = time
            globalTab = 'sav'
            getCommBestILs(categoryName)
            runRecapExample = true
            runRecap_savFile = data
            categories.forEach((category, categoryIndex) => {
                const level = getCupheadLevel(categoryIndex)
                level.bestTime = database[databaseIndex].sav[categoryIndex]
                level.played = true
                level.completed = true
            })
            showTab('sav')
            closeModal()
        })
}