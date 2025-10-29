import { Page, Locator, expect } from '@playwright/test';

export class TWAPEdgeTradePage {
  readonly page: Page;
  readonly exchangeSearchButton: Locator;
  readonly exchangeSearchInput: Locator;
  readonly marketDropdown: Locator;
  readonly searchInput: Locator;
  readonly symbolInput: Locator;
  readonly quantityInput: Locator;
  readonly buyButton: Locator;
  readonly sellButton: Locator;
  readonly tradeButton: Locator;
  readonly symbolCard: Locator;
  readonly marketTypeOption: Locator;
  readonly discoveryModeToggle: Locator;
  readonly durationInput: Locator;
  readonly intervalInput: Locator;
  readonly decayInput: Locator;

  constructor(page: Page) {
    this.page = page;
 
    this.exchangeSearchButton = page.locator("//button[@data-testid='exchange-selector-trigger']");
    this.exchangeSearchInput = page.locator('input[placeholder*="Search by exchange"]');
    this.marketDropdown = page.locator("//p[@class='text-center']");
    this.searchInput = page.locator("//button[@data-testid='symbols-dropdown']");
    this.symbolInput = page.locator("//div[@data-testid='symbol-option-BTC-USD']");
    this.quantityInput = page.locator('input[id="emailInput"][data-testid="quantity"]');
    this.buyButton = page.locator("//button[@data-testid='long-button']");
    this.sellButton = page.locator("//button[@data-testid='short-button']");
    this.tradeButton = page.locator("//button[@data-testid='trade-button']");
    this.symbolCard = page.locator('.DOT-EUR');
    this.marketTypeOption = page.locator('text=Market');
    this.discoveryModeToggle = page.locator('text=Discovery Mode');
    this.durationInput = page.locator("//input[@data-testid='duration']");
    this.intervalInput = page.locator("//input[@data-testid='interval']");
    this.decayInput = page.locator("//input[@placeholder='Enter decay factor']")
  }

  /**
   * 
   * @param exchangeName 
   */
  async selectExchange(exchangeName: string): Promise<void> {
    await this.exchangeSearchButton.click();
    await this.exchangeSearchInput.waitFor({ state: 'visible', timeout: 1000 });
    await this.exchangeSearchInput.fill(exchangeName);
    await this.page.waitForTimeout(1500);
    await this.page.locator("//div[@class='flex w-full items-center']").click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 
   * @param marketType 
   */
  async selectMarketType(marketType: string): Promise<void> {
 
    await this.page.locator("//span[normalize-space()='TWAP-Edge']").click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 
   * @param symbol 
   */
  async selectSymbol(symbol: string): Promise<void> {
    await this.searchInput.click();
    await this.page.waitForTimeout(1000);
    
    
   await this.page.locator("//div[@data-testid='symbol-option-BTC-USD']").click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 
   * @param quantity 
   */
  async enterQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill('');
    await this.quantityInput.fill(quantity);
    await this.page.waitForTimeout(1000);
  }

   /**
   * 
   * @param duration 
   */
  async enterDuration(duration: string): Promise<void> {
    await this.durationInput.fill('');
    await this.durationInput.fill(duration);
    await this.page.waitForTimeout(1000);
  }

  /**
   * 
   * @param interval 
   */
  async enterInterval(interval: string): Promise<void> {
    await this.intervalInput.fill('');
    await this.intervalInput.fill(interval);
    await this.page.waitForTimeout(1000);
  }

   /**
   * 
   * @param decay 
   */
  async enterDecay(decay: string): Promise<void> {
    await this.decayInput.fill('');
    await this.decayInput.fill(decay);
    await this.page.waitForTimeout(1000);
  }

  /**
   * 
   * @param side 
   */
  async selectOrderSide(side: 'buy' | 'sell'): Promise<void> {
    if (side.toLowerCase() === 'buy') {
      await this.buyButton.click();
    } else if (side.toLowerCase() === 'sell') {
      await this.sellButton.click();
    } else {
      throw new Error('Invalid order side. Use "buy" or "sell"');
    }
    await this.page.waitForTimeout(10000);
  }


  async executeTrade(): Promise<void> {
    await this.tradeButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 
   * @param tradeDetails 
   */
  async performTrade(tradeDetails: {
    exchange?: string;
    marketType?: string;
    symbol?: string;
    quantity?: string;
     duration?: string;
    interval?: string;
    decay?: string;
    side: 'buy' | 'sell';
  }): Promise<void> {
    const { exchange, marketType, symbol, quantity, duration, interval, decay, side } = tradeDetails;
    
    if (exchange) {
      console.log(`Selecting exchange: ${exchange}`);
      await this.selectExchange(exchange);
    }
    
    if (marketType) {
      console.log(`Selecting market type: ${marketType}`);
      await this.selectMarketType(marketType);
    }
    
    if (symbol) {
      console.log(`Selecting symbol: ${symbol}`);
      await this.selectSymbol(symbol);
    }
    
    if (quantity) {
      console.log(`Entering quantity: ${quantity}`);
      await this.enterQuantity(quantity);
    }

    if (duration) {
      console.log(`Entering duration: ${duration}`);
      await this.enterDuration(duration);
    }

     if (interval) {
      console.log(`Entering interval: ${interval}`);
      await this.enterInterval(interval);
    }

     if (decay) {
      console.log(`Entering decay: ${decay}`);
      await this.enterDecay(decay);
    }
    
    console.log(`Selecting order side: ${side}`);
    await this.selectOrderSide(side);
    
    console.log('Executing trade...');
    await this.executeTrade();
    
    console.log('Trade completed successfully!');
  }

 
  /**
   * 
   * @returns 
   */
  async getNetAssetValue(): Promise<string | null> {
    const navElement = this.page.locator("//p[@class='ml-2 text-neutral-500 font-inter text-sm md:text-2xsm md:ml-0 md:w-full md:text-center 4k:text-lg']");
    if (await navElement.count() > 0) {
      const navValue = await this.page.locator("//p[@class='font-plusJakartaSans font-bold mt-1 text-base md:text-sm header-nav text-nowrap md:w-full md:text-center 4k:text-lg 4k:mt-2']").textContent();
      return navValue;
    }
    return null;
  }
}