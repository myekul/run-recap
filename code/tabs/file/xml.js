function generate_xml() {
    let HTMLContent = ''
    if (runRecap_xmlFile.attemptHistory) {
        HTMLContent += `<div class='container'><table>`
        runRecap_xmlFile.attemptHistory[runRecap_xmlFile.attemptHistory.length - 1].scenes.forEach(scene => {
            const level = cupheadLevels[scene.name.slice(6)]
            HTMLContent += `<tr>
            <td>${getImage(level?.id)}</td>
            </tr>`
        })
        HTMLContent += `</table></div>`
    } else {
        HTMLContent += `<div class='container'>No .xml file uploaded!</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
}
function read_xml(content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "application/xml");
    console.log(xmlDoc)
    runRecap_xmlFile = {}
    runRecap_xmlFile.attemptHistory = [...xmlDoc.getElementsByTagName("Attempt")].map(attempt => {
        const id = Number(attempt.getAttribute("id"))
        const scenes = [...attempt.getElementsByTagName("Scene")].map(scene => {
            return {
                name: scene.getAttribute("name"),
                time: Number(scene.getElementsByTagName("Time")[0].textContent),
                parries: Number(scene.getElementsByTagName("Parries")[0].textContent)
            }
        })
        return { id, scenes }
    })
    console.log(runRecap_xmlFile.attemptHistory)
}