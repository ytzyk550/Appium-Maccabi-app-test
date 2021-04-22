const assert = require('chai').assert;
const webdriverio = require('webdriverio');
const { appAndroidConfig, CORRECT_ID, CORRECT_PIN, INCORRECT_ID, INCORRECT_PIN } = require('./configs')


let client;

let openNoCardVisitForm = async (client)=>{
  await client.setTimeout({ 'implicit': 15000 })
      
    const whatsNew = await getElementByText("מה חדש באפליקציה?")

    whatsNew.waitForDisplayed(300000)
    let whatsNewisDisplayed = await whatsNew.isDisplayed()
    if (whatsNewisDisplayed) {
      const closeAlert = await getElementByResourceId('ib_whats_new_close');
      await closeAlert.click()
    }
    
      
    
    const openMenu = await getElementByResourceId('btn_toggleDrawer')
    openMenu.waitForDisplayed(10000)
    await openMenu.click()

    const bottomElementSelector = `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("ביקור ללא כרטיס"))`
    const openCard = await client.$(`android=${bottomElementSelector}`)
    await openCard.click()
    
}

let getElementByResourceId = (id) => {
  return client.$(`android=new UiSelector().resourceId("com.ideomobile.maccabi:id/${id}")`)
}

let getElementByText = (text) => {
  return client.$(`android=new UiSelector().textContains("${text}")`)
}

describe('Test Maccabi interactions', function () {
  

  beforeEach(async function () {
    client = await webdriverio.remote(appAndroidConfig);
    await openNoCardVisitForm(client)
  });

  afterEach(async function () {
    await client.deleteSession();
  });

  it('should get no-card-visit ok', async function () {
    

    const textField = await getElementByResourceId('textInputEditText')
    await textField.setValue( CORRECT_ID );
    
    const passField = await getElementByResourceId('textInputEditTextPassword')
    await passField.setValue( CORRECT_PIN );
    
    const submitButton = await getElementByResourceId('enterButton')
    await submitButton.click()
    
    await client.setTimeout({ 'implicit': 15000 })

    const resonButton = await client.$("~לחצן שכחתי כרטיס")
    await resonButton.click()
    
    const successTitle = await getElementByResourceId('tv_success_title')
    const successTitleValue = await successTitle.getText();

    assert.strictEqual(successTitleValue, "ביקור ללא כרטיס אושר בהצלחה");
    
    return
  
  });

  it('should get an incorrect login error', async function () {
        
    const textField = await getElementByResourceId('textInputEditText')
    await textField.setValue( CORRECT_ID );
    
    const passField = await getElementByResourceId('textInputEditTextPassword')
    await passField.setValue( INCORRECT_PIN );
    
    const submitButton = await getElementByResourceId('enterButton')
    await submitButton.click()
    
    const errorAlert = await getElementByText("ההזדהות נכשלה")
    errorAlert.waitForDisplayed(30000)
    
    const errorTitleValue = await errorAlert.getText();

    assert.strictEqual(errorTitleValue, "ההזדהות נכשלה");
    
    return
  
  });


  it('should be disabled button - wrong params', async function () {
      

    const textField = await getElementByResourceId('textInputEditText')
    await textField.setValue(INCORRECT_ID);
   
    const passField = await getElementByResourceId('textInputEditTextPassword')
    await passField.setValue(INCORRECT_PIN);
    
    const submitButton = await getElementByResourceId('enterButton')
    let submitButtonisEnabled = await submitButton.isEnabled()
    
    assert.isFalse(submitButtonisEnabled, 'incorrect values but submit button is enabled!!')

    return

  });
});