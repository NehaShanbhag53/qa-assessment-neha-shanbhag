import { Page, Locator, expect } from '@playwright/test';

export interface OrderDetails {
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

export class WorkingOrdersPage {
  readonly page: Page;
  
  readonly workingOrdersTab: Locator;
  readonly orderHistoryTab: Locator;
  readonly openPositionsTab: Locator;
  readonly assetsTab: Locator;
   readonly cancelWorkingOrdersBtn: Locator;
  readonly killEdgeBtn: Locator;
  readonly liquidatePositionsBtn: Locator;
   readonly algoDropdown: Locator;
   readonly venueColumn: Locator;
  readonly accountColumn: Locator;
  readonly algorithmIdColumn: Locator;
  readonly statusColumn: Locator;
  readonly typeColumn: Locator;
  readonly symbolColumn: Locator;
  readonly dateTimeColumn: Locator;
  readonly sideColumn: Locator;
  readonly avgFillPriceColumn: Locator;
  readonly fillQuantityColumn: Locator;
  readonly fillValueColumn: Locator;
  readonly fillProgressColumn: Locator;
  readonly actionsColumn: Locator;
  readonly tableBody: Locator;
  readonly orderRows: Locator;

  constructor(page: Page) {
    this.page = page;

    this.workingOrdersTab = page.locator("//button[normalize-space()='Working Orders']");
    this.orderHistoryTab = page.locator("//button[normalize-space()='Order History']");
    this.openPositionsTab = page.locator("//button[normalize-space()='Open Positions']");
    this.assetsTab = page.locator("//button[normalize-space()='Assets']");
    this.cancelWorkingOrdersBtn = page.locator("//button[normalize-space()='Cancel Working Orders']");
    this.killEdgeBtn = page.locator('button:has-text("Kill-Edge")');
    this.liquidatePositionsBtn = page.locator('button:has-text("Liquidate Positions")');
     this.algoDropdown = page.locator('text=Algos');
     this.venueColumn = page.locator("//button[normalize-space()='Venue']");
    this.accountColumn = page.locator('th:has-text("Account")');
    this.algorithmIdColumn = page.locator('th:has-text("Algorithm ID")');
    this.statusColumn = page.locator('th:has-text("Status")');
    this.typeColumn = page.locator('th:has-text("Type")');
    this.symbolColumn = page.locator('th:has-text("Symbol")');
    this.dateTimeColumn = page.locator('th:has-text("Date Time (UTC)")');
    this.sideColumn = page.locator('th:has-text("Side")');
    this.avgFillPriceColumn = page.locator('th:has-text("Avg Fill Price")');
    this.fillQuantityColumn = page.locator('th:has-text("Fill Quantity")');
    this.fillValueColumn = page.locator('th:has-text("Fill Value")');
    this.fillProgressColumn = page.locator('th:has-text("Fill Progress")');
    this.actionsColumn = page.locator('th:has-text("Actions")');
     this.tableBody = page.locator('table tbody');
    this.orderRows = page.locator('table tbody tr');
  }

 
  async navigateToWorkingOrders(): Promise<void> {
    await this.workingOrdersTab.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
  }

  getOrderRowByAlgoId(algoId: string): Locator {
    return this.page.locator(`tr:has-text("${algoId}")`);
  }

 
  getOrderRowBySymbol(symbol: string): Locator {
    return this.page.locator(`tr:has-text("${symbol}")`);
  }

  getOrderRowByAccount(account: string): Locator {
    return this.page.locator(`tr:has-text("${account}")`);
  }

  async getOrderDetails(algoId: string): Promise<OrderDetails> {
    const row = this.getOrderRowByAlgoId(algoId);
    
    const cells = row.locator('td');
    
    return {
      venue: (await cells.nth(0).textContent()) || '',
      account: (await cells.nth(1).textContent()) || '',
      algorithmId: (await cells.nth(2).textContent()) || '',
      status: (await cells.nth(3).textContent()) || '',
      type: (await cells.nth(4).textContent()) || '',
      symbol: (await cells.nth(5).textContent()) || '',
      dateTime: (await cells.nth(6).textContent()) || '',
      side: (await cells.nth(7).textContent()) || '',
      avgFillPrice: (await cells.nth(8).textContent()) || '',
      fillQuantity: (await cells.nth(9).textContent()) || '',
      fillValue: (await cells.nth(10).textContent()) || '',
      fillProgress: (await cells.nth(11).textContent()) || ''
    };
  }

  async cancelOrder(algoId: string): Promise<void> {
    const row = this.getOrderRowByAlgoId(algoId);
    const cancelBtn = row.locator('button:has-text("Cancel")');
    await cancelBtn.click();
  }

 
  async modifyOrder(algoId: string): Promise<void> {
    const row = this.getOrderRowByAlgoId(algoId);
    const modifyBtn = row.locator('button[aria-label*="modify"], button[title*="modify"]');
    await modifyBtn.click();
  }

 
  async isOrderPresent(algoId: string): Promise<boolean> {
    const row = this.getOrderRowByAlgoId(algoId);
    return (await row.count()) > 0;
  }

   async getOrderCount(): Promise<number> {
    return await this.orderRows.count();
  }

  async waitForOrderToAppear(algoId: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector("//div[@class='4k:text-sm flex w-fit justify-center']//span[@class='overflow-hidden text-ellipsis'][normalize-space()='${algoId}']", { 
      timeout,
      state: 'visible'
    });
  }

  async waitForOrderToDisappear(algoId: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(`tr:has-text("${algoId}")`, { 
      state: 'detached', 
      timeout 
    });
  }

  
  async getAllOrders(): Promise<OrderDetails[]> {
    const count = await this.orderRows.count();
    const orders: OrderDetails[] = [];

    for (let i = 0; i < count; i++) {
      const row = this.orderRows.nth(i);
      const algoIdText = await row.locator('td').nth(2).textContent();
      
      if (algoIdText) {
        const algoId = algoIdText.trim();
        orders.push(await this.getOrderDetails(algoId));
      }
    }

    return orders;
  }

  async verifyTableColumns(): Promise<void> {
    const expectedColumns: string[] = [
      'Venue', 'Account', 'Algorithm ID', 'Status', 'Type', 
      'Symbol', 'Date Time (UTC)', 'Side', 'Avg Fill Price',
      'Fill Quantity', 'Fill Value', 'Fill Progress', 'Actions'
    ];

    for (const column of expectedColumns) {
      await this.page.locator(`th:has-text("${column}")`).waitFor({ 
        state: 'visible',
        timeout: 50000
      });
    }
  }

  getCancelButton(algoId: string): Locator {
    const row = this.getOrderRowByAlgoId(algoId);
    return row.locator('button:has-text("Cancel")');
  }

 
  getModifyButton(algoId: string): Locator {
    const row = this.getOrderRowByAlgoId(algoId);
    return row.locator('button[aria-label*="modify"], button[title*="modify"]');
  }

 
  async clickCancelWorkingOrders(): Promise<void> {
    await this.cancelWorkingOrdersBtn.click();
  }

  
  async clickKillEdge(): Promise<void> {
    await this.killEdgeBtn.click();
  }

 
  async clickLiquidatePositions(): Promise<void> {
    await this.liquidatePositionsBtn.click();
  }

  
  async navigateToOrderHistory(): Promise<void> {
    await this.orderHistoryTab.click();
    await this.page.waitForLoadState('networkidle');
  }

 
  async navigateToOpenPositions(): Promise<void> {
    await this.openPositionsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAssets(): Promise<void> {
    await this.assetsTab.click();
    await this.page.waitForLoadState('networkidle');
  }
}