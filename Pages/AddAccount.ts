import { Page, Locator, expect } from '@playwright/test';

export class AddAccount {
  readonly page: Page;
  readonly accounts: Locator;
  readonly admin: Locator;
  readonly addAccountButton: Locator;
  readonly accountDialog: Locator;
  readonly exchangeDropdown: Locator;
  readonly OKXAccountName: Locator;
  readonly OKXAccountKey: Locator;
  readonly OKXAccountSecret: Locator;
  readonly OKXPassphrase: Locator;
  readonly testModeOKX: Locator;
  readonly addButton: Locator;
  readonly binanceUSDMAccountName: Locator;
  readonly binanceUSDMAccountKey: Locator;
  readonly binanceUSDMAccountSecret: Locator;
  readonly testModeBinanceUSDM: Locator;
  readonly binanceCOINMAccountName: Locator;
  readonly binanceCOINMAccountKey: Locator;
  readonly binanceCOINMAccountSecret: Locator;
  readonly testModeBinanceCOINM: Locator;
  readonly dialogTitle: Locator;
  readonly closeButton: Locator;
  readonly getStartedButton: Locator;
  readonly OKXOption: Locator;
  readonly binanaceUSDMOption: Locator;
  readonly binanceCOINMOption: Locator;
  readonly accountNameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accounts = page.locator("//span[normalize-space()='Accounts']");
    this.admin = page.locator("//span[normalize-space()='Manage trading accounts & groups']");
    this.addAccountButton = page.locator("//button[normalize-space()='Add Account']");
    this.accountDialog = page.locator("//div[@role='dialog']");
    this.exchangeDropdown = page.locator("//button[@role='combobox']");
    this.OKXOption = page.locator('[data-testid="exchange-option-OKX"]');
    this.binanaceUSDMOption = page.locator('[data-testid="exchange-option-BINANCEUSDM"]');
    this.binanceCOINMOption = page.locator('[data-testid="exchange-option-BINANCECOINM"]')
    this.dialogTitle = page.locator("//h2[contains(text(),'Add')]");
    this.OKXAccountName = page.locator("//input[@placeholder='Enter your OKX Account Name']");
    this.OKXAccountKey = page.locator("//input[@placeholder='Enter your OKX API Key']");
    this.OKXAccountSecret = page.locator("//input[@placeholder='Enter your OKX secret key']");
    this.OKXPassphrase = page.locator("//input[@placeholder='Enter your OKX passphrase']");
    this.testModeOKX = page.locator("//button[@role='switch']");
    this.addButton = page.locator("//button[@type='submit']");
    this.binanceUSDMAccountName = page.locator("//input[@placeholder='Enter your Binance USDⓈ-M Account Name']");
    this.binanceUSDMAccountKey = page.locator("//input[@placeholder='Enter your Binance USDⓈ-M API Key']");
    this.binanceUSDMAccountSecret = page.locator("//input[@placeholder='Enter your Binance USDⓈ-M secret key']");
    this.testModeBinanceUSDM = page.locator("#_r_4r_-form-item");
    this.binanceCOINMAccountName = page.locator("//input[@placeholder='Enter your Binance COIN-M Account Name']");
    this.binanceCOINMAccountKey = page.locator("//input[@placeholder='Enter your Binance COIN-M API Key']");
    this.binanceCOINMAccountSecret = page.locator("//input[@placeholder='Enter your Binance COIN-M secret key']");
    this.testModeBinanceCOINM = page.locator("//button[@data-testid='test-mode-switch']");
    this.closeButton = page.locator("//button[@aria-label='Close']");
    this.getStartedButton = page.locator('text=Get Started');
    this.accountNameInput = page.locator("//input[@name='accountName']");
  }

  private async selectExchange(exchangeName: 'OKX' | 'Binance USDS-M' | 'Binance COIN-M'): Promise<void> {
    await this.exchangeDropdown.click();
    
    let exchangeOption: Locator;
    
    switch(exchangeName) {
      case 'OKX':
        exchangeOption = this.OKXOption;
        break;
      case 'Binance USDS-M':
        exchangeOption = this.binanaceUSDMOption;
        break;
      case 'Binance COIN-M':
        exchangeOption = this.binanceCOINMOption;
        break;
      default:
        throw new Error(`Unsupported exchange: ${exchangeName}`);
    }
    
    await exchangeOption.waitFor({ state: 'visible', timeout: 5000 });
    await exchangeOption.click();
    
    await this.page.waitForTimeout(500);
  }

  async fillOKXAccountDetails(
    accountName: string,
    apiKey: string,
    secretKey: string,
    passphrase: string,
    testMode: boolean = true
  ): Promise<void> {
    
    await this.selectExchange('OKX');
    
    await this.OKXAccountName.waitFor({ state: 'visible' });
    await this.OKXAccountName.fill(accountName);
    await this.OKXAccountKey.fill(apiKey);
    await this.OKXAccountSecret.fill(secretKey);
    await this.OKXPassphrase.fill(passphrase);
    
    if (testMode) {
      await this.toggleTestMode('OKX', true);
    }
  }

  async addOKXAccount(
    accountName: string,
    apiKey: string,
    secretKey: string,
    passphrase: string,
    testMode: boolean = true
  ): Promise<void> {
    await this.fillOKXAccountDetails(accountName, apiKey, secretKey, passphrase, testMode);
    await this.clickAddButton();
  }

  async fillBinanceUSDMAccountDetails(
    accountName: string,
    apiKey: string,
    secretKey: string,
    testMode: boolean = true
  ): Promise<void> {
    
    await this.selectExchange('Binance USDS-M');
    
    await this.binanceUSDMAccountName.waitFor({ state: 'visible' });
    await this.binanceUSDMAccountName.fill(accountName);
    await this.binanceUSDMAccountKey.fill(apiKey);
    await this.binanceUSDMAccountSecret.fill(secretKey);
    
    if (testMode) {
      await this.toggleTestMode('BinanceUSDM', true);
    }
  }

  async addBinanceUSDMAccount(
    accountName: string,
    apiKey: string,
    secretKey: string,
    testMode: boolean = true
  ): Promise<void> {
    await this.fillBinanceUSDMAccountDetails(accountName, apiKey, secretKey, testMode);
    await this.clickAddButton();
  }

  async fillBinanceCOINMAccountDetails(
    accountName: string,
    apiKey: string,
    secretKey: string,
    testMode: boolean = true
  ): Promise<void> {
  
    await this.selectExchange('Binance COIN-M');
    
    await this.binanceCOINMAccountName.waitFor({ state: 'visible' });
    await this.binanceCOINMAccountName.fill(accountName);
    await this.binanceCOINMAccountKey.fill(apiKey);
    await this.binanceCOINMAccountSecret.fill(secretKey);
    
    if (testMode) {
      await this.toggleTestMode('BinanceCOINM', true);
    }
  }

  async addBinanceCOINMAccount(
    accountName: string,
    apiKey: string,
    secretKey: string,
    testMode: boolean = true
  ): Promise<void> {
    await this.fillBinanceCOINMAccountDetails(accountName, apiKey, secretKey, testMode);
    await this.clickAddButton();
  }

  async toggleTestMode(exchange: 'OKX' | 'BinanceUSDM' | 'BinanceCOINM', enable: boolean = true): Promise<void> {
    let toggleElement: Locator;
    
    switch(exchange) {
      case 'OKX':
        toggleElement = this.testModeOKX;
        break;
      case 'BinanceUSDM':
        toggleElement = this.testModeBinanceUSDM;
        break;
      case 'BinanceCOINM':
        toggleElement = this.testModeBinanceCOINM;
        break;
    }
    
    const isChecked = await toggleElement.isChecked();
    
    if ((enable && !isChecked) || (!enable && isChecked)) {
      await toggleElement.click();
    }
  }
