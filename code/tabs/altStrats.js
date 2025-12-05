function generateAltStrats() {
    let HTMLContent = ''
    if (alt[commBestILsCategory.tabName]) {
        HTMLContent += `<div class='container' style='gap:10px'>`
        assignIsles()
        HTMLContent += `<table>
        <tr><td class='background2' style='font-size:80%;color:gray'>${alt[commBestILsCategory.tabName].forestfollies?.length || '&nbsp;'}</td></tr>
        <tr><td class='grow' onclick="altStratClick('forestfollies')"><div>${getImage('other/forestfollies')}</div></td></tr>
        </table>`
        isles.forEach(isle => {
            if (isle.runRecapCategories.length) {
                HTMLContent += `<table><tr class='background2'>`
                isle.runRecapCategories.forEach(categoryIndex => {
                    const category = categories[categoryIndex]
                    let numStrats = 0
                    const altTest = alt[commBestILsCategory.tabName][category.info.id]
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
            for (const boss in alt[commBestILsCategory.tabName]) {
                for (const obj of alt[commBestILsCategory.tabName][boss]) {
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
            if (commBestILsCategory.tabName == '1.1+') {
                const myekulIdeas = [
                    {
                        boss: 'hildaberg',
                        name: 'Double Trollnado'
                    },
                    {
                        boss: 'hildaberg',
                        name: 'No Damage Boosts'
                    },
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
                    },
                    {
                        boss: 'thedevil',
                        name: 'Clap Bubbles Clap Dragon (Slower)'
                    },
                    {
                        boss: 'thedevil',
                        name: 'Clap Bubbles Clap Dragon (Slowest)'
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
            Across all categories, we have accumulated ${myekulColor(commBestILSum)} ILs. Thank you for the continued support!
            </div>
            <div id='commBest_queue'>${pendingSubmissions()}</div>
            </div>`
            // Best Times
            HTMLContent += `<table>`
            HTMLContent += `<tr><td colspan=5 class='font2 gray' style='font-size:120%;padding:5px'>Best Times</td></tr>`
            categories.forEach((category, categoryIndex) => {
                const altGroup = alt[commBestILsCategory.tabName][category.info.id]
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
                    <td>${getPlayerDisplay(players.find(player => player.name == fastest.player), true)}</td>
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
            if (alt[commBestILsCategory.tabName][altStratLevel]) {
                HTMLContent += altStrats(altStratLevel)
                if (commBestILsCategory.name == '1.1+' && altStratLevel == 'kingdice') {
                    ['mrwheezy', 'hopuspocus', 'pirouletta', 'kingdice2'].forEach(miniboss => {
                        HTMLContent += altStrats(miniboss)
                    })
                }
            } else {
                HTMLContent += `<div class='container' style='margin-top:20px'>No alt strats...</div>`
            }
        }
    } else {
        HTMLContent += `<div class='container'>No alt strats...</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
    if (altStratLevel == 'baronessvonbonbon' && commBestILsCategory.name == '1.1+') drawChart()
    if (!altStratLevel) window.firebaseUtils.firestoreReadCommBestILs()
}
function drawChart() {
    let data = [['Value']]
    alt[commBestILsCategory.tabName].baronessvonbonbon.forEach(strat => {
        data.push([parseFloat(strat.time)])
    })
    data = google.visualization.arrayToDataTable(data);
    const font = getComputedStyle(document.documentElement).getPropertyValue('--font')
    var options = {
        chartArea: { height: '75%', width: '90%' },
        legend: { position: 'none' },
        colors: ["hotpink"],
        backgroundColor: 'transparent',
        histogram: {
            bucketSize: 0.5
        },
        hAxis: {
            viewWindow: { min: 29, max: 38 },
            ticks: [29, 30, 31, 32, 33, 34, 35, 36, 37],
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
        document.getElementById("chart_baroness")
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
    mrwheezy: 'Mr. Wheezy',
    hopuspocus: 'Hopus Pocus',
    pirouletta: 'Pirouletta',
    kingdice2: 'King Dice (Final)'
}
const imgLocation = {
    forestfollies: 'other/forestfollies',
    mrwheezy: 'phase/kingdice3',
    hopuspocus: 'phase/kingdice5',
    pirouletta: 'phase/kingdice7',
    kingdice2: 'kingdice'
}
const minibosses = {
    'Waffle': 'waffle',
    'Candy Corn': 'candycorn',
    'Cupcake': 'cupcake',
    'Gumball': 'gumball',
    'Jawbreaker': 'jawbreaker'
}
function altStrats(query) {
    const category = categories.find(category => category.info.id == query)
    const img = category ? query : imgLocation[query]
    const name = category ? category.info.name : otherNames[query]
    let HTMLContent = ''
    if (query == 'baronessvonbonbon' && commBestILsCategory.name == '1.1+') {
        HTMLContent += bonbonStuff()
    }
    if (query == 'thedevil' && commBestILsCategory.name == '1.1+') {
        HTMLContent += `<div class='container'>
        <input type='checkbox' ${isolatePatterns ? 'checked' : ''} onchange="playSound('move');isolatePatterns=!isolatePatterns;action()">Isolate Patterns
        </div>`
    }
    HTMLContent += `
    <div class='container'>
    <div style='margin:0;position:relative'><table style='margin:10px'>
    <tr><td colspan=10><div class='container ${query}' style='gap:8px;padding:5px;font-size:120%'>${getImage(img)}${name}</div></td></tr>`
    const baronessCheck = query == 'baronessvonbonbon'
    const RTAcheck = alt[commBestILsCategory.tabName][query].some(strat => strat.rta)
    // if (!alt[commBestILsCategory.tabName][query].some(strat => strat.title)) {
    //     HTMLContent += `<tr>
    // <th class='gray'>Pattern / Strat</th>`
    //     if (baronessCheck) HTMLContent += `<th class='gray'></th>`
    //     HTMLContent += `<th class='gray'>IGT</th>`
    //     if (RTAcheck) HTMLContent += `<th class='gray'>RTA</th>`
    //     HTMLContent += `<th colspan=2 class='gray'>Player</th></tr>`
    // }
    let altStrats = [...alt[commBestILsCategory.tabName][query]]
    let min = 0
    let max = Infinity
    if (query == 'baronessvonbonbon' && commBestILsCategory.name == '1.1+') {
        if (bonbonSort == 'Best') {
            altStrats.sort((a, b) => a.time - b.time)
        } else if (bonbonSort == 'Worst') {
            altStrats.sort((a, b) => b.time - a.time)
        }
    }
    min = Math.min(...altStrats.filter(obj => !obj.title).map(obj => parseFloat(obj.time)))
    max = Math.max(...altStrats.filter(obj => !obj.title).map(obj => parseFloat(obj.time)))
    function normalizeTime(time) {
        return (time - min) / (max - min);
    }
    function getColor(normalized) {
        let r, g;
        if (normalized < 0.5) {
            r = Math.round(255 * (normalized * 2))
            g = 255;
        } else {
            r = 255;
            g = Math.round(255 * (1 - (normalized - 0.5) * 2))
        }
        return `rgb(${r},${g},0)`;
    }
    altStrats.forEach((strat, index) => {
        if (strat.title && !(strat.title == 'Head Skip' && commBestILsCategory.name == '1.1+' && isolatePatterns && query == 'thedevil')) {
            HTMLContent += `<tr><td style='height:10px'></td></tr>
            <tr>`
            if (isolatePatterns && strat.odds) {
                HTMLContent += `<th></th>
                <th class='gray'>${getOdds(strat.odds)}</th>
                <th colspan='3' class='gray' style='margin-top:10px'>${strat.title}</th>`
            } else {
                HTMLContent += `<th colspan='5' class='gray' style='margin-top:10px'>${strat.title}</th>`
            }
            HTMLContent += `</tr>`
        } else {
            if (!(commBestILsCategory.name == '1.1+' && query == 'thedevil' && isolatePatterns && !strat.odds)) {
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
                HTMLContent += query == 'thedevil' && commBestILsCategory.name == '1.1+' && isolatePatterns ? `<td style='font-size:80%;text-align:right;color:gray' style='padding:0 5px'>${getOdds(strat.odds)}</td>` : ''
                if (['cagneycarnation', 'calamaria', 'thedevil'].includes(query)) HTMLContent += bossPattern(query, strat.name)
                HTMLContent += `<td style='width:5px;background-color:${getColor(normalizeTime(strat.time))}'></td>`
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
    if (commBestILsCategory.name == '1.1+' && category) {
        const categoryIndex = categories.findIndex(category => category.info.id == query)
        HTMLContent += `<table style='position:absolute;left:110%;top:12px'>
        <tr>
        <td class='container gray' style='gap:3px;padding:3px;width:75px'>${fontAwesome('flask')}TAS</td>
        </tr>
        <tr>
        <td class='${query}' style='padding:0 5px'>${commBestILsCategory.tas[categoryIndex]}</td>
        </tr>`;
        ['Main', 'Clean', 'Debug'].forEach((vid, vidIndex) => {
            HTMLContent += `<tr>
            <td colspan=2 class='background2 grow' style='font-size:90%'>
            ${getAnchor(commBestILsCategory.tasLinks[vidIndex] + '&t=' + commBestILsCategory.tasTimestamps[categoryIndex] + 's')}
            <span class='dim'>${fontAwesome('video-camera')}</span> ${vid}</a>
            </td>
            </tr>`
        })
        HTMLContent += `</table>`
    }
    HTMLContent += `</div></div>`
    return HTMLContent
    function getOdds(odds) {
        return ((odds.split('/')[0] / odds.split('/')[1]) * 100).toFixed(1) + '%'
    }
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
            <td class='${commBestILs[submission.category].className}'>${submission.category}</td>
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
    HTMLContent += `<table style='margin-top:10px'>`
    let strats = []
    for (const level in alt[commBestILsCategory.tabName]) {
        let title = ''
        for (const obj of alt[commBestILsCategory.tabName][level]) {
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
        <tr class='${getRowColor(index)}'>
        <td style='text-align:left;font-size:80%;color:gray;padding:0 3px'>${strat.title}</td>
        <td class='${strat.level}'><div class='container'>${getImage(imgLocation[strat.level] ? imgLocation[strat.level] : strat.level, 21)}</div></td>
        <td class='${strat.level}' style='padding:0 3px'>${strat.time}</td>
        <td style='text-align:left' style='padding:0 3px'>${strat.name}</td>
        </tr>`
    })
    HTMLContent += `</table>`
    return HTMLContent
}
function bonbonStuff() {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='gap:10px'>
        <div id='chart_baroness' style='width:350px;margin:0'></div>
        <table>
        </tr>
        <td></td>`
    if (baronessExtra) HTMLContent += `<td></td>`
    minibossArray = []
    for (const miniboss in minibosses) {
        const minibossInfo = { name: miniboss, overall: [], minion1: [], minion2: [], minion3: [] }
        HTMLContent += `<td class='${minibosses[miniboss]}'>${getImage('phase/baronessvonbonbon' + minibosses[miniboss])}</td>`
        for (const obj of alt[commBestILsCategory.tabName].baronessvonbonbon) {
            obj.name.split(', ').forEach((name, index) => {
                if (name == miniboss) {
                    minibossInfo.overall.push(obj)
                    if (index == 0) minibossInfo.minion1.push(obj)
                    if (index == 1) minibossInfo.minion2.push(obj)
                    if (index == 2) minibossInfo.minion3.push(obj)
                }
            })
        }
        minibossArray.push(minibossInfo)
    }
    HTMLContent += `
    <td rowspan=6 style='width:15px'></td>
    <td class='baronessvonbonbon'>${getImage('baronessvonbonbon')}</div>`
    HTMLContent += bonbonRow('overall', '')
    if (baronessExtra) {
        HTMLContent += bonbonRow('minion1', '1st')
        HTMLContent += bonbonRow('minion2', '2nd')
        HTMLContent += bonbonRow('minion3', '3rd')
    }
    HTMLContent += `<td colspan=9 class='gray clickable' onclick="baronessExtra=!baronessExtra;playSound('move');action()">${fontAwesome(baronessExtra ? 'close' : 'chevron-down')}</td>`
    HTMLContent += `</table></div>`
    HTMLContent += `<div class='container' style='gap:5px'>
    <div>Sort:</div>`;
    ['Standard', 'Best', 'Worst'].forEach(sort => {
        HTMLContent += `<div class='button ${sort == bonbonSort ? 'cuphead' : ''}' style='width:75px' onclick="bonbonSort='${sort}';action();playSound('move')">${sort}</div>`
    })
    HTMLContent += `</div>`
    return HTMLContent
    function bonbonRow(field, label) {
        let HTMLContent = ''
        HTMLContent += `<tr>`
        if (baronessExtra) HTMLContent += `<td rowspan=5 class='${label ? 'gray' : ''}' style='padding:5px'>${label}</td>`
        // Mean
        HTMLContent += `<td class='myekulColor'>Mean</td>`
        minibossArray.forEach(miniboss => {
            const mean = math.mean(miniboss[field].map(entry => parseFloat(entry.time)))
            HTMLContent += `<td class='baronessvonbonbon' style='padding:0 3px'>${mean.toFixed(2)}</td>`
        })
        if (!label) {
            const mean = math.mean(alt[commBestILsCategory.tabName].baronessvonbonbon.map(entry => parseFloat(entry.time)))
            HTMLContent += `<td class='baronessvonbonbon' style='padding:0 3px'>${mean.toFixed(2)}</td>`
        }
        HTMLContent += `</tr>`
        // Std. Dev
        HTMLContent += `<tr class='background2' style='font-size:80%'>
            <td>Std. Dev</td>`
        minibossArray.forEach(miniboss => {
            const std = math.std(miniboss[field].map(entry => parseFloat(entry.time)))
            HTMLContent += `<td class='dim'>${std.toFixed(2)}s</td>`
        })
        if (!label) {
            const std = math.std(alt[commBestILsCategory.tabName].baronessvonbonbon.map(entry => parseFloat(entry.time)))
            HTMLContent += `<td class='dim'>${std.toFixed(2)}s</td>`
        }
        HTMLContent += `</tr>`
        // Median
        HTMLContent += `<tr class='background2' style='font-size:80%'>
            <td>Median</td>`
        minibossArray.forEach(miniboss => {
            const median = math.median(miniboss[field].map(entry => parseFloat(entry.time)))
            HTMLContent += `<td>${median.toFixed(2)}</td>`
        })
        if (!label) {
            const median = math.median(alt[commBestILsCategory.tabName].baronessvonbonbon.map(entry => parseFloat(entry.time)))
            HTMLContent += `<td>${median.toFixed(2)}</td>`
        }
        HTMLContent += `</tr>`
        // Min
        HTMLContent += `<tr style='font-size:70%'>
            <td>Min</td>`
        minibossArray.forEach(miniboss => {
            const min = Math.min(...miniboss[field].map(entry => parseFloat(entry.time)))
            HTMLContent += `<td>${min.toFixed(2)}</td>`
        })
        if (!label) {
            const min = Math.min(...alt[commBestILsCategory.tabName].baronessvonbonbon.map(entry => parseFloat(entry.time)))
            HTMLContent += `<td>${min.toFixed(2)}</td>`
        }
        HTMLContent += `</tr>`
        // Max
        HTMLContent += `<tr class='background2' style='font-size:70%'>
            <td>Max</td>`
        minibossArray.forEach(miniboss => {
            const max = Math.max(...miniboss[field].map(entry => parseFloat(entry.time)))
            HTMLContent += `<td>${max}</td>`
        })
        if (!label) {
            const max = Math.max(...alt[commBestILsCategory.tabName].baronessvonbonbon.map(entry => parseFloat(entry.time)))
            HTMLContent += `<td>${max.toFixed(2)}</td>`
        }
        HTMLContent += `</tr>`
        return HTMLContent
    }
}