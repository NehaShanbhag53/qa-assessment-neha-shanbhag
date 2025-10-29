import { test, expect } from '@playwright/test';
import type { Page, Browser } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
 import { AddAccount } from '../Pages/AddAccount';
import { AccountTablePage } from '../Pages/AccountTablePage';
import { TradingPage } from '../Pages/TradingPage';
import { WorkingOrdersPage } from '../Pages/WorkingOrdersPage';
import { OrderHistoryPage } from '../Pages/OrderHistoryPage';
import { SettingsPage } from '../Pages/SettingsPage';
import { GoTradePage } from '../Pages/GoMarketPage';
import { LimitTradePage } from '../Pages/LimitTradePage';
import { TWAPTradePage } from '../Pages/TWAPTradePage';
import { MarketEdgeTradePage } from '../Pages/MarketEdgeTradePage';
import { LimitEdgeTradePage } from '../Pages/LimitEdgeTradePage';
import { TWAPEdgeTradePage } from '../Pages/TWAPEdgeTradePage';


  test.setTimeout(300000); 

 test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    
    page.setDefaultTimeout(120000); 
  });

  test('Login Test', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();

    await loginPage.waitForPageReady();
 
    await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');

    const username = await loginPage.getUsername();
    await expect(username).toBeVisible();
  });

  test('Login Test with Error Handling', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    try {
      await loginPage.goto();
      await loginPage.waitForPageReady();
      await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');
     
      const errorMsg = await loginPage.getErrorMessage();
      
      if (errorMsg) {
        console.log('Login failed with error:', errorMsg);
      } else {
        console.log('Login successful');
        const username = await loginPage.getUsername();
        await expect(username).toBeVisible();
      }
    } catch (error) {
      console.error('Test failed due to timeout or error:', error);
      throw error;
    }
  });
});

test.describe('Invalid Login Scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    page.setDefaultTimeout(120000); 
    
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForPageReady();
  });

  test('Invalid username', async () => {
    await loginPage.login('in@email.com', '60Re3G9KvvFl4Ihegxpi');
    
    await loginPage.errorMessage.waitFor({ 
      state: 'visible',
      timeout: 60000 
    });
    
    await expect(loginPage.errorMessage).toContainText(
      'The user was not found in the system', 
      { timeout: 60000 }
    );
  });

  test('Invalid password', async () => {
    await loginPage.login('user6@goquant.io', 'Wroword');
   
    await loginPage.errorMessage.waitFor({ 
      state: 'visible',
      timeout: 60000 
    });
    
    await expect(loginPage.errorMessage).toContainText(
      'password is invalid', 
      { timeout: 60000 }
    );
  });

 test('Email is empty', async () => {
    await loginPage.login('', '60Re3G9KvvFl4Ihegxpi');
 
    const errorText = await loginPage.getEmailEmptyError();

    expect(errorText).not.toBeNull();
 
    console.log('Email empty error message:', errorText);

    expect(errorText).toContain('Email is required');
 
    await expect(loginPage.emailEmptyError).toBeVisible({ timeout: 60000 });

    await expect(loginPage.page).toHaveURL(/.*\/auth\/login/, { timeout: 30000 });
  });

  test('Password is empty', async () => {
    await loginPage.login('user6@goquant.io', '');
   
    await loginPage.errorMessage.waitFor({ 
      state: 'visible',
      timeout: 60000 
    });
    
    await expect(loginPage.errorMessage).toContainText(
      'password is invalid', 
      { timeout: 60000 }
    );
  });
  test('Login and Logout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.waitForPageReady();
  await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');
  
  const username = await loginPage.getUsername();
  await expect(username).toBeVisible();
  
  await loginPage.logout();

  await expect(page).toHaveURL(/.*\/auth\/login/);
});
}); 
 test.setTimeout(300000); 

test.describe('Login Tests', () => {
    test.beforeEach(async ({ page }) => {
      page.setDefaultTimeout(120000); 
    });
});
test.describe('Add Account Tests', () => {
  let addAccountPage: AddAccount;
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
 
    page.setDefaultTimeout(120000);     
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');

    await page.waitForLoadState('networkidle', { timeout: 180000 }); 
    await expect(page).toHaveURL(/gotrade/); 

    await page.goto('https://test1.gotrade.goquant.io/gotrade', { waitUntil: 'networkidle' });

    addAccountPage = new AddAccount(page);
await addAccountPage.closeWelcomePopup();
 
    await addAccountPage.navigateToAccounts();
    await addAccountPage.navigateToAdmin(); 

    await page.waitForTimeout(2000);
 
    await page.waitForTimeout(1000);
  });

  test.afterEach(async () => {
    await page.close();
  });
 
  test('Add OKX account successfully', async () => {
    await addAccountPage.clickAddAccount();
    await addAccountPage.verifyDialogOpened();
 
    await addAccountPage.fillOKXAccountDetails(
      'OKX Account - Neha',
      'ebfb1f88-c0fd-4b47-bc0e-4c59c89941cc',
      '38DFD046E187A5870AA51FBD4DE41BA9',
      'GQtest@123',
      true
    );
    
    await addAccountPage.clickAddButton();
    await addAccountPage.verifyAccountAdded();
  });

  test('Add Binance COIN-M account', async () => {
    await addAccountPage.clickAddAccount();
    await addAccountPage.verifyDialogOpened();
 
    await addAccountPage.addBinanceCOINMAccount(
      'Binance COIN-M Account - Neha',
      'Yp8bDeP2rTe154qfe3trno62Jo66BC8TBT3DRzDL8SV90L4ubF0DbpX6pxrjNcn7',
      'q2ABwfGslz6dzE9wPp2bFT6KyZxMqwy3Tgy08LSrK5AzIAapWKGhkj5hHcUOBh1L',
      true
    );
    
    await addAccountPage.verifyAccountAdded();
  });

  test('Add Binance USDS-M account', async () => {
    await addAccountPage.clickAddAccount();
    await addAccountPage.verifyDialogOpened();

    await addAccountPage.addBinanceUSDMAccount(
      'Binance USDS-M Account - Neha',
      'ZPBfumjtgclJnrrtQT5qRFJ9aNbghcslny4LIwkfm6bEbF40k0KAjYcoGe5Uvq2o',
      '6k5XUIHEcA89JxdlblYCSZNJU9G8Z865pdzQgn4g6l4P2gmp22GnCor9MzzFkUsA',
      true
    );
    
    await addAccountPage.verifyAccountAdded();
  });

  test('Should handle multiple exchange form visibility', async () => {
    await addAccountPage.clickAddAccount();
    await addAccountPage.verifyDialogOpened();

    await addAccountPage.fillOKXAccountDetails(
      'OKX Test Account',
      'test-okx-key',
      'test-okx-secret',
      'test-passphrase',
      true
    );
 
    await expect(addAccountPage.OKXAccountName).toBeVisible();
 
    await addAccountPage.closeDialog();
    await addAccountPage.clickAddAccount();

    await addAccountPage.fillBinanceCOINMAccountDetails(
      'Binance Test Account',
      'test-binance-key',
      'test-binance-secret',
      true
    );

    await expect(addAccountPage.binanceCOINMAccountName).toBeVisible();
  });

  test('Validate Add button is enabled after filling all fields', async () => {
    await addAccountPage.clickAddAccount();
    await addAccountPage.verifyDialogOpened();

    await addAccountPage.fillBinanceCOINMAccountDetails(
      'Test Account',
      'test-key',
      'test-secret',
      true
    );
 
    await expect(addAccountPage.addButton).toBeEnabled();
    
    await addAccountPage.clickAddButton();
    await addAccountPage.verifyAccountAdded();
  });

 
  test('Should toggle test mode correctly for each exchange', async () => {
    await addAccountPage.clickAddAccount();
    await addAccountPage.verifyDialogOpened();

    await addAccountPage.fillOKXAccountDetails(
      'OKX Production Account',
      'prod-api-key',
      'prod-secret-key',
      'prod-passphrase',
      false 
    );

    await expect(addAccountPage.testModeOKX).not.toBeChecked();
  });

  test('Should handle dialog close without saving', async () => {
    await addAccountPage.clickAddAccount();
    await addAccountPage.verifyDialogOpened();

    await addAccountPage.fillBinanceUSDMAccountDetails(
      'Incomplete Account',
      'incomplete-key',
      'incomplete-secret',
      true
    );

    await addAccountPage.closeDialog();

    await expect(addAccountPage.accountDialog).not.toBeVisible();
  }); 

   test('Modify existing account name', async () => {
 
    await addAccountPage.clickModifyButton('My Binance COIN-M Account');

    await addAccountPage.verifyModifyDialogOpened();

    await addAccountPage.modifyAccountName('Updated Binance COIN-M Account');

    await addAccountPage.verifyAccountModified();
  });
}); 

