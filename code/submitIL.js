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