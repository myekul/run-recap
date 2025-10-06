function generateCommBestILs() {
    let HTMLContent = `<div class='container'><table>`
    if (alt[commBestILsCategory.name]) {
        HTMLContent += `<tr><td colspan=6></td>`
        categories.forEach((category, categoryIndex) => {
            if (alt[commBestILsCategory.name][category.info.id]) {
                HTMLContent += `<td class='clickable' style='color:gray;font-size:80%' onclick="altStrats(${categoryIndex})">${fontAwesome('exclamation-circle')}</td>`
            } else {
                HTMLContent += `<td></td>`
            }
        })
        HTMLContent += `</tr>`
    }
    HTMLContent += `<tr>`
    HTMLContent += `<td colspan=6></td>`
    categories.forEach(category => {
        HTMLContent += `<td class='${category.info.id}' style='width:36px'>${getImage(category.info.id)}</td>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `<tr>`
    HTMLContent += `<td colspan=6></td>`
    categories.forEach(category => {
        HTMLContent += `<th class='cuphead'>${secondsToHMS(category.runs[0].score)}</th>`
    })
    players.slice(0, 100).forEach((player, index) => {
        HTMLContent += `<tr class='${getRowColor(index)}'>`
        HTMLContent += bigPlayerDisplay(player)
        categories.forEach((category, index2) => {
            const run = player.runs[index2]
            if (run) {
                const debug = run.debug ? '*' : ''
                HTMLContent += `<td class='clickable'>${getAnchor(run.url)}${getTrophy(1)}${debug}<a></td>`
            } else {
                HTMLContent += `<td></td>`
            }
        })
    })
    HTMLContent += `</table></div>`
    document.getElementById('content').innerHTML = HTMLContent
}
function altStrats(categoryIndex) {
    const category = categories[categoryIndex]
    let HTMLContent = `<div class='container ${category.info.id}' style='gap:8px;padding:5px;font-size:120%'>${getImage(category.info.id)}${category.info.name}</div><table style='margin:0 auto'>`
    alt[commBestILsCategory.name][category.info.id].forEach((strat, index) => {
        HTMLContent += `<tr class='${getRowColor(index)}'>
        <td style='text-align:left;padding-right:8px'>${strat.name}</td>
        <td class='${category.info.id}' style='padding:0 5px'>${secondsToHMS(strat.time)}</td>`
        strat.runs.forEach(run => {
            const player = players.find(player => player.name == run.player.split('*')[1] || player.name == run.player)
            HTMLContent += `
            <td class='clickable'>
            ${getAnchor(run.url)}<div class='container' style='gap:5px;justify-content:left'>${getPlayerIcon(player, 21)}${getPlayerName(player)}</div></a>
            </td>`
        })
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table>`
    openModal(HTMLContent, 'ALTERNATE STRATS')
}
// if (['DLC', 'DLC+Base'].includes(commBestILsCategory.tabName) && !commBestILsCategory.extraPlayers) {
//     if (player.extra?.percentage >= 90) {
//         HTMLContent += `<td>${cupheadShot(determineShot1(player), 20, true)}</td>`
//         HTMLContent += `<td>${cupheadShot('spread', 20, true)}</td>`
//     } else {
//         HTMLContent += `<td></td><td></td>`
//     }
// }
// function determineShot1(player, categoryName) {
//     const category = categoryName ? categoryName : commBestILsCategory.name
//     if (commBestILs[category + ' L/S'].extraPlayers?.includes(player.name)) {
//         return 'lobber'
//     } else if (commBestILs[category + ' C/S'].extraPlayers?.includes(player.name)) {
//         return 'charge'
//     }
// }
function metaInfo() {
    let HTMLContent = ''
    HTMLContent += `<div ${runViableStyle}>What is a "run viable" IL?</div>
    <div class='textBlock'>
    In a top-level context,
    there are a handful of time-saving strategies which are extremely difficult to pull off consistently.
    Often times, these strats are risky or RNG reliant, and failing them will result in a considerable time loss.
    <br><br>
    For this reason, we've decided to separate ILs achieved with these strats into viable and nonviable sections.
    </div>
    <div ${runViableStyle}>"Nonviable"? But the DLC world record goes for Lunar Eclipse!</div>
    <div class='textBlock'>
    I KNOW, I know. Maybe "nonviable" isn't the best word choice.
    It's really just consistent vs inconsistent strats.
    Run viable just sounds cooler.
    </div>
    <div ${runViableStyle}>Why are run viable ILs the default view?</div>
    <div class='textBlock'>
    The ILs in the run viable section serve as a resource for runners to study and optimize their fights for fullgame consistency.
    For this reason, I think it's best to have these ILs conveniently located on the front page.</div>
    <div ${runViableStyle}>BUT THE DLC WORLD RECORD GOES FOR LUNAR ECLIPSE!</div>
    <div class='textBlock'>
    SHUT UP!
    </div>
    <div ${runViableStyle}>What are the nonviable strats?</div>
    <div class='textBlock'>
    ${generateBoardTitle(commBestILs['1.1+'])}
    ${bossImage('cagneycarnation', 'Down lunge EX')}
    ${bossImage('baronessvonbonbon', 'Up+down EXs at 1 HP')}
    ${bossImage('beppitheclown', 'Two-cycle Beppi Skip')}
    ${bossImage('drkahlsrobot', "TAS EX")}
    ${bossImage('captainbrineybeard', 'Jistuma EX on first flame')}
    ${bossImage('phantomexpress', '2 EXs on Phase 1')}
    ${bossImage('thedevil', "Spider's Kiss")}
    ${generateBoardTitle(commBestILs['NMG'])}
    ${bossImage('goopylegrande', 'Doubles (besides quad)')}
    ${bossImage('drkahlsrobot', "TAS EX")}
    ${bossImage('wernerwerman', 'Doubles (besides quad)')}
    ${generateBoardTitle(commBestILs['DLC C/S'])}
    ${bossImage('thehowlingaces', 'First laser guess')}
    ${bossImage('chefsaltbaker', 'Willy-nilly Chargimate')}
    ${bossImage('chefsaltbaker', 'Fast 4+3')}
    ${generateBoardTitle(commBestILs['DLC+Base C/S'])}
    ${bossImage('phantomexpress', 'Phase 2 one-cycle')}
    </div>`
    openModal(HTMLContent, 'RUN VIABLE INFO')
}
const runViableStyle = 'class="myekulColor font2" style="font-size:120%;margin-top:10px"'
function bossImage(boss, text) {
    return `<div class='container ${boss}' style='border-radius:5px;justify-content:left;gap:8px;width:300px;margin:5px;margin-left:15px;padding-left:5px'>
    <img src='https://myekul.github.io/shared-assets/cuphead/images/${boss}.png' style='height:36px'>
    <div>${text}</div>
    </div>`
}