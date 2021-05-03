const assert = require('chai').assert;
const { CORRECT_ID, CORRECT_PIN, INCORRECT_ID, INCORRECT_PIN } = require('./configs')
const visit = require('./visit')


// Test
describe('Test Maccabi interactions', function () {
  
  // Load the App and then go to no-card-visit form
  beforeEach(async function () {
    await visit.startApp()
    await visit.openNoCardVisitForm()
  });

  afterEach(async function () {
    await visit.closeApp()
  });


  // Currect ID and password
  it('should get no-card-visit ok', async function () {
    
    await visit.accountLogin(CORRECT_ID, CORRECT_PIN)

    let successTitleValue = ''

    let chooseResonIsDisplayed = await visit.chooseResonScreen()
    if ( chooseResonIsDisplayed ) {
      await visit.clickElementByAccessibilityId("לחצן שכחתי כרטיס")
      successTitleValue = await visit.getElementText('tv_success_title')
    }
    assert.strictEqual(successTitleValue, "ביקור ללא כרטיס אושר בהצלחה");
    
    return
  
  });

  // Currect ID, Wrong password
  it('should get an incorrect login error', async function () {
    
    await visit.accountLogin(CORRECT_ID, INCORRECT_PIN)

    const errorAlert = await visit.getElementByText("ההזדהות נכשלה")
    let errorAlertShown = await visit.isElementDisplayed(errorAlert)

    assert.isTrue(errorAlertShown)
    return
  
  });

  // Wrong ID and password
  it('should be disabled button - wrong params', async function () {
      
    await visit.setFormValues(INCORRECT_ID, INCORRECT_PIN)

    let isSubmitButtonEnabled = await visit.isElementEnabled('enterButton')
    
    assert.isFalse(isSubmitButtonEnabled, 'incorrect values but submit button is enabled!!')
    return
  });
});