let altStratOther = '300%'
let altStratCategory
function generateAltStrats() {
    altStratCategory = alt[runRecapCategory.tabName || altStratOther]
    let HTMLContent = ''
    if (altStratCategory) {
        HTMLContent += `<div class='container' style='gap:10px'>`
        assignIsles()
        HTMLContent += `<table>
        <tr><td class='background2' style='font-size:80%;color:gray'>${altStratCategory.forestfollies?.length || '&nbsp;'}</td></tr>
        <tr><td class='grow' onclick="altStratClick('forestfollies')"><div>${getImage('runnguns/forestfollies')}</div></td></tr>
        </table>`
        isles.forEach(isle => {
            if (isle.runRecapCategories.length) {
                HTMLContent += `<table><tr class='background2'>`
                isle.runRecapCategories.forEach(categoryIndex => {
                    const category = categories[categoryIndex]
                    let numStrats = 0
                    const altTest = altStratCategory[category.info.id]
                    if (altTest) {
                        altTest.forEach(strat => {
                            if (!strat.title) {
                                numStrats++
                            }
                        })
                    }
                    HTMLContent += `<td>
            <div style='font-size:80%;color:gray'>${numStrats || '&nbsp;'}</div>
            </td>`
                })
                HTMLContent += `</tr><tr>`
                isle.runRecapCategories.forEach(categoryIndex => {
                    const category = categories[categoryIndex]
                    HTMLContent += `<td style='width:36px' class='grow ${category.info.id} ${category.info.id == altStratLevel ? 'selected' : ''}' onclick="altStratClick('${category.info.id}')">
            <div>${getImage(category.info.id)}</div>
            </td>`
                })
                HTMLContent += `</tr></table>`
            }
        })
        HTMLContent += `</div>`
        if (!altStratLevel) {
            const counts = {};
            for (const boss in altStratCategory) {
                for (const obj of altStratCategory[boss]) {
                    if (!obj.title) {
                        const player = obj.player;
                        counts[player] = (counts[player] || 0) + 1;
                    }
                }
            }
            const countArray = Object.entries(counts).map(([player, count]) => ({
                player,
                count
            }));
            countArray.sort((a, b) => b.count - a.count)
            HTMLContent += `<div class='container' style='margin-top:20px;gap:30px;align-items:flex-start'>`
            HTMLContent += `
            <div>
            <div class='container'><table>
            <tr><td colspan=5 class='font2 gray' style='font-size:120%;padding:5px'>Top Contributors</td></tr>`
            let sum = 0
            countArray.forEach((player, index) => {
                sum += player.count
                HTMLContent += `<tr class='grow ${getRowColor(index)}' onclick="openModal(userContributions('${player.player}'),'CONTRIBUTIONS')">
                <td>${getPlayerDisplay(players.find(player2 => player2.name == player.player) || player.player)}</td>
                <td>${player.count}</td>
                </tr>`
            })
            HTMLContent += `</table></div>
            <div class='container' style='color:gray;font-size:80%'>TOTAL: ${sum}</div>`
            if (runRecapCategory.tabName == '1.1+') {
                const myekulIdeas = [
                    {
                        boss: 'drkahlsrobot',
                        name: 'One Damage Boost'
                    },
                    {
                        boss: 'calamaria',
                        name: 'ALL PATTERNS!'
                    },
                    {
                        boss: 'thedevil',
                        name: 'Clap Bubbles Clap'
                    }
                ]
                HTMLContent += `
            <table style='margin-top:20px'>
            <tr><td colspan=5 class='font2 gray' style='font-size:120%;padding:5px'><div class='container' style='gap:8px'><img src='https://myekul.com/shared-assets/images/myekul.png' style='height:36px'><div>myekul's ideas</div></div></td></tr>`
                myekulIdeas.forEach((idea, index) => {
                    HTMLContent += `<tr class='${getRowColor(index)}'>
                <td class='${idea.boss}'><div class='container'>${getImage(idea.boss, 21)}</div></td>
                <td style='text-align:left;font-size:90%'>${idea.name}</td>
                </tr>`
                })
                HTMLContent += `
            </table>`
            }
            HTMLContent += `</div>`
            HTMLContent += `<div><div class='textBlock' style='width:460px'>
            Welcome to the ${myekulColor('Comm Best ILs')} database!
            This is a comprehensive collection of ILs for EVERY notable pattern / strat variation on EVERY boss in EVERY main Any% category.
            <br><br>
            The ${myekulColor('Alternate Strats')} collection serves as a resource for runners to study the best times and strategies for all possible scenarios.
            Got an idea for a new alt strat?
            ${myekulColor('Submissions are always open!')}
            </div>
            <div class="button cuphead"
                style="width:120px;gap:8px;font-size:90%;margin:20px auto"
                onclick="modalSubmitIL()">
                <i class="fa fa-plus"></i>Submit IL
            </div>
            <div class='textBlock' style='width:460px'>
            Across all categories, we have accumulated ${myekulColor(altStratNum)} ILs. Thank you for the continued support!
            </div>
            <div id='commBest_queue'>${pendingSubmissions()}</div>
            </div>`
            // Best Times
            HTMLContent += `<table>`
            HTMLContent += `<tr><td colspan=5 class='font2 gray' style='font-size:120%;padding:5px'>Best Times</td></tr>`
            categories.forEach((category, categoryIndex) => {
                const altGroup = altStratCategory[category.info.id]
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
                    <td>${getPlayerDisplay(players.find(player => player.name == fastest.player) || fastest.player, true)}</td>
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
            HTMLContent += `</div>`
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
    document.getElementById('content').innerHTML = HTMLContent
    if (['baronessvonbonbon', 'captainbrineybeard'].includes(altStratLevel) && runRecapCategory.name == '1.1+') drawChart()
    if (!altStratLevel && altStratCategory) window.firebaseUtils.firestoreReadCommBestILs()
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
const otherNames = {
    forestfollies: 'Forest Follies',
    chipsbettigan: 'Chips Bettigan',
    mrwheezy: 'Mr. Wheezy',
    pipanddot: 'Pip and Dot',
    hopuspocus: 'Hopus Pocus',
    pirouletta: 'Pirouletta',
    kingdice2: 'King Dice (Final)'
}
const imgLocation = {
    forestfollies: 'runnguns/forestfollies',
    chipsbettigan: 'phase/kingdice2',
    mrwheezy: 'phase/kingdice3',
    pipanddot: 'phase/kingdice4',
    hopuspocus: 'phase/kingdice5',
    pirouletta: 'phase/kingdice7',
    kingdice2: 'kingdice'
}
function altStrats(query) {
    const category = categories.find(category => category.info.id == query)
    const img = category ? query : imgLocation[query]
    const name = category ? category.info.name : otherNames[query]
    let HTMLContent = ''
    if (['baronessvonbonbon', 'captainbrineybeard'].includes(query) && runRecapCategory.name == '1.1+') {
        HTMLContent += altStats(query)
    }
    if (query == 'thedevil' && runRecapCategory.name == '1.1+') {
        HTMLContent += `<div class='container'>
        <input type='checkbox' ${isolatePatterns ? 'checked' : ''} onchange="playSound('move');isolatePatterns=!isolatePatterns;action()">Isolate Patterns
        </div>`
    }
    HTMLContent += `
    <div class='container'>
    <div style='margin:0;position:relative'><table style='margin:10px'>
    <tr><td colspan=10><div class='container ${query}' style='gap:8px;padding:5px;font-size:120%'>${getImage(img)}${name}</div></td></tr>`
    const baronessCheck = query == 'baronessvonbonbon'
    const RTAcheck = altStratCategory[query].some(strat => strat.rta)
    // if (!altStratCategory[query].some(strat => strat.title)) {
    //     HTMLContent += `<tr>
    // <th class='gray'>Pattern / Strat</th>`
    //     if (baronessCheck) HTMLContent += `<th class='gray'></th>`
    //     HTMLContent += `<th class='gray'>IGT</th>`
    //     if (RTAcheck) HTMLContent += `<th class='gray'>RTA</th>`
    //     HTMLContent += `<th colspan=2 class='gray'>Player</th></tr>`
    // }
    let altStrats = [...altStratCategory[query]]
    if (query == 'baronessvonbonbon' && runRecapCategory.name == '1.1+') {
        if (bonbonSort == 'Best') {
            altStrats.sort((a, b) => a.time - b.time)
        } else if (bonbonSort == 'Worst') {
            altStrats.sort((a, b) => b.time - a.time)
        }
    }
    let min = Math.min(...altStrats.filter(obj => !obj.title).map(obj => parseFloat(obj.time)))
    let max = Math.max(...altStrats.filter(obj => !obj.title).map(obj => parseFloat(obj.time)))
    altStrats.forEach((strat, index) => {
        if (strat.title && !(["Spider's Kiss", 'Head Skip'].includes(strat.title) && runRecapCategory.name == '1.1+' && isolatePatterns && query == 'thedevil')) {
            HTMLContent += `<tr><td style='height:10px'></td></tr>
            <tr>`
            if (isolatePatterns && strat.odds) {
                HTMLContent += `<th></th>
                <th colspan=2 class='gray'>${getOdds(strat.odds)}</th>
                <th colspan='3' class='gray' style='margin-top:10px'>${strat.title}</th>`
            } else {
                HTMLContent += `<th colspan='9' class='gray' style='margin-top:10px'>${strat.title}</th>`
            }
            HTMLContent += `</tr>`
        } else {
            if (!(query == 'thedevil' && runRecapCategory.name == '1.1+' && isolatePatterns && !strat.odds)) {
                HTMLContent += `<tr class='grow ${getRowColor(index)}' onclick="window.open('${strat.url}', '_blank')">
        <td style='text-align:left;padding-right:8px;font-size:80%'>${strat.name}</td>`
                if (baronessCheck) {
                    HTMLContent += `<td><div class='container'>`
                    strat.name.split(',').forEach(miniboss => {
                        miniboss = miniboss.trim()
                        HTMLContent += `<div class='container' style='width:25px'><img src='https://myekul.com/shared-assets/cuphead/images/phase/baronessvonbonbon${minibosses[miniboss]}.png' style='height:21px'></div>`
                    })
                    HTMLContent += `</div></td>`
                }
                if ((query == 'thedevil' && runRecapCategory.name == '1.1+' && isolatePatterns) || query == 'captainbrineybeard') {
                    HTMLContent += altStrats.some(strat => strat.odds3) ? oddsLayer(altStrats, index, strat, 'odds3') : ''
                    HTMLContent += oddsLayer(altStrats, index, strat, 'odds2')
                    HTMLContent += `<td class='odds'>${strat.odds ? getOdds(strat.odds) : ''}</td>`
                }
                if (['cagneycarnation', 'captainbrineybeard', 'calamaria', 'thedevil'].includes(query)) HTMLContent += bossPattern(query, strat.name)
                HTMLContent += normalizedColorCell(strat.time, min, max)
                HTMLContent += `<td class='${query}' style='padding:0 5px'>${strat.time}</td>`
                if (RTAcheck) {
                    HTMLContent += `<td class='${query}' style='padding:0 5px;font-size:80%'>${strat.rta || ''}</td>`
                }
                const player = players.find(player => player.name == strat.player)
                HTMLContent += `<td>${getPlayerDisplay(player || strat.player, true)}</td>`
            }
        }
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table>`
    if (runRecapCategory.name == '1.1+' && category) {
        const categoryIndex = categories.findIndex(category => category.info.id == query)
        HTMLContent += `<table style='position:absolute;left:110%;top:12px'>
        <tr>
        <td class='container gray' style='gap:3px;padding:3px;width:75px'>${fontAwesome('flask')}TAS</td>
        </tr>
        <tr>
        <td class='${query}' style='padding:0 5px'>${runRecapCategory.tas[categoryIndex]}</td>
        </tr>`;
        ['Main', 'Clean', 'Debug'].forEach((vid, vidIndex) => {
            HTMLContent += `<tr>
            <td colspan=2 class='background2 grow' style='font-size:90%'>
            ${getAnchor(runRecapCategory.tasLinks[vidIndex] + '&t=' + runRecapCategory.tasTimestamps[categoryIndex] + 's')}
            <span class='dim'>${fontAwesome('video-camera')}</span> ${vid}</a>
            </td>
            </tr>`
        })
        HTMLContent += `</table>`
    }
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
function pendingSubmissions(submissions = new Array(16).fill(null), done) {
    let HTMLContent = `<div class='container'><table style='width:450px;margin-top:20px'>`
    HTMLContent += `<tr><td colspan=6 class='font2 gray' style='font-size:120%;padding:5px;position:relative'>
    ${done ? '' : `<div class='loader' style='position:absolute;left:10px'></div>`}
    Pending Submissions
    </td></tr>`
    for (let i = 0; i < 16; i++) {
        const submission = submissions[i]
        HTMLContent += `<tr class='${submission ? 'grow' : ''} ${getRowColor(i)}' ${submission ? `onclick="window.open('${submission.url}', '_blank')"` : ''}>`
        if (submission) {
            let strat
            if (submission.altstrat != 'none') {
                strat = submission.altstrat == 'other' ? submission.other : submission.altstrat
            }
            HTMLContent += `
            <td class='${commBestILs[submission.category]?.className || 'gray'}'>${submission.category}</td>
            <td class='${submission.boss}'><div class='container'>${getImage(imgLocation[submission.boss] ? imgLocation[submission.boss] : submission.boss, 21)}</div></td>
            <td class='${submission.boss}'>${submission.time}</td>
            <td style='text-align:left'>${strat || ''}</td>
            <td>${getPlayerDisplay(players.find(player => player.name == submission.player) || submission.player, true)}</td>`
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
    let HTMLContent = ''
    HTMLContent += `<td class='gray'><div class='container'>`
    let split = boss == 'thedevil' ? ' ' : ', '
    const attacks = {
        cagneycarnation: ['Lunge', 'Pods', 'Seeds'],
        captainbrineybeard: ['Gun', '2-Gun', '4-Gun', 'Squid', 'Shark', 'Dogfish'],
        calamaria: ['Pufferfish', 'Turtle', 'Seahorse', 'Ghosts', 'Red Fish', 'Yellow Fish'],
        thedevil: ['Clap', 'Bubbles', 'Ring', 'Pinwheel', 'Dragon', 'Spider']
    }
    pattern.split(split).forEach(attack => {
        if (boss == 'cagneycarnation') attack = attack.split(' ')[0]
        if (attacks[boss].includes(attack)) {
            HTMLContent += `<div class='container' style='width:25px;margin:0'><img src='images/${boss}/${attack}.png' style='height:21px'></div>`
        }
    })
    HTMLContent += `</div></td>`
    return HTMLContent
}
function userContributions(playerName) {
    let HTMLContent = ''
    HTMLContent += playerDisplay(playerName)
    HTMLContent += `<table style='margin:10px'>`
    let strats = []
    for (const level in altStratCategory) {
        let title = ''
        for (const obj of altStratCategory[level]) {
            if (!obj.title) {
                if (playerName == obj.player) {
                    strats.push({ ...obj, level: level, title: title })
                }
            } else {
                title = obj.title
            }
        }
    }
    strats.forEach((strat, index) => {
        HTMLContent += `
        <tr class='grow ${getRowColor(index)}' onclick="window.open('${strat.url}', '_blank')">
        <td style='text-align:left;font-size:80%;color:gray;padding:0 3px'>${strat.title}</td>
        <td class='${strat.level}'><div class='container'>${getImage(imgLocation[strat.level] ? imgLocation[strat.level] : strat.level, 21)}</div></td>
        <td class='${strat.level}' style='padding:0 3px'>${strat.time}</td>
        <td style='text-align:left' style='padding:0 3px'>${strat.name}</td>
        </tr>`
    })
    HTMLContent += `</table>`
    return HTMLContent
}
const minibosses = {
    'Waffle': 'waffle',
    'Candy Corn': 'candycorn',
    'Cupcake': 'cupcake',
    'Gumball': 'gumball',
    'Jawbreaker': 'jawbreaker'
}
function altStats() {
    const config = {
        baronessvonbonbon: {
            minibosses: minibosses,
            fields: ['overall', 'minion1', 'minion2', 'minion3'],
            groupSize: 3,
            groupLabels: ['', '1st', '2nd', '3rd'],
            startIndex: 0,
            limit: null
        },
        captainbrineybeard: {
            minibosses: { '2-Gun': '2-Gun', '4-Gun': '4-Gun', 'Squid': 'Squid', 'Shark': 'Shark', 'Dogfish': 'Dogfish', 'Gun': 'Gun' },
            fields: ['overall', 'minion1', 'minion2'],
            groupSize: 2,
            groupLabels: ['', '1st', '2nd'],
            startIndex: 1,
            limit: 20
        }
    }
    const cfg = config[altStratLevel]
    let allStrats = altStratCategory[altStratLevel]
    const endIndex = cfg.limit ? cfg.startIndex + cfg.limit : allStrats.length
    allStrats = allStrats.slice(cfg.startIndex, endIndex)
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='gap:10px'>
        <div id='chart_${altStratLevel}' style='width:350px;margin:0'></div>
        <table>
        </tr>
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
    HTMLContent += `<td colspan=20 class='gray clickable' onclick="altStratExtra=!altStratExtra;playSound('move');action()">${fontAwesome(altStratExtra ? 'close' : 'chevron-down')}</td>
    </table></div>`
    if (altStratLevel == 'baronessvonbonbon') {
        HTMLContent += `<div class='container' style='gap:5px;margin-top:5px'>
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