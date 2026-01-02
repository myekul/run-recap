function generateHome() {
    let HTMLContent = ''
    HTMLContent += `<div class="container" style="margin-top:20px">
                    <div class='textBlock'>
                        Welcome to <span class="myekulColor">Run Recap</span>! This tool allows you
                        to upload
                        a <span class="myekulColor">Cuphead .sav</span>
                        and a <span class="myekulColor">LiveSplit .lss</span> file
                        to gain valuable insights about your recent run performance.
                    </div>
                </div>
                <div class="container" style="padding:25px 0;gap:20px">
                    <div style="padding-right:20px">
                        <div class="container">View Example:</div>
                        <div class="container">${runRecapExamples()}</div>
                    </div>
                    <div id="dropbox"></div>
                </div>
                <div id='fileTypes' class="container" style="gap:30px;align-items:flex-start"></div>
                <div id='runRecapError' class='container' style='display:none;margin-top:20px'>Error!</div>`
    document.getElementById('content').innerHTML = HTMLContent
    if (runRecapExample) {
        runRecapDefault()
        runRecapUnload('sav')
        runRecapUnload('lss')
        runRecapUnload('rrc')
        rrcAttemptIndex = 0
        runRecapExample = false
        hide('runRecap_example_div')
    }
    hide('runRecap_chart')
    show('uploadButton')
    hide('uploadCheck')
    initializeDropbox(true)
    HTMLContent = '';
    ['sav', 'lss', 'rrc'].forEach(type => {
        HTMLContent += fileInfoCard(type)
    })
    document.getElementById('fileTypes').innerHTML = HTMLContent
}
function runRecapDefault() {
    document.getElementById('runRecap_time').innerHTML = `
    <div style='font-size:150%'>XX:XX</div>
    <div style='font-size:160%'>${fontAwesome('edit')}</div>`
    runRecapTime = 'XX:XX'
}