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
function modalSubmitIL() {
    let bossSelectHTML = ''
    categories.forEach(category => {
        bossSelectHTML += `<option value='${category.info.id}'>${category.info.name}</option>`
    })
    let inputty = [
        {
            name: 'Level',
            html: `<select id="dropdown_commBestILs_level" onchange="handleBossDropdown()">
            <option value='none' selected>-- Select a Level --</option>
            <option value='forestfollies'>Forest Follies</option>
            ${bossSelectHTML}
            </select>`
        },
        {
            name: 'Time',
            html: `<input id='input_commBestILs_time' type='text' placeholder='XX.XX' style='font-size:100%;width:80px' onchange="checkSubmittable()">`
        },
        {
            name: 'Alt Strat',
            html: `<select id='dropdown_commBestILs_altStrat' onchange="handleAltStratDropdown()"></select>`
        },
        {
            name: 'Other',
            html: `<input id='input_commBestILs_other' type='text' style='font-size:100%;width:250px' onchange="checkSubmittable()">`
        },
        {
            name: 'URL',
            html: `<input id='input_commBestILs_url' type='text' style='font-size:100%;width:250px' onchange="checkSubmittable()">`
        }
    ]
    let HTMLContent = ''
    HTMLContent += `
    <div class='container' style='gap:12px;margin:10px'>
    ${generateBoardTitle()}
    ${runRecapPlayer()}
    </div>`
    HTMLContent += `<table id='commBestILsSubmit' style='margin:0 auto'>`
    inputty.forEach(elem => {
        HTMLContent += `<tr id='commBestILs_row_${elem.name}' style='height:36px;${elem.name == 'Other' ? 'display:none' : ''}'>
        <td>${elem.name}</td>`
        HTMLContent += `<td id='commBestILs_${elem.name.trim().toLowerCase()}'><div class='container' style='justify-content:left'><div id='commBestILs_level_cell3'></div>${elem.html}</div></td>
        </tr>`
    })
    HTMLContent += `</table>
    <div class='container' style='height:50px'>
        <div id='commBestILs_uploadButton' class="button cuphead grayedOut"
                                style="width:120px;gap:8px;font-size:90%;margin:20px auto"
                                onclick="submitIL()">
                                <i class="fa fa-plus"></i>Submit IL
                            </div>
        <div id='commBestILs_uploadCheck' class='container' style='display:none;width:190px;font-size:200%;margin:0'></div>
    </div>
    <div class='textBlock' style='color:gray;font-size:80%;padding:10px 0'>
    -Debug mod, Lobber EX crits, and RNG manip are allowed.
    <br>-For video proof, game audio and full scorecard are preferred.
    <br>-Unobstructed gameplay is preferred.
    <br>-V-sync must be turned off.
    <br>-Pause buffers must be less than 1s.
    <br>-Submitting ILs on behalf of other players is encouraged.
    <br>-Submissions will be manually verified by myekul.
    </div>`
    openModal(HTMLContent, 'COMM BEST IL SUBMISSION')
}
function handleBossDropdown() {
    checkSubmittable()
    playSound('cardflip')
    const level = document.getElementById('dropdown_commBestILs_level').value
    if (level != 'none') {
        document.getElementById('dropdown_commBestILs_level').className = level
        document.getElementById('commBestILs_level').className = level
        document.getElementById('commBestILs_level_cell3').innerHTML = `<div class='container' style='width:32px;padding-left:5px'>${getImage(level == 'forestfollies' ? 'other/forestfollies' : level, 32)}</div>`
        let altStratHTML = `
        <option value='none'>-- None --</option>
        <option value='other'>++ New alt strat ++</option>`
        const altTest = alt[commBestILsCategory.tabName]
        if (altTest) {
            if (altTest[level]) {
                let prevStrat
                altTest[level].forEach(strat => {
                    if (strat.title) altStratHTML += `<optgroup label='-- ${strat.title} --'>`
                    if (strat.name) altStratHTML += `<option value='${strat.name}'>${strat.name}</option>`
                    prevStrat = strat
                    if (prevStrat.title) altStratHTML += `</optgroup>`
                })
            }
        }
        document.getElementById('dropdown_commBestILs_altStrat').innerHTML = altStratHTML
    } else {
        document.getElementById('dropdown_commBestILs_level').className = ''
        document.getElementById('commBestILs_level').className = ''
        document.getElementById('commBestILs_level_cell3').innerHTML = ''
    }
}
function handleAltStratDropdown() {
    checkSubmittable()
    playSound('cardflip')
    if (document.getElementById('dropdown_commBestILs_altStrat').value == 'other') {
        show('commBestILs_row_Other')
    } else {
        hide('commBestILs_row_Other')
    }
}
function checkSubmittable() {
    const button = document.getElementById('commBestILs_uploadButton')
    if (localStorage.getItem('username') && document.getElementById('dropdown_commBestILs_level').value != 'none' && document.getElementById('input_commBestILs_time').value && !(document.getElementById('dropdown_commBestILs_altStrat').value == 'other' && !document.getElementById('input_commBestILs_other').value) && document.getElementById('input_commBestILs_url').value) {
        button.classList.remove('grayedOut')
        button.classList.add('pulseSize')
        commbestILs_ready = true
    } else {
        button.classList.add('grayedOut')
        button.classList.remove('pulseSize')
        commbestILs_ready = false
    }
}
function submitIL() {
    if (commbestILs_ready) {
        playSound('ready')
        window.firebaseUtils.firestoreWriteCommBestILs()
    } else {
        playSound('locked')
    }
}