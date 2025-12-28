function generateHome() {
    if (runRecapExample) {
        runRecapDefault()
        runRecapUnload('sav')
        runRecapUnload('lss')
        runRecapUnload('rrc')
        runRecapExample = false
        hide('runRecap_example_div')
    }
    hide('runRecap_chart')
    show('uploadButton')
    hide('uploadCheck')
}