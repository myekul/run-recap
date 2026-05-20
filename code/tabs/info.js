function generateInfo() {
    let HTMLContent = `
    <div class='container'>
    <div>
    <img src='${sharedAssetsURL('myekul')}' class='container' style='height:50px;width:50px'><div style='width:600px;white-space: normal'>
    Hello! My name is ${myekulColor(`myekul`)} and I am a Cuphead speedrunner and web developer.
    This is ${myekulColor(`Run Recap`)}, a Cuphead speedrun analysis tool.
    <video autoplay loop playsinline muted class='container border shadow' style='height:250px;width:444.44px;margin-top:15px'>
        <source src='images/sizzle.mp4' type='video/mp4' />
    </video>
    <div class='infoTitle'>How it works</div>
    This website contains a ${myekulColor('massive database')} of runs, individual levels, split/segment times, and more.
    Using this data, we're able to display a detailed run breakdown with a simple drag and drop of a file.
    <br><br>
    The IL grading system is quite simple. Based on the selected comparison, grades are determined by a linear scale.
    <table class='shadow' style='margin-top:15px'>
        <tr>`
    grades.forEach((grade, index) => {
        HTMLContent += `<td class='${grade.className}' style='padding:8px;width:24px'><span>${grade.grade}</span></td>`
    })
    HTMLContent += `</tr><tr>`
    grades.forEach((grade, index) => {
        HTMLContent += `<td class='background2' style='font-size:80%;margin-top:2px'>+${index}</td>`
    })
    HTMLContent += `</table>`
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
    document.getElementById('content').innerHTML = HTMLContent
}