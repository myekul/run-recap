function generate_lss() {
    dropboxEligible = false
    let HTMLContent = ''
    if (runRecap_lssFile.pbSplits) {
        HTMLContent += lssView()
    } else {
        HTMLContent += emptyFile('lss')
    }
    document.getElementById('content').innerHTML = HTMLContent
    if (dropboxEligible) initializeDropbox()
}
function lssView() {
    if (runRecap_savFile) document.getElementById('lss_igt').innerHTML = savComparisonDisplay()
    let HTMLContent = ''
    const currentRun = document.getElementById('dropdown_runRecap_lss_current').value
    const comparison = document.getElementById('dropdown_runRecap_lss_comparison').value
    const comparisonTitle = segmentComparison(comparison)
    let splitTitle = comparisonTitle
    if (comparison == 'yourBest') {
        splitTitle = 'Your BPE'
    } else if (comparison == 'sob') {
        splitTitle = 'Your SoB'
    }
    runRecapTheoretical = ['yourBest', 'sob', 'theoryRun'].includes(currentRun)
    HTMLContent += `
    ${splitBeforeAfter()}
    <div class='container'>
        <table class='shadow'>
            <tr>
                <td colspan=3 class='font2 gray' style='font-size:110%;padding:3px'>Splits</td>
                <td style='font-size:60%'>${splitTitle}</td>
                <td></td>
                <td colspan=4 class='font2 gray' style='font-size:110%;padding:3px'>Segments</td>
                <td style='font-size:60%'>${comparisonTitle}</td>`
    if (runRecap_savFile) {
        HTMLContent += `
                <td></td>
                <td colspan=4 class='font2 gray' style='font-size:110%;padding:3px'>IGT</td>
                <td style='font-size:60%'>Comparison</td>`
    }
    // Offset for Follies, Mausoleum, Chalice Tutorial
    const splits = []
    const deltas = []
    for (let index = 0; index < runRecap_lssFile.pbSplits.length && index < categories.length + getOffset(); index++) {
        const currentSegment = segmentComparison(currentRun, index, true)
        const comparisonSegment = segmentComparison(comparison, index)
        const categoryIndex = index - getOffset()
        const delta = currentSegment - comparisonSegment
        const trueDelta = Math.trunc(delta * 100) / 100
        const grade = runRecapGrade(trueDelta)
        const className = splitInfo[index].id
        const image = `<td class='${className}'><div class='container'>${getImage(className, 24)}</div></td>`
        // HTMLContent += `<tr class='${getRowColor(index)} clickable'>`
        const currentSplit = splitComparison(currentRun, index)
        splits.push(currentSplit)
        const comparisonSplit = splitComparison(comparison, index)
        const splitDelta = currentSplit - comparisonSplit
        const trueSplitDelta = Math.trunc(splitDelta * 100) / 100
        deltas.push(trueSplitDelta)
        const compareCustom = !isNaN(comparison) || comparison == 'yourPB'
        HTMLContent += `
            <tr class='${getRowColor(index)} ${!runRecapExample ? `clickable' onclick="openModal(runRecapSegment(${index}), 'SEGMENT INFO')"` : ''}'>
                ${image}
                <td class='${className}' style='padding:0 10px;font-size:120%'>${currentSplit ? secondsToHMS(currentSplit, true) : ''}</td>
                <td class='${redGreen(trueSplitDelta)}' style='padding:0 5px;font-size:90%'>${currentSplit ? getDelta(trueSplitDelta) : ''}</td>
                <td style='padding:0 5px;'>${comparisonContent('split', index, comparisonSplit, comparison)}</td>
                <td style='padding:0 20px'></td>
                <td class='${compareCustom || !currentSegment ? '' : grade.className}' style='padding:0 5px;text-align:left'><span>${compareCustom || !currentSegment ? '' : grade.grade}</span></td>
                ${image}
                <td class='${currentSegment ? className : ''}' style='padding:0 10px;font-size:120%'>${currentSegment ? secondsToHMS(currentSegment, true) : ''}</td>
                <td class='${redGreen(trueDelta)}' style='padding:0 5px;font-size:90%'><span>${currentSegment ? getDelta(trueDelta) : ''}</span></td>
                <td style='padding:0 5px;'>${comparisonContent('segment', index, comparisonSegment, comparison)}</td>`
        if (runRecap_savFile) {
            HTMLContent += `<td style='padding:0 20px'></td>`
            if (index >= getOffset()) {
                const level = getCupheadLevel(categoryIndex)
                const runTime = level?.bestTime
                const comparisonTime = savComparisonCollection[savComparison][categoryIndex]
                const delta = runRecapDelta(runTime, comparisonTime)
                const ILgrade = runRecapGrade(delta)
                let comparisonContents = `<div class='container'>`
                if (savComparison == 'Top Bests') {
                    comparisonContents += `<div class='container' style='padding-right:6px'>`
                    savComparisonCollection.topBestPlayers[categoryIndex].forEach(playerIndex => {
                        const player = players[playerIndex]
                        comparisonContents += getPlayerIcon(player, 24)
                    })
                    comparisonContents += `</div>`
                }
                comparisonContents += `<div>${secondsToHMS(comparisonTime)}</div></div>`
                HTMLContent += `
                    <td class='${ILgrade.className}' style='padding:0 5px;text-align:left'><span>${ILgrade.grade}</span></td>
                    ${image}
                    <td class='${className}' style='padding:0 10px;font-size:120%'>${runTime == nullTime ? '-' : secondsToHMS(runTime, true)}</td>
                    <td class='${redGreen(delta)}' style='padding:0 5px;font-size:90%'><span>${runTime == nullTime ? '-' : getDelta(delta)}</span></td>
                    <td class='dim' style='padding:0 10px;font-size:90%'>${comparisonContents}</td>`
            } else if (index == 2) {
                HTMLContent += `<td colspan=5></td>`
            } else {
                const levelID = index == 0 ? runNguns[0].levelID : mausoleumID
                const level = getCupheadLevel(levelID, true)
                HTMLContent += `
                    <td>${level.bestTime != nullTime ? image : ''}</td>
                    <td>${level.bestTime != nullTime ? secondsToHMS(level.bestTime, true) : ''}</td>
                    <td></td>
                    <td></td>`
            }
        }
        HTMLContent += `</tr>`
        if (index >= getOffset()) {
            const category = categories[categoryIndex]
            const nextCategory = categories[categoryIndex + 1]
            if (nextCategory && category.info.isle != nextCategory?.info.isle) {
                HTMLContent += `<tr style='height:20px'></tr>`
            }
        }
    }
    HTMLContent += `</table></div>`
    runRecap_chart(splits, deltas, true)
    return HTMLContent
}
function convertDateToISO(dateString) {
    const [month, day, year] = dateString.slice(0, 10).split('/')
    const date = new Date(`${year}-${month}-${day}`)
    return date.toISOString().split('T')[0]
}
const NUM_SPLITS = 10
function read_lss(content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "application/xml");
    // console.log(xmlDoc)
    runRecap_lssFile = {}
    runRecap_lssFile = { bestSplits: [], bestSegments: [], sob: [], pbSplits: [], pbSegments: [], attemptHistory: [] }
    runRecap_lssFile.attemptCount = xmlDoc.querySelector('AttemptCount').innerHTML
    const allAttempts = Array.from(xmlDoc.querySelectorAll("AttemptHistory > Attempt"))
    const finishedAttempts = allAttempts.filter(attempt => attempt.querySelector("GameTime"));
    const attemptHistory = finishedAttempts.map(attempt => {
        return {
            id: attempt.getAttribute("id"),
            date: convertDateToISO(attempt.getAttribute("ended")),
            gameTime: convertToSeconds(attempt.querySelector("GameTime").textContent.slice(3)),
            segments: [],
            splits: []
        }
    })
    runRecap_lssFile.attemptSet = {}
    allAttempts.forEach(attempt => {
        runRecap_lssFile.attemptSet[attempt.id] = {
            segments: [],
            splits: [],
            date: convertDateToISO(attempt.getAttribute("ended"))
        }
    })
    const segments = xmlDoc.querySelectorAll("Segment");
    segments.forEach((segment, index) => {
        const bestSegmentTime = convertToSeconds(segment.querySelector("BestSegmentTime GameTime")?.textContent.slice(3))
        runRecap_lssFile.bestSegments.push(bestSegmentTime)
        runRecap_lssFile.sob.push(index == 0 ? bestSegmentTime : runRecap_lssFile.sob[index - 1] + bestSegmentTime)
        const splitTime = convertToSeconds(segment.querySelector('SplitTimes SplitTime GameTime')?.textContent.slice(3))
        runRecap_lssFile.pbSplits.push(splitTime)
        let segmentTime = splitTime
        if (index > 0) {
            const prevSplitTime = runRecap_lssFile.pbSplits[index - 1]
            segmentTime = splitTime - prevSplitTime
        }
        runRecap_lssFile.pbSegments.push(segmentTime)
        const segmentAttempts = Array.from(segment.querySelectorAll('SegmentHistory > Time'))
        segmentAttempts.forEach(attempt => {
            const timeMode = attempt.querySelector("GameTime") ? 'GameTime' : 'RealTime'
            const id = attempt.getAttribute("id")
            if (attempt.hasChildNodes()) {
                const segmentTime = convertToSeconds(attempt.querySelector(timeMode).textContent.slice(3))
                runRecap_lssFile.attemptSet[id]?.segments.push(segmentTime)
            } else {
                runRecap_lssFile.attemptSet[id]?.segments.push(null)
            }
        })
    })
    runRecap_lssFile.segmentHistory = Array.from({ length: runRecap_lssFile.bestSegments.length }, () => []);
    Object.entries(runRecap_lssFile.attemptSet).forEach(([key, attempt]) => {
        attempt.segments?.forEach((segment, index) => {
            let split = segment
            if (index > 0) {
                const prevSplit = attempt.splits[index - 1]
                if (prevSplit) {
                    split = prevSplit + segment
                } else {
                    split = attempt.splits[index - 2] + segment
                }
                if (!split) split = segment
                if (split == prevSplit) split = null
            }
            attempt.splits.push(split);
            if (segment && !(index > 0 && attempt.splits[index - 1] == null)) {
                runRecap_lssFile.segmentHistory[index].push({ id: key, segment: segment, split: split });
            }
        });
    });
    runRecap_lssFile.theorySegments = []
    runRecap_lssFile.theorySplits = []
    runRecap_lssFile.bestSplits = Array(runRecap_lssFile.bestSegments.length).fill(Infinity);
    runRecap_lssFile.segmentHistory.forEach((segment, index) => {
        segment.sort((a, b) => a.segment - b.segment)
        let sum = 0
        segment.slice(0, NUM_SPLITS).forEach(attempt => {
            sum += attempt.segment
        })
        const segmentTime = sum / NUM_SPLITS
        runRecap_lssFile.theorySegments.push(segmentTime)
        runRecap_lssFile.theorySplits.push(index == 0 ? segmentTime : runRecap_lssFile.theorySplits[index - 1] + segmentTime)
        segment.forEach(attempt => {
            if (attempt.split < runRecap_lssFile.bestSplits[index]) {
                runRecap_lssFile.bestSplits[index] = attempt.split
            }
        })
    })
    attemptHistory.forEach(attempt => {
        if (runRecap_lssFile.attemptSet[attempt.id]) {
            runRecap_lssFile.attemptHistory.push(attempt)
        }
    })
    let HTMLContent = ''
    const reverseAttempts = runRecap_lssFile.attemptHistory.reverse()
    let firstAttempt = 0
    const pbTime = runRecap_lssFile.pbSplits[runRecap_lssFile.pbSplits.length - 1]
    let prevPB = Infinity
    let prevPBIndex = 0
    reverseAttempts.forEach((attempt, index) => {
        if (index == 0) firstAttempt = attempt.id
        HTMLContent += `<option value="${attempt.id}">${secondsToHMS(attempt.gameTime)} - ${attempt.date}</option>`
        if (attempt.gameTime > pbTime && attempt.gameTime < prevPB) {
            prevPB = attempt.gameTime
            prevPBIndex = attempt.id
        }
    })
    document.querySelectorAll('.lss_recentRuns').forEach(elem => {
        show(elem)
        elem.innerHTML = HTMLContent
    })
    document.querySelectorAll('.lssHide').forEach(elem => {
        show(elem)
    })
    const prevPBelem = document.getElementById('lss_prevPB')
    prevPBelem.innerHTML = secondsToHMS(prevPB) + ' - Previous PB'
    prevPBelem.value = prevPBIndex
    let comparisonValue = 'yourPB'
    if (reverseAttempts[0].gameTime == pbTime) {
        comparisonValue = prevPBIndex
    }
    document.getElementById('dropdown_runRecap_lss_current').value = firstAttempt
    document.getElementById('dropdown_runRecap_lss_comparison').value = comparisonValue
    document.querySelectorAll('.lss_yourPB').forEach(elem => {
        elem.innerHTML = secondsToHMS(runRecap_lssFile.pbSplits[runRecap_lssFile.pbSplits.length - 1]) + ' - Your PB'
    })
    runRecap_lssFile.attemptHistory.forEach(attempt => {
        let total = 0
        runRecap_lssFile.attemptSet[attempt.id].segments.forEach(segment => {
            attempt.segments.push(segment)
            total += segment
            attempt.splits.push(total)
        })
    })
    // console.log(runRecap_lssFile)
}
function runRecap_lss_splitInfo() {
    splitInfo = []
    for (let index = 0; index < commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after'].length && index < categories.length + getOffset(); index++) {
        const categoryIndex = index - getOffset()
        if (index == 0) {
            splitInfo.push({ id: 'runnguns/forestfollies', name: 'Forest Follies', isle: null })
        } else if (index == 1 && ['DLC', 'DLC+Base'].includes(runRecapCategory.name)) {
            splitInfo.push({ id: 'other/mausoleum', name: 'Mausoleum', isle: null })
        } else if (index == 2 && runRecapCategory.shot1 == 'charge') {
            splitInfo.push({ id: 'other/chalicetutorial', name: 'Chalice Tutorial', isle: null })
        } else {
            const category = categories[categoryIndex]
            if (category) {
                splitInfo.push({ id: category.info.id, name: category.name, isle: category.info.isle })
            }
        }
    }
}
function getOffset() {
    let offset = 1
    if (['DLC', 'DLC+Base'].includes(runRecapCategory.name)) {
        offset = runRecapCategory.shot1 == 'charge' ? 3 : 2
    }
    return offset
}
function comparisonContent(type, index, time, comparison) {
    let HTMLContent = `<div class='container dim' style='gap:7px;justify-content:left;font-size:90%'>`
    if (comparison == null || comparison == 'commBest') {
        const player = allPlayers.find(player => player.name == commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after'][index][(type == 'split' ? 'split' : 'segment') + 'Runner'])
        HTMLContent += player ? getPlayerIcon(player, 24) : ''
    }
    HTMLContent += `<div>${time ? secondsToHMS(time, true) : ''}</div></div>`
    return HTMLContent
}
function segmentComparison(comparison, index, current) {
    switch (comparison) {
        case 'yourBest':
            if (current) {
                setRunRecapTime2('bestSplits')
            }
            if (index == null) {
                return 'Your Golds'
            }
            return runRecap_lssFile.bestSegments[index]
        case 'sob':
            if (current) {
                setRunRecapTime2('sob')
            }
            if (index == null) {
                return 'Your Golds'
            }
            return runRecap_lssFile.bestSegments[index]
        case 'theoryRun':
            if (current) {
                setRunRecapTime2('theorySplits')
            }
            if (index == null) {
                return 'Theory'
            }
            return runRecap_lssFile.theorySegments[index]
        case 'yourPB':
            if (current) {
                setRunRecapTime2('pbSplits')
            }
            if (index == null) {
                return 'Your PB'
            }
            return runRecap_lssFile.pbSegments[index]
        case 'commBest':
            if (index == null) {
                return 'Comm Best'
            }
            return convertToSeconds(
                commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after'][index].segment
            )
        case 'commSob':
            if (index == null) {
                return 'Comm SoB'
            }
            return convertToSeconds(
                commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after'][index].segment
            )
        default: {
            if (comparison.slice(0, 3) == 'top') {
                playerIndex = comparison.split('top')[1]
                if (index == null) {
                    return `<div class='container'>${getPlayerIcon(players[playerIndex], 21)}</div>`
                }
                return runRecapCategory.topRuns[playerIndex][splitBefore ? 'segmentBefore' : 'segmentAfter'][index]
            }
            const attempt = runRecap_lssFile.attemptHistory.find(attempt => attempt.id == comparison)
            if (current) {
                setRunRecapTime(secondsToHMS(attempt.gameTime))
            }
            if (index == null) {
                return secondsToHMS(attempt.gameTime)
            }
            return attempt.segments[index]
        }
    }
}
function setRunRecapTime2(src) {
    setRunRecapTime(secondsToHMS(runRecap_lssFile[src].at(-1)))
}
function splitComparison(comparison, index) {
    switch (comparison) {
        case 'yourBest':
            return runRecap_lssFile.bestSplits[index]
        case 'sob':
            return runRecap_lssFile.sob[index]
        case 'theoryRun':
            return runRecap_lssFile.theorySplits[index]
        case 'yourPB':
            return runRecap_lssFile.pbSplits[index]
        case 'commBest':
            return convertToSeconds(
                commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after'][index].split
            )
        case 'commSob':
            return commSob[index]
        default:
            if (comparison.slice(0, 3) == 'top') {
                playerIndex = comparison.split('top')[1]
                return runRecapCategory.topRuns[playerIndex][splitBefore ? 'splitBefore' : 'splitAfter'][index]
            }
            return runRecap_lssFile.attemptHistory.find(attempt => attempt.id == comparison).splits[index]
    }
}
function lssExample(index) {
    const run = runRecapCategory.topRuns[index]
    runRecap_lssFile.pbSplits = [...run[splitBefore ? 'splitBefore' : 'splitAfter']]
    runRecap_lssFile.pbSegments = [...run[splitBefore ? 'segmentBefore' : 'segmentAfter']]
    runRecap_lssFile.bestSegments = [...commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after'].map(split => convertToSeconds(split.segment))]
    document.querySelectorAll('.lss_yourPB').forEach(elem => {
        elem.innerHTML = secondsToHMS(run[splitBefore ? 'splitBefore' : 'splitAfter'].at(-1)) + ' - ' + players[index].name
    })
    document.querySelectorAll('.lss_recentRuns').forEach(elem => {
        elem.innerHTML = ''
        hide(elem)
    })
    document.querySelectorAll('.lssHide').forEach(elem => {
        hide(elem)
    })
    document.getElementById('dropdown_runRecap_lss_current').value = 'yourPB'
}
function runRecapSegment(index) {
    const split = splitInfo[index]
    document.getElementById('modal-subtitle').innerHTML = `
    <div class='container ${split.id}' style='gap:10px;margin-top:10px;padding:5px;border-radius:5px'>
        ${getImage(split.id, 36)}
        <div style='font-size:20px;font-weight:bold'>${split.name}</div>
    </div>`
    const thisSegment = runRecap_lssFile.segmentHistory[index].length
    let prevSegment = runRecap_lssFile.segmentHistory[index - 1]?.length
    if (!prevSegment) {
        prevSegment = 0
    }
    const numResets = Math.abs(prevSegment - thisSegment)
    const segmentAttemptCount = index == 0 ? runRecap_lssFile.attemptCount : thisSegment
    const resetRate = 100 * (numResets / segmentAttemptCount)
    const display = resetRate ? displayPercentage(resetRate) : 0
    const grade = getLetterGrade(100 - resetRate)
    const sortedSplits = runRecap_lssFile.segmentHistory[index].sort((a, b) => a.split - b.split)
    const sortedSegments = runRecap_lssFile.segmentHistory[index].sort((a, b) => a.segment - b.segment)
    return `
    <div class='container' style='gap:8px'>
        <div>Reset rate:</div>
        <div class='${grade.className}' style='border-radius:5px;padding:5px;${grade.grade == 'F' ? 'color:white' : ''}'><span>${display}%</span></div>
        <div>=</div>
        <div style='font-size:80%'>
            <div class='container'>${numResets} reset${numResets == 1 ? '' : 's'}</div>
            <div style='margin: 5px 0;border-bottom: 2px solid white;width: 100px;'></div>
            <div class='container'>${segmentAttemptCount} attempts</div>
        </div>
    </div>
    <div class='container' style='gap:20px;width:800px'>
        ${splitSegmentInfo(sortedSplits, index, 'Split')}
        ${splitSegmentInfo(sortedSegments, index, 'Segment')}
    </div>
    </div>`
}
function splitSegmentInfo(array, index, type) {
    const split = splitInfo[index]
    let HTMLContent = `
    <div style='padding-top:15px'>
        <table>
            <tr class='gray'>
                <th colspan=6>Your Top 10 ${type}s</th>
            </tr>`
    let sum = 0
    array.slice(0, NUM_SPLITS).forEach((arrayAttempt, segmentIndex) => {
        const run = runRecap_lssFile.attemptHistory.find(attempt => attempt.id == arrayAttempt.id)
        const date = runRecap_lssFile.attemptSet[arrayAttempt.id].date
        const trophy = getTrophy(segmentIndex + 1)
        const time = arrayAttempt[type.toLowerCase()]
        sum += time
        HTMLContent += `
        <tr class='${getRowColor(segmentIndex)}'>
            <td style='font-size:70%;text-align:right;padding:0 5px'>${date ? daysAgo(getDateDif(new Date(), new Date(date))) : ''}</td>
            <td class='${placeClass[segmentIndex + 1]}' style='font-size:70%;padding:0 3px'>${trophy ? `<div class='container trophy'>${trophy}` : segmentIndex + 1}</td>
            <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(time, true)}</td>
            <td class='${run ? runRecapCategory.className : ''}' style='font-size:80%;padding:0 5px'>${run ? secondsToHMS(run.gameTime, true) : ''}</td>
            <td style='font-size:70%;padding:0 5px'>${date ? date : ''}</td>
            <td style='font-size:50%'>${arrayAttempt.id}</td>
        </tr>`
    })
    HTMLContent += `</table>`
    HTMLContent += `
    <div class='container' style='padding-top:15px'>
        <table>
            <tr class='gray'>
                <th>Your Top 10 Average</th>
            </tr>
            <tr>
                <td class='${split.id}'>${secondsToHMS(sum / NUM_SPLITS, true)}</td>
            </tr>
        </table>
    </div>
    <div class='container' style='padding-top:15px;gap:8px'>
        <table>
            <tr class='gray'>
                <th colspan=2>Comm Best</th>
            </tr>
            <tr>
                <td>${getPlayerIcon(allPlayers.find(player => player.name == commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after'][index][(type == 'Split' ? 'split' : 'segment') + 'Runner']), 24)}</td>
                <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(convertToSeconds(commBest[runRecapCategory.tabName][splitBefore ? 'before' : 'after'][index][(type == 'Split' ? 'split' : 'segment')]), true)}</td>
            </tr>
        </table>
        <table>
            <tr class='gray'>
                <th colspan=2>World Record</th>
            </tr>
            <tr>
                <td>${getPlayerIcon(players[0], 24)}</td>
                <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(runRecapCategory.topRuns[0][(type == 'Split' ? 'split' : 'segment') + (splitBefore ? 'Before' : 'After')][index], true)}</td>
            </tr>
        </table>
    </div>
    </div>`
    return HTMLContent
}