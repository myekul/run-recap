async function handleFile(event) {
    const file = event.target?.files ? event.target.files[0] : event;
    if (file) {
        try {
            const content = await file.text()
            playSound('ready')
            const fileExtension = file.name.split('.').pop().toLowerCase()
            if (fileExtension == 'rrc') {
                read_rrc(content)
                showTab('rrc')
            } else if (fileExtension == 'lss') {
                read_lss(content)
                showTab('lss')
            } else {
                runRecap_savFile = JSON.parse(content)
                let category
                if ('isPlayer1Mugman' in runRecap_savFile) {
                    if (getCupheadLevel(mausoleumID, true).completed) {
                        if (runRecap_savFile.loadouts.playerOne.primaryWeapon == 1467024095) { // Lobber
                            if (getCupheadLevel(bosses[0].levelID, true).completed) {
                                category = 'DLC+Base L/S'
                            } else {
                                category = 'DLC L/S'
                            }
                        } else if (runRecap_savFile.loadouts.playerOne.primaryWeapon == 1466416941) { // Charge
                            if (getCupheadLevel(bosses[0].levelID, true).completed) {
                                category = 'DLC+Base C/S'
                            } else if (runRecap_savFile.loadouts.playerOne.secondaryWeapon == 1568276855) { // Twist-Up
                                category = 'DLC C/T'
                            } else if (getCupheadLevel(bosses[19].levelID, true).difficultyBeaten == 2) {
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
                if (['sums', 'residual', 'grid'].includes(globalTab)) {
                    action()
                } else {
                    showTab('sav')
                }
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
    if (elem == 'username') {
        localStorage.setItem('username', input.trim() ? input : localStorage.getItem('username'))
        document.getElementById('username').innerHTML = playerDisplay()
    }
    show(elem)
    action()
}
function setRunRecapTime(time) {
    document.getElementById('runRecap_time').innerHTML = `<div style='font-size:150%'>${time}</div>`
}
function runRecapUnload(elem, shh) {
    if (!shh) playSound('carddown')
    if (elem == 'sav') {
        runRecap_savFile = null
    } else {
        runRecap_lssFile = {}
    }
}
function runRecapGrade(delta) {
    return getLetterGrade(100 - (delta * 4))
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
            const comparisonTime = savComparisonCollection[savComparison][categoryIndex]
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
                },
                minValue: 0,
                gridlines: { count: 0 }
            },
            vAxis: {
                textStyle: {
                    color: 'transparent',
                },
                gridlines: { count: 0 },
                baselineColor: 'gray'
            },
            tooltip: {
                trigger: 'none'
            }
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
    const src = ['DLC', 'DLC+Base'].includes(runRecapCategory.name) ? `https://www.youtube.com/embed/L6T3fpUGSmE?si=CY3h0TbNYkQ003eZ` : `https://www.youtube.com/embed/cdvSNkW3Uyk?si=VcZ9Du_FsD5A8O6g`
    document.getElementById('musicDiv').innerHTML = `
    <iframe width="150" height="150" src="${src}&amp;controls=0" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    `
}
function runRecapCopy() {
    let clipboardContent = ''
    if (globalTab == 'sav') {
        categories.forEach((category, categoryIndex) => {
            clipboardContent += `${getCupheadLevel(categoryIndex).bestTime.toString().split('.')[0] + '.' + getCupheadLevel(categoryIndex).bestTime.toString().split('.')[1].slice(0, 2)}${categoryIndex == categories.length - 1 ? '' : ', '}`
        })
    } else {
        const scenes = runRecap_rrcFile.attempts[rrcAttemptIndex].scenes
        // clipboardContent = JSON.stringify(scenes)
        scenes.forEach((scene, sceneIndex) => {
            if (cupheadBosses[scene.name] && !(scene.name == 'level_dice_palace_main' && scenes[sceneIndex + 1]?.name != 'win')) {
                clipboardContent += scene.levelTime
                if (!['level_devil', 'level_saltbaker'].includes(scene.name) && sceneIndex < scenes.length - 1) clipboardContent += ','
            }
        })
    }
    navigator.clipboard.writeText(clipboardContent)
        .then(() => {
            // Success!
        })
}