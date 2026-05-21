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
    HTMLContent += `
    </table>
    <div class='infoTitle'>The Rundown</div>
    Run Recap offers a comprehensive set of ${myekulColor('comparison tools')}.
    For .sav, .lss, and .rrc, there are many comparisons available, including top runs and community bests.
    In order to maintain these comparisons, the Run Recap backend requires data for all of these metrics, which is stored in a series of ${myekulColor('.json')} files in the project repository.
    <br><br>
    Maintaining .rrc comparisons is particularly tricky, since we don't always have raw .rrc data for every top run.
    For runs completed with the .rrc component installed, those are easy to import into the .json because all of the necessary data gets automatically recorded.
    For runs completed without the component, they need to be manually retimed and reconstructed into an .rrc.
    The three essential components of a retime are: ${myekulColor('scene loads')}, ${myekulColor('level IGT')}, and ${myekulColor('star skips')}.
    These elements are collected and inserted into ${myekulColor('rrcData.json')}, which gets programmatically converted into a full .rrc for comparison.
    <br><br>
    ${myekulColor('rrcData.json')} contains all of the .rrc data for every top run in every main Any% category.
    Some runs have the entire .rrc scene array, while others only have an array of manually timed endTimes, along with IGT and star skip arrays, which are then converted to an .rrc.
    An .rrc file also contains all of the data required to reconstruct an .lss file, which means all of the ${myekulColor('LiveSplit splits/segments')} can be calculated from an .rrc, for ${myekulColor('both split before/after scorecard')}.
    Wow!
    <br><br>
    On the Run Recap home page, there's a list of the ${myekulColor('top 10 1.1+ Any% runs')}.
    When one of these is selected, it reconstructs a ${myekulColor('.sav')}, ${myekulColor('.lss')}, and ${myekulColor('.rrc')} using rrcData.json.
    <br><br>
    Run Recap also contains its own leaderboard page, which utilizes the ${myekulColor('speedrun.com API')} to fetch runs and players from the SRC database.
    Run Recap actually uses the same data as my Combined Leaderboard project, which is cached in a Firestore database.
    This is what causes the page to load upon entering the site.
    In the future, I may cache that data locally to reduce that load.
    </div>`
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