async function generateInfo() {
    await setHTML('html/info.html', 'content')
    // `<div class='infoTitle'>The Top</div>
    // Various charts and tables depicting top runs for every main Any% category, using rrcData.json.
    // It's kinda messy, but it gets the job done.
    // </div>`
    // let endTimeNum = 0
    // let scoreCardNum = 0
    // let commBestSplitNum = 0
    // for (const category in commBestILs) {
    //     const categoryRef = commBestILs[category]
    //     if (categoryRef.topRuns) {
    //         for (let i = 0; i < categoryRef.topRuns?.length; i++) {
    //             endTimeNum += categoryRef.scenes.length
    //             scoreCardNum += categoryRef.topRuns[0].igt.length
    //         }
    //     }
    // }
    // for (const category in commBest) {
    //     const categoryRef = commBest[category].after
    //     commBestSplitNum += categoryRef.length * 2
    // }
    // HTMLContent += `
    // <div class='infoTitle'>Stats</div>
    // <div class='container'>
    //     <table class='shadow'>
    //         <tr>
    //             <td>Comm Best ILs</td>
    //             <td>${altStratNum}</td>
    //         </tr>
    //         <tr>
    //             <td>Run Viable ILs</td>
    //             <td>${altStratNum}</td>
    //         </tr>
    //         <tr>
    //             <td>Splits</td>
    //             <td>${commBestSplitNum}</td>
    //         </tr>
    //         <tr>
    //             <td>Segments</td>
    //             <td>${commBestSplitNum}</td>
    //         </tr>
    //         <tr>
    //             <td>Scenes</td>
    //             <td>${endTimeNum}</td>
    //         </tr>
    //         <tr>
    //             <td>Boss IGT</td>
    //             <td>${scoreCardNum}</td>
    //         </tr>
    //     </table>
    // </div>`
    document.getElementById('javaSav').innerHTML = javaSav
    const flags = ['us', 'gb', 'gb/sct', 'de', 'ch', 'it', 'se', 'rs', 'cn', 'kr', 'jp', 'br']
    let flagsContent = `<div class='container' style='gap:8px;margin:10px'>`
    flags.forEach(flag => {
        flagsContent += `<img src='https://speedrun.com/images/flags/${flag}.png' style='height:20px'>`
    })
    flagsContent += `</div>`
    document.getElementById('info_flags').innerHTML = flagsContent
    document.getElementById('specialThanks').innerHTML = specialThanks
    let gradesHTML = `
    <table class='shadow' style='margin-top:15px'>
        <tr>`
    grades.forEach((grade, index) => {
        gradesHTML += `<td class='${grade.className}' style='padding:8px;width:24px'><span>${grade.grade}</span></td>`
    })
    gradesHTML += `</tr><tr>`
    grades.forEach((grade, index) => {
        gradesHTML += `<td class='background2' style='font-size:80%;margin-top:2px'>+${index}</td>`
    })
    gradesHTML += `</table>`
    document.getElementById('info_grades').innerHTML = gradesHTML
    document.querySelectorAll('.infoFileType').forEach(fileType => {
        fileType.innerHTML = fileTitle(fileType.id.split('_')[1], true)
        fileType.style.width = '150px'
    })
}