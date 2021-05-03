const {appAndroidConfig} = require('./configs')
const webdriverio = require('webdriverio');

let client;

let startApp = async () => {
    client = await webdriverio.remote(appAndroidConfig);
}

let closeApp = () => {
    client.deleteSession();
}

let getElementByResourceId = (id) => {
    return client.$(`android=new UiSelector().resourceId("com.ideomobile.maccabi:id/${id}")`)
}

let getElementByText = (text) => {
    return client.$(`android=new UiSelector().textContains("${text}")`)
}

let isElementDisplayed = async (element) => {
    element.waitForDisplayed(20000)
    return await element.isDisplayed()
}

let isElementEnabled = async (element_id) => {
    const element = await getElementByResourceId(element_id)
    return await element.isEnabled()
}
    
let clickElement = async (element_id) => {
    const element = await getElementByResourceId(element_id)
    await element.click()
}

let clickElementByAccessibilityId = async (accessibility_id) => {
    const element = await client.$("~"+accessibility_id)
    await element.click()
}

let scrollToElement = async (text) => {
    const elementSelector = `new UiScrollable(new UiSelector()).scrollIntoView(text(\"${text}"))`
    return await client.$(`android=${elementSelector}`)    
}

let closeWhatsNewAd = async () => {
    const whatsNew = await getElementByText("מה חדש באפליקציה?")

    let whatsNewisDisplayed = await isElementDisplayed(whatsNew)
    if ( whatsNewisDisplayed ) {
    await clickElement('ib_whats_new_close')
    }
}

let openNoCardVisitForm = async () => {
    await client.setTimeout({ 'implicit': 15000 })
    await closeWhatsNewAd()
    
    await clickElement('btn_toggleDrawer')
    
    let openCard = await scrollToElement('ביקור ללא כרטיס')
    await openCard.click()
    
}

let setValueToElement = async (element_id, value) => {
    const textField = await getElementByResourceId(element_id)
    await textField.setValue( value ); 
}

let getElementText = async (element_id) => {
    const textElement = await getElementByResourceId(element_id)
    return await textElement.getText();
}

let setFormValues = async (id_number, password) => {
    await setValueToElement( 'textInputEditText', id_number )
    await setValueToElement( 'textInputEditTextPassword', password )
}

let accountLogin = async (id_number, password) => {
    await setFormValues(id_number, password)
    await clickElement('enterButton')
}

let chooseResonScreen = async () => {
    const chooseReson = await getElementByText("מה הסיבה להזמנת ביקור ללא כרטיס?")

    return await isElementDisplayed(chooseReson)
}



module.exports = {
    client,
    startApp,
    closeApp,
    getElementByResourceId,
    getElementByText,
    isElementDisplayed,
    isElementEnabled,
    clickElement,
    clickElementByAccessibilityId,
    scrollToElement,
    closeWhatsNewAd,
    openNoCardVisitForm,
    setValueToElement,
    getElementText,
    setFormValues,
    accountLogin,
    chooseResonScreen
}