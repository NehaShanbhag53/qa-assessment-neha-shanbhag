import { Page, Locator, expect } from '@playwright/test';

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
  action: string;
}

interface OrderMetadata {
  quantity?: string;
  instrumentType?: string;
  duration?: string;
  interval?: string;
  price?: string;
  decayFactor?: string;
  threshold?: string;
}

interface ParsedQuantity {
  value: number;
  unit: string;
}

interface ParsedPrice {
  value: number;
  currency: string;
}

interface ParsedDuration {
  value: number;
  unit: string;
}

interface CompleteOrder extends OrderDetails {
  metadata: OrderMetadata;
}

export class OrderHistoryPage {
  readonly page: Page;
  readonly workingOrdersTab: Locator;
  readonly orderHistoryTab: Locator;
  readonly openPositionsTab: Locator;
  readonly assetsTab: Locator;
   readonly cancelWorkingOrdersBtn: Locator;
  readonly killEdgeBtn: Locator;
  readonly liquidatePositionsBtn: Locator;
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
  
  // Table body
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

  async navigateToOrderHistory(): Promise<void> {
    await this.orderHistoryTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToWorkingOrders(): Promise<void> {
    await this.workingOrdersTab.click();
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

  getOrderRowByAlgoId(algoId: string): Locator {
    return this.page.locator(`tr:has-text("${algoId}")`);
  }

  getOrderRowByStatus(status: string): Locator {
    return this.page.locator(`tr:has-text("${status}")`);
  }

  getOrderRowBySymbol(symbol: string): Locator {
    return this.page.locator(`tr:has-text("${symbol}")`);
  }

  async getOrderDetails(algoId: string): Promise<OrderDetails> {
    const row = this.getOrderRowByAlgoId(algoId);
    
    const details: OrderDetails = {
      venue: (await row.locator('td').nth(0).textContent()) || '',
      account: (await row.locator('td').nth(1).textContent()) || '',
      algorithmId: (await row.locator('td').nth(2).textContent()) || '',
      status: (await row.locator('td').nth(3).textContent()) || '',
      type: (await row.locator('td').nth(4).textContent()) || '',
      symbol: (await row.locator('td').nth(5).textContent()) || '',
      dateTime: (await row.locator('td').nth(6).textContent()) || '',
      side: (await row.locator('td').nth(7).textContent()) || '',
      avgFillPrice: (await row.locator('td').nth(8).textContent()) || '',
      fillQuantity: (await row.locator('td').nth(9).textContent()) || '',
      fillValue: (await row.locator('td').nth(10).textContent()) || '',
      fillProgress: (await row.locator('td').nth(11).textContent()) || '',
      action: (await row.locator('td').nth(12).textContent()) || ''
    };

    Object.keys(details).forEach((key) => {
      const typedKey = key as keyof OrderDetails;
      details[typedKey] = details[typedKey].trim();
    });

    return details;
  }

  async getOrderMetadata(algoId: string): Promise<OrderMetadata> {
    const row = this.getOrderRowByAlgoId(algoId);
    const metadata: OrderMetadata = {};

    const quantityTag = row.locator('text=/Quantity:.*/').first();
    if ((await quantityTag.count()) > 0) {
      metadata.quantity = await quantityTag.textContent() || undefined;
    }

    const instrumentTag = row.locator('text=/Instrument Type:.*/').first();
    if ((await instrumentTag.count()) > 0) {
      metadata.instrumentType = await instrumentTag.textContent() || undefined;
    }

    const durationTag = row.locator('text=/Duration:.*/').first();
    if ((await durationTag.count()) > 0) {
      metadata.duration = await durationTag.textContent() || undefined;
    }

    const intervalTag = row.locator('text=/Interval:.*/').first();
    if ((await intervalTag.count()) > 0) {
      metadata.interval = await intervalTag.textContent() || undefined;
    }

    const priceTag = row.locator('text=/Price:.*/').first();
    if ((await priceTag.count()) > 0) {
      metadata.price = await priceTag.textContent() || undefined;
    }

    const decayTag = row.locator('text=/Decay Factor:.*/').first();
    if ((await decayTag.count()) > 0) {
      metadata.decayFactor = await decayTag.textContent() || undefined;
    }

  
    const thresholdTag = row.locator('text=/Threshold:.*/').first();
    if ((await thresholdTag.count()) > 0) {
      metadata.threshold = await thresholdTag.textContent() || undefined;
    }

    return metadata;
  }

  async getOrderStatus(algoId: string): Promise<string> {
    const details = await this.getOrderDetails(algoId);
    return details.status;
  }

  async isOrderPresent(algoId: string): Promise<boolean> {
    const row = this.getOrderRowByAlgoId(algoId);
    return (await row.count()) > 0;
  }

  async getOrderCount(): Promise<number> {
    return await this.orderRows.count();
  }

  async waitForOrderToAppear(algoId: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(`tr:has-text("${algoId}")`, { timeout });
  }

  async getOrdersByStatus(status: string): Promise<CompleteOrder[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => order.status.includes(status));
  }


  async getAllOrders(): Promise<CompleteOrder[]> {
    const count = await this.orderRows.count();
    const orders: CompleteOrder[] = [];

    for (let i = 0; i < count; i++) {
      const row = this.orderRows.nth(i);
      const algoId = (await row.locator('td').nth(2).textContent()) || '';
      const orderDetails = await this.getOrderDetails(algoId.trim());
      const metadata = await this.getOrderMetadata(algoId.trim());
      orders.push({ ...orderDetails, metadata });
    }

    return orders;
  }

  async filterByVenue(venue: string): Promise<CompleteOrder[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => order.venue.includes(venue));
  }

