function rrcCustomTooltip(delta, split, segmentDelta, title, sceneName) {
    return `
    ${title}
    ${sceneName}
    <br>
    <br>Split: ${secondsToHMS(split)} (<span class='${redGreen(delta)}'>${getDelta(delta.toFixed(2))}</span>)
    <br>Segment: <span class='${redGreen(segmentDelta)}'>${getDelta(segmentDelta.toFixed(2))}</span>`;
}

function getPBHistories() {
    const histories = runRecapCategory.top10PlayerHistories?.filter(history => history?.runs?.length)
    if (!histories?.length) return null
    return histories.slice(0, 10).map(history => {
        const sortedRuns = history.runs
            .map(run => ({
                run,
                date: getPBRunDate(run),
                displayDate: run.date,
                seconds: run.times?.primary_t
            }))
            .filter(entry => entry.date && !Number.isNaN(entry.seconds))
            .sort((a, b) => a.date - b.date)

        const pbHistory = []
        let bestTime = Infinity
        sortedRuns.forEach(entry => {
            if (entry.seconds < bestTime) {
                bestTime = entry.seconds
                pbHistory.push({ date: entry.date, displayDate: entry.displayDate, pbSeconds: entry.seconds, run: entry.run })
            }
        })

        return {
            player: history.player,
            pbHistory
        }
    }).filter(history => history.pbHistory.length)
}

function getPBRunDate(run) {
    const date = new Date(run.date || run.submitted)
    return isNaN(date) ? null : date
}

function getPBTooltip(entry, playerName) {
    return `
    <div>
        <div class='container' style='font-size:120%'>
        ${getPlayerDisplay(players.find(player => player.name == playerName))}
        </div>
        <div class='container' style='font-size:150%'>
            <div class='${runRecapCategory.className}' style='padding:3px;margin:5px;border-radius:5px'>${secondsToHMS(entry.pbSeconds, true)}</div>
        </div>
        <div class='container'>
            ${entry.displayDate}
        </div>
    </div>`
}

function pbProgressionChartData(histories) {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('date', 'Date');

    if (!histories?.length) return null

    histories.forEach((history, index) => {
        dataTable.addColumn('number', `${history.player.name || `Player ${index + 1}`} line`);
        dataTable.addColumn('number', `${history.player.name || `Player ${index + 1}`} point`);
        dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });
    });

    const pointsPerHistory = histories.map(history => {
        const pts = [];
        const hb = history.pbHistory;
        if (!hb || !hb.length) return pts;
        pts.push({ time: hb[0].date.getTime(), value: hb[0].pbSeconds, tooltip: getPBTooltip(hb[0], history.player.name), isPB: true });
        for (let i = 1; i < hb.length; i++) {
            const prev = hb[i - 1];
            const cur = hb[i];
            const t = cur.date.getTime();
            pts.push({ time: t, value: prev.pbSeconds, tooltip: null, isPB: false });
            pts.push({ time: t, value: cur.pbSeconds, tooltip: getPBTooltip(cur, history.player.name), isPB: true });
        }
        return pts;
    });

    const timeSet = new Set();
    pointsPerHistory.forEach(pts => pts.forEach(p => timeSet.add(p.time)));
    const times = Array.from(timeSet).sort((a, b) => a - b);

    const rows = [];
    const lastValues = new Array(histories.length).fill(null);
    times.forEach(time => {
        const counts = pointsPerHistory.map(pts => pts.filter(p => p.time === time).length);
        const maxCount = Math.max(...counts, 1);
        for (let seq = 0; seq < maxCount; seq++) {
            const row = [new Date(time)];
            for (let h = 0; h < histories.length; h++) {
                const pts = pointsPerHistory[h].filter(p => p.time === time);
                if (pts.length > seq) {
                    const point = pts[seq];
                    row.push(point.value);
                    row.push(point.isPB ? point.value : null);
                    row.push(point.isPB ? point.tooltip : null);
                    lastValues[h] = point.value;
                } else {
                    row.push(lastValues[h]);
                    row.push(null);
                    row.push(null);
                }
            }
            rows.push(row);
        }
    });

    rows.forEach(r => dataTable.addRow(r));
    return dataTable;
}

function pbProgression() {
    const histories = getPBHistories();
    if (!histories?.length) return;
    const chartData = pbProgressionChartData(histories);
    if (!chartData) return;
    const font = getComputedStyle(document.documentElement).getPropertyValue('--font')

    const minY = runRecapCategory.runs?.[0]?.score

    const yearTicks = [];
    const seenYears = new Set();
    for (let row = 0; row < chartData.getNumberOfRows(); row++) {
        const date = chartData.getValue(row, 0);
        if (!(date instanceof Date)) continue;
        const year = date.getFullYear();
        if (!seenYears.has(year)) {
            seenYears.add(year);
            yearTicks.push(new Date(year, 0, 1));
        }
    }

    const yTicks = buildSecondsTicks(chartData);

    const title = `${runRecapCategory.tabName} Top ${histories.length} Progression`

    const options = {
        title: title,
        titleTextStyle: { color: 'gray', fontSize: 16 },
        chartArea: { height: '70%', width: '80%' },
        fontName: font,
        focusTarget: 'datum',
        hAxis: {
            title: 'Year',
            textStyle: { color: 'gray' },
            titleTextStyle: { color: 'gray' },
            format: 'yyyy',
            gridlines: { color: 'dimgray' },
            ticks: yearTicks
        },
        vAxis: {
            title: 'PB',
            textStyle: { color: 'gray' },
            titleTextStyle: { color: 'gray' },
            gridlines: { color: 'dimgray' },
            minorGridlines: { count: 1, color: 'rgba(255,255,255,0.12)' },
            viewWindowMode: minY !== undefined ? 'pretty' : undefined,
            viewWindow: minY !== undefined ? { min: minY } : undefined,
            ticks: yTicks
        },
        legend: { position: 'none' },
        lineWidth: 2,
        pointSize: 0,
        series: historiesToSeries(),
        backgroundColor: '#343434',
        tooltip: { isHtml: true, trigger: 'focus' },
        areaOpacity: 0,
        interpolateNulls: true
    };
    const chart = new google.visualization.LineChart(document.getElementById('pbProgressionChart'));
    chart.draw(chartData, options);
}

