function aprilFoolsPopup() {
    let HTMLContent = `
    <div style='width:400px;padding:10px'>
        Hello vibrant community!
        <br><br>
        Thank you for using Run Recap. Due to the extremely positive reception of the site and the widespread impact it has had on the community,
        the myekul.com board of executives has decided to make Run Recap a ${myekulColor('premium, subscription-based service')}.
        Given the site's popularity, we figured this would be an excellent opportunity to capitalize on our lucrative run analysis tools.
        <br>${myekulColor('Pricing plans now available!')}
        <br><br>
        -myekul
    </div>`
    openModal(HTMLContent, 'UPDATE')
}
function aprilFoolsReveal() {
    let HTMLContent = `
    <div style='width:450px;padding:10px'>
    APRIL FOOLS! ${myekulColor('myekul.com will ALWAYS be free and open source.')}
    Thank you everyone for visiting the site. It truly means a lot for my work to get appreciated the way it does.
    <br><br>
    ...If you would like to actually support the myekul project though, a donation would be greatly appreciated.
    It costs me ${myekulColor('$10/year')} to keep the myekul.com domain name, and if we could get that community-funded, that would mean a lot.
    Anything beyond that is not necessary, but would put a smile on my silly face.
    ${myekulColor('For donations of $5 or more, you will receive a special supporter badge on the Combined Leaderboard!')}
    <a href="https://ko-fi.com/myekul" target="_blank" class='button cuphead font2' style='margin:10px auto;font-size:170%;height:50px;width:150px;border-radius:40px'>DONATE</a>`
    openModal(HTMLContent, 'APRIL FOOLS!', '', true)
    playSound('ready')
    aprilFools = false
    action()
}