  async filterBySymbol(symbol: string): Promise<CompleteOrder[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => order.symbol.includes(symbol));
  }

  async filterBySide(side: 'Buy' | 'Sell'): Promise<CompleteOrder[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => order.side.includes(side));
  }

  async filterByType(type: string): Promise<CompleteOrder[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => order.type.includes(type));
  }

   async getActionText(algoId: string): Promise<string> {
    const details = await this.getOrderDetails(algoId);
    return details.action;
  }


  async clickOrderRejected(algoId: string): Promise<void> {
    const row = this.getOrderRowByAlgoId(algoId);
    const orderRejectedBtn = row.locator('text=Order Rejected');
    await orderRejectedBtn.click();
  }

 
  async clickCancelOrder(algoId: string): Promise<void> {
    const row = this.getOrderRowByAlgoId(algoId);
    const cancelBtn = row.locator('button:has-text("Cancel")');
    await cancelBtn.click();
  }

   get orderRejectedModal(): Locator {
    return this.page
      .locator('[role="dialog"], .modal, [class*="modal"]')
      .filter({ hasText: 'Order Rejected' });
  }

  get modalTitle(): Locator {
    return this.orderRejectedModal.locator('h2, h3, [class*="title"]').first();
  }

  get modalReason(): Locator {
    return this.orderRejectedModal.locator('p, div[class*="message"], div[class*="reason"]');
  }

  get modalCloseButton(): Locator {
    return this.orderRejectedModal.locator(
      'button[aria-label="close"], button:has-text("Close"), [class*="close"]'
    );
  }

   async getRejectionReason(): Promise<string> {
    await this.orderRejectedModal.waitFor({ state: 'visible', timeout: 5000 });
    const reasonText = await this.modalReason.textContent();
    return reasonText?.trim() || '';
  }

  async closeRejectionModal(): Promise<void> {
    await this.modalCloseButton.click();
    await this.orderRejectedModal.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async isRejectionModalVisible(): Promise<boolean> {
    return await this.orderRejectedModal.isVisible();
  }

  async verifyOrderStatus(
    algoId: string,
    expectedStatus: string,
    retries: number = 3,
    delay: number = 1000
  ): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      const status = await this.getOrderStatus(algoId);
      if (status.includes(expectedStatus)) {
        return true;
      }
      await this.page.waitForTimeout(delay);
    }
    return false;
  }
  async verifyTableColumns(): Promise<void> {
    const expectedColumns: string[] = [
      'Venue',
      'Account',
      'Algorithm ID',
      'Status',
      'Type',
      'Symbol',
      'Date Time (UTC)',
      'Side',
      'Avg Fill Price',
      'Fill Quantity',
      'Fill Value',
      'Fill Progress',
      'Actions'
    ];

    for (const column of expectedColumns) {
      await this.page.locator(`th:has-text("${column}")`).waitFor({ state: 'visible' });
    }
  }

  parseQuantity(quantityStr: string): ParsedQuantity | null {
    const match = quantityStr.match(/Quantity:\s*([\d.]+)\s*(\w+)/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2]
      };
    }
    return null;
  }

  parsePrice(priceStr: string): ParsedPrice | null {
    const match = priceStr.match(/Price:\s*([\d.]+)\s*(\w+)/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        currency: match[2]
      };
    }
    return null;
  }

  parseDuration(durationStr: string): ParsedDuration | null {
    const match = durationStr.match(/Duration:\s*([\d.]+)(\w+)/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2]
      };
    }
    return null;
  }

  parseFillProgress(progressStr: string): number {
    const match = progressStr.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  }

  async searchByAlgoId(algoId: string): Promise<boolean> {
    return await this.isOrderPresent(algoId);
  }

  async sortByColumn(columnName: string): Promise<void> {
    const columnHeader = this.page.locator(`th:has-text("${columnName}")`);
    await columnHeader.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickExportButton(): Promise<void> {
    const exportBtn = this.page.locator('button:has-text("Export")');
    await exportBtn.click();
  }

   async refreshOrders(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async getOrdersInDateRange(startDate: Date, endDate: Date): Promise<CompleteOrder[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => {
      const orderDate = new Date(order.dateTime);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  async validateOrderDataCompleteness(algoId: string): Promise<boolean> {
    const orderDetails = await this.getOrderDetails(algoId);
    
    const requiredFields: (keyof OrderDetails)[] = [
      'venue',
      'account',
      'algorithmId',
      'status',
      'type',
      'symbol',
      'dateTime',
      'side'
    ];

    return requiredFields.every(field => orderDetails[field] && orderDetails[field].trim() !== '');
  }


  async getOrderCountByStatus(status: string): Promise<number> {
    const orders = await this.getOrdersByStatus(status);
    return orders.length;
  }

  async getOrdersWithMetadata(metadataKey: keyof OrderMetadata): Promise<CompleteOrder[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => order.metadata[metadataKey] !== undefined);
  }
}