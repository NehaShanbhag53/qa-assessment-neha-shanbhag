import { Page, Locator, expect } from '@playwright/test';
export class AccountTablePage {
    readonly page: Page;
    readonly venuesTable: Locator;
    readonly tableRows: Locator;
    readonly venueColumn: Locator;
    readonly accountNameColumn: Locator;
    readonly accountKeyColumn: Locator;
    readonly accountTypeColumn: Locator;
    readonly statusColumn: Locator;
    readonly actionsColumn: Locator;

    constructor(page: Page) {
        this.page = page;
 
        this.venuesTable = page.locator('table.w-full');
        this.tableRows = page.locator('tbody[class*="last-child"] tr');
        this.venueColumn = page.locator("//div[@class='flex flex-row items-center']");
        this.accountNameColumn = page.locator("//div[@class='font-inter text-xsm 4k:text-[16px] flex min-h-max min-w-max items-center justify-start']");
        this.accountKeyColumn = page.locator("//p[@class='font-inter text-xsm 4k:text-[16px] flex min-h-max min-w-max items-center justify-start']");
        this.accountTypeColumn = page.locator('td[data-testid="venues-table-cell-0-is_testnet"]');
        this.statusColumn = page.locator('td[data-testid="venues-table-cell-0-status"]');
        this.actionsColumn = page.locator('td[data-testid="venues-table-cell-0-accountAction"]');
    }

    /**
     * 
     * @returns 
     */
    async isTableVisible(): Promise<boolean> {
        return await this.venuesTable.isVisible();
    }

    /**
     * 
     * @returns 
     */
    async getRowCount(): Promise<number> {
        return await this.tableRows.count();
    }

    /**
     * 
     * @param rowIndex 
     * @returns 
     */
    async getVenueName(rowIndex: number): Promise<string> {
        return await this.venueColumn.nth(rowIndex).textContent() || '';
    }

    /**
     * 
     * @param rowIndex 
     * @returns 
     */
    async getAccountName(rowIndex: number): Promise<string> {
        return await this.accountNameColumn.nth(rowIndex).textContent() || '';
    }

    /**
     * 
     * @param rowIndex 
     * @returns 
     */
    async getAccountKey(rowIndex: number): Promise<string> {
        return await this.accountKeyColumn.nth(rowIndex).textContent() || '';
    }

    /**
     * 
     * @param rowIndex 
     * @returns 
     */
    async getAccountType(rowIndex: number): Promise<string> {
        return await this.accountTypeColumn.nth(rowIndex).textContent() || '';
    }

    /**
     * 
     * @param rowIndex 
     * @returns 
     */
    async isStatusVisible(rowIndex: number): Promise<boolean> {
        return await this.statusColumn.nth(rowIndex).isVisible();
    }

    /**
     * 
     * @param rowIndex 
     * @returns 
     */
    async areActionsVisible(rowIndex: number): Promise<boolean> {
        const actionsCell = this.actionsColumn.nth(rowIndex);
        const modifyBtn = actionsCell.locator('button:has-text("Modify")');
        const deleteBtn = actionsCell.locator('button:has-text("Delete")');
        
        return (await modifyBtn.isVisible()) && (await deleteBtn.isVisible());
    }

    /**
     * 
     * @param accountName 
     * @returns 
     */
    async findRowIndexByAccountName(accountName: string): Promise<number> {
        const count = await this.accountNameColumn.count();
        for (let i = 0; i < count; i++) {
            const text = await this.accountNameColumn.nth(i).textContent();
            if (text?.trim() === accountName) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 
     * @param accountName 
     * @returns 
     */
    async isAccountDisplayed(accountName: string): Promise<boolean> {
        const rowIndex = await this.findRowIndexByAccountName(accountName);
        return rowIndex !== -1;
    }

    /**
     * 
     * @param rowIndex 
     * @returns 
     */
    async getAccountRowData(rowIndex: number): Promise<AccountRowData> {
        return {
            venue: await this.getVenueName(rowIndex),
            accountName: await this.getAccountName(rowIndex),
            accountKey: await this.getAccountKey(rowIndex),
            accountType: await this.getAccountType(rowIndex)
        };
    }

    /**
     * 
     * @returns 
     */
    async getAllAccountNames(): Promise<string[]> {
        const count = await this.accountNameColumn.count();
        const names: string[] = [];
        for (let i = 0; i < count; i++) {
            const name = await this.accountNameColumn.nth(i).textContent();
            names.push(name || '');
        }
        return names;
    }

    /**
     * 
     * @param accountName 
     * @returns 
     * @throws 
     */
    async getAccountDataByName(accountName: string): Promise<AccountRowData> {
        const rowIndex = await this.findRowIndexByAccountName(accountName);
        if (rowIndex === -1) {
            throw new Error(`Account '${accountName}' not found in table`);
        }
        return await this.getAccountRowData(rowIndex);
    }

    /**
     * 
     * @param timeout
     */
    async waitForTableToLoad(timeout: number = 30000): Promise<void> {
        await this.venuesTable.waitFor({ state: 'visible', timeout });
        await this.page.waitForTimeout(500); 
    }

    /**
     * 
     * @param rowIndex 
     * @param expectedData 
     * @returns 
     */
    async verifyRowData(rowIndex: number, expectedData: ExpectedAccountData): Promise<VerificationResult> {
        const actualData = await this.getAccountRowData(rowIndex);
        return {
            venue: actualData.venue.trim() === expectedData.venue,
            accountName: actualData.accountName.trim() === expectedData.accountName,
            accountKey: actualData.accountKey.includes('*****'),
            accountType: actualData.accountType.trim() === expectedData.accountType
        };
    }

    /**
     * 
     * @param rowIndex 
     */
    async clickModifyButton(rowIndex: number): Promise<void> {
        const actionsCell = this.actionsColumn.nth(rowIndex);
        const modifyBtn = actionsCell.locator('button:has-text("Modify")');
        await modifyBtn.click();
    }

    /**
     * 
     * @param rowIndex 
     */
    async clickDeleteButton(rowIndex: number): Promise<void> {
        const actionsCell = this.actionsColumn.nth(rowIndex);
        const deleteBtn = actionsCell.locator('button:has-text("Delete")');
        await deleteBtn.click();
    }

    /**
     * 
     * @param expectedAccounts 
     * @returns 
     */
    async verifyAllAccountsDisplayed(expectedAccounts: string[]): Promise<boolean> {
        for (const accountName of expectedAccounts) {
            const isDisplayed = await this.isAccountDisplayed(accountName);
            if (!isDisplayed) {
                return false;
            }
        }
        return true;
    }

    /**
     * 
     * @returns 
     */
    async verifyAllApiKeysMasked(): Promise<boolean> {
        const rowCount = await this.getRowCount();
        
        for (let i = 0; i < rowCount; i++) {
            const accountKey = await this.getAccountKey(i);
            if (!accountKey.includes('*****')) {
                return false;
            }
        }
        return true;
    }
}

// Type definitions
export interface AccountRowData {
    venue: string;
    accountName: string;
    accountKey: string;
    accountType: string;
}

export interface ExpectedAccountData {
    venue: string;
    accountName: string;
    accountType: string;
}

export interface VerificationResult {
    venue: boolean;
    accountName: boolean;
    accountKey: boolean;
    accountType: boolean;
}