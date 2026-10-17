function modalSubmit() {
    let bossSelectHTML = ''
    assignIsles()
    isles.forEach(isle => {
        if (isle?.runRecapCategories?.length) {
            bossSelectHTML += `<optgroup label='${isle.name}'>`
            isle.runRecapCategories.forEach(categoryIndex => {
                const category = categories[categoryIndex]
                bossSelectHTML += `<option value='${category.info.id}'>${category.info.name}</option>`
            })
            bossSelectHTML += `</optgroup>`
        }
    })
    if (runRecapCategory.name == 'Other' && ['1.1+ All Flags', '300%'].includes(altStratOther)) {
        const levels = altStratOther == '300%' ? OTHER_LEVELS : OTHER_LEVELS.slice(-5)
        bossSelectHTML += `<optgroup label='Other'>`
        levels.forEach(level => {
            bossSelectHTML += `<option value='${level}'>${level}</option>`
        })
        bossSelectHTML += `</optgroup>`
    }
    let inputty = [
        {
            name: 'Level',
            html: `<select id="dropdown_submitIL_level" onchange="handleBossDropdown()">
            <option value='none' selected>-- Select a Level --</option>
            <option value='forestfollies'>Forest Follies</option>
            ${mausCriteria() ? `<option value='mausoleum'>Mausoleum</option>` : ''}
            ${bossSelectHTML}
            </select>`
        },
        {
            name: 'Time',
            html: `<input id='input_submitIL_time' type='text' placeholder='XX.XX' style='font-size:100%;width:80px' onchange="checkSubmittable()">`
        },
        {
            name: 'Alt Strat',
            html: `<select id='dropdown_submitIL_altStrat' onchange="handleAltStratDropdown()"></select>`
        },
        {
            name: 'Other',
            html: `<input id='input_submitIL_other' type='text' style='font-size:100%;width:250px' onchange="checkSubmittable()">`
        },
        {
            name: 'URL',
            html: `<input id='input_submitIL_url' type='text' style='font-size:100%;width:250px' onchange="checkSubmittable()">`
        }
    ]
    let HTMLContent = `
    <div class='container' style='gap:12px;margin:10px'>
        ${generateBoardTitle()}
        ${playerDisplay()}
    </div>
    <table id='submitILTable' style='margin:0 auto'>`
    inputty.forEach(elem => {
        HTMLContent += `
        <tr id='submitIL_row_${elem.name}' style='height:36px;${elem.name == 'Other' ? 'display:none' : ''}'>
            <td>${elem.name}</td>
            <td id='submitIL_${elem.name.trim().toLowerCase()}'><div class='container' style='justify-content:left'><div id='submitIL_level_cell3'></div>${elem.html}</div></td>
        </tr>`
    })
    HTMLContent += `
    </table>
    <div class='container' style='height:50px'>
        <div id='submitIL_uploadButton' class="button cuphead grayedOut" style="width:120px;gap:8px;font-size:90%;margin:20px auto" onclick="submitIL()">
            <i class="fa fa-plus"></i>
            Submit
        </div>
        <div id='submitIL_uploadCheck' class='container' style='display:none;width:190px;font-size:200%;margin:0'></div>
    </div>
    <div class='textBlock dim' style='font-size:80%;padding:10px 0'>
        -Debug mod, Lobber EX crits, and RNG control are allowed.
        <br>-For video proof, game audio and full scorecard are preferred.
        <br>-Unobstructed gameplay is preferred.
        <br>-V-sync must be turned off.
        <br>
        <br>-Pausing is only allowed on Wally and Devil.
        <br>-Pause buffers must be less than 1s.
        <br>-Only 1 pause is allowed.
        <br>
        <br>-ILs with exact time attached will take precedence over non-exact times.
        <br>-Submitting ILs on behalf of other players is encouraged.
        <br>-Submissions will be manually verified by myekul.
    </div>`
    openModal(HTMLContent, 'IL SUBMISSION')
}
function handleBossDropdown() {
    checkSubmittable()
    playSound('cardflip')
    const level = document.getElementById('dropdown_submitIL_level').value
    if (level != 'none') {
        document.getElementById('dropdown_submitIL_level').className = level
        document.getElementById('submitIL_level').className = level
        document.getElementById('submitIL_level_cell3').innerHTML = `<div class='container' style='width:32px;padding-left:5px'>${getImage(imageLocation(level), 32)}</div>`
        let altStratHTML = `
        <option value='none'>-- None --</option>
        ${runRecapCategory.tabName ? `<option value='Run Viable'>Run Viable IL</option>` : ''}
        ${runRecapCategory.tabName ? `<option value='Vanilla'>Vanilla IL</option>` : ''}
        <option value='other'>++ New alt strat ++</option>`
        const altTest = alt[runRecapCategory.tabName]
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
        document.getElementById('dropdown_submitIL_altStrat').innerHTML = altStratHTML
    } else {
        document.getElementById('dropdown_submitIL_level').className = ''
        document.getElementById('submitIL_level').className = ''
        document.getElementById('submitIL_level_cell3').innerHTML = ''
    }
}
function imageLocation(level) {
    level = level.toLowerCase().replaceAll(" ", "")
    if (level == 'angelanddemon') return 'other/angelanddemon'
    if (level == 'mausoleum') return 'other/mausoleum'
    if (RUNNGUNS.includes(level)) {
        return 'runnguns/' + level
    } else if (IMG_LOCATION[level]) {
        return IMG_LOCATION[level]
    } else if (OTHER_LEVELS.map(level => level.toLowerCase().replaceAll(" ", "")).includes(level)) {
        return 'other/' + level
    }
    return level
}
function handleAltStratDropdown() {
    checkSubmittable()
    playSound('cardflip')
    if (document.getElementById('dropdown_submitIL_altStrat').value == 'other') {
        show('submitIL_row_Other')
    } else {
        hide('submitIL_row_Other')
    }
}
function checkSubmittable() {
    const button = document.getElementById('submitIL_uploadButton')
    if (localStorage.getItem('username')
        && document.getElementById('dropdown_submitIL_level').value != 'none'
        && document.getElementById('input_submitIL_time').value
        && !(document.getElementById('dropdown_submitIL_altStrat').value == 'other' && !document.getElementById('input_submitIL_other').value)
        && document.getElementById('input_submitIL_url').value) {
        button.classList.remove('grayedOut')
        button.classList.add('pulseSize')
        submitIL_readyToSubmit = true
    } else {
        button.classList.add('grayedOut')
        button.classList.remove('pulseSize')
        submitIL_readyToSubmit = false
    }
}
function submitIL() {
    if (submitIL_readyToSubmit) {
        playSound('ready')
        window.firebaseUtils.firestoreWriteIL()
    } else {
        playSound('locked')
    }
}