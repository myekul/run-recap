function mausCriteria() {
    return ['DLC', 'DLC+Base'].includes(runRecapCategory.name) || (['Other'].includes(runRecapCategory.name) && (MISC_DLC.includes(altStratOther) || altStratOther == 'DLC OG Charge'))
}
async function generateAltStrats() {
    altStratCategory = alt[runRecapCategory.tabName || altStratOther]
    let HTMLContent = ''
    if (altStratCategory) {
        HTMLContent += `
        <div>
            <div class='container' style='gap:10px;margin-top:8px'>`
        assignIsles()
        const isle1 = []
        if (!(runRecapCategory.name == 'Other' && ['1.1+ Low%', 'Legacy Low%', 'NMG P/S'].includes(altStratOther))) isle1.push('forestfollies')
        if (mausCriteria()) isle1.push('mausoleum')
        if (runRecapCategory.name == 'Other' && altStratOther == 'OG Charge') isle1.push('treetoptrouble')
        HTMLContent += `
        <table class='shadow'>
            <tr class='background2'>`
        isle1.forEach(level => {
            HTMLContent += altStratHeader(level)
        })
        HTMLContent += `</tr><tr>`
        isle1.forEach(level => {
            HTMLContent += `
            <td style='width:36px' class='grow ${level == altStratLevel ? 'selected' : ''}' onclick="altStratClick('${level}')">
                <div>${getImage(imageLocation(level))}</div>
            </td>`
        })
        HTMLContent += `
            </tr>
        </table>`
        isles.forEach(isle => {
            if (isle.runRecapCategories.length) {
                HTMLContent += `<table class='shadow'><tr class='background2'>`
                isle.runRecapCategories.forEach(categoryIndex => {
                    const category = categories[categoryIndex]
                    HTMLContent += altStratHeader(category.info.id)
                })
                HTMLContent += `</tr><tr>`
                isle.runRecapCategories.forEach(categoryIndex => {
                    const category = categories[categoryIndex]
                    HTMLContent += `
                    <td style='width:36px' class='grow ${category.info.id} ${category.info.id == altStratLevel ? 'selected' : ''}' onclick="altStratClick('${category.info.id}')">
                        <div>${getImage(category.info.id)}</div>
                    </td>`
                })
                HTMLContent += `</tr></table>`
            }
        })
        HTMLContent += `</div>`
        if (runRecapCategory.name == 'Other' && ['1.1+ All Flags', '300%'].includes(altStratOther)) {
            HTMLContent += `<div class='container' style='gap:10px;margin-top:10px'>`
        }
        if (runRecapCategory.name == 'Other' && altStratOther == '300%') {
            HTMLContent += `<table class='shadow'><tr class='background2'>`
            CHESS.forEach(level => {
                HTMLContent += altStratHeader(level)
            })
            HTMLContent += `</tr><tr>`
            CHESS.forEach(level => {
                HTMLContent += `
                <td style='width:36px' class='grow ${level == altStratLevel ? 'selected' : ''}' onclick="altStratClick('${level}')">
                    <div>${getImage('other/' + level)}</div>
                </td>`
            })
            HTMLContent += `
                </tr>
            </table>
            <table class='shadow'>
                <tr>
                    <td class='background2' style='font-size:80%;color:gray'>${altStratCategory.angelanddemon?.filter(IL => !IL.title).length || '&nbsp;'}</td>
                </tr>
                <tr>
                    <td class='grow ${'angelanddemon' == altStratLevel ? 'selected' : ''}' onclick="altStratClick('angelanddemon')"><div>${getImage('other/angelanddemon')}</div></td>
                </tr>
            </table>`
        }
        if (runRecapCategory.name == 'Other' && ['1.1+ All Flags', '300%'].includes(altStratOther)) {
            HTMLContent += `<table class='shadow'>
                <tr class='background2'>`
            RUNNGUNS.slice(1).forEach(level => {
                HTMLContent += altStratHeader(level)
            })
            HTMLContent += `</tr><tr>`
            RUNNGUNS.slice(1).forEach(level => {
                HTMLContent += `
                <td style='width:36px' class='grow ${level == altStratLevel ? 'selected' : ''}' onclick="altStratClick('${level}')">
                    <div>${getImage('runnguns/' + level)}</div>
                </td>`
            })
            HTMLContent += `
                    </tr>
                </table>
            </div>`
        }
        HTMLContent += `</div>`
        if (!altStratLevel) {
            HTMLContent += `<div id='altStratsHTML' class='container' style='margin-top:20px;gap:30px;align-items:flex-start'></div>`
        } else {
            HTMLContent += `<div class='button grade-a' style='width:40px;font-size:110%;margin:10px auto' onclick="playSound('category_select');altStratLevel=null;action()">${fontAwesome('reply')}</div>`
            if (altStratCategory[altStratLevel]) {
                HTMLContent += altStrats(altStratLevel)
                if (runRecapCategory.name == '1.1+' && altStratLevel == 'kingdice') {
                    ['mrwheezy', 'hopuspocus', 'pirouletta', 'kingdice2'].forEach(miniboss => {
                        HTMLContent += altStrats(miniboss)
                    })
                }
                if (runRecapCategory.name == 'Legacy' && altStratLevel == 'kingdice') {
                    ['chipsbettigan', 'pipanddot'].forEach(miniboss => {
                        HTMLContent += altStrats(miniboss)
                    })
                }
            } else {
                HTMLContent += emptyPageText('No alt strats...')
            }
        }
    } else {
        HTMLContent += emptyPageText('No alt strats...')
    }
    let temp = document.createElement('div')
    temp.innerHTML = HTMLContent
    if (!altStratLevel && altStratCategory) {
        const altHTML = await fetch('html/altStrats.html').then(r => r.text());
        temp.querySelector('#altStratsHTML').innerHTML = altHTML;
        altStrat_topContributors(temp)
        altStrat_bestTimes(temp)
        temp.querySelector('#altStratNum').innerText = altStratNum
        temp.querySelector('#commBest_queue').innerHTML = pendingSubmissions()
        window.firebaseUtils.firestoreReadCommBestILs()
    }
    document.getElementById('content').innerHTML = temp.innerHTML
    if (['baronessvonbonbon', 'captainbrineybeard'].includes(altStratLevel) && runRecapCategory.name == '1.1+') drawChart()
}
function altStratHeader(level) {
    const copy = altStratCategory[level] ? altStratCategory[level][0]?.copy : null
    let num = 0
    if (commBestILsAll) {
        for (const category in alt) {
            if (alt[category]) {
                num += alt[category][level]?.filter(IL => !IL.title && !IL.copy).length || 0
            }
        }
    } else {
        num = altStratCategory[level]?.filter(IL => !IL.title).length
    }
    return `
    <td>
        <div style='font-size:80%;color:gray;position:relative'>
            ${num || '&nbsp;'}
            ${copy && !commBestILsAll ? `<div class='${commBestILs[copy]?.className ?? 'gray'}' style='position:absolute;width:36px;top:-5px;height:2px'></div>` : ''}
        </div>
    </td>`
}
function altStrat_topContributors(root, level) {
    let HTMLContent = ''
    const counts = {};
    const countCategories = commBestILsAll ? alt : { [runRecapCategory.tabName == 'Other' ? altStratOther : runRecapCategory.tabName]: altStratCategory }
    if (root) {
        for (const category in countCategories) {
            for (const boss in countCategories[category]) {
                for (const obj of countCategories[category][boss]) {
                    if (!obj.title && !obj.copy) {
                        const player = obj.player;
                        counts[player] = (counts[player] || 0) + 1;
                    }
                }
            }
        }
    } else {
        for (const category in countCategories) {
            for (const obj of countCategories[category][level] || []) {
                if (!obj.title && !(commBestILsAll && obj.copy)) {
                    const player = obj.player;
                    counts[player] = (counts[player] || 0) + 1;
                }
            }
        }
    }
    const countArray = Object.entries(counts).map(([player, count]) => ({
        player,
        count
    }));
    countArray.sort((a, b) => b.count - a.count)
    HTMLContent += `
    <table class='shadow'>
        <tr>
            <td colspan=5 class='font2 gray' style='font-size:120%;padding:5px 8px;white-space:nowrap'>Top Contributors</td>
        </tr>`
    countArray.forEach((player, index) => {
        HTMLContent += `
        <tr class='grow ${getRowColor(index)}' onclick="openModal(userContributions('${player.player}'),'CONTRIBUTIONS')">
            <td>${getPlayerDisplay(allPlayers.find(player2 => player2.name == player.player) || player.player)}</td>
            <td>${player.count}</td>
        </tr>`
    })
    HTMLContent += `</table>`
    if (root) {
        root.querySelector('#altStrat_topContributors').innerHTML = HTMLContent
    } else {
        return HTMLContent
    }
}
function altStrat_bestTimes(root) {
    let HTMLContent = `
    <table class='shadow'>
        <tr>
            <td colspan=5 class='font2 gray' style='font-size:120%;padding:5px'>Best Times</td>
        </tr>`
    categories.forEach((category, categoryIndex) => {
        let altGroup = []
        if (commBestILsAll) {
            for (const cata in alt) {
                if (alt[cata][category.info?.id]) {
                    altGroup.push(...alt[cata][category.info.id].filter(IL => !IL.copy))
                }
            }
        } else {
            altGroup = altStratCategory[category.info.id]
        }
        if (altGroup) {
            let fastest = altGroup[0]
            altGroup.forEach(strat => {
                if (fastest.title || convertToSeconds(strat.time) < convertToSeconds(fastest.time)) {
                    fastest = strat
                }
            })
            HTMLContent += `
            <tr class='grow ${getRowColor(categoryIndex)}' onclick="window.open('${fastest.url}', '_blank')">
                <td class='${category.info.id}'><div class='container'>${getImage(category.info.id, 21)}</div></td>
                <td class='${category.info.id}' style='padding:0 3px'>${fastest.time}</td>
                <td>${getPlayerDisplay(allPlayers.find(player => player.name == fastest.player) || fastest.player, true)}</td>
                <td class='${fastest.copy ? commBestILs[fastest.copy]?.className ?? 'gray' : ''}'></td>
            </tr>`
        } else {
            HTMLContent += `
            <tr class='${getRowColor(categoryIndex)}'>
                <td class='${category.info.id}'><div class='container'>${getImage(category.info.id, 21)}</div></td>
                <td class='${category.info.id}'></td>
                <td></td>
            </tr>`
        }
    })
    HTMLContent += `</table>`
    root.querySelector('#altStrat_bestTimes').innerHTML = HTMLContent
}
function drawChart() {
    let data = [['Value']]
    altStratCategory[altStratLevel].forEach(strat => {
        data.push([parseFloat(strat.time)])
    })
    data = google.visualization.arrayToDataTable(data);
    const font = getComputedStyle(document.documentElement).getPropertyValue('--font')
    const isBaroness = altStratLevel == 'baronessvonbonbon'
    const minVal = isBaroness ? 29 : 36
    const maxVal = isBaroness ? 38 : 44
    const ticks = isBaroness ? [29, 30, 31, 32, 33, 34, 35, 36] : [36, 37, 38, 39, 40, 41, 42, 43, 44]
    var options = {
        chartArea: { height: '75%', width: '90%' },
        legend: { position: 'none' },
        colors: [isBaroness ? 'hotpink' : 'crimson'],
        backgroundColor: 'transparent',
        histogram: {
            bucketSize: 0.5
        },
        hAxis: {
            viewWindow: { min: minVal, max: maxVal },
            ticks: ticks,
            textStyle: {
                color: 'gray',
                fontName: font
            },
        },
        vAxis: {
            textStyle: {
                color: 'transparent'
            },
            gridlines: { color: "transparent" }
        },
        tooltip: {
            textStyle: {
                fontName: font
            }
        }
    };
    var chart = new google.visualization.Histogram(
        document.getElementById("chart_" + altStratLevel)
    );
    chart.draw(data, options);
}
function altStratClick(level) {
    altStratLevel = level
    playSound('move')
    action()
}
function levelName(query) {
    const category = categories.find(category => category.info.id == query)
    if (category) return category.info.name
    const otherName = OTHER_LEVELS.find(level => query == level.toLowerCase().replaceAll(" ", ""))
    if (otherName) return otherName
    if (query == 'angelanddemon') return 'Angel & Demon'
    if (query == 'mausoleum') return 'Mausoleum'
    return OTHER_NAMES[query]
}
function altStrats(query) {
    let HTMLContent = ''
    if (['baronessvonbonbon', 'captainbrineybeard'].includes(query) && runRecapCategory.name == '1.1+' && !commBestILsAll) {
        HTMLContent += altStats(query)
    }
    if (query == 'thedevil' && runRecapCategory.name == '1.1+' && !commBestILsAll) {
        HTMLContent += `
        <div class='container'>
            <input type='checkbox' ${isolatePatterns ? 'checked' : ''} onchange="playSound('move');isolatePatterns=!isolatePatterns;action()">Isolate Patterns
        </div>`
    }
    HTMLContent += `
    <div class='container'>
        <div style='margin:0;position:relative'><table class='shadow' style='margin:10px'>
            <tr>
                <td colspan=10>
                    <div class='container ${query}' style='gap:8px;padding:5px;font-size:120%'>${getImage(imageLocation(query))}${levelName(query)}</div>
                </td>
            </tr>`
    const altStratCategories = []
    const cataNames = []
    let RTAcheck = false
    if (commBestILsAll) {
        for (const category in alt) {
            if (alt[category][query] && !alt[category][query][0].copy) {
                altStratCategories.push(alt[category])
                cataNames.push(category)
                if (alt[category][query].some(strat => strat.rta)) RTAcheck = true
            }
        }
    } else {
        altStratCategories.push(altStratCategory)
        RTAcheck = altStratCategory[query].some(strat => strat.rta)
    }
    altStratCategories.forEach((altStratCata, cataIndex) => {
        if (altStratCategories.length > 1) {
            HTMLContent += `
            <tr>
                <td colspan=10><div class='container gray' style='padding:6px 0'>${generateBoardTitle(cataNames[cataIndex])}</div></td>
            </tr>`
        }
        const baronessCheck = query == 'baronessvonbonbon'
        // if (!altStratCategory[query].some(strat => strat.title)) {
        //     HTMLContent += `<tr>
        // <th class='gray'>Pattern / Strat</th>`
        //     if (baronessCheck) HTMLContent += `<th class='gray'></th>`
        //     HTMLContent += `<th class='gray'>IGT</th>`
        //     if (RTAcheck) HTMLContent += `<th class='gray'>RTA</th>`
        //     HTMLContent += `<th colspan=2 class='gray'>Player</th></tr>`
        // }
        const altStrats = [...altStratCata[query]]
        if (query == 'baronessvonbonbon' && runRecapCategory.name == '1.1+' && !commBestILsAll) {
            if (bonbonSort == 'Best') {
                altStrats.sort((a, b) => a.time - b.time)
            } else if (bonbonSort == 'Worst') {
                altStrats.sort((a, b) => b.time - a.time)
            }
        }
        let min = Math.min(...altStrats.filter(obj => !obj.title).map(obj => parseFloat(convertToSeconds(obj.time))))
        let max = Math.max(...altStrats.filter(obj => !obj.title).map(obj => parseFloat(convertToSeconds(obj.time))))
        altStrats.forEach((strat, index) => {
            if (!(commBestILsAll && strat.copy)) {
                if (strat.title && !(["Spider's Kiss", 'Head Skip', 'Other'].includes(strat.title) && runRecapCategory.name == '1.1+' && isolatePatterns && query == 'thedevil')) {
                    if (index > 0) {
                        HTMLContent += `
                        <tr>
                            <td style='height:10px'></td>
                        </tr>`
                    }
                    HTMLContent += `<tr>`
                    if (isolatePatterns && strat.odds && !commBestILsAll) {
                        HTMLContent += `
                        <th></th>
                        <th colspan=2 class='gray'>${getOdds(strat.odds)}</th>
                        <th colspan='3' class='gray' style='margin-top:10px'>${strat.title}</th>`
                    } else {
                        HTMLContent += `<th colspan='9' class='gray' style='margin-top:10px'>${strat.title}</th>`
                    }
                    HTMLContent += `</tr>`
                } else {
                    if (!(query == 'thedevil' && runRecapCategory.name == '1.1+' && isolatePatterns && !strat.odds)) {
                        HTMLContent += `
                        <tr class='grow ${getRowColor(index)}' onclick="window.open('${strat.url}', '_blank')">
                            <td style='text-align:left;padding-right:8px;font-size:80%'>${strat.name}</td>`
                        if (runRecapCategory.name == '1.1+' && ((query == 'thedevil' && isolatePatterns) || ODDS_BOSSES.includes(query)) && !commBestILsAll) {
                            HTMLContent += altStrats.some(strat => strat.odds3) ? oddsLayer(altStrats, index, strat, 'odds3') : ''
                            HTMLContent += oddsLayer(altStrats, index, strat, 'odds2')
                            HTMLContent += `<td class='odds'>${strat.odds ? getOdds(strat.odds) : ''}</td>`
                        }
                        if (ATTACKS[query]) HTMLContent += bossPattern(query, strat.name)
                        HTMLContent += normalizedColorCell(convertToSeconds(strat.time), min, max)
                        HTMLContent += `<td class='${query}' style='padding:0 5px'>${strat.time}</td>`
                        if (RTAcheck) {
                            HTMLContent += `<td class='${query}' style='padding:0 5px;font-size:80%'>${strat.rta || ''}</td>`
                        }
                        const player = allPlayers.find(player => player.name == strat.player)
                        HTMLContent += `<td>${getPlayerDisplay(player || strat.player, true)}</td>`
                    }
                }
                HTMLContent += `</tr>`
            }
        })
    })
    HTMLContent += `</table>`
    if (runRecapCategory.name == '1.1+' && categoryNames.includes(query) && !commBestILsAll) {
        const categoryIndex = categories.findIndex(category => category.info.id == query)
        HTMLContent += `
        <table class='shadow' style='position:absolute;left:110%;top:12px'>
            <tr>
                <td class='container gray' style='gap:3px;padding:3px;width:75px'>${fontAwesome('flask')}TAS</td>
            </tr>
            <tr>
                <td class='${query}' style='padding:0 5px'>${runRecapCategory.tas[categoryIndex]}</td>
            </tr>`;
        ['Main', 'Clean', 'Debug'].forEach((vid, vidIndex) => {
            HTMLContent += `
            <tr>
                <td colspan=2 class='background2 grow' style='font-size:90%'>
                ${getAnchor(runRecapCategory.tasLinks[vidIndex] + '&t=' + runRecapCategory.tasTimestamps[categoryIndex] + 's')}
                <span class='dim'>${fontAwesome('video-camera')}</span> ${vid}</a>
                </td>
            </tr>`
        })
        HTMLContent += `</table>`
    }
    if (alt[runRecapCategory.tabName ? runRecapCategory.tabName : altStratOther][query].filter(strat => !strat.title).length > 1 || commBestILsAll) HTMLContent += `<div style='position:absolute;right:110%;top:12px'>${altStrat_topContributors(null, query)}</div>`
    HTMLContent += `</div></div>`
    return HTMLContent
}
function rawOdds(odds) {
    return odds.split('/')[0] / odds.split('/')[1] * 100
}
function getOdds(odds) {
    return rawOdds(odds).toFixed(1) + '%'
}
function oddsLayer(altStrats, index, strat, field) {
    let combinedOdds = 0
    if (strat.odds) {
        altStrats.slice(index, index + strat[field]).forEach((strat2) => {
            combinedOdds += rawOdds(strat2.odds)
            strat2[field + 'Flag'] = true
        })
    }
    if (strat[field]) {
        return `<td rowspan=${strat[field]} class='background2 odds'>${combinedOdds.toFixed(1) + '%'}</td>`
    } else if (!strat[field + 'Flag']) {
        return `<td></td>`
    }
    return ''
}
const MIN_ENTRIES = 10
const MAX_ENTRIES = 50
function pendingSubmissions(submissions = new Array(MIN_ENTRIES).fill(null), done) {
    let HTMLContent = `
    <div class='container'>
        <table class='shadow' style='width:450px;margin-top:20px'>
            <tr>
                <td colspan=6 class='gray' style='padding:5px;position:relative'>
                    ${done ? '' : `<div class='loader' style='position:absolute;left:10px'></div>`}
                    <div class='font2' style='font-size:120%'>Pending Submissions</div>
                    ${done ? `<div style='position:absolute;right:5px;top:7px'>${submissions.length}</div>` : ''}
                </td>
            </tr>`
    for (let i = 0; i < (submissions.length <= MIN_ENTRIES ? MIN_ENTRIES : submissions.length < MAX_ENTRIES ? submissions.length : MAX_ENTRIES); i++) {
        const submission = submissions[i]
        HTMLContent += `<tr class='${submission ? 'grow' : ''} ${getRowColor(i)}' ${submission ? `onclick="window.open('${submission.url}', '_blank')" onmouseenter="toast('${submission.date} - ${daysAgo(getDateDif(new Date(), new Date(submission.date)))}')"` : ''}>`
        if (submission) {
            let strat
            if (submission.altstrat != 'none') {
                strat = submission.altstrat == 'other' ? submission.other : submission.altstrat
            }
            HTMLContent += `
            <td class='${commBestILs[submission.category]?.className || 'gray'}'>${submission.category}</td>
            <td class='${submission.boss}'><div class='container'>${getImage(imageLocation(submission.boss), 21)}</div></td>
            <td class='${submission.boss}'>${submission.time}</td>
            <td style='text-align:left'>${strat || ''}</td>
            <td>${getPlayerDisplay(allPlayers.find(player => player.name == submission.player) || submission.player, true)}</td>`
        } else {
            // if (done && i == 3 && !submissions[0]) {
            //     HTMLContent += `<td colspan=5 style='font-size:80%;color:gray'></td>`
            // }
            HTMLContent += `<td colspan=6>&nbsp;</td>`
        }
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table></div>`
    return HTMLContent
}
function bossPattern(boss, pattern) {
    let HTMLContent = `<td><div class='container'>`
    const split = boss == 'thedevil' ? ' ' : ', '
    const patterns = boss == 'chefsaltbaker' ? [...pattern.split(' ')[0]] : pattern.split(split)
    patterns.forEach(attack => {
        if (boss == 'cagneycarnation') attack = attack.split(' ')[0]
        if (ATTACKS[boss].includes(attack)) {
            const src = boss == 'baronessvonbonbon'
                ? `https://myekul.com/shared-assets/cuphead/images/phase/baronessvonbonbon${MINIBOSSES[attack]}.png`
                : `images/${boss}/${attack}.png`
            HTMLContent += `<div class='container' style='width:25px;margin:0'><img src='${src}' style='height:21px'></div>`
        }
    })
    HTMLContent += `</div></td>`
    return HTMLContent
}
function userContributions(playerName) {
    let HTMLContent = `
    ${playerDisplay(playerName)}
    <table style='margin:10px auto'>`
    const altStratCategories = []
    const categoryNames = []
    if (commBestILsAll) {
        for (const category in alt) {
            for (const level in alt[category]) {
                if (alt[category][level].some(strat => strat.player == playerName && !strat.copy)) {
                    altStratCategories.push(alt[category])
                    categoryNames.push(category)
                    break
                }
            }
        }
    } else {
        altStratCategories.push(altStratCategory)
    }
    let num = 0
    altStratCategories.forEach((altStratCata, cataIndex) => {
        let strats = []
        for (const level in altStratCata) {
            let title = ''
            for (const obj of altStratCata[level]) {
                if (!obj.title && !obj.copy) {
                    if (playerName == obj.player) {
                        strats.push({ ...obj, level: level, title: title })
                    }
                } else {
                    title = obj.title
                }
            }
        }
        HTMLContent += `
        <tr>
            <td colspan=10><div class='container gray' style='padding:6px 0'>${generateBoardTitle(categoryNames[cataIndex])}</div></td>
        </tr>`
        strats.forEach((strat, index) => {
            HTMLContent += `
            <tr class='grow ${getRowColor(index)}' onclick="window.open('${strat.url}', '_blank')">
                <td class='dim' style='font-size:70%'>${num + 1}</td>
                <td style='text-align:left;font-size:80%;color:gray;padding:0 5px'>${strat.title}</td>
                <td class='${strat.level}'><div class='container'>${getImage(imageLocation(strat.level), 21)}</div></td>
                <td class='${strat.level}' style='padding:0 3px'>${strat.time}</td>
                ${ATTACKS[strat.level] ? bossPattern(strat.level, strat.name) : `<td></td>`}
                <td style='text-align:left;padding:0 5px;white-space:nowrap;font-size:80%'>${strat.name}</td>
            </tr>`
            num++
        })
    })
    HTMLContent += `</table>`
    return HTMLContent
}
function altStats() {
    const cfg = STATS_CONFIG[altStratLevel]
    let allStrats = altStratCategory[altStratLevel]
    const endIndex = cfg.limit ? cfg.startIndex + cfg.limit : allStrats.length
    allStrats = allStrats.slice(cfg.startIndex, endIndex)
    let HTMLContent = `
    <div class='container' style='gap:10px'>
        <div id='chart_${altStratLevel}' style='width:350px;margin:0'></div>
            <table>
                <tr>
                    <td></td>`
    if (altStratExtra) HTMLContent += `<td></td>`
    minibossArray = []
    for (const minibossName in cfg.minibosses) {
        const minibossInfo = { name: minibossName }
        cfg.fields.forEach(field => minibossInfo[field] = [])
        const imageHtml = altStratLevel === 'captainbrineybeard'
            ? `<img src='images/captainbrineybeard/${cfg.minibosses[minibossName]}.png' style='height:36px'>`
            : getImage('phase/' + altStratLevel + cfg.minibosses[minibossName])
        HTMLContent += `<td class='${cfg.minibosses[minibossName]}'>${imageHtml}</td>`
        for (const obj of allStrats) {
            obj.name.split(', ').forEach((name, index) => {
                if (name == minibossName) {
                    minibossInfo.overall.push(obj)
                    const positionField = cfg.fields[index + 1]
                    if (positionField) minibossInfo[positionField].push(obj)
                }
            })
        }
        minibossArray.push(minibossInfo)
    }
    HTMLContent += `
    <td rowspan=20 style='width:15px'></td>
    <td class='${altStratLevel}'>${getImage(altStratLevel)}</div>`
    HTMLContent += bonbonRow('overall', '', cfg.fields.length)
    if (altStratExtra) {
        for (let i = 1; i < cfg.fields.length; i++) {
            HTMLContent += bonbonRow(cfg.fields[i], cfg.groupLabels[i], cfg.fields.length)
        }
    }
    HTMLContent += `
                <td colspan=20 class='gray clickable' onclick="altStratExtra=!altStratExtra;playSound('move');action()">${fontAwesome(altStratExtra ? 'close' : 'chevron-down')}</td>
            </tr>
        </table>
    </div>`
    if (altStratLevel == 'baronessvonbonbon') {
        HTMLContent += `
        <div class='container' style='gap:5px;margin-top:5px'>
            <div>Sort:</div>`;
        ['Standard', 'Best', 'Worst'].forEach(sort => {
            HTMLContent += `<div class='button ${sort == bonbonSort ? 'cuphead' : ''}' style='width:75px' onclick="bonbonSort='${sort}';action();playSound('move')">${sort}</div>`
        })
        HTMLContent += `</div>`
    }
    return HTMLContent
    function bonbonRow(field, label) {
        const stats = [
            { name: 'Mean', fn: miniboss => math.mean(miniboss[field].map(entry => parseFloat(entry.time))), fn_all: () => math.mean(allStrats.map(entry => parseFloat(entry.time))), class: altStratLevel, format: v => v.toFixed(2) },
            { name: 'Std. Dev', fn: miniboss => math.std(miniboss[field].map(entry => parseFloat(entry.time))), fn_all: () => math.std(allStrats.map(entry => parseFloat(entry.time))), class: 'dim', format: v => v.toFixed(2) + 's', row_class: 'background2' },
            { name: 'Median', fn: miniboss => math.median(miniboss[field].map(entry => parseFloat(entry.time))), fn_all: () => math.median(allStrats.map(entry => parseFloat(entry.time))), class: '', format: v => v.toFixed(2), row_class: 'background2' },
            { name: 'Min', fn: miniboss => Math.min(...miniboss[field].map(entry => parseFloat(entry.time))), fn_all: () => Math.min(...allStrats.map(entry => parseFloat(entry.time))), class: '', format: v => v.toFixed(2), row_class: '' },
            { name: 'Max', fn: miniboss => Math.max(...miniboss[field].map(entry => parseFloat(entry.time))), fn_all: () => Math.max(...allStrats.map(entry => parseFloat(entry.time))), class: '', format: v => v.toFixed(2), row_class: 'background2' }
        ]
        let HTMLContent = ''
        stats.forEach((stat, index) => {
            const row_class = stat.row_class ? ` ${stat.row_class}` : ''
            const font_size = index == 0 ? '' : " style='font-size:80%'"
            HTMLContent += `<tr class='${row_class}'${font_size}>`
            if (!index && altStratExtra) {
                HTMLContent += `<td rowspan=5 class='${label ? 'gray' : ''}' style='padding:5px'>${label}</td>`
            }
            HTMLContent += `<td class='${index == 0 ? 'myekulColor' : ''}'>${stat.name}</td>`
            minibossArray.forEach(miniboss => {
                const value = miniboss[field].length ? stat.fn(miniboss) : null
                HTMLContent += `<td class='${stat.class}' ${stat.name == 'Mean' ? `style='padding:0 3px'` : ''}>${value !== null ? stat.format(value) : '-'}</td>`
            })
            if (!label) {
                const value = stat.fn_all()
                HTMLContent += `<td class='${stat.class}' ${stat.name == 'Mean' ? `style='padding:0 3px'` : ''}>${stat.format(value)}</td>`
            }
            HTMLContent += `</tr>`
        })
        return HTMLContent
    }
}
function commBestILsAllHelper() {
    commBestILsAll = !commBestILsAll
    document.getElementById('commBestILsAll_toggle').innerHTML = fontAwesome('toggle-' + (commBestILsAll ? 'on' : 'off'))
    playSound('move')
    action()
}