function buildSecondsTicks(chartData) {
    if (!chartData) return null;
    const numCols = chartData.getNumberOfColumns();
    let min = Infinity;
    let max = -Infinity;
    for (let row = 0; row < chartData.getNumberOfRows(); row++) {
        for (let col = 1; col < numCols; col++) {
            if (chartData.getColumnType(col) !== 'number') continue;
            const value = chartData.getValue(row, col);
            if (typeof value === 'number' && !Number.isNaN(value)) {
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        }
    }
    if (min === Infinity || max === -Infinity) return null;
    const interval = 30;
    const start = Math.floor(min / interval) * interval;
    const end = Math.ceil(max / interval) * interval;
    const ticks = [];
    for (let v = start; v <= end; v += interval) {
        const label = (v % 60 === 0) ? formatSeconds(v) : '';
        ticks.push({ v, f: label });
    }
    return ticks;
}

function historiesToSeries() {
    const histories = getPBHistories() || []
    const series = {}
    const usedColors = new Set();
    histories.forEach((history, index) => {
        let color = players[index]?.['name-style']?.color2;
        if (usedColors.has(color)) {
            color = players[index]?.['name-style']?.color1;
        }
        if (usedColors.has(color)) {
            color = 'lightgreen';
        }
        if (usedColors.has(color)) {
            color = 'salmon';
        }
        usedColors.add(color);
        const lineIndex = index * 2
        const pointIndex = index * 2 + 1
        series[lineIndex] = { color, lineWidth: 2, pointSize: 0, enableInteractivity: false }
        series[pointIndex] = { color, lineWidth: 0, pointSize: 2, visibleInLegend: false }
    })
    return series
}

function pbProgressionSection() {
    return `
    <div class='container' style='gap:10px;margin-top:30px'>
        <div id='pbProgressionChart' class='border shadow' style='width:1000px;height:400px'></div>
    </div>`;
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
    const tempTop = runRecapCategory.topRuns.map(run => run.rrc.map(scene => ({ ...scene })))
    tempTop.forEach(run => rrcSegments(run))
    for (let i = 0; i < runRecapCategory.scenes.length; i++) {
        tempTop.forEach((run, playerIndex) => {
            if (run[i]) {
                const xTime = run[i].endTime;
                const yDelta = xTime - rrcComparisonCollection[rrcComparison][i]?.endTime || 0;
                const segmentDelta = run[i].segment - rrcComparisonCollection[rrcComparison][i]?.segment;
                const tooltip = rrcCustomTooltip(yDelta, xTime, segmentDelta, getPlayerDisplay(players[playerIndex]), run[i].name);
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
function formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}
function rrcChart() {
    // console.log(rrcChartData())
    const chartData = rrcChartData();
    let interval = 420
    let numTicks = 4
    if (runRecapCategory.name == 'NMG') {
        interval = 120
        numTicks = 15
    }
    if (runRecapCategory.name == 'DLC') {
        interval = 60
        numTicks = 11
    }
    if (runRecapCategory.name == 'DLC+Base') {
        interval = 120
        numTicks = 19
    }
    let maxTime = interval * numTicks
    const ticks = [];
    for (let t = interval; t <= maxTime; t += interval) {
        ticks.push({
            v: t,
            f: formatSeconds(t)
        });
    }
    const font = getComputedStyle(document.documentElement).getPropertyValue('--font')
    const title = `${runRecapCategory.tabName} Top ${runRecapCategory.topRuns.length} .rrc`
    const options = {
        chartArea: { height: '70%', width: '80%' },
        title: title,
        titleTextStyle: { color: 'gray', fontSize: 16 },
        fontName: font,
        hAxis: {
            title: 'Split Time',
            ticks: ticks,
            textStyle: { color: 'gray' },
            titleTextStyle: { color: 'gray' },
            slantedText: true,
            slantedTextAngle: 30,
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
            baseline: 0,
            baselineColor: 'black'
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
        let color = players[index]['name-style']?.color2
        if (usedColors.has(color)) {
            color = players[index]['name-style']?.color1
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
    rrcChartSeries[runRecapCategory.topRuns.length] = { color: 'red', lineWidth: 5 };
    let HTMLContent = `
    ${rrcComparisonDisplay()}
    <div class='container' style='gap:10px'>
        <div id="rrcChart" class='border shadow' style="width:1000px;height:400px"></div>
        <table class='shadow'>`
    runRecapCategory.topRuns.forEach((run, index) => {
        const colorCell = `<td style='background-color:${rrcChartSeries[index].color};width:10px'></td>`
        const selected = rrcComparison.split(' ')[0] == 'Player' && rrcComparison.split(' ')[1] == index
        HTMLContent += `<tr class='grow ${getRowColor(index)} ${selected ? 'cuphead' : ''}' onclick="playerComparison('rrc',${index})">
        ${colorCell}
        <td>${getPlayerDisplay(players[index])}</td>
        ${colorCell}
        </tr>`
    })
    HTMLContent += `
        </table>
    </div>`
    return HTMLContent
}