test.setTimeout(300000); 
test.describe('Login Tests', () => {
    test.beforeEach(async ({ page }) => {
       
        page.setDefaultTimeout(120000); 
    });
});

test.describe('Account Verification Tests', () => {
    let page: Page;
    let accountTablePage: AccountTablePage;
    let addAccountPage: AddAccount;

    test.beforeEach(async ({ browser }: { browser: Browser }) => {
         page = await browser.newPage();
     
        page.setDefaultTimeout(120000); 
        
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');

        await page.waitForLoadState('networkidle', { timeout: 180000 }); 
        await expect(page).toHaveURL(/gotrade/); 
       
        await page.goto('https://test1.gotrade.goquant.io/gotrade', { waitUntil: 'networkidle' });

        addAccountPage = new AddAccount(page);
        await addAccountPage.closeWelcomePopup();
        await addAccountPage.navigateToAccounts();
        await addAccountPage.navigateToAdmin(); 

         await page.waitForTimeout(2000);
        await page.waitForTimeout(1000);
 
        accountTablePage = new AccountTablePage(page);
        await accountTablePage.waitForTableToLoad();
    });

    test.afterEach(async () => {
         await page.close();
    });

    test('Verify table is displayed after account is added', async () => {
        const isVisible = await accountTablePage.isTableVisible();
        expect(isVisible).toBeTruthy();
    });

    test('Verify newly added account is displayed in the table', async () => {
        const accountName = 'OKXtestnet3';
        const isDisplayed = await accountTablePage.isAccountDisplayed(accountName);
        
        expect(isDisplayed).toBeTruthy();
    });

    test('Verify account data is correct after addition', async () => {
        const accountName = 'OKX Account - Neha';
        const rowIndex = await accountTablePage.findRowIndexByAccountName(accountName);
        
        expect(rowIndex).toBeGreaterThanOrEqual(0);
  
        const venue = await accountTablePage.getVenueName(rowIndex);
        expect(venue.trim()).toBe('OKX');
    
        const name = await accountTablePage.getAccountName(rowIndex);
        expect(name.trim()).toBe(accountName);
    
        const key = await accountTablePage.getAccountKey(rowIndex);
        expect(key).toContain('*****');
   
        const type = await accountTablePage.getAccountType(rowIndex);
        expect(type.trim()).toBe('Testnet');
    });

    test('Verify all expected accounts are displayed', async () => {
        const expectedAccounts = ['OKX Account - Neha','Binance USDS-M Account - Neha', 'Binance COIN-M Account - Neha'];
        
        for (const accountName of expectedAccounts) {
            const isDisplayed = await accountTablePage.isAccountDisplayed(accountName);
            expect(isDisplayed, `Account '${accountName}' should be displayed`).toBeTruthy();
        }
   
        const rowCount = await accountTablePage.getRowCount();
        expect(rowCount).toBe(expectedAccounts.length);
    });

    test('Verify status and actions are displayed for each row', async () => {
        const rowCount = await accountTablePage.getRowCount();
        
        for (let i = 0; i < rowCount; i++) {
            const statusVisible = await accountTablePage.isStatusVisible(i);
            expect(statusVisible, `Status should be visible for row ${i}`).toBeTruthy();
            
            const actionsVisible = await accountTablePage.areActionsVisible(i);
            expect(actionsVisible, `Actions should be visible for row ${i}`).toBeTruthy();
        }
    });

   
    test('Verify all accounts have masked API keys', async () => {
        const rowCount = await accountTablePage.getRowCount();
        
        for (let i = 0; i < rowCount; i++) {
            const accountKey = await accountTablePage.getAccountKey(i);
            expect(accountKey, `Row ${i} should have masked API key`).toContain('*****');
        }
    });

    test('Verify specific account data', async () => {
        const accountName = 'Binance COIN-M Account - Neha';
        await page.waitForTimeout(200000);
        const rowIndex = await accountTablePage.findRowIndexByAccountName(accountName);
        
        const expectedData = {
            venue: 'Binance COIN-M',
            accountName: 'Binance COINM',
            accountType: 'Testnet'
        };
        
        const verification = await accountTablePage.verifyRowData(rowIndex, expectedData);
        
        expect(verification.venue).toBeTruthy();
        expect(verification.accountName).toBeTruthy();
        expect(verification.accountKey).toBeTruthy();
        expect(verification.accountType).toBeTruthy();
    });

    test('Verify table contains all the accounts', async () => {
        const rowCount = await accountTablePage.getRowCount();
        expect(rowCount).toBe(3);
        
        const allAccountNames = await accountTablePage.getAllAccountNames();
        expect(allAccountNames).toHaveLength(6);
    });

    test('Verify account not found returns -1', async () => {
        const rowIndex = await accountTablePage.findRowIndexByAccountName('NonExistentAccount');
        expect(rowIndex).toBe(-1);
    });

  
    test('Verify getting account data by name throws error for non-existent account', async () => {
        await expect(async () => {
            await accountTablePage.getAccountDataByName('NonExistentAccount');
        }).rejects.toThrow("Account 'NonExistentAccount' not found in table");
    });

    test('Verify complete row data structure for all accounts', async () => {
        const rowCount = await accountTablePage.getRowCount();
        
        for (let i = 0; i < rowCount; i++) {
          await page.waitForTimeout(200000);
            const rowData = await accountTablePage.getAccountRowData(i);
  
            expect(rowData.venue).toBeTruthy();
            expect(rowData.accountName).toBeTruthy();
            expect(rowData.accountKey).toBeTruthy();
            expect(rowData.accountType).toBeTruthy();
        }
    });

    test('Verify account table row data types', async () => {
        const accountName = 'Binance USDS-M Account - Neha';
        await page.waitForTimeout(200000);
        const rowData = await accountTablePage.getAccountDataByName(accountName);
 
        expect(typeof rowData.venue).toBe('string');
        expect(typeof rowData.accountName).toBe('string');
        expect(typeof rowData.accountKey).toBe('string');
        expect(typeof rowData.accountType).toBe('string');
    });
}); 

