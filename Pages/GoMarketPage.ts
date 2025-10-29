import { Page, Locator, expect } from '@playwright/test';

export class GoTradePage {
  readonly page: Page;
  readonly marketsMenu: Locator;
  readonly goMarket: Locator;
   readonly symbolDropdown: Locator;
  readonly discoveryModeToggle: Locator;
  readonly symbolInput: Locator;
  readonly swapLabel: Locator;
  readonly currentSymbolLabel: Locator;
  readonly chartContainer: Locator;
  readonly candleButton: Locator;
  readonly lineButton: Locator;
  readonly timeframe1m: Locator;
  readonly timeframe5m: Locator;
  readonly timeframe15m: Locator;
  readonly timeframe1h: Locator;
  readonly priceTab: Locator;
  readonly tradesTab: Locator;
  readonly ma5: Locator;
  readonly ma10: Locator;
  readonly ma20: Locator;
  readonly ma30: Locator;
  readonly currentPrice: Locator;
  readonly btcAudSymbol: Locator;
  readonly trumpAudSymbol: Locator;
  readonly bchUsdtSymbol: Locator;
  readonly etcUsdtSymbol: Locator;
  readonly trxUsdPerpSymbol: Locator;
  readonly symbolRemoveButtons: Locator;
  readonly addSymbolModal: Locator;
  readonly modalSearchInput: Locator;
  readonly okxTab: Locator;
  readonly bybitTab: Locator;
  readonly deribitTab: Locator;
  readonly binancespotTab: Locator;
  readonly binancecTab: Locator;
  readonly symbolList: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly pageInfo: Locator;
  readonly modalCloseButton: Locator;
  readonly addSymbolButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.marketsMenu = page.locator('button:has-text("Markets"), a:has-text("Markets")');
    this.goMarket = page.locator("//span[@class='text-sm font-medium']");
    this.symbolDropdown = page.locator('[data-testid="symbol-dropdown"], button:has-text("OKX"), select[name*="exchange"]').first();
    this.discoveryModeToggle = page.locator('text=Discovery Mode').locator('..').locator('input, button').first();
    this.symbolInput = page.locator('input[placeholder*="symbol" i], input[placeholder*="search" i]').first();
    this.swapLabel = page.locator('text=BTC-USDT-SWAP, [data-testid="current-symbol"]');
    this.currentSymbolLabel = page.locator('text=/BTC.*SWAP|ETH.*SWAP/i, [class*="symbol-label"]').first();
    this.chartContainer = page.locator('canvas, [class*="chart-container"], [id*="chart"]').first();
    this.candleButton = page.locator('button:has-text("Candle"), [data-testid="candle-chart"]');
    this.lineButton = page.locator('button:has-text("Line"), [data-testid="line-chart"]');
    this.timeframe1m = page.locator('button:has-text("1m"), [data-timeframe="1m"]');
    this.timeframe5m = page.locator("//span[normalize-space()='5m']");
    this.timeframe15m = page.locator('button:has-text("15m"), [data-timeframe="15m"]');
    this.timeframe1h = page.locator('button:has-text("1h"), [data-timeframe="1h"]');
    this.priceTab = page.locator('button:has-text("Price"), [data-tab="price"]');
    this.tradesTab = page.locator('button:has-text("Trades"), [data-tab="trades"]');
    this.ma5 = page.locator('text=MA5, [data-ma="5"]');
    this.ma10 = page.locator('text=MA10, [data-ma="10"]');
    this.ma20 = page.locator('text=MA20, [data-ma="20"]');
    this.ma30 = page.locator('text=MA30, [data-ma="30"]');
    this.currentPrice = page.locator('text=/11[0-9],\\d{3}\\.\\d{2}/, [class*="current-price"], [data-testid="price"]').first();
    this.btcAudSymbol = page.locator('text=BTC-AUD');
    this.trumpAudSymbol = page.locator('text=TRUMP-AUD');
    this.bchUsdtSymbol = page.locator('text=BCHUSDT');
    this.etcUsdtSymbol = page.locator('text=ETCUSDT');
    this.trxUsdPerpSymbol = page.locator('text=TRXUSD_PERP');
    this.symbolRemoveButtons = page.locator('button[aria-label*="remove" i], button:has-text("×")');
    this.addSymbolModal = page.locator('text=Add Symbol').locator('..').locator('..').locator('..');
    this.modalSearchInput = page.locator('input[placeholder*="search" i]').last();
    this.okxTab = page.locator('button:has-text("OKX")').nth(1);
    this.bybitTab = page.locator('button:has-text("BYBIT")');
    this.deribitTab = page.locator('button:has-text("DERIBIT")');
    this.binancespotTab = page.locator('button:has-text("BINANCESPOT")');
    this.binancecTab = page.locator('button:has-text("BINANCEC")');
    this.symbolList = page.locator('[class*="symbol-item"], text=/_PERP$/, text=/USDT$/');
    this.nextButton = page.locator('button:has-text("Next")');
    this.previousButton = page.locator('button:has-text("Previous")');
    this.pageInfo = page.locator('text=/Page \\d+ of \\d+/');
    this.modalCloseButton = page.locator('button[aria-label="Close"], [class*="modal"] button:has-text("×")').last();
    this.addSymbolButton = page.locator('button[aria-label*="add symbol" i], button:has-text("+")').first();
  }
  
  async navigate(url: string = 'https://test1.gotrade.goquant.io/gomarket') {
    await this.page.goto(url);
    await this.page.waitForTimeout(2000);
    await this.page.locator("//button[@class='inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:border-2 focus-visible:border-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 border border-gotradeBorder bg-background hover:bg-accent hover:text-accent-foreground h-[34px] px-3 py-1.5 flex-1']").click();
  }
  
  async selectExchange(exchange: string) {
    await this.symbolDropdown.click();
    await this.page.locator(`text=${exchange}`).click();
    await this.page.waitForTimeout(5000);
  }

  async toggleDiscoveryMode() {
    await this.discoveryModeToggle.click();
    await this.page.waitForTimeout(3000);
  }

  async searchSymbol(symbol: string) {
    await this.symbolInput.fill(symbol);
    await this.page.waitForTimeout(5000);
  }

  async getCurrentSymbol(): Promise<string> {
    return await this.currentSymbolLabel.textContent() || '';
  }

  
  async waitForChartToLoad() {
    await this.chartContainer.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async isChartVisible(): Promise<boolean> {
    return await this.chartContainer.isVisible();
  }

  async selectChartType(type: 'Candle' | 'Line') {
    if (type === 'Candle') {
      await this.candleButton.click();
    } else {
      await this.lineButton.click();
    }
    await this.page.waitForTimeout(500);
  }

  async selectTimeframe(timeframe: '1m' | '5m' | '15m' | '1h') {
    const timeframeMap = {
      '1m': this.timeframe1m,
      '5m': this.timeframe5m,
      '15m': this.timeframe15m,
      '1h': this.timeframe1h,
    };
    await timeframeMap[timeframe].click();
    await this.page.waitForTimeout(1000);
  }

  async switchToPriceTab() {
    await this.priceTab.click();
    await this.page.waitForTimeout(3000);
  }

  async switchToTradesTab() {
    await this.tradesTab.click();
    await this.page.waitForTimeout(3000);
  }

  async areMovingAveragesVisible(): Promise<boolean> {
    const ma5Visible = await this.ma5.isVisible();
    const ma10Visible = await this.ma10.isVisible();
    const ma20Visible = await this.ma20.isVisible();
    const ma30Visible = await this.ma30.isVisible();
    return ma5Visible && ma10Visible && ma20Visible && ma30Visible;
  }

  async getCurrentPrice(): Promise<string> {
    try {
      const price = await this.currentPrice.textContent({ timeout: 5000 });
      return price || '';
    } catch {
      return '';
    }
  }

  
  async getVisibleSymbols(): Promise<string[]> {
    const symbols: string[] = [];
    try {
      if (await this.btcAudSymbol.isVisible()) symbols.push('BTC-AUD');
      if (await this.trumpAudSymbol.isVisible()) symbols.push('TRUMP-AUD');
      if (await this.bchUsdtSymbol.isVisible()) symbols.push('BCHUSDT');
      if (await this.etcUsdtSymbol.isVisible()) symbols.push('ETCUSDT');
      if (await this.trxUsdPerpSymbol.isVisible()) symbols.push('TRXUSD_PERP');
    } catch (error) {
          console.error('Error checking symbol visibility:', error);
    }
    return symbols;
  }

  async removeSymbol(symbolName: string) {
    const symbolLocator = this.page.locator(`text=${symbolName}`);
    const parent = symbolLocator.locator('..');
    await parent.locator('button').first().click();
    await this.page.waitForTimeout(300);
  }

  async isSymbolVisible(symbolName: string): Promise<boolean> {
    return await this.page.locator(`text=${symbolName}`).isVisible();
  }

  
  async openAddSymbolModal() {
    await this.addSymbolButton.click();
    await this.addSymbolModal.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  async isModalVisible(): Promise<boolean> {
    return await this.addSymbolModal.isVisible();
  }

  async searchSymbolInModal(symbol: string) {
    await this.modalSearchInput.fill(symbol);
    await this.page.waitForTimeout(1000);
  }

  async selectExchangeTab(exchange: 'okx' | 'bybit' | 'deribit' | 'binancespot' | 'binancec') {
    const exchangeMap = {
      okx: this.okxTab,
      bybit: this.bybitTab,
      deribit: this.deribitTab,
      binancespot: this.binancespotTab,
      binancec: this.binancecTab,
    };
    await exchangeMap[exchange].click();
    await this.page.waitForTimeout(800);
  }

  async selectSymbolFromModal(symbolName: string) {
    await this.page.locator(`text=${symbolName}`).click();
    await this.page.waitForTimeout(500);
  }

  async goToNextPage() {
    const isEnabled = await this.nextButton.isEnabled();
    if (isEnabled) {
      await this.nextButton.click();
      await this.page.waitForTimeout(800);
    }
  }

  async goToPreviousPage() {
    const isEnabled = await this.previousButton.isEnabled();
    if (isEnabled) {
      await this.previousButton.click();
      await this.page.waitForTimeout(800);
    }
  }

  async getCurrentPageInfo(): Promise<string> {
    try {
      return await this.pageInfo.textContent() || '';
    } catch {
      return '';
    }
  }

  async closeModal() {
    await this.modalCloseButton.click();
    await this.page.waitForTimeout(500);
  }

  async getAvailableSymbolsInModal(): Promise<string[]> {
    const symbols = await this.symbolList.allTextContents();
    return symbols.filter(s => s.trim().length > 0);
  }

  
  async setupTradingView(timeframe: '1m' | '5m' | '15m' | '1h', chartType: 'Candle' | 'Line') {
    await this.waitForChartToLoad();
    await this.selectTimeframe(timeframe);
    await this.selectChartType(chartType);
  }

  async addNewSymbol(exchange: 'okx' | 'bybit' | 'deribit' | 'binancespot' | 'binancec', symbolName: string) {
    await this.openAddSymbolModal();
    await this.selectExchangeTab(exchange);
    await this.selectSymbolFromModal(symbolName);
    await this.closeModal();
  }

  async searchAndSelectSymbol(
    exchange: 'okx' | 'bybit' | 'deribit' | 'binancespot' | 'binancec',
    searchTerm: string,
    symbolName: string
  ) {
    await this.openAddSymbolModal();
    await this.selectExchangeTab(exchange);
    await this.searchSymbolInModal(searchTerm);
    await this.selectSymbolFromModal(symbolName);
    await this.closeModal();
  }
  
  async verifyPageLoaded(): Promise<boolean> {
    try {
      await expect(this.page).toHaveURL(/.*gomarket/, { timeout: 10000 });
     
      return true;
    } catch {
      return false;
    }
  }

  async verifyChartDisplayed(): Promise<boolean> {
    try {
      await this.waitForChartToLoad();
      return await this.isChartVisible();
    } catch {
      return false;
    }
  }


  async verifyMovingAverages(): Promise<boolean> {
    return await this.areMovingAveragesVisible();
  }

  async verifySymbolComparison(): Promise<boolean> {
    const symbols = await this.getVisibleSymbols();
    return symbols.length >= 3;
  }
  
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  async reload() {
    await this.page.reload();
    await this.page.waitForTimeout(2000);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getPageURL(): Promise<string> {
    return this.page.url();
  }
  
  async handleStaleElement(action: () => Promise<void>, retries: number = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await action();
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(500);
      }
    }
  }

  async waitForElementToBeStable(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    await this.page.waitForTimeout(200);
  }
}