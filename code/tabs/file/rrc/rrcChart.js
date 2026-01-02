function rrcCustomTooltip(delta, split, segmentDelta, title, sceneName) {
    return `${title}
                ${sceneName}
                <br>
                <br>Split: ${secondsToHMS(split)} (<span class='${redGreen(delta)}'>${getDelta(delta.toFixed(2))}</span>)
                <br>Segment: <span class='${redGreen(segmentDelta)}'>${getDelta(segmentDelta.toFixed(2))}</span>`;
}
function rrcChartData() {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('number', 'Time');
    runRecapCategory.topRuns.forEach(r => {
        dataTable.addColumn('number', r.name);
        dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });
    });
    if (globalTab == 'rrc') {
        dataTable.addColumn('number', 'You');
        dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });
    }
    const pointsPerPlayer = runRecapCategory.topRuns.map(r => []);
    const currentAttemptPoints = [];
    for (let i = 0; i < 80; i++) {
        runRecapCategory.topRuns.forEach((player, playerIndex) => {
            if (player.rrc[i]) {
                const xTime = player.rrc[i].endTime;
                const yDelta = xTime - rrcComparisonCollection[rrcComparison][i]?.endTime || 0;
                const segmentDelta = player.rrc[i].segment - rrcComparisonCollection[rrcComparison][i]?.segment;
                const tooltip = rrcCustomTooltip(yDelta, xTime, segmentDelta, getPlayerDisplay(players[playerIndex]), player.rrc[i].name);
                pointsPerPlayer[playerIndex].push([xTime, yDelta, tooltip]);
            }
        });
        if (globalTab == 'rrc') {
            const xTime = rrcCurrentAttempt.scenes[i].endTime;
            const yDelta = xTime - rrcComparisonAttempt.scenes[i]?.endTime || 0;
            const segmentDelta = rrcComparisonAttempt.scenes[i].segment - rrcComparisonCollection[rrcComparison][i]?.segment;
            const tooltip = rrcCustomTooltip(yDelta, xTime, segmentDelta, 'YOU<br>', rrcComparisonAttempt.scenes[i].name);
            currentAttemptPoints.push([xTime, yDelta, tooltip]);
        }
    }
    const allXTimes = new Set();
    pointsPerPlayer.forEach(points => points.forEach(p => allXTimes.add(p[0])));
    if (globalTab == 'rrc') currentAttemptPoints.forEach(p => allXTimes.add(p[0]));
    const sortedXTimes = Array.from(allXTimes).sort((a, b) => a - b);
    sortedXTimes.forEach(x => {
        const row = [x];
        pointsPerPlayer.forEach(points => {
            const point = points.find(p => p[0] === x);
            row.push(point ? point[1] : null);
            row.push(point ? point[2] : null);
        });
        if (globalTab == 'rrc') {
            const point = currentAttemptPoints.find(p => p[0] === x);
            row.push(point ? point[1] : null);
            row.push(point ? point[2] : null);
        }
        dataTable.addRow(row);
    });
    return dataTable;
}
function rrcChart() {
    // console.log(rrcChartData())
    const chartData = rrcChartData();
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
        tooltip: { isHtml: true }
    };
    const chart = new google.visualization.ScatterChart(
        document.getElementById('rrcChart')
    );
    chart.draw(chartData, options);
}
function rrcChartSection() {
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
    rrcChartSeries[runRecapCategory.topRuns.length] = { color: 'red', lineWidth: 4 };
    let HTMLContent = ''
    HTMLContent += `
    ${rrcComparisonDisplay()}
    <div class='container' style='gap:10px'>
    <div id="rrcChart" class='border' style="width:1000px;height: 400px"></div>
    <table>`
    runRecapCategory.topRuns.forEach((run, index) => {
        const colorCell = `<td style='background-color:${rrcChartSeries[index].color};width:10px'></td>`
        HTMLContent += `<tr class='grow ${getRowColor(index)} ${rrcComparison.split(' ')[1] == index ? 'cuphead' : ''}' onclick="playerComparison('rrc',${index})">
        ${colorCell}
        <td>${getPlayerDisplay(players[index])}</td>
        ${colorCell}
        </tr>`
    })
    HTMLContent += `</table>
    </div>`
    return HTMLContent
}