test.describe('Trading Tests', () => {
  let tradingPage: TradingPage;
  let limitTradePage: LimitTradePage;
  let twapTradePage: TWAPTradePage; 
  let marketEdgeTradePage: MarketEdgeTradePage;
  let limitEdgeTradePage: LimitEdgeTradePage;
  let twapEdgeTradePage: TWAPEdgeTradePage;
  let page: Page;

  test.beforeEach(async ({ browser }) => {

    test.setTimeout(300000); 

    page = await browser.newPage();
    page.setDefaultTimeout(120000); 
 
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');
 
    await page.waitForLoadState('networkidle', { timeout: 180000 }); 
        await expect(page).toHaveURL(/gotrade/); 
        await page.goto('https://test1.gotrade.goquant.io/gotrade', { waitUntil: 'networkidle' });

    const addAccountPage = new AddAccount(page);
    await addAccountPage.closeWelcomePopup();
    
    tradingPage = new TradingPage(page);
    limitTradePage = new LimitTradePage(page);
    twapTradePage = new TWAPTradePage(page);
    marketEdgeTradePage = new MarketEdgeTradePage(page);
    limitEdgeTradePage = new LimitEdgeTradePage(page);
    twapEdgeTradePage = new TWAPEdgeTradePage(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

 test('Execute a buy trade for Market Algo', async () => {
    await tradingPage.performTrade({
      exchange: 'OKX',
      marketType: 'Market',
      symbol: 'DOT-EUR',
      quantity: '10',
      side: 'buy'
    });

    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });

   test('Execute a sell trade for Market Algo', async () => {
    await tradingPage.performTrade({
      exchange: 'OKX',
      marketType: 'Market',
      symbol: 'DOT-EUR',
      quantity: '5',
      side: 'sell'
    }); 
  
    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });

  test('Execute a buy trade for Limit Algo', async () => {
    await limitTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'Limit',
      symbol: 'BTC-AUD',
      quantity: '20',
      price: '495',
      side: 'buy'
    });
 
    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });

test('Execute a sell trade for Limit Algo', async () => {
    await limitTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'Limit',
      symbol: 'BTC-AUD',
      quantity: '15',
      price: '500',
      side: 'sell'
    });

    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  }); 
  
test('Execute a buy trade for TWAP Algo', async () => {
    await twapTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'TWAP',
      symbol: 'BTC-USD',
      quantity: '0.0002',
      duration: '10',
      interval: '2',
      side: 'buy'
    });

    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });


  test('Execute a sell trade for TWAP Algo', async () => {
    await twapTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'TWAP',
      symbol: 'BTC-USD',
      quantity: '0.0002',
      duration: '10',
      interval: '2',
      side: 'sell'
    });
 
    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });
 
 test('Execute a buy trade for Market Edge Algo', async () => {
    await marketEdgeTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'Market Edge',
      symbol: 'BTC-USD',
      quantity: '0.000000000000000000000000000002',
      duration: '10',
      decay: '2',
      side: 'buy'
    });
  
    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });


  test('Execute a sell trade for Market Edge Algo', async () => {
    await marketEdgeTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'Market Edge',
      symbol: 'BTC-USD',
      quantity: '0.0002',
      duration: '10',
      decay: '2',
      side: 'sell'
    });
    
     await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });
 

   test('Execute a buy trade for Limit Edge Algo', async () => {
    await limitEdgeTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'Limit Edge',
      symbol: 'BTC-USD',
      quantity: '0.0001',
      duration: '2',
      price: '100',
      threshold: '2',
      side: 'buy'
    });
    
    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });


  test('Execute a sell trade for Limit Edge Algo', async () => {
    await limitEdgeTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'Market Edge',
      symbol: 'BTC-USD',
      quantity: '0.0001',
      duration: '2',
      price: '100',
      threshold: '2',
      side: 'sell'
    });
 
    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });
 

  test('Execute a buy trade for TWAP Edge Algo', async () => {
    await twapEdgeTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'Limit Edge',
      symbol: 'BTC-USD',
      quantity: '0.004',
      duration: '20',
      interval: '2',
      decay: '1',
      side: 'buy'
    });
  
    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });


  test('Execute a sell trade for TWAP Edge Algo', async () => {
    await twapEdgeTradePage.performTrade({
      exchange: 'OKX',
      marketType: 'Market Edge',
      symbol: 'BTC-USD',
      quantity: '0.004',
      duration: '20',
      interval: '2',
      decay: '1',
      side: 'sell'
    });
 
    await expect(page.locator("//li[@class='bg-gotradeSurface [&_button]:bg-gotradeSurface text-white text-sm py-3.5 px-3 gap-0 w-[17.8rem] ']")).toBeVisible();
  });

  
   test('Get current NAV', async () => {
    const nav = await tradingPage.getNetAssetValue();
    console.log(`Current NAV: ${nav}`);
    expect(nav).toBeTruthy();
  });

 
  test('Verify trading page elements are visible', async () => {
    await expect(tradingPage.exchangeSearchButton).toBeVisible();
    await expect(tradingPage.quantityInput).toBeVisible();
    await expect(tradingPage.buyButton).toBeVisible();
    await expect(tradingPage.sellButton).toBeVisible();
    await expect(tradingPage.tradeButton).toBeVisible();
  });
 
});  

