import { Page, Locator, expect } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly accounts: Locator;
  readonly settings: Locator;
  readonly toggle: Locator;
  readonly keyboardShortcut: Locator;
  readonly navigation: Locator;
  readonly trading: Locator;
  readonly shortcuts: Locator;
  readonly sounds: Locator;
  readonly goOpsShortcut: Locator;
  readonly goRiskShortcut: Locator;
  readonly goCreditShortcut: Locator;
  readonly goMarketShortcut: Locator;
  readonly applicationSettingsShortcut: Locator;
  readonly adminShortcut: Locator;
  readonly goTradeShortcut: Locator;
  readonly postTradeAnalyticsShortcut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accounts = page.locator("//span[normalize-space()='Accounts']");
    this.settings = page.locator("//span[normalize-space()='Settings']");
    this.toggle = page.locator("//button[@role='switch']");
    this.keyboardShortcut = page.locator("//p[@class='text-muted-foreground text-sm']");
    this.navigation = page.locator("//button[contains(@aria-controls,'navigation')]").first();
    this.trading = page.locator("//button[contains(@aria-controls,'trading')]").first();
    this.shortcuts = page.locator("//button[normalize-space()='Shortcuts']");
    this.sounds = page.locator("//button[normalize-space()='Sounds']");
    this.goOpsShortcut = page.locator("//div[normalize-space()='GoOps']");
    this.goRiskShortcut = page.locator("//div[normalize-space()='GoRisk']");
    this.goCreditShortcut = page.locator("//div[normalize-space()='GoCredit']");
    this.goMarketShortcut = page.locator("//div[normalize-space()='GoMarket']");
    this.applicationSettingsShortcut = page.locator("//div[normalize-space()='Application Settings']");
    this.adminShortcut = page.locator("//div[normalize-space()='Admin']");
    this.goTradeShortcut = page.locator("//div[normalize-space()='GoTrade and start a new trade']");
    this.postTradeAnalyticsShortcut = page.locator("//div[normalize-space()='Post Trade Analytics']");
  }

  async navigateToAccounts() {
    await this.accounts.click();
  }

  async navigateToSettings() {
    await this.settings.click();
  }

  async clickShortcutsTab() {
    await this.shortcuts.click();
    await this.page.waitForTimeout(1000);
  }

  async clickNavigationTab() {
    await this.navigation.click();
    await this.page.waitForTimeout(20000);
  }

  async clickTradingTab() {
    await this.trading.click();
    await this.page.waitForTimeout(2000);
  }

  async enableKeyboardShortcuts() {
 
    const isEnabled = await this.toggle.getAttribute('data-state');
    if (isEnabled !== 'checked') {
      await this.toggle.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async verifyToggleMessage() {
    await expect(this.keyboardShortcut).toBeVisible();
    await expect(this.keyboardShortcut).toHaveText('✅ Keyboard shortcuts are active and ready to use');
  }

  async pressGoOpsShortcut() {
     await this.page.bringToFront();
  await this.page.click("//div[@class='p-4 py-1 pb-6 pt-2']");
     await this.page.keyboard.down('Alt');
  await this.page.keyboard.press('J');
  await this.page.keyboard.up('Alt');
    await this.page.waitForTimeout(15000);
  }

  async pressGoRiskShortcut() {
    await this.page.bringToFront();
  await this.page.click("//div[@class='p-4 py-1 pb-6 pt-2']");
    await this.page.keyboard.press('Alt+R');
    await this.page.waitForTimeout(15000);
  }

  async pressGoCreditShortcut() {
    await this.page.bringToFront();
  await this.page.click("//div[@class='p-4 py-1 pb-6 pt-2']");
    await this.page.keyboard.press('Alt+C');
    await this.page.waitForTimeout(15000);
  }

  async pressGoMarketShortcut() {
    await this.page.bringToFront();
  await this.page.click("//div[@class='p-4 py-1 pb-6 pt-2']");
    await this.page.keyboard.press('Alt+M');
    await this.page.waitForTimeout(15000);
  }

  async pressApplicationSettingsShortcut() {
    await this.page.bringToFront();
  await this.page.click("//div[@class='p-4 py-1 pb-6 pt-2']");
    await this.page.keyboard.press('Alt+S');
    await this.page.waitForTimeout(15000);
  }

  async pressAdminShortcut() {
    await this.page.bringToFront();
  await this.page.click("//div[@class='p-4 py-1 pb-6 pt-2']");
    await this.page.keyboard.press('Alt+A');
    await this.page.waitForTimeout(15000);
  }

 
  async pressGoTradeShortcut() {
    await this.page.bringToFront();
  await this.page.click("//div[@class='p-4 py-1 pb-6 pt-2']");
    await this.page.keyboard.press('Alt+T');
    await this.page.waitForTimeout(15000);
  }

  async pressPostTradeAnalyticsShortcut() {
    await this.page.bringToFront();
  await this.page.click("//div[@class='p-4 py-1 pb-6 pt-2']");
    await this.page.keyboard.press('Alt+A');
    await this.page.waitForTimeout(15000);
  }

   async verifyGoOpsNavigation() {
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/goops', { timeout: 10000 });
  }

  async verifyGoRiskNavigation() {
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/gorisk', { timeout: 10000 });
  }

  async verifyGoCreditNavigation() {
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/gocredit', { timeout: 10000 });
  }

  async verifyGoMarketNavigation() {
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/gomarket', { timeout: 10000 });
  }

  async verifyApplicationSettingsNavigation() {
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/settings', { timeout: 10000 });
  }

  async verifyAdminNavigation() {
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/admin', { timeout: 10000 });
  }

  async verifyGoTradeNavigation() {
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/gotrade', { timeout: 10000 });
  }

  async verifyPostTradeAnalyticsNavigation() {
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/post-trade-analytics', { timeout: 10000 });
  }


  async verifyPageHeading(expectedHeading: string) {
    const heading = this.page.locator(`//h1[contains(text(),'${expectedHeading}')]`);
    await expect(heading).toBeVisible({ timeout: 10000 });
  }

 
  async verifyShortcutVisibleXPath(shortcutName: string) {
    const shortcut = this.page.locator("//div[normalize-space(.)='${shortcutName}']");
    await expect(shortcut).toBeVisible({ timeout: 50000 });
  }
  }
