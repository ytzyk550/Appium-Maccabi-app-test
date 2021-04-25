const assert = require('chai').assert;
const webdriverio = require('webdriverio');
const { appAndroidConfig, CORRECT_ID, CORRECT_PIN, INCORRECT_ID, INCORRECT_PIN } = require('./configs')


let client;

let getElementByResourceId = (id) => {
  return client.$(`android=new UiSelector().resourceId("com.ideomobile.maccabi:id/${id}")`)
}

let getElementByText = (text) => {
  return client.$(`android=new UiSelector().textContains("${text}")`)
}

let isElementDisplayed = async (element) => {
  element.waitForDisplayed(10000)
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

let openNoCardVisitForm = async (client) => {
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


// Test
describe('Test Maccabi interactions', function () {
  
  // Load the App and then go to no-card-visit form
  beforeEach(async function () {
    client = await webdriverio.remote(appAndroidConfig);
    await openNoCardVisitForm(client)
  });

  afterEach(async function () {
    await client.deleteSession();
  });


  // Currect ID and password
  it('should get no-card-visit ok', async function () {
    
    
    await accountLogin(CORRECT_ID, CORRECT_PIN)

    await client.setTimeout({ 'implicit': 15000 })

    const resonButton = await client.$("~לחצן שכחתי כרטיס")
    await resonButton.click()
    const successTitleValue = await getElementText('tv_success_title')
    
    assert.strictEqual(successTitleValue, "ביקור ללא כרטיס אושר בהצלחה");
    
    return
  
  });

  // Currect ID, Wrong password
  it('should get an incorrect login error', async function () {
    
    await accountLogin(CORRECT_ID, INCORRECT_PIN)

    const errorAlert = await getElementByText("ההזדהות נכשלה")
    let errorAlertShown = await isElementDisplayed(errorAlert)

    assert.isTrue(errorAlertShown)
    return
  
  });

  // Wrong ID and password
  it('should be disabled button - wrong params', async function () {
      
    await setFormValues(INCORRECT_ID, INCORRECT_PIN)

    let isSubmitButtonEnabled = await isElementEnabled('enterButton')
    
    assert.isFalse(isSubmitButtonEnabled, 'incorrect values but submit button is enabled!!')
    return
  });
});