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
        HTMLContent += `<div class='container' style='margin-bottom:10px'>Choose a comparison!</div>`
    } else {
        HTMLContent += `<div class='container'>
        <div class='textBlock' style='margin-bottom:10px'>
        Welcome to the ${myekulColor('Run Recap Database')}!
        This is a collection of every .sav and .rrc that has been uploaded to the website.
        To view a run, simply click on an entry.
        </div>
        </div>`
    }
    HTMLContent += `<div class='container' style='align-items:flex-start'>`
    if (!comparison) {
        HTMLContent += `<div>`
        HTMLContent += `<div class='container' style='gap:10px;margin:10px 0'>`;
        ['sav', 'rrc'].forEach(fileType => {
            HTMLContent += `<div class='button font2 cuphead ${type == fileType ? 'grayedOut' : ''}' style='width:50px' onclick="databaseType='${fileType}';fetchDatabase('${fileType}',null,true)">.${fileType}</div>`
        })
        HTMLContent += `</div>`
        HTMLContent += `<div id='allButtonDatabase' class='button cuphead' onclick="databaseCategory=null;fetchDatabase('${type}',null,true)">ALL</div>`
        HTMLContent += `<div id='databaseCategorySelect'>${categorySelect(true)}</div>`
        HTMLContent += `</div>`
    }
    HTMLContent += `<div class='container' style='height:500px;width:750px;overflow-y:scroll;align-items:flex-start'>`
    HTMLContent += `<div>`
    HTMLContent += `<div class='container' style='margin-top:5px;gap:10px'>`
    if (databaseCategory) HTMLContent += generateBoardTitle(commBestILs[databaseCategory])
    HTMLContent += `<div>${fileTitle(type)}</div>`
    HTMLContent += `</div>`
    HTMLContent += `<table class='border' style='margin:20px;padding:10px'>`
    let empty = true
    runRecap_database[type].forEach((run, index) => {
        if ((comparison && runRecapCategory.tabName == run.category)
            || !comparison && !databaseCategory
            || !comparison && databaseCategory == run.category) {
            empty = false
            const category = commBestILs[run.category]
            const onclick = comparison ? `databaseCompare('${type}','${index}','${run.player}','${run.time}')` : `databaseView('${type}',${index},'${run.player}','${run.time}','${category.tabName}')`
            HTMLContent += `<tr class='${getRowColor(index)} grow' onclick="${onclick}">
        <td class='dim' style='font-size:70%'>${index + 1}</td>
        ${comparison || databaseCategory ? '' : `<td><div class='container'>${generateBoardTitle(category)}</div></td>`}
        <td style='padding:0 5px;white-space:nowrap'><div>${run.date}</div><div style='font-size:60%'>${daysAgo(getDateDif(new Date(), new Date(run.date)))}</div></td>
        <td class='${category.className}' style='font-size:120%;padding:0 5px'>${run.time}</td>
        <td>${playerDisplay(run.player, true)}</td>
        </tr>`
        }
    })
    HTMLContent += `
    ${empty ? `<td class='container'>No submitted .${type}s...</td>` : ''}
    </table>
    </div>
    </div>
    </div>`
    if (comparison) playSound('category_select')
    if (shh) playSound('move')
    openModal(HTMLContent, 'DATABASE', '', comparison || shh)
    buttonShots()
    const buttons = document.querySelectorAll('#databaseCategorySelect #categorySelect > .container > div[id]')
    buttons.forEach(btn => {
        btn.id += 'Database'
    })
    categoryButtonClick(commBestILs[databaseCategory], true)
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
        runData.forEach((time, index) => {
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