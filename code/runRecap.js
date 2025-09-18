async function runRecapHandleFile(event) {
    const file = event.target?.files ? event.target.files[0] : event;
    if (file) {
        try {
            const content = await file.text()
            playSound('ready')
            const checkbox_runRecap_harsh = document.getElementById('checkbox_runRecap_harsh')
            checkbox_runRecap_harsh.checked = !(runRecapTime != 'XX:XX' && getScore(globalCategory, convertToSeconds(runRecapTime)) < 90)
            if (!(file.name.split('.').pop().toLowerCase() == 'lss')) {
                runRecap_savFile = JSON.parse(content)
                let category
                if ('isPlayer1Mugman' in runRecap_savFile) {
                    if (getCupheadLevel(mausoleumID, true).completed) {
                        if (runRecap_savFile.loadouts.playerOne.primaryWeapon == 1467024095) { // Lobber
                            if (getCupheadLevel(bossIDs['therootpack'], true).completed) {
                                category = 'DLC+Base L/S'
                            } else {
                                category = 'DLC L/S'
                            }
                        } else if (runRecap_savFile.loadouts.playerOne.primaryWeapon == 1466416941) { // Charge
                            if (getCupheadLevel(bossIDs['therootpack'], true).completed) {
                                category = 'DLC+Base C/S'
                            } else if (runRecap_savFile.loadouts.playerOne.secondaryWeapon == 1568276855) { // Twist-Up
                                category = 'DLC C/T'
                            } else if (getCupheadLevel(bossIDs['glumstonethegiant'], true).difficultyBeaten == 2) {
                                category = 'DLC Expert'
                            } else {
                                category = 'DLC C/S'
                            }
                        } else {
                            category = 'DLC Low%'
                        }
                    } else {
                        category = 'NMG'
                    }
                } else {
                    if (runRecap_savFile.loadouts.playerOne.secondaryWeapon == 1466518900) { // Roundabout
                        category = 'Legacy'
                    } else {
                        category = '1.1+'
                    }
                }
                getCommBestILs(category)
                showTab('sav')
            } else {
                read_lss(content)
                showTab('lss')
            }
        } catch (error) {
            show('runRecapError')
            console.log(error)
        }
    } else {
        show('runRecapError')
    }
    if (event.target?.files) {
        event.target.value = ''
    }
}
function showInput(elem) {
    playSound('move')
    hide(elem)
    const input_elem = document.getElementById('input_' + elem)
    show(input_elem)
    input_elem.focus()
    input_elem.select()
    if (elem == 'runRecap_time') playSound('win_time_loop')
    let handled = false;
    input_elem.addEventListener('change', () => {
        if (!handled) {
            hideInput(elem);
            handled = true;
            if (elem == 'runRecap_time') playSound('win_time_loop_end');
        }
    });
    input_elem.addEventListener('blur', () => {
        if (!handled) {
            hideInput(elem);
            handled = true;
            if (elem == 'runRecap_time') playSound('win_time_loop_end');
        }
    });
}
function hideInput(elem) {
    const input_elem = document.getElementById('input_' + elem)
    const input = input_elem.value
    hide(input_elem)
    if (elem == 'username') {
        playSound('category_select')
    } else if (elem == 'runRecap_time') {
        stopSound('win_time_loop')
        runRecapTime = input.trim() ? input : runRecapTime
        setRunRecapTime(runRecapTime)
    }
    const startElem = document.getElementById(elem)
    if (elem == 'username') {
        localStorage.setItem('username', input.trim() ? input : localStorage.getItem('username'))
        startElem.innerHTML = runRecapPlayer(elem)
    }
    show(startElem)
    action()
}
function setRunRecapTime(time) {
    document.getElementById('runRecap_time').innerHTML = `<div style='font-size:150%'>${time}</div>`
}
function runRecapPlayer(elem) {
    const playerString = runRecapExample ? players[globalPlayerIndex].name : localStorage.getItem('username')
    const player = players.find(player => player.name == playerString)
    globalPlayerIndex = player ? player.rank - 1 : -1
    const playerName = player ? getPlayerName(player) : playerString
    let HTMLContent = `<div class='container' style='gap:8px;margin:0'>`
    HTMLContent += player ? `<div>${getPlayerIcon(player, elem == 'username' ? 28 : 40)}</div>` : ''
    HTMLContent += `<div style='font-size:${elem == 'username' ? '110' : '130'}%'>${playerName}</div>`
    HTMLContent += player ? `<div>${getPlayerFlag(player, elem == 'username' ? 14 : 18)}</div>` : ''
    HTMLContent += `</div>`
    return HTMLContent
}
function runRecapUnload(elem, shh) {
    if (!shh) playSound('carddown')
    if (elem == 'sav') {
        runRecap_savFile = null
    } else {
        runRecap_lssFile = {}
    }
}
function runRecapInfo() {
    const player = players[globalPlayerIndex]
    const playerName = player ? getPlayerName(player) : `<span style='color:white'>${localStorage.getItem('username')}</span>`
    let HTMLContent = ''
    HTMLContent += `<div>
                        SAVE FILE LOCATIONS:
                        <br>Windows: ${myekulColor(`C:\\Users\\<span class='runRecapInfoName'>${playerName}</span>\\AppData\\Roaming\\Cuphead`)}
                        <br>Mac: ${myekulColor(`/Users/<span class='runRecapInfoName'>${playerName}</span>/Library/Application\\ Support/unity.Studio\\ MDHR.Cuphead/Cuphead`)}
                    </div>`
    return HTMLContent
}
function runRecapDatabase() {
    let HTMLContent = ''
    HTMLContent += `<div>Coming soon!</div>`
    return HTMLContent
}
function runRecapUploadButton() {
    if (localStorage.getItem('username') && runRecapTime != 'XX:XX') {
        window.firebaseUtils.firestoreWriteRR()
    } else {
        openModal(runRecapUpload(), 'UPLOAD')
    }
    function runRecapUpload() {
        let HTMLContent = ''
        HTMLContent += `
    <div style='margin-bottom:20px'>${myekulColor(fontAwesome('warning'))} Please insert your run time and username.</div>
    <div>Fraudulent or duplicate submissions are subject to deletion.</div>`
        return HTMLContent
    }
}
function runRecapGrade(delta) {
    let score = 100 - (delta * 4)
    if (!document.getElementById('checkbox_runRecap_harsh').checked) {
        score = 100 - delta
    }
    return getLetterGrade(score)
}
function runRecapDelta(runTime, comparisonTime) {
    return Math.floor(runTime) - Math.floor(comparisonTime)
}
function runRecap_chart(times, deltas, lss) {
    if (runRecap_savFile && !lss) {
        times = []
        deltas = []
        categories.forEach((category, categoryIndex) => {
            const level = getCupheadLevel(categoryIndex)
            const runTime = level?.bestTime
            category.runTime = runTime
            const prevCategory = categories[categoryIndex - 1]
            if (prevCategory) category.runTime += prevCategory.runTime
            times.push(category.runTime)
            const comparisonTime = getComparisonTime(categoryIndex)
            const delta = runRecapDelta(runTime, comparisonTime)
            deltas.push(delta)
        })
    }
    if (runRecap_savFile || lss) {
        show('runRecap_chart')
        const data = new google.visualization.DataTable()
        data.addColumn('number', 'Times')
        data.addColumn('number', 'Delta')
        data.addColumn({ type: 'string', role: 'style' })
        // data.addColumn({ role: 'annotation' })
        const rows = []
        const startingIndex = lss ? getOffset() : 1
        for (let i = 0; i < startingIndex; i++) {
            rows.push([0, 0, ''])
        }
        times.forEach((time, index) => {
            let colorClass
            if (lss) {
                colorClass = index >= getOffset() ? splitInfo[index].id : ''
            } else {
                colorClass = categories[index].info.id
            }
            const color = colorClass ? getColorFromClass(colorClass) : ''
            // rows.push([split, deltas[index], `point { fill-color: ${color}; }`, getDelta(deltas[index])])
            rows.push([time, deltas[index], `point { fill-color: ${color}; }`])
        })
        data.addRows(rows)
        const font = getComputedStyle(document.documentElement).getPropertyValue('--font')
        const options = {
            // curveType: 'function', // Smooth curves
            chartArea: { height: '90%' },
            legend: { position: 'none' },
            backgroundColor: 'transparent',
            pointSize: 9,
            lineWidth: 2,
            series: { 0: { color: 'gray' } },
            hAxis: {
                textStyle: {
                    color: 'transparent',
                    fontName: font
                },
                minValue: 0,
                gridlines: { count: 0 }
            },
            vAxis: {
                textStyle: {
                    color: 'transparent',
                    fontName: font
                },
                gridlines: { count: 0 },
                baselineColor: 'gray'
            },
            tooltip: { trigger: 'none' },
            // annotations: {
            //     style: 'none',
            //     textStyle: {
            //         fontName: font
            //     }
            // },
        };
        const chart = new google.visualization.LineChart(document.getElementById('runRecap_chart'));
        chart.draw(data, options);
    } else {
        hide('runRecap_chart')
    }
}
function runRecapDefault() {
    document.getElementById('runRecap_time').innerHTML = `
    <div style='font-size:150%'>XX:XX</div>
    <div style='font-size:160%'>${fontAwesome('edit')}</div>`
    runRecapTime = 'XX:XX'
}
function runRecapMusic() {
    const src = ['DLC', 'DLC+Base'].includes(commBestILsCategory.name) ? `https://www.youtube.com/embed/L6T3fpUGSmE?si=CY3h0TbNYkQ003eZ` : `https://www.youtube.com/embed/cdvSNkW3Uyk?si=VcZ9Du_FsD5A8O6g`
    document.getElementById('musicDiv').innerHTML = `
    <iframe width="150" height="150" src="${src}&amp;controls=0" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    `
}
function runRecapExamples() {
    let HTMLContent = `<div><table class='shadow'>`
    players.slice(0, commBestILsCategory.numRuns).forEach((player, playerIndex) => {
        if (player.extra) {
            HTMLContent += `<tr class='${getRowColor(playerIndex)} clickable' onclick="processSavFile(${playerIndex});playSound('category_select')">`
            HTMLContent += `<td style='font-size:70%'>${getTrophy(playerIndex + 1) || playerIndex + 1}</td>`
            HTMLContent += `<td class='${placeClass[playerIndex + 1]}' style='padding:0 4px'>${secondsToHMS(player.extra.score)}</td>`
            HTMLContent += `<td>${getPlayerFlag(player, 12)}</td>`
            HTMLContent += `<td style='padding:0 3px'>${getPlayerIcon(player, 28)}</td>`
            HTMLContent += `<td style='padding-right:10px;text-align:left'>${getPlayerName(player)}</td>`
            HTMLContent += `</tr>`
        }
    })
    HTMLContent += `</table>`
    // HTMLContent += `
    // <div class='container' style='margin-top:10px'>
    //     <div class='button cuphead' style='gap:5px;width:170px' onclick="openModal(runRecapDatabase(), 'DATABASE')">
    //         ${fontAwesome('cloud')}
    //         Browse database
    //     </div>
    // </div>`
    HTMLContent += `</div>`
    document.getElementById('runRecap_examples').innerHTML = HTMLContent
}