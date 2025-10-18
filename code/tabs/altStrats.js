function generateAltStrats() {
    let HTMLContent = ''
    if (alt[commBestILsCategory.tabName]) {
        HTMLContent += `<div class='container' style='gap:10px'>
        <div class='button grade-a' style='width:40px;font-size:110%' onclick="playSound('category_select');altStratIndex=-1;action()">${fontAwesome('home')}</div>`
        assignIsles()
        isles.forEach(isle => {
            if (isle.runRecapCategories.length) {
                HTMLContent += `<table><tr>`
                isle.runRecapCategories.forEach(categoryIndex => {
                    const category = categories[categoryIndex]
                    HTMLContent += `<td>
            <div style='font-size:80%;color:gray'>${alt[commBestILsCategory.tabName][category.info.id]?.length || '&nbsp;'}</div>
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
            HTMLContent += `<div class='container' style='margin-top:20px;gap:30px'>
            <table>
            <tr><td colspan=5 class='font2 gray' style='font-size:150%;padding:5px'>Top Contributors</td></tr>`
            countArray.forEach((player, index) => {
                HTMLContent += `<tr class='${getRowColor(index)}'>
                ${getPlayerDisplay(players.find(player2 => player2.name == player.player))}
                <td>${player.count}</td>
                </tr>`
            })
            HTMLContent += `</table>
            <div class='textBlock' style='width:450px'>
            Welcome to the ${myekulColor('Alternate Strats')} page!
            This is a comprehensive database of ILs for EVERY notable pattern / strat variation on EVERY boss in EVERY main category.
            <br><br>
            The alt strats database serves as a resource for runners to study the best times and strategies for all possible scenarios.
            Got an idea for a new alt strat?
            ${myekulColor('Submissions are always open!')}
            </div>
            </div>`
        } else {
            HTMLContent += alt[commBestILsCategory.tabName][categories[altStratIndex].info.id] ? altStrats(altStratIndex) : `<div class='container' style='margin-top:20px'>No alt strats...</div>`
        }
    } else {
        HTMLContent += `<div class='container'>No alt strats...</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
}
function altStratClick(index) {
    altStratIndex = index
    playSound('move')
    action()
}
function altStrats(categoryIndex) {
    const category = categories[categoryIndex]
    let HTMLContent = `
    <div class='container'><table style='margin:10px'>
    <tr><td colspan=5><div class='container ${category.info.id}' style='gap:8px;padding:5px;font-size:120%'>${getImage(category.info.id)}${category.info.name}</div></td></tr>`
    const baronessCheck = category.info.id == 'baronessvonbonbon' && commBestILsCategory.name == '1.1+'
    const devilCheck = category.info.id == 'thedevil' && commBestILsCategory.name == '1.1+'
    const RTAcheck = alt[commBestILsCategory.tabName][category.info.id].some(strat => strat.rta)
    if (!alt[commBestILsCategory.tabName][category.info.id].some(strat => strat.title)) {
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
    alt[commBestILsCategory.tabName][category.info.id].forEach((strat, index) => {
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
            HTMLContent += `<td class='${category.info.id}' style='padding:0 5px'>${strat.time}</td>`
            if (RTAcheck) {
                HTMLContent += `<td class='${category.info.id}' style='padding:0 5px;font-size:80%'>${strat.rta || ''}</td>`
            }
            const player = players.find(player => player.name == strat.player)
            HTMLContent += getPlayerDisplay(player, true)
        }
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>`
    return HTMLContent
}