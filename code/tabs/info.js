function generateInfo() {
    let HTMLContent = `
    <div class='container'>
    <div>
    <img src='${sharedAssetsURL('myekul')}' class='container' style='height:50px;width:50px'>
    <div style='width:600px;white-space:normal;margin:0 auto'>
    Hello! My name is ${myekulColor(`myekul`)} and I am a Cuphead speedrunner and web developer.
    This is ${myekulColor(`Run Recap`)}, a Cuphead speedrun analysis tool.
    </div>
    <div class='container' style='gap:20px'>
        <video autoplay loop playsinline muted class='border shadow' style='height:250px;width:444.44px;margin-top:15px'>
            <source src='images/sizzle.mp4' type='video/mp4' />
        </video>
        <div class='dim' style='font-size:90%'>
            I'm gonna check my stats,
            <br>So I'm gonna have to use Run Recap...
            <br>Inkwell Isle, uploading my file,
            <br>myekul's freaking awesome!
            <br>
            <br>I use Run Recap,
            <br>I know my decimals,
            <br>My run's incredible,
            <br>But my residual's terrible!
        </div>
    </div>
    <div style='width:600px;white-space:normal;margin:0 auto'>
    <div class='infoTitle'>How it works</div>
    This website contains a ${myekulColor('massive database')} of runs, individual levels, split/segment times, and more.
    Using this data, we're able to display a detailed run breakdown with a simple drag and drop of a file.
    <br><br>
    <div class='background1 border shadow' style='font-size:85%;padding:15px'>
        <div style='font-size:115%'>When you complete a fullgame speedrun, there are 3 different file types you can drag into Run Recap to analyze your performance:</div>
        <br><br>
        <div class='container'>
            <div style='width:150px'>${fileTitle('sav', true)}</div>
            <div style='width:450px'>
                Cuphead automatically saves all level times to a ${myekulColor('.sav')} file, stored in ${myekulColor('%appdata%\\Roaming\\Cuphead')}.
                The 3 .sav files correspond to the 3 in-game save files.
                You can drag one of these files into Run Recap to view your times.
            </div>
        </div>
        <br>
        <div class='container'>
            <div style='width:450px'>
                Run Recap also supports ${myekulColor('LiveSplit .lss')} files.
                Here, you can compare against all of your previous runs, and also compare against top runners' splits/segments.
                Additionally, you can click on a row to view a list of your best splits/segments for a given boss.
            </div>
            <div style='width:150px'>${fileTitle('lss', true)}</div>
        </div>
        <br>
        <div class='container'>
            <div style='width:150px'>${fileTitle('rrc', true)}</div>
            <div style='width:450px'>
                A powerful new file type, ${myekulColor('Run Recap .rrc')}.
                Using a custom LiveSplit component developed in collaboration with SBDWolf, .rrc automatically records the time between every single loading screen in the run.
                It also reads the game's memory, and saves level data such as IGT, parries, and star skips.
                For the most in-depth analysis, .rrc is the way to go.
            </div>
        </div>
    </div>
    <br>
    <div class='background1 border shadow' style='padding:15px'>
        The grading system is quite simple. Based on the selected comparison, grades are determined by a linear scale.
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
    </div>
    <div class='infoTitle'>The Rundown</div>
    Run Recap offers a comprehensive set of ${myekulColor('comparison tools')}.
    For .sav, .lss, and .rrc, there are many comparisons available, including top runs and community bests.
    In order to maintain these comparisons, the Run Recap backend requires data for all of these metrics, which is stored in a series of ${myekulColor('.json')} files in the project repository.
    <br><br>
    Maintaining .rrc comparisons is particularly tricky, since we don't always have raw .rrc data for every top run.
    For runs completed with the .rrc component installed, those are easy to import into the .json because all of the necessary data gets automatically recorded.
    For runs completed without the component, they need to be manually retimed and reconstructed into an .rrc.
    The 3 essential components of a retime are: ${myekulColor('scene loads')}, ${myekulColor('level IGT')}, and ${myekulColor('star skips')}.
    These elements are collected and inserted into ${myekulColor('rrcData.json')}, which gets programmatically converted into a full .rrc for comparison.
    <br><br>
    <div class='background1 border shadow' style='padding:15px'>
        <a href="https://myekul.com/run-recap/resources/commBest.json" target="_blank" class='container grow' style='width:100px;gap:8px'><i class='fa fa-file-code-o' style='font-size:150%'></i>rrcData.json</a>
        <br>
        ${myekulColor('rrcData.json')} contains all of the .rrc data for every top run in every main Any% category.
        Some runs have the entire .rrc scene array, while others only have an array of manually timed endTimes, along with IGT and star skip arrays, which are then converted to an .rrc.
        An .rrc file also contains all of the data required to reconstruct an .lss file, which means all of the ${myekulColor('LiveSplit splits/segments')} can be calculated from an .rrc, for ${myekulColor('both split before/after scorecard')}.
        Wow!
        <br><br>
        On the Run Recap home page, there's a list of the ${myekulColor('top 10 1.1+ Any% runs')}.
        When one of these is selected, it reconstructs a ${myekulColor('.sav')}, ${myekulColor('.lss')}, and ${myekulColor('.rrc')} using rrcData.json.
        This is the case for every main Any% category.
        <br><br>
        Currently, when a top runner sets a new PB, rrcData.json needs to be updated manually to keep the comparisons up-to-date.
        Maybe in the future we can get some sort of SRC .rrc integration to reduce the overhead.
    </div>
    <br>
    <div class='background1 border shadow' style='padding:15px'>
        <a href="https://myekul.com/run-recap/resources/scenes.json" target="_blank" class='container grow' style='width:100px;gap:8px'><i class='fa fa-file-code-o' style='font-size:150%'></i>scenes.json</a>
        <br>
        ${myekulColor('scenes.json')} stores a list of scenes for each category, which reflect the routes used in their respective world records.
        This data is used to reconstruct .rrc files from raw load times.
        It's also used to verify whether an .rrc attempt has been completed, which is required to upload to the database.
    </div>
    <br>
    Run Recap also contains its own leaderboard page, which utilizes the ${myekulColor('speedrun.com API')} to fetch runs and players from the SRC database.
    Run Recap actually uses the same data as my Combined Leaderboard project, which is cached in a Firestore database.
    This is what causes the page to load upon entering the site.
    In the future, I may cache that data locally to reduce that load.
    <br><br>
    <div class='background1 border shadow' style='padding:15px'>
        <div class='container' style='gap:40px'>
            <button class='container button grade-a font2' style='font-size:100%;width:180px;gap:8px;height:25px' onclick="altStratLevel=null;showTab('altStrats');playSound('category_select')"><i class='fa fa-database'></i>Comm Best ILs</button>
            <a href="https://myekul.com/run-recap/resources/alt.json" target="_blank" class='container grow' style='width:100px;gap:8px;margin:0'><i class='fa fa-file-code-o' style='font-size:150%'></i>alt.json</a>
        </div>
        <br>
        A comprehensive collection of ILs for EVERY notable pattern / strat variation on EVERY boss in EVERY main Any% category.
        ${myekulColor('Alt strats!')}
    </div>
    <br>
    <div class='background1 border shadow' style='padding:15px'>
        <div class='container' style='gap:40px'>
            <button class='container button grade-a font2' style='font-size:100%;width:180px;gap:8px;height:25px' onclick="altStratLevel=null;showTab('runViableILs');playSound('category_select')"><i class='fa fa-trophy'></i>Run Viable ILs</button>
            <a href="https://myekul.com/run-recap/resources/runViable.json" target="_blank" class='container grow' style='width:100px;gap:8px;margin:0'><i class='fa fa-file-code-o' style='font-size:150%'></i>runViable.json</a>
        </div>
        <br>
        A database of the best ILs achieved with "${myekulColor('run-viable')}" strategies.
        Risky / nonviable tricks such as Spider's Kiss, 2-cycle Beppi Skip, and 3+3 Chargimate are omitted.
    </div>
    <br>
    <div class='background1 border shadow' style='padding:15px'>
        <div class='container' style='gap:40px'>
            <button class='container button grade-a font2' style='font-size:100%;width:180px;gap:8px;height:25px' onclick="altStratLevel=null;showTab('commBestSplits');playSound('category_select')"><i class='fa fa-tasks'></i>Comm Best Splits</button>
            <a href="https://myekul.com/run-recap/resources/commBest.json" target="_blank" class='container grow' style='width:100px;gap:8px;margin:0'><i class='fa fa-file-code-o' style='font-size:150%'></i>commBest.json</a>
        </div>
        <br>
        All of the community best split/segment times for every main Any% category, for both split on knockout and split after scorecard.
    </div>
    <div class='infoTitle'>Motivation</div>
    ${javaSav}
    <br><br>
    In late 2024, I got into fullgame speedruns, and I had this idea to utilize the .sav to display the level IGT of all of the fights.
    I implemented it as a side feature on my Combined Leaderboard website, and it was a hit!
    I eventually ported Run Recap to its own repository and fleshed it out, and it became what it is today.
    Now, Run Recap acts as a central hub of Cuphead speedrun analysis, and it's the go-to place for top runners all around the world to critique their runs.`
    const flags = ['us', 'gb', 'gb/sct', 'de', 'ch', 'it', 'se', 'rs', 'cn', 'kr', 'jp', 'br']
    HTMLContent += `<div class='container' style='gap:8px;margin:10px'>`
    flags.forEach(flag => {
        HTMLContent += `<img src='https://speedrun.com/images/flags/${flag}.png' style='height:20px'>`
    })
    HTMLContent += `</div>`
    HTMLContent += `
    <div class='infoTitle'>Special Thanks</div>
    ${specialThanks}`
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
    document.getElementById('content').innerHTML = HTMLContent
}