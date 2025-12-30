let rrcChartSeries
function generateTop10() {
    if (runRecapCategory.name != '1.1+') getCommBestILs('1.1+')
    rrcChartSeries = {};
    const usedColors = new Set();
    runRecapCategory.topRuns.forEach((playerRun, index) => {
        let color = players[index]['name-style'].color2
        if (usedColors.has(color)) {
            color = players[index]['name-style'].color1
        }
        if (usedColors.has(color)) {
            color = 'lightgreen'
        }
        if (usedColors.has(color)) {
            color = 'salmon'
        }
        usedColors.add(color);
        rrcChartSeries[index] = { color: color };
    });
    isles.forEach(isle => {
        isle.sum = 0
        isle.comparisonSum = 0
        isle.sums = []
    })
    assignIsles()
    runRecapCategory.topRuns.forEach((run, index) => {
        isles.forEach(isle => {
            isle.sum = 0
            isle.sums[index] = 0
        })
        isles.forEach(isle => {
            isle.runRecapCategories.forEach(categoryIndex => {
                const bestTime = run.runRecap[categoryIndex]
                const content = bestTime != nullTime ? decimalsCriteria() ? bestTime : Math.floor(bestTime) : 0
                isle.sum += content
                isle.sums[index] += content
            })
        })
    })
    let HTMLContent = ''
    HTMLContent += `
    <div class='container' style='gap:10px'>
    <div id="rrcChart" class='border' style="width:1000px;height: 400px"></div>
    <table>`
    runRecapCategory.topRuns.forEach((run, index) => {
        const colorCell = `<td style='background-color:${rrcChartSeries[index].color};width:10px'></td>`
        HTMLContent += `<tr class='${getRowColor(index)}'>
        ${colorCell}
        <td>${getPlayerDisplay(players[index])}</td>
        ${colorCell}
        </tr>`
    })
    HTMLContent += `</table>
    </div>
    <div class='container' style='margin-top:20px'><table>
        <tr>
        <td colspan=4></td>
        <th colspan=3 class='isle1'>Isle 1</th>
        <th colspan=5 class='expert'>Isle 2</th>
        <th colspan=5 class='isle3'>Isle 3</th>
        <th colspan=5 class='hell'>Hell</th>
        </tr>
        <tr>
        <td colspan=4>
        <th class='gray'>RTA</th>
        <th class='gray'>IGT</th>
        <th class='gray'>Resid</th>`
    for (let i = 0; i < 3; i++) {
        HTMLContent += `
            <th class='gray'>RTA</th>
            <th class='gray'>IGT</th>
            <th colspan=2 class='gray'>Sum</th>
            <th class='gray'>Resid</th>`
    }
    runRecapCategory.topRuns.forEach((run, index) => {
        HTMLContent += `<tr class='hover ${getRowColor(index)}'>
            ${bigPlayerDisplay(players[index])}`
        let sum = 0
        run.splits = [
            convertToSeconds(runRecapCategory.topRuns[index].rrc[22].endTime) - 6.45,
            convertToSeconds(runRecapCategory.topRuns[index].rrc[40].endTime) - 6.45,
            convertToSeconds(runRecapCategory.topRuns[index].rrc[64].endTime) - 6.45,
            runRecapCategory.runs[index].score
        ]
        run.splits.forEach((time, isleIndex) => {
            const isle = isles[isleIndex]
            const isleRTA = convertToSeconds(time) - convertToSeconds(run.splits[isleIndex - 1])
            const isleIGT = isle.sums[index]
            sum += isleIGT
            HTMLContent += `<td class='${isle.className}' style='padding:0 3px'>${secondsToHMS(isleRTA || convertToSeconds(time), true)}</td>`
            HTMLContent += `<td class='${isle.className}' style='font-size:80%;opacity:80%'>${secondsToHMS(isleIGT, true)}</td>`
            HTMLContent += isleIndex > 0 ? `<td class='${isle.className}' style='padding:0 3px'>${secondsToHMS(convertToSeconds(time), true)}</td>` : ''
            HTMLContent += isleIndex > 0 ? `<td style='font-size:80%;opacity:80%' class='${isle.className}'>${secondsToHMS(sum, true)}</td>` : ''
            HTMLContent += `<td style='font-size:80%'>${secondsToHMS((isleRTA || convertToSeconds(time)) - isleIGT, true)}</td>`
        })
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>
    <div class='container' style='margin-top:100px;gap:50px'>`
    HTMLContent += `<table>`
    runRecapCategory.topRuns.forEach((run, index) => {
        HTMLContent += `<tr class='${getRowColor(index)}'>
        <td>${getPlayerDisplay(players[index])}</td>
        ${residualIcons(run)}
        <td class='thedevil' style='padding:0 5px'>${secondsToHMS(run.runRecap[categories.length - 1], true)}</td>
        ${bossPattern('thedevil', run.thedevil)}
        </tr>`
    })
    HTMLContent += `<table>
    <tr>
    <td><td>`
    players.slice(0, 10).forEach(player => {
        HTMLContent += `<td><div style='position:absolute;transform:rotate(-30deg) translate(-13px,-30px);transform-origin:bottom left'>${getPlayerDisplay(player, true)}</div></td>`
    })
    HTMLContent += `<tr>
    <td><div class='container'>${getImage('runnguns/forestfollies', 21)}</div></td>`
    runRecapCategory.topRuns.forEach((run, index) => {
        let starSkip = ''
        if (run.starSkips[0]) starSkip = fontAwesome('star')
        if (run.starSkips[0] == 1) starSkip += fontAwesome('star')
        HTMLContent += `<td class='${getRowColor(index)}' style='color:var(--cuphead);font-size:80%;gap:3px;text-align:left;padding:0 5px'>${starSkip}</td>`
    })
    HTMLContent += `<tr>`
    categories.forEach((category, categoryIndex) => {
        if (categoryIndex < categories.length - 1) {
            HTMLContent += `<tr>
            <td class='${category.info.id}'><div class='container'>${getImage(category.info.id, 21)}</div></td>`
            runRecapCategory.topRuns.forEach((run, index) => {
                let starSkip = ''
                if (run.starSkips[categoryIndex + 1]) starSkip = fontAwesome('star')
                if (run.starSkips[categoryIndex + 1] == 1) starSkip += fontAwesome('star')
                HTMLContent += `<td class='${getRowColor(index)}' style='color:var(--cuphead);font-size:80%;gap:3px;text-align:left;padding:0 5px'>${starSkip}</td>`
            })
            HTMLContent += `</tr>`
        }
    })
    HTMLContent += `<tr>
    <td></td>`
    runRecapCategory.topRuns.forEach((run, index) => {
        HTMLContent += `<td class='dim ${getRowColor(index)}'>${run.starSkips.reduce((acc, num) => acc + num, 0)}</td>`
    })
    HTMLContent += `</tr>
    </table>`
    HTMLContent += `</table>`
    HTMLContent += `</div>`
    document.getElementById('content').innerHTML = HTMLContent
    drawChart()
}
function buildChartData() {
    const data = [];
    data.push([
        'Time',
        ...runRecapCategory.topRuns.map(r => r.name)
    ]);
    const pointsPerPlayer = runRecapCategory.topRuns.map(r => []);
    for (let i = 0; i < 80; i++) {
        runRecapCategory.topRuns.forEach((player, pIndex) => {
            if (player.rrc[i]) {
                const xTime = convertToSeconds(player.rrc[i].endTime);
                const yDelta = xTime - rrcComparisonCollection['Player 0'][i]?.endTime || 0;
                pointsPerPlayer[pIndex].push([xTime, yDelta])
            }
        });
    }
    const allRows = [];
    const allXTimes = new Set();
    pointsPerPlayer.forEach(points => points.forEach(p => allXTimes.add(p[0])));
    const sortedXTimes = Array.from(allXTimes).sort((a, b) => a - b);

    sortedXTimes.forEach(x => {
        const row = [x];
        pointsPerPlayer.forEach(points => {
            const point = points.find(p => p[0] === x);
            row.push(point ? point[1] : null);
        });
        allRows.push(row);
    });

    return [data[0], ...allRows];
}
function drawChart() {
    // console.log(buildChartData())
    const chartData = google.visualization.arrayToDataTable(buildChartData());
    function formatSeconds(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    }
    const maxTime = 420 * 4
    const ticks = [];
    for (let t = 420; t <= maxTime; t += 420) {
        ticks.push({
            v: t,
            f: formatSeconds(t)
        });
    }
    const font = getComputedStyle(document.documentElement).getPropertyValue('--font')
    const options = {
        chartArea: { height: '80%', width: '80%' },
        fontName: font,
        hAxis: {
            title: 'Segment Time',
            ticks: ticks,
            textStyle: { color: 'gray' },
            titleTextStyle: { color: 'gray' },
            gridlines: {
                color: 'dimgray'
            },
        },
        vAxis: {
            title: 'Delta',
            textStyle: { color: 'gray' },
            titleTextStyle: { color: 'gray' },
            gridlines: {
                color: 'dimgray'
            },
        },
        legend: {
            position: 'none'
        },
        lineWidth: 2,
        pointSize: 1,
        interpolateNulls: true,
        series: rrcChartSeries,
        backgroundColor: '#343434',
    };
    const chart = new google.visualization.ScatterChart(
        document.getElementById('rrcChart')
    );
    chart.draw(chartData, options);
}