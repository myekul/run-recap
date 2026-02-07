function fetchDatabase(type, comparison, shh) {
    if (!runRecap_database[type]?.length) {
        window.firebaseUtils.firestoreReadRR(type, comparison, shh)
    } else {
        openDatabase(type, comparison, shh)
    }
}
function openDatabase(type, comparison, shh) {
    let HTMLContent = ''
    if (comparison) {
        HTMLContent += `<div class='container'>Choose a comparison!</div>`
    } else {
        HTMLContent += `<div class='container'>
        <div class='textBlock'>
        Welcome to the ${myekulColor('Run Recap Database')}!
        This is a collection of every .sav and .rrc that has been uploaded to the website.
        To view a run, simply click on an entry.
        </div>
        </div>`
    }
    HTMLContent += `<div class='container'>`
    if (!comparison) HTMLContent += categorySelect(true)
    HTMLContent += `<div>`
    if (!comparison) {
        HTMLContent += `<div class='container' style='gap:10px;margin:10px 0'>`;
        ['rrc', 'sav'].forEach(fileType => {
            HTMLContent += `<div class='button font2 ${type == fileType ? 'selected' : 'cuphead'}' style='width:50px' onclick="fetchDatabase('${fileType}',null,true)">.${fileType}</div>`
        })
        HTMLContent += `</div>`
        HTMLContent += fileTitle(type)
    }
    HTMLContent += `<table style='padding:10px;margin:0 auto'>`
    runRecap_database[type].forEach((run, index) => {
        if (!(type && runRecapCategory.tabName != run.category)) {
            const category = commBestILs[run.category]
            const onclick = comparison ? `databaseCompare('${type}','${index}','${run.player}','${run.time}')` : `databaseView('${type}',${index},'${run.player}','${run.time}','${category.tabName}')`
            HTMLContent += `<tr class='${getRowColor(index)} grow' onclick="${onclick}">
        <td class='dim' style='font-size:70%'>${index + 1}</td>
        ${comparison ? '' : `<td><div class='container'>${generateBoardTitle(category)}</div></td>`}
        <td style='padding:0 5px;white-space:nowrap'><div>${run.date}</div><div style='font-size:60%'>${daysAgo(getDateDif(new Date(), new Date(run.date)))}</div></td>
        <td class='${category.className}' style='font-size:120%;padding:0 5px'>${run.time}</td>
        <td>${playerDisplay(run.player, true)}</td>
        </tr>`
        }
    })
    HTMLContent += `</table>
    </div>
    </div>`
    if (comparison) playSound('category_select')
    if (shh) playSound('move')
    openModal(HTMLContent, 'DATABASE', '', comparison || shh)
}
function databaseView(type, databaseIndex, player, time, categoryName) {
    runRecapUnload('sav')
    runRecapUnload('lss')
    runRecapUnload('rrc')
    runRecapTime = time
    setRunRecapTime(runRecapTime)
    document.getElementById('input_runRecap_time').value = time
    getCommBestILs(categoryName)
    runRecapExample = true
    document.getElementById('runRecap_player').innerHTML = playerDisplay(player)
    if (type == 'sav') {
        fetch('https://myekul.com/shared-assets/cuphead/sav.json')
            .then(response => response.json())
            .then(data => {
                runRecap_savFile = data
                categories.forEach((category, categoryIndex) => {
                    const level = getCupheadLevel(categoryIndex)
                    level.bestTime = runRecap_database['sav'][databaseIndex].sav[categoryIndex]
                    level.played = true
                    level.completed = true
                })
                if (!['sums', 'residual', 'grid'].includes(globalTab)) {
                    showTab('sav')
                } else {
                    action()
                }
                playSound('ready')
                closeModal(true)
            })
    } else if (type == 'rrc') {
        rrcImport(runRecap_database['rrc'][databaseIndex].scenes)
        showTab('rrc')
        playSound('ready')
        closeModal(true)
    }

}
function databaseCompare(type, databaseIndex, player, time) {
    const run = runRecap_database[type][databaseIndex]
    const runData = type == 'sav' ? run.sav : run.scenes
    if (type == 'sav') {
        savComparisonCollection['Database'] = []
        runData.split(',').forEach((time, index) => {
            savComparisonCollection['Database'][index] = time
        })
    } else if (type == 'rrc') {
        rrcSegments(runData)
        rrcComparisonCollection['Database'] = runData
    }
    changeComparison(type, 'Database', player + ' - ' + time)
    action()
}
function runRecapUploadButton() {
    if (localStorage.getItem('username') &&
        ((globalTab == 'sav' && runRecapTime != 'XX:XX') || globalTab == 'rrc')) {
        window.firebaseUtils.firestoreWriteRR()
    } else {
        let HTMLContent = `
    <div style='margin-bottom:20px'>${myekulColor(fontAwesome('warning'))} Please insert your run time and username.</div>
    <div>Fraudulent or duplicate submissions are subject to deletion.</div>`
        openModal(HTMLContent, 'UPLOAD')
    }
}