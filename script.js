var variables = require('./variables');
var emails = require('./emails');
var webDriver = require('selenium-webdriver');
var seleniumDrivers = require('selenium-drivers');

var until = webDriver.until;
var By = webDriver.By;
var browser = webDriver.browser

seleniumDrivers.init({
    browserName: 'chrome',
    download: true
}).then(function () {
  var driver = new webDriver.Builder()
      .forBrowser('chrome')
      .build();

  driver.get(variables.linkedinPath)
  driver.findElement(By.id(variables.emailInputId)).sendKeys(variables.userEmail);
  driver.findElement(By.id(variables.passwordInputId)).sendKeys(variables.userPass);
  driver.findElement(By.id(variables.loginButtonId)).click();
  driver.get(variables.linkedInEmailConnectPath);
  driver.findElement(By.className(variables.addByEmailButtonClass)).click();
  driver.findElement(By.className(variables.emailInputClass)).sendKeys(variables.starterEmail);
  driver.findElement(By.id(variables.sendConnectButtonId)).click();
  driver.wait(until.elementLocated(By.className(variables.successToastMessageClass)), 12500);
  var element = driver.findElement(By.className(variables.successToastMessageClass));

  emails.forEach(function(email) {
    driver.wait(until.elementIsNotVisible(element), 12500);
    driver.findElement(By.className(variables.emailInputClass)).clear();
    driver.findElement(By.className(variables.emailInputClass)).sendKeys(email);
    driver.findElement(By.id(variables.sendConnectButtonId)).click();
    driver.findElement(webDriver.By.className(variables.errorNotificationMessage)).then(
      function(success){
        console.log(email)
        driver.wait(until.elementIsNotVisible(driver.findElement(By.className(variables.errorNotificationMessage))),12500);
      },
      function (err) {
        driver.wait(until.elementLocated(By.className(variables.successToastMessageClass)), 12500);
      }
    );
  })
});
