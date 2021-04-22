const appAndroidConfig = {
    path: '/wd/hub',
    port: 4723,
    logLevel: 'error',
    capabilities: {
      platformName: "Android",
      platformVersion: "7.1.2",
      deviceName: "emulator-5554",
      app: "C:/Users/User/Downloads/מכבי שירותי בריאות_v3.14.0_apkpure.com.apk",
      appPackage: "com.ideomobile.maccabi"
    }
};



module.exports = { 
    appAndroidConfig,
    CORRECT_ID : 208796102,
    CORRECT_PIN : 8541343,
    INCORRECT_ID : 432125874,
    INCORRECT_PIN : 4321234,
}
  