interface OrderDetails {
  venue: string;
  account: string;
  algorithmId: string;
  status: string;
  type: string;
  symbol: string;
  dateTime: string;
  side: string;
  avgFillPrice: string;
  fillQuantity: string;
  fillValue: string;
  fillProgress: string;
}

test.describe('Working Orders Tests', () => {
  let page: Page;
  let workingOrdersPage: WorkingOrdersPage;

  test.beforeEach(async ({ browser }: { browser: Browser }) => {
     test.setTimeout(300000); 
 
    page = await browser.newPage();

    page.setDefaultTimeout(120000); 
    const loginPage = new LoginPage(page);
 
    await loginPage.goto();

    await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');
 
    await page.waitForLoadState('networkidle', { timeout: 180000 }); 
    await expect(page).toHaveURL(/gotrade/); 

    await page.goto('https://test1.gotrade.goquant.io/gotrade', { waitUntil: 'networkidle' });
  
    const addAccountPage = new AddAccount(page);
    await addAccountPage.closeWelcomePopup();
 
    workingOrdersPage = new WorkingOrdersPage(page);
 
    await workingOrdersPage.navigateToWorkingOrders();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Verify order appears in Working Orders table after placement', async () => {

    const testAlgoId: string = '318_001'; 
    
    const expectedOrderData = {
      venue: 'Binance COINM',
      account: 'Binance COINM',
      algorithmId: '318_001',
      status: 'In Progress',
      type: 'Market',
      symbol: 'BTC-USD_PERP',
      side: 'Buy',
      fillQuantity: '100 Contracts',
      fillProgress: '0%'
    };

    await workingOrdersPage.waitForOrderToAppear(testAlgoId);

    const isPresent: boolean = await workingOrdersPage.isOrderPresent(testAlgoId);
    expect(isPresent).toBeTruthy();

    const orderDetails: OrderDetails = await workingOrdersPage.getOrderDetails(testAlgoId);

    expect(orderDetails.venue).toContain(expectedOrderData.venue);
    expect(orderDetails.account).toContain(expectedOrderData.account);
    expect(orderDetails.algorithmId).toContain(expectedOrderData.algorithmId);
    expect(orderDetails.status).toContain(expectedOrderData.status);
    expect(orderDetails.type).toContain(expectedOrderData.type);
    expect(orderDetails.symbol).toContain(expectedOrderData.symbol);
    expect(orderDetails.side).toContain(expectedOrderData.side);
    expect(orderDetails.fillQuantity).toContain(expectedOrderData.fillQuantity);
    expect(orderDetails.fillProgress).toContain(expectedOrderData.fillProgress);

    expect(orderDetails.dateTime).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  test('Verify all table columns are present', async () => {
    await workingOrdersPage.verifyTableColumns();

    await expect(workingOrdersPage.venueColumn).toBeVisible();
    await expect(workingOrdersPage.accountColumn).toBeVisible();
    await expect(workingOrdersPage.algorithmIdColumn).toBeVisible();
    await expect(workingOrdersPage.statusColumn).toBeVisible();
    await expect(workingOrdersPage.typeColumn).toBeVisible();
    await expect(workingOrdersPage.symbolColumn).toBeVisible();
    await expect(workingOrdersPage.dateTimeColumn).toBeVisible();
    await expect(workingOrdersPage.sideColumn).toBeVisible();
    await expect(workingOrdersPage.avgFillPriceColumn).toBeVisible();
    await expect(workingOrdersPage.fillQuantityColumn).toBeVisible();
    await expect(workingOrdersPage.fillValueColumn).toBeVisible();
    await expect(workingOrdersPage.fillProgressColumn).toBeVisible();
    await expect(workingOrdersPage.actionsColumn).toBeVisible();
  });

  test('Verify user can cancel an order', async () => {
    const testAlgoId: string = '318_001';

    await workingOrdersPage.waitForOrderToAppear(testAlgoId);

    const initialCount: number = await workingOrdersPage.getOrderCount();

    await workingOrdersPage.cancelOrder(testAlgoId);

    await workingOrdersPage.waitForOrderToDisappear(testAlgoId);

    const isPresent: boolean = await workingOrdersPage.isOrderPresent(testAlgoId);
    expect(isPresent).toBeFalsy();

    const finalCount: number = await workingOrdersPage.getOrderCount();
    expect(finalCount).toBe(initialCount - 1);
  });

  test('Verify user can modify an order', async () => {
    const testAlgoId: string = '318_001';

    await workingOrdersPage.waitForOrderToAppear(testAlgoId);

    await workingOrdersPage.modifyOrder(testAlgoId);

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 10000 });
  });

  test('Verify multiple orders display correctly', async () => {
    interface ExpectedOrder {
      algoId: string;
      symbol: string;
      venue: string;
    }

    const expectedOrders: ExpectedOrder[] = [
      { algoId: '318_001', symbol: 'BTC-USD_PERP', venue: 'Binance COINM' },
      { algoId: '892_314', symbol: 'BTC-AUD', venue: 'OKXestnet3' },
      { algoId: '980_134', symbol: 'BTC-USD', venue: 'OKXestnet3' }
    ];

    for (const order of expectedOrders) {
      await workingOrdersPage.waitForOrderToAppear(order.algoId);
      
      const isPresent: boolean = await workingOrdersPage.isOrderPresent(order.algoId);
      expect(isPresent).toBeTruthy();

      const details: OrderDetails = await workingOrdersPage.getOrderDetails(order.algoId);
      expect(details.symbol).toContain(order.symbol);
      expect(details.venue).toContain(order.venue);
    }

    const orderCount: number = await workingOrdersPage.getOrderCount();
    expect(orderCount).toBeGreaterThanOrEqual(expectedOrders.length);
  });

  test('Verify order status updates', async () => {
    const testAlgoId: string = '318_001';

    await workingOrdersPage.waitForOrderToAppear(testAlgoId);

    const initialDetails: OrderDetails = await workingOrdersPage.getOrderDetails(testAlgoId);
    expect(initialDetails.status).toContain('In Progress');

    await page.waitForTimeout(2000);

    const updatedDetails: OrderDetails = await workingOrdersPage.getOrderDetails(testAlgoId);
    expect(updatedDetails.status).toBeTruthy();
    expect(updatedDetails.status.length).toBeGreaterThan(0);
  });

  test('Verify fill progress updates correctly', async () => {
    const testAlgoId: string = '318_001';

    await workingOrdersPage.waitForOrderToAppear(testAlgoId);

    const details: OrderDetails = await workingOrdersPage.getOrderDetails(testAlgoId);
  
    expect(details.fillProgress).toMatch(/\d+%/);
     if (details.fillProgress === '0%') {
      expect(details.fillValue).toContain('0');
    }
  });

  test('Verify Side column displays Buy/Sell correctly', async () => {
    const orders: OrderDetails[] = await workingOrdersPage.getAllOrders();

    expect(orders.length).toBeGreaterThan(0);

    for (const order of orders) {
      expect(['Buy', 'Sell']).toContain(order.side);
    }
  });

  test('Verify actions column has Cancel button', async () => {
    const testAlgoId: string = '318_001';

    await workingOrdersPage.waitForOrderToAppear(testAlgoId);

    const cancelBtn = workingOrdersPage.getCancelButton(testAlgoId);

    await expect(cancelBtn).toBeVisible();
    await expect(cancelBtn).toBeEnabled();
  });

  test('Verify quantity and instrument type display', async () => {
    const perpetualOrder: string = '318_001';
    const spotOrder: string = '892_314';
    await workingOrdersPage.waitForOrderToAppear(perpetualOrder);
    const perpDetails: OrderDetails = await workingOrdersPage.getOrderDetails(perpetualOrder);
    expect(perpDetails.fillQuantity).toMatch(/\d+ Contracts/);
    await workingOrdersPage.waitForOrderToAppear(spotOrder);
    const spotDetails: OrderDetails = await workingOrdersPage.getOrderDetails(spotOrder);
    expect(spotDetails.fillQuantity).toMatch(/\d+/);
  });

  test('Verify Cancel Working Orders button functionality', async () => {
    const initialCount: number = await workingOrdersPage.getOrderCount();
    expect(initialCount).toBeGreaterThan(0);
    await workingOrdersPage.clickCancelWorkingOrders();

    await page.waitForTimeout(2000);

  });

  test('Verify order row details are consistent', async () => {
    const testAlgoId: string = '318_001';

    await workingOrdersPage.waitForOrderToAppear(testAlgoId);

    const details: OrderDetails = await workingOrdersPage.getOrderDetails(testAlgoId);
    expect(details.venue).toBeTruthy();
    expect(details.account).toBeTruthy();
    expect(details.algorithmId).toBe(testAlgoId);
    expect(details.status).toBeTruthy();
    expect(details.type).toBeTruthy();
    expect(details.symbol).toBeTruthy();
    expect(details.dateTime).toBeTruthy();
    expect(details.side).toBeTruthy();
    expect(details.fillProgress).toBeTruthy();
  });

  test('Verify table updates after order cancellation', async () => {
    const orders: OrderDetails[] = await workingOrdersPage.getAllOrders();

    if (orders.length === 0) {
      test.skip();
      return;
    }

    const firstOrder = orders[0];
    const algoId = firstOrder.algorithmId;

    await workingOrdersPage.cancelOrder(algoId);
    await workingOrdersPage.waitForOrderToDisappear(algoId, 15000);

    const isStillPresent: boolean = await workingOrdersPage.isOrderPresent(algoId);
    expect(isStillPresent).toBeFalsy();
  });

  test('Verify navigation between tabs', async () => {
 
    await workingOrdersPage.navigateToOrderHistory();
    await expect(workingOrdersPage.orderHistoryTab).toHaveAttribute('aria-selected', 'true');
    await workingOrdersPage.navigateToWorkingOrders();
    await expect(workingOrdersPage.workingOrdersTab).toHaveAttribute('aria-selected', 'true');
    await workingOrdersPage.navigateToOpenPositions();
    await expect(workingOrdersPage.openPositionsTab).toHaveAttribute('aria-selected', 'true');
    await workingOrdersPage.navigateToAssets();
    await expect(workingOrdersPage.assetsTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Verify order search by symbol', async () => {
    const testSymbol: string = 'BTC-USD_PERP';

    const row = workingOrdersPage.getOrderRowBySymbol(testSymbol);
    await expect(row).toBeVisible();

    const rowText = await row.textContent();
    expect(rowText).toContain(testSymbol);
  });

});

 test.describe('Order History Tests', () => {
  let orderHistoryPage: OrderHistoryPage;
  let page: Page;

  test.beforeEach(async ({ browser }: { browser: Browser }) => {
     test.setTimeout(300000); 
 
    page = await browser.newPage();
 
    page.setDefaultTimeout(120000); 
 
    const loginPage = new LoginPage(page);
     await loginPage.goto();

    await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');
 
    await page.waitForLoadState('networkidle', { timeout: 180000 }); 
    await expect(page).toHaveURL(/gotrade/); 
    await page.goto('https://test1.gotrade.goquant.io/gotrade', { waitUntil: 'networkidle' });
    const addAccountPage = new AddAccount(page);
    await addAccountPage.closeWelcomePopup();
     orderHistoryPage = new OrderHistoryPage(page);
    await orderHistoryPage.navigateToOrderHistory();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Verify all table columns are present', async () => {
    await orderHistoryPage.verifyTableColumns();

    await expect(orderHistoryPage.venueColumn).toBeVisible();
    await expect(orderHistoryPage.accountColumn).toBeVisible();
    await expect(orderHistoryPage.algorithmIdColumn).toBeVisible();
    await expect(orderHistoryPage.statusColumn).toBeVisible();
    await expect(orderHistoryPage.typeColumn).toBeVisible();
    await expect(orderHistoryPage.symbolColumn).toBeVisible();
    await expect(orderHistoryPage.dateTimeColumn).toBeVisible();
    await expect(orderHistoryPage.sideColumn).toBeVisible();
    await expect(orderHistoryPage.avgFillPriceColumn).toBeVisible();
    await expect(orderHistoryPage.fillQuantityColumn).toBeVisible();
    await expect(orderHistoryPage.fillValueColumn).toBeVisible();
    await expect(orderHistoryPage.fillProgressColumn).toBeVisible();
    await expect(orderHistoryPage.actionsColumn).toBeVisible();
  });

  test('Verify error status order displays correctly', async () => {
    const errorAlgoId = '669_183';
    
    await orderHistoryPage.waitForOrderToAppear(errorAlgoId);
    
    const orderDetails = await orderHistoryPage.getOrderDetails(errorAlgoId);

    expect(orderDetails.venue).toContain('DashKit5 OKX');
    expect(orderDetails.account).toContain('DashKit5 OKX');
    expect(orderDetails.algorithmId).toContain('669_183');
    expect(orderDetails.status).toContain('Error');
    expect(orderDetails.type).toContain('Market');
    expect(orderDetails.symbol).toContain('DOT-USD');
    expect(orderDetails.side).toContain('Buy');
    expect(orderDetails.fillQuantity).toContain('10 DOT');
    expect(orderDetails.fillValue).toContain('0 USD');
    expect(orderDetails.fillProgress).toContain('0%');
    expect(orderDetails.action).toContain('Order Rejected');
 
    expect(orderDetails.dateTime).toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(orderDetails.dateTime).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  test('Verify completed order displays correctly', async () => {
    const completedAlgoId = '400_188';
    
    await orderHistoryPage.waitForOrderToAppear(completedAlgoId);
    
    const orderDetails = await orderHistoryPage.getOrderDetails(completedAlgoId);

    expect(orderDetails.venue).toContain('OKXestnet3');
    expect(orderDetails.algorithmId).toContain('400_188');
    expect(orderDetails.status).toContain('Completed');
    expect(orderDetails.type).toContain('TWAP Edge');
    expect(orderDetails.symbol).toContain('BTC-USD');
    expect(orderDetails.side).toContain('Buy');
    expect(orderDetails.fillQuantity).toContain('0.020000 BTC');
    expect(orderDetails.fillValue).toContain('0 USD');
    expect(orderDetails.fillProgress).toContain('0%');
  });

  test('Verify cancelled order displays correctly', async () => {
    const cancelledAlgoId = '695_034';
    
    await orderHistoryPage.waitForOrderToAppear(cancelledAlgoId);
    
    const orderDetails = await orderHistoryPage.getOrderDetails(cancelledAlgoId);
    expect(orderDetails.venue).toContain('OKXestnet3');
    expect(orderDetails.algorithmId).toContain('695_034');
    expect(orderDetails.status).toContain('Cancelled');
    expect(orderDetails.type).toContain('Limit Edge');
    expect(orderDetails.symbol).toContain('BTC-USD');
    expect(orderDetails.side).toContain('Buy');
    expect(orderDetails.fillQuantity).toContain('0.010000 BTC');
    expect(orderDetails.fillProgress).toContain('0%');
  });

  test('Verify In progress order displays correctly', async () => {
    const inProgressAlgoId = '318_001';
    
    await orderHistoryPage.waitForOrderToAppear(inProgressAlgoId);
    
    const orderDetails = await orderHistoryPage.getOrderDetails(inProgressAlgoId);
 
    expect(orderDetails.venue).toContain('Binance COINM');
    expect(orderDetails.algorithmId).toContain('318_001');
    expect(orderDetails.status).toContain('In Progress');
    expect(orderDetails.type).toContain('Market');
    expect(orderDetails.symbol).toContain('BTC-USD_PERP');
    expect(orderDetails.side).toContain('Buy');
    expect(orderDetails.fillQuantity).toContain('100 Contracts');
    expect(orderDetails.fillProgress).toContain('0%');
  });

    test('Verify all orders have valid data', async () => {
    const allOrders = await orderHistoryPage.getAllOrders();
    
    expect(allOrders.length).toBeGreaterThan(0);
    
    allOrders.forEach(order => {
 
      expect(order.venue).toBeTruthy();
      expect(order.account).toBeTruthy();
      expect(order.algorithmId).toBeTruthy();
      expect(order.status).toBeTruthy();
      expect(order.type).toBeTruthy();
      expect(order.symbol).toBeTruthy();
      expect(order.dateTime).toBeTruthy();
      expect(order.side).toBeTruthy();
 
      expect(order.dateTime).toMatch(/\d{4}-\d{2}-\d{2}/);
 
      expect(['Buy', 'Sell'].some(side => order.side.includes(side))).toBeTruthy();

      expect(order.fillProgress).toMatch(/\d+%/);
    });
  });


  test('Verify different order types display correctly', async () => {
    const allOrders = await orderHistoryPage.getAllOrders();
    
    const orderTypes = new Set(allOrders.map(order => order.type));
      expect(orderTypes.size).toBeGreaterThan(1);

    const expectedTypes = ['Market', 'TWAP Edge', 'Limit Edge'];
    expectedTypes.forEach(type => {
      const hasType = allOrders.some(order => order.type.includes(type));
      expect(hasType).toBeTruthy();
    });
  });

  test('Verify order status changes are reflected', async () => {
    const testAlgoId = '318_001';
  
    const initialStatus = await orderHistoryPage.getOrderStatus(testAlgoId);
    expect(initialStatus).toContain('In Progress');
    const statusVerified = await orderHistoryPage.verifyOrderStatus(testAlgoId, 'In Progress', 3, 1000);
    expect(statusVerified).toBeTruthy();
  });

  test('Verify order is present by algorithm ID', async () => {
    const algoId = '669_183';
    const isPresent = await orderHistoryPage.isOrderPresent(algoId);
    expect(isPresent).toBeTruthy();
  });

  test('Verify order count is greater than zero', async () => {
    const orderCount = await orderHistoryPage.getOrderCount();
    expect(orderCount).toBeGreaterThan(0);
  });

  test('Verify order data completeness', async () => {
    const algoId = '669_183';
    const isComplete = await orderHistoryPage.validateOrderDataCompleteness(algoId);
    expect(isComplete).toBeTruthy();
  });

  test('Verify order count by status', async () => {
    const errorCount = await orderHistoryPage.getOrderCountByStatus('Error');
    const completedCount = await orderHistoryPage.getOrderCountByStatus('Completed');
    
    expect(errorCount).toBeGreaterThan(0);
    expect(completedCount).toBeGreaterThan(0);
  });


  test('Verify navigation between tabs', async () => {
  
    await orderHistoryPage.navigateToWorkingOrders();
    await expect(orderHistoryPage.workingOrdersTab).toBeVisible();
 
    await orderHistoryPage.navigateToOrderHistory();
    await expect(orderHistoryPage.orderHistoryTab).toBeVisible();
  
    await orderHistoryPage.navigateToOpenPositions();
    await expect(orderHistoryPage.openPositionsTab).toBeVisible();

    await orderHistoryPage.navigateToAssets();
    await expect(orderHistoryPage.assetsTab).toBeVisible();
 
    await orderHistoryPage.navigateToOrderHistory();
  });

  test('Verify order rejected modal functionality', async () => {
    const errorAlgoId = '669_183';
    
    await orderHistoryPage.waitForOrderToAppear(errorAlgoId);
    await orderHistoryPage.clickOrderRejected(errorAlgoId);
    const isModalVisible = await orderHistoryPage.isRejectionModalVisible();
    expect(isModalVisible).toBeTruthy();
 
    const reason = await orderHistoryPage.getRejectionReason();
    expect(reason).toBeTruthy();
    await orderHistoryPage.closeRejectionModal();
    await expect(orderHistoryPage.orderRejectedModal).not.toBeVisible();
  });


  test('Verify order row retrieval methods', async () => {
    const algoId = '669_183';
    const status = 'Error';
    const symbol = 'DOT';
    
    const rowByAlgoId = orderHistoryPage.getOrderRowByAlgoId(algoId);
    const rowByStatus = orderHistoryPage.getOrderRowByStatus(status);
    const rowBySymbol = orderHistoryPage.getOrderRowBySymbol(symbol);
    
    await expect(rowByAlgoId).toBeVisible();
    await expect(rowByStatus).toBeVisible();
    await expect(rowBySymbol).toBeVisible();
  });
});

test.describe('Keyboard Shortcuts Tests', () => {
  let page: Page;
  let settingsPage: SettingsPage;
  let addAccountPage: AddAccount;

  test.beforeEach(async ({ page }) => {

    page.setDefaultTimeout(120000);
 
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');
    await page.waitForLoadState('networkidle', { timeout: 180000 });
    await expect(page).toHaveURL(/gotrade/);
    await page.goto('https://test1.gotrade.goquant.io/gotrade', { waitUntil: 'networkidle' });

     addAccountPage = new AddAccount(page);
    settingsPage = new SettingsPage(page);

    await addAccountPage.closeWelcomePopup();
     await settingsPage.navigateToAccounts();
    await settingsPage.navigateToSettings();
    await settingsPage.clickShortcutsTab();
    await page.waitForTimeout(2000);
  });

 
  test('Verify keyboard shortcuts toggle enables successfully', async () => {

    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.verifyToggleMessage();
  });

  test('Verify Navigation shortcuts are visible', async () => {
    await settingsPage.enableKeyboardShortcuts();
 
    await settingsPage.verifyShortcutVisibleXPath('GoOps');
    await settingsPage.verifyShortcutVisibleXPath('GoRisk');
    await settingsPage.verifyShortcutVisibleXPath('GoCredit');
    await settingsPage.verifyShortcutVisibleXPath('GoMarket');
    await settingsPage.verifyShortcutVisibleXPath('Application Settings');
    await settingsPage.verifyShortcutVisibleXPath('Admin');
  });

  test('Verify Trading shortcuts are visible', async () => {
    await settingsPage.enableKeyboardShortcuts();

    await settingsPage.clickTradingTab();
     await settingsPage.verifyShortcutVisibleXPath('GoTrade and start a new trade');
    await settingsPage.verifyShortcutVisibleXPath('Post Trade Analytics');
  });

  test('Test GoOps navigation using keyboard shortcut Alt+J', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickNavigationTab();
    await settingsPage.pressGoOpsShortcut();
     await settingsPage.verifyGoOpsNavigation();
  });

  test('Test GoRisk navigation using keyboard shortcut Alt+R', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickNavigationTab();
    await settingsPage.pressGoRiskShortcut();
     await settingsPage.verifyGoRiskNavigation();
  });

  test('Test GoCredit navigation using keyboard shortcut Alt+C', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickNavigationTab();
     await settingsPage.pressGoCreditShortcut();
    await settingsPage.verifyGoCreditNavigation();
  });

  test('Test GoMarket navigation using keyboard shortcut Alt+M', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickNavigationTab();
     await settingsPage.pressGoMarketShortcut();
    await settingsPage.verifyGoMarketNavigation();
  });

  test('Test Application Settings navigation using keyboard shortcut Alt+S', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickNavigationTab();
     await settingsPage.pressApplicationSettingsShortcut();
     await settingsPage.verifyApplicationSettingsNavigation();
  });

  test('Test Admin navigation using keyboard shortcut Alt+A', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickNavigationTab();
    await settingsPage.pressAdminShortcut();
     await settingsPage.verifyAdminNavigation();
  });

  test('Test GoTrade navigation using keyboard shortcut Alt+T', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickTradingTab();
    await settingsPage.pressGoTradeShortcut();
    await settingsPage.verifyGoTradeNavigation();
  });

  test('Test Post Trade Analytics navigation using keyboard shortcut Alt+A', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickTradingTab();
    await settingsPage.pressPostTradeAnalyticsShortcut();
    await settingsPage.verifyPostTradeAnalyticsNavigation();
  });

  test('Test multiple shortcuts in sequence', async () => {
    await settingsPage.enableKeyboardShortcuts();
    await settingsPage.clickNavigationTab();
    await settingsPage.pressGoOpsShortcut();
    await settingsPage.verifyGoOpsNavigation();
    await settingsPage.navigateToSettings();
    await settingsPage.clickShortcutsTab();
    await settingsPage.clickTradingTab();
    await settingsPage.pressGoTradeShortcut();
    await settingsPage.verifyGoTradeNavigation();
  }); 
});
 
