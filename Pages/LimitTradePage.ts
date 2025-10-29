import { Page, Locator, expect } from '@playwright/test';

export class LimitTradePage {
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
  readonly priceInput: Locator;

  constructor(page: Page) {
    this.page = page;
     this.exchangeSearchButton = page.locator("//button[@data-testid='exchange-selector-trigger']");
    this.exchangeSearchInput = page.locator('input[placeholder*="Search by exchange"]');
    this.marketDropdown = page.locator("//div[@data-testid='GOTRADE_ORDERTYPE_MORE']");
    this.searchInput = page.locator("//button[@data-testid='symbols-dropdown']");
    this.symbolInput = page.locator("//div[@data-testid='symbol-option-BTC-AUD']");
    this.quantityInput = page.locator('input[id="emailInput"][data-testid="quantity"]');
    this.buyButton = page.locator("//button[@data-testid='long-button']");
    this.sellButton = page.locator("//button[@data-testid='short-button']");
    this.tradeButton = page.locator("//button[@data-testid='trade-button']");
    this.symbolCard = page.locator('.DOT-EUR');
    this.marketTypeOption = page.locator('text=Market');
    this.discoveryModeToggle = page.locator('text=Discovery Mode');
    this.priceInput = page.locator("//input[@data-testid = 'price']");
  }

  /**
   * 
   * @param exchangeName 
   */
  async selectExchange(exchangeName: string): Promise<void> {
    await this.exchangeSearchButton.click();
    await this.exchangeSearchInput.waitFor({ state: 'visible', timeout: 1000 });
    await this.exchangeSearchInput.fill(exchangeName);
    await this.page.waitForTimeout(1000);
    await this.page.locator("//div[@class='flex w-full items-center']").click();
    await this.page.waitForTimeout(20000);
  }

  /**
   * 
   * @param marketType 
   */
  async selectMarketType(marketType: string): Promise<void> {
    await this.marketDropdown.click();
    await this.page.waitForTimeout(1000);
    await this.page.locator("//div[@data-testid='GOTRADE_ORDERTYPE_LIMIT']").click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 
   * @param symbol 
   */
  async selectSymbol(symbol: string): Promise<void> {
    await this.searchInput.click();
    await this.page.waitForTimeout(1000);
        
    const symbolSearchInput = this.page.locator('input[placeholder*="Search"]');
    if (await symbolSearchInput.count() > 0) {
      await symbolSearchInput.fill(symbol);
      await this.page.waitForTimeout(10000);
      
    }
    
   await this.page.locator("//input[@placeholder='Search symbol...']").click();
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
   * @param price 
   */
  async enterPrice(price: string): Promise<void> {
    await this.priceInput.fill('');
    await this.priceInput.fill(price);
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
    price?: string;
    side: 'buy' | 'sell';
  }): Promise<void> {
    const { exchange, marketType, symbol, quantity, price, side } = tradeDetails;
    
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

    if (price) {
      console.log(`Entering price: ${price}`);
      await this.enterPrice(price);
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