async closeWelcomePopup(): Promise<void> {
    try {
      const popupCloseButton = this.page.locator('//span[@class="hover:text-primary text-base text-green-400"]');
      await popupCloseButton.waitFor({ state: 'visible', timeout: 10000 });
      await popupCloseButton.click();
      await this.page.waitForTimeout(1000); 
    } catch (error) {
      
      console.log('Welcome popup not found or already closed');
    }
  }

  async navigateToAccounts(): Promise<void> {
    await this.accounts.waitFor({ state: 'visible', timeout: 10000 });
    await this.accounts.click();
    await this.page.waitForTimeout(1000); 
  }

  async navigateToAdmin(): Promise<void> {
    await this.admin.waitFor({ state: 'visible', timeout: 10000 });
    await this.admin.click();
    await this.page.waitForTimeout(1000); 
  }
 

  async clickAddAccount(): Promise<void> {
     await this.addAccountButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.addAccountButton.click();
    await this.page.waitForTimeout(1000);
   
  }

  async verifyDialogOpened(): Promise<void> {
    await expect(this.accountDialog).toBeVisible();
    await this.page.waitForTimeout(1000);
  }
 async clickAddButton(): Promise<void> {
    await this.addButton.waitFor({ state: 'visible' });
    await expect(this.addButton).toBeEnabled();
    await this.addButton.click();
  }
  async verifyDialogClosed(): Promise<void> {
    await this.accountDialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async verifyAccountAdded(): Promise<void> {
    await this.verifyDialogClosed();
  }

  async closeDialog(): Promise<void> {
    await this.closeButton.click();
    await this.verifyDialogClosed();
  }

  async clickModifyButton(accountName: string): Promise<void> {
    const modifyButton = this.page.locator("//div/button[@aria-controls='radix-_r_1ao_']");
   await modifyButton.waitFor({ state: 'visible', timeout: 5000 });
    await modifyButton.click();
    await this.page.waitForTimeout(1000);
  }

  async verifyModifyDialogOpened(): Promise<void> {
    const modifyDialogTitle = this.page.locator("//div[@role='dialog']");
    await expect(modifyDialogTitle).toBeVisible({ timeout: 1000 });
    await this.page.waitForTimeout(500);
  }

  async modifyAccountName(newAccountName: string): Promise<void> {
       
    await this.accountNameInput.clear();
    await this.accountNameInput.fill(newAccountName);
    await this.page.waitForTimeout(500);
    await this.page.locator("//button[@type='submit']").click();
  }

  async verifyAccountModified(): Promise<void> {
    await this.verifyDialogClosed();
    
    const successMessage = this.page.locator("//div[contains(@class,'notification')]//span[contains(text(),'successfully')]");
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  }
}

