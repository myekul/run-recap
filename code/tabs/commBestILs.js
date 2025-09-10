function generateCommBestILs() {
    let HTMLContent = `<div class='container'><table>`
    categories.forEach(category => {
        HTMLContent += `<td>${getImage(category.info.id)}</td>`
    })
    HTMLContent += `</table></div>`
    document.getElementById('content').innerHTML = HTMLContent
}