function generateCommBestILs() {
    let HTMLContent = `<div class='container'><table>`
    HTMLContent += `<tr>`
    HTMLContent += `<td colspan=4></td>`
    categories.forEach(category => {
        HTMLContent += `<td class='${category.info.id}' style='width:36px'>${getImage(category.info.id)}</td>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `<tr>`
    HTMLContent += `<td colspan=4></td>`
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
// if (['DLC', 'DLC+Base'].includes(runRecapCategory.tabName) && !runRecapCategory.extraPlayers) {
//     if (player.extra?.percentage >= 90) {
//         HTMLContent += `<td>${cupheadShot(determineShot1(player), 20, true)}</td>`
//         HTMLContent += `<td>${cupheadShot('spread', 20, true)}</td>`
//     } else {
//         HTMLContent += `<td></td><td></td>`
//     }
// }
// function determineShot1(player, categoryName) {
//     const category = categoryName ? categoryName : runRecapCategory.name
//     if (commBestILs[category + ' L/S'].extraPlayers?.includes(player.name)) {
//         return 'lobber'
//     } else if (commBestILs[category + ' C/S'].extraPlayers?.includes(player.name)) {
//         return 'charge'
//     }
// }
function runViableInfo() {
    let HTMLContent = ''
    HTMLContent += `<div ${runViableStyle}>What is a "Run Viable" IL?</div>
    <div class='textBlock'>
    In a top-level context,
    there are a handful of time-saving strategies which are extremely difficult to pull off consistently.
    Often times, these strats are risky or RNG reliant, and failing them will result in a considerable time loss.
    <br><br>
    For this reason, we've curated this collection of ILs achieved with run viable strats.
    </div>
    <div ${runViableStyle}>What are the nonviable strats?</div>
    <div class='textBlock'>
    ${generateBoardTitle(commBestILs['1.1+'])}
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
    <img src='https://myekul.com/shared-assets/cuphead/images/${boss}.png' style='height:36px'>
    <div>${text}</div>
    </div>`
}