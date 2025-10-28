function generateAltStrats() {
    let HTMLContent = ''
    if (alt[commBestILsCategory.tabName]) {
        HTMLContent += `<div class='container' style='gap:10px'>`
        assignIsles()
        HTMLContent += `<table>
        <tr><td class='background2' style='font-size:80%;color:gray'>${alt[commBestILsCategory.tabName].forestfollies?.length || '&nbsp;'}</td></tr>
        <tr><td class='grow' onclick="altStratClick(-2)"><div>${getImage('other/forestfollies')}</div></td></tr>
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
                    HTMLContent += `<td style='width:36px' class='grow ${category.info.id} ${categoryIndex == altStratIndex ? 'selected' : ''}' onclick="altStratClick(${categoryIndex})">
            <div>${getImage(category.info.id)}</div>
            </td>`
                })
                HTMLContent += `</tr></table>`
            }
        })
        HTMLContent += `</div>`
        if (altStratIndex == -1) {
            const counts = {};
            for (const category in alt[commBestILsCategory.tabName]) {
                for (const obj of alt[commBestILsCategory.tabName][category]) {
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
                HTMLContent += `<tr class='${getRowColor(index)}'>
                ${getPlayerDisplay(players.find(player2 => player2.name == player.player))}
                <td>${player.count}</td>
                </tr>`
            })
            HTMLContent += `</table></div>
            <div class='container' style='color:gray;font-size:80%'>TOTAL: ${sum}</div>`
            if (commBestILsCategory.tabName == '1.1+') {
                const myekulIdeas = [
                    {
                        boss: 'ribbyandcroaks',
                        name: '6 Flies Regular Skip, Bulls'
                    },
                    {
                        boss: 'ribbyandcroaks',
                        name: '6 Flies Regular Skip, Tigers'
                    },
                    {
                        boss: 'hildaberg',
                        name: 'Double Trollnado'
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
                        name: 'Pinwheel Clap Dragon'
                    },
                    {
                        boss: 'thedevil',
                        name: 'Clap Bubbles Clap'
                    },
                    {
                        boss: 'thedevil',
                        name: 'Pinwheel Spider'
                    },
                    {
                        boss: 'thedevil',
                        name: 'Clap Spider'
                    }
                ]
                HTMLContent += `
            <table style='margin-top:20px'>
            <tr><td colspan=5 class='font2 gray' style='font-size:120%;padding:5px'><div class='container' style='gap:8px'><img src='https://myekul.github.io/shared-assets/images/myekul.png' style='height:36px'><div>myekul's ideas</div></div></td></tr>`
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
                    ${getPlayerDisplay(players.find(player => player.name == fastest.player), true)}
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
            const category = categories[altStratIndex]
            const location = category ? category.info.id : 'forestfollies'
            HTMLContent += `<div class='button grade-a' style='width:40px;font-size:110%;margin:10px auto' onclick="playSound('category_select');altStratIndex=-1;action()">${fontAwesome('reply')}</div>`
            HTMLContent += alt[commBestILsCategory.tabName][location] ? altStrats(altStratIndex) : `<div class='container' style='margin-top:20px'>No alt strats...</div>`
        }
    } else {
        HTMLContent += `<div class='container'>No alt strats...</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
    window.firebaseUtils.firestoreReadCommBestILs()
}
function altStratClick(index) {
    altStratIndex = index
    playSound('move')
    action()
}
function altStrats(categoryIndex) {
    const category = categories[categoryIndex]
    const query = category ? category.info.id : 'forestfollies'
    const img = category ? category.info.id : 'other/forestfollies'
    const name = category ? category.info.name : 'Forest Follies'
    let HTMLContent = ''
    HTMLContent += `
    <div class='container'><table style='margin:10px'>
    <tr><td colspan=5><div class='container ${query}' style='gap:8px;padding:5px;font-size:120%'>${getImage(img)}${name}</div></td></tr>`
    const baronessCheck = query == 'baronessvonbonbon'
    const devilCheck = query == 'thedevil'
    const RTAcheck = alt[commBestILsCategory.tabName][query].some(strat => strat.rta)
    if (!alt[commBestILsCategory.tabName][query].some(strat => strat.title)) {
        HTMLContent += `<tr>
    <th class='gray'>Pattern / Strat</th>`
        if (baronessCheck) {
            HTMLContent += `<th class='gray'></th>`
        }
        HTMLContent += `<th class='gray'>IGT</th>`
        if (RTAcheck) HTMLContent += `<th class='gray'>RTA</th>`
        HTMLContent += `<th colspan=2 class='gray'>Player</th></tr>`
    }
    const minibosses = {
        'Candy Corn': 'candycorn',
        'Waffle': 'waffle',
        'Cupcake': 'cupcake',
        'Gumball': 'gumball',
        'Jawbreaker': 'jawbreaker'
    }
    const attacks = ['Clap', 'Bubbles', 'Ring', 'Pinwheel', 'Dragon', 'Spider']
    alt[commBestILsCategory.tabName][query].forEach((strat, index) => {
        if (strat.title) {
            HTMLContent += `
            <tr><td style='height:10px'></td></tr>
            <tr><th colspan='5' class='gray' style='margin-top:10px'>${strat.title}</th>`
        } else {
            HTMLContent += `<tr class='grow ${getRowColor(index)}' onclick="window.open('${strat.url}', '_blank')">
        <td style='text-align:left;padding-right:8px;font-size:80%'>${strat.name}</td>`
            if (baronessCheck) {
                HTMLContent += `<td><div class='container'>`
                strat.name.split(',').forEach(miniboss => {
                    miniboss = miniboss.trim()
                    HTMLContent += `<div class='container' style='width:25px'><img src='https://myekul.github.io/shared-assets/cuphead/images/phase/baronessvonbonbon${minibosses[miniboss]}.png' style='height:21px'></div>`
                })
                HTMLContent += `</div></td>`
            }
            if (devilCheck) {
                HTMLContent += `<td class='gray'><div class='container'>`
                strat.name.split(' ').forEach(attack => {
                    if (attacks.includes(attack)) {
                        HTMLContent += `<div class='container' style='width:25px;margin:0'><img src='images/thedevil/${attack}.png' style='height:21px'></div>`
                    }
                })
                HTMLContent += `</div></td>`
            }
            HTMLContent += `<td class='${query}' style='padding:0 5px'>${strat.time}</td>`
            if (RTAcheck) {
                HTMLContent += `<td class='${query}' style='padding:0 5px;font-size:80%'>${strat.rta || ''}</td>`
            }
            const player = players.find(player => player.name == strat.player)
            HTMLContent += getPlayerDisplay(player, true)
        }
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>`
    return HTMLContent
}
function pendingSubmissions(submissions = new Array(10).fill(null)) {
    let HTMLContent = `<div class='container'><table style='width:450px;margin-top:20px'>`
    HTMLContent += `<tr><td colspan=6 class='font2 gray' style='font-size:120%;padding:5px'>Pending Submissions</td></tr>`
    for (let i = 0; i < 10; i++) {
        const submission = submissions[i]
        HTMLContent += `<tr class='${submission ? 'grow' : ''} ${getRowColor(i)}' ${submission ? `onclick="window.open('${submission.url}', '_blank')"` : ''}>`
        if (submission) {
            let strat
            if (submission.altstrat != 'none') {
                strat = submission.altstrat == 'other' ? submission.other : submission.altstrat
            }
            HTMLContent += `
            <td class='${commBestILs[submission.category].className}'>${submission.category}</td>
            <td class='${submission.boss}'><div class='container'>${getImage(submission.boss == 'forestfollies' ? 'other/forestfollies' : submission.boss, 21)}</div></td>
            <td class='${submission.boss}'>${submission.time}</td>
            <td style='text-align:left'>${strat || ''}</td>
            ${getPlayerDisplay(players.find(player => player.name == submission.player) || submission.player, true)}`
        } else {
            HTMLContent += `<td colspan=6>&nbsp;</td>`
        }
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table></div>`
    return HTMLContent
}