test.describe('GoMarket Chart Testing', () => {
  let goTradePage: GoTradePage;
  let addAccountPage: AddAccount;

  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(120000); 
 
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user6@goquant.io', '60Re3G9KvvFl4Ihegxpi');
    await page.waitForLoadState('networkidle', { timeout: 180000 });
    await expect(page).toHaveURL(/gotrade/);

    await page.goto('https://test1.gotrade.goquant.io/gotrade', { waitUntil: 'networkidle' });
    addAccountPage = new AddAccount(page);
    
    await addAccountPage.closeWelcomePopup();
    goTradePage = new GoTradePage(page);
    await goTradePage.navigate();
  });

  test.describe('Page Load and Navigation', () => {
    test('Verify trading page loads successfully', async ({ page }) => {
      const isLoaded = await goTradePage.verifyPageLoaded();
      expect(isLoaded).toBeTruthy();
      expect(page.url()).toContain('gomarket');
    });

 });

    test('Toggle discovery mode', async () => {
      await goTradePage.toggleDiscoveryMode();
      await goTradePage.waitForTimeout(500);
      await goTradePage.toggleDiscoveryMode();
    });

    test('Select different exchange', async () => {
      await goTradePage.selectExchange('OKX');
      await goTradePage.waitForTimeout(1000);
    });

    test('Search for symbol', async () => {
      await goTradePage.searchSymbol('ETH');
      await goTradePage.waitForTimeout(500);
    });
  

  test.describe('Chart Display and Controls', () => {
    test('Verify chart loads and is visible', async () => {
      const chartDisplayed = await goTradePage.verifyChartDisplayed();
      expect(chartDisplayed).toBeTruthy();
    });
});
    test('Switch to Line chart type', async () => {
      await goTradePage.waitForChartToLoad();
      await goTradePage.selectChartType('Line');
      await expect(goTradePage.lineButton).toBeVisible();
    });

    test('Switch to Candle chart type', async () => {
      await goTradePage.waitForChartToLoad();
      await goTradePage.selectChartType('Candle');
      await expect(goTradePage.candleButton).toBeVisible();
    });

    test('Change timeframe to 1m', async () => {
      await goTradePage.waitForChartToLoad();
      await goTradePage.selectTimeframe('1m');
      await expect(goTradePage.timeframe1m).toBeVisible();
    });

    test('Change timeframe to 5m', async () => {
      await goTradePage.waitForChartToLoad();
      await goTradePage.selectTimeframe('5m');
      await expect(goTradePage.timeframe5m).toBeVisible();
    });

    test('Change timeframe to 15m', async () => {
      await goTradePage.waitForChartToLoad();
      await goTradePage.selectTimeframe('15m');
      await expect(goTradePage.timeframe15m).toBeVisible();
    });

    test('Change timeframe to 1h', async () => {
      await goTradePage.waitForChartToLoad();
      await goTradePage.selectTimeframe('1h');
      await expect(goTradePage.timeframe1h).toBeVisible();
    });

    test('Switch to Trades tab', async () => {
      await goTradePage.waitForChartToLoad();
      await goTradePage.switchToTradesTab();
      await expect(goTradePage.tradesTab).toBeVisible();
    });

    test('Switch to Price tab', async () => {
      await goTradePage.waitForChartToLoad();
      await goTradePage.switchToTradesTab();
      await goTradePage.switchToPriceTab();
      await expect(goTradePage.priceTab).toBeEnabled();
    });

    test('Verify moving averages are displayed', async () => {
      await goTradePage.waitForChartToLoad();
      const maVisible = await goTradePage.verifyMovingAverages();
      expect(maVisible).toBeTruthy();
    });

    test('Verify current price is displayed', async () => {
      await goTradePage.waitForChartToLoad();
      const price = await goTradePage.getCurrentPrice();
      expect(price).toBeTruthy();
      console.log('Current BTC Price:', price);
    });
  

     test('Verify BCHUSDT symbol is visible', async () => {
      await expect(goTradePage.bchUsdtSymbol).toBeVisible();
    });

    test('Verify ETCUSDT symbol is visible', async () => {
      await expect(goTradePage.etcUsdtSymbol).toBeVisible();
    });

    test('Verify TRXUSD_PERP symbol is visible', async () => {
      await expect(goTradePage.trxUsdPerpSymbol).toBeVisible();
    });

    test('Get all visible symbols', async () => {
      const symbols = await goTradePage.getVisibleSymbols();
      expect(symbols.length).toBeGreaterThan(0);
      console.log('Visible symbols:', symbols);
    });

    test('Verify symbol comparison functionality', async () => {
      const hasSymbols = await goTradePage.verifySymbolComparison();
      expect(hasSymbols).toBeTruthy();
    });

    test('Remove a symbol from comparison', async () => {
      const symbolsBefore = await goTradePage.getVisibleSymbols();
      if (symbolsBefore.length > 0) {
        await goTradePage.removeSymbol(symbolsBefore[0]);
        const symbolsAfter = await goTradePage.getVisibleSymbols();
        expect(symbolsAfter.length).toBeLessThanOrEqual(symbolsBefore.length);
      }
    });
  

     test.afterEach(async () => {
      const isVisible = await goTradePage.isModalVisible();
      if (isVisible) {
        await goTradePage.closeModal();
      }
    });

     test('Close modal with close button', async () => {
      await goTradePage.closeModal();
      const isVisible = await goTradePage.isModalVisible();
      expect(isVisible).toBeFalsy();
    });
  
 
    test('Complete trading setup workflow', async () => {

      await goTradePage.waitForChartToLoad();
      await goTradePage.selectTimeframe('15m');
      await goTradePage.selectChartType('Line');
       await goTradePage.openAddSymbolModal();
      await goTradePage.selectExchangeTab('binancec');
      await goTradePage.searchSymbolInModal('SOL');
      await goTradePage.closeModal();
      const chartVisible = await goTradePage.isChartVisible();
      expect(chartVisible).toBeTruthy();
    });

    
  test.describe('Error Handling and Edge Cases', () => {
    test(' Handle rapid timeframe changes', async () => {
      await goTradePage.waitForChartToLoad();
      
      for (const timeframe of ['1m', '5m', '15m', '1h'] as const) {
        await goTradePage.selectTimeframe(timeframe);
      }
      
      const chartVisible = await goTradePage.isChartVisible();
      expect(chartVisible).toBeTruthy();
    });
});

    test('Handle rapid chart type switching', async () => {
      await goTradePage.waitForChartToLoad();
      
      await goTradePage.selectChartType('Line');
      await goTradePage.selectChartType('Candle');
      await goTradePage.selectChartType('Line');
      await goTradePage.selectChartType('Candle');
      
      const chartVisible = await goTradePage.isChartVisible();
      expect(chartVisible).toBeTruthy();
    });

 
  test.describe('Tab Navigation', () => {
    test('Switch between Price and Trades tabs multiple times', async () => {
      await goTradePage.waitForChartToLoad();
      
      await goTradePage.switchToTradesTab();
      await goTradePage.switchToPriceTab();
      await goTradePage.switchToTradesTab();
      await goTradePage.switchToPriceTab();
      
      await expect(goTradePage.priceTab).toBeVisible();
    });
  });


  test.describe('Price Monitoring', () => {
    test('Monitor price updates over time', async () => {
      await goTradePage.waitForChartToLoad();
      
      const price1 = await goTradePage.getCurrentPrice();
      await goTradePage.waitForTimeout(3000);
      const price2 = await goTradePage.getCurrentPrice();
      
      expect(price1).toBeTruthy();
      expect(price2).toBeTruthy();
      
      console.log('Price at T0:', price1);
      console.log('Price at T+3s:', price2);
    });
    });

  test.describe('Symbol Search Functionality', () => {
    test('Search for BTC symbols in modal', async () => {
      await goTradePage.openAddSymbolModal();
      await goTradePage.selectExchangeTab('binancec');
      await goTradePage.searchSymbolInModal('BTC');
      
      const symbols = await goTradePage.getAvailableSymbolsInModal();
      expect(symbols.length).toBeGreaterThan(0);
      
      await goTradePage.closeModal();
    });
    });

     test('Clear search and verify all symbols return', async () => {
      await goTradePage.openAddSymbolModal();
      await goTradePage.selectExchangeTab('binancec');
      await goTradePage.searchSymbolInModal('BTC');
      const filteredSymbols = await goTradePage.getAvailableSymbolsInModal();
      await goTradePage.searchSymbolInModal('');
      await goTradePage.waitForTimeout(1000);
      const allSymbols = await goTradePage.getAvailableSymbolsInModal();
      
      expect(allSymbols.length).toBeGreaterThanOrEqual(filteredSymbols.length);
      
      await goTradePage.closeModal();
    });
  

    test.describe('Performance Tests', () => {
    test('Measure page load time', async ({ page }) => {
      const startTime = Date.now();
      await goTradePage.navigate();
      await goTradePage.waitForChartToLoad();
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      console.log(`Page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000); 
    });
    });

    test('Measure chart render time', async () => {
      const startTime = Date.now();
      await goTradePage.waitForChartToLoad();
      const endTime = Date.now();
      
      const renderTime = endTime - startTime;
      console.log(`Chart render time: ${renderTime}ms`);
      expect(renderTime).toBeLessThan(5000); 
    });
 });


 

 