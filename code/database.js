function runRecapDatabase() {
    if (!database) {
        window.firebaseUtils.firestoreReadRR()
    } else {
        openDatabase()
    }
}
function openDatabase() {
    let HTMLContent = `<table style='padding:5px'>`
    database.forEach((run, index) => {
        const category = commBestILs[run.category]
        HTMLContent += `<tr class='${getRowColor(index)} grow' onclick="processDatabaseFile(${index},'${run.player}','${run.time}','${category.tabName}')">
        <td><div class='container'>${generateBoardTitle(category)}</div></td>
        <td style='padding:0 5px'><div>${run.date}</div><div style='font-size:60%'>${daysAgo(getDateDif(new Date(), new Date(run.date)))}</div></td>
        <td class='${category.className}' style='font-size:120%;padding:0 5px'>${run.time}</td>
        <td>${runRecapPlayer(run.player)}</td>
        </tr>`
    })
    HTMLContent += `</table>`
    openModal(HTMLContent, 'DATABASE')
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
            runRecap_savFile = data
            runRecapUnload('lss', true)
            runRecapExample = true
            document.getElementById('runRecap_player').innerHTML = runRecapPlayer(player)
            runRecapTime = time
            setRunRecapTime(runRecapTime)
            document.getElementById('input_runRecap_time').value = time
            globalTab = 'sav'
            getCommBestILs(categoryName)
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