function generateHome() {
    if (runRecapExample) {
        runRecapDefault()
        runRecapUnload('sav', true)
        runRecapUnload('lss', true)
        runRecapExample = false
        hide('runRecap_example_div')
    }
    hide('runRecap_chart')
    show('uploadButton')
    hide('uploadCheck')
}