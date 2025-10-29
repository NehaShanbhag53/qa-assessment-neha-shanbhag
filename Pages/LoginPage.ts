import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly userIdElement: Locator;
  readonly emailValidationMessage: Locator;
  readonly passwordValidationMessage: Locator;
  readonly emailEmptyError: Locator;
  readonly logoutMenuTrigger: Locator;
  readonly logoutMenuItem: Locator;

  private readonly defaultTimeout: number = 120000; 

  constructor(page: Page) {
    this.page = page;
    this.loginInput = page.locator("//input[@placeholder='Enter your email address']");
    this.passwordInput = page.locator("//input[@placeholder='Enter your password']");
    this.loginButton = page.locator("//button[@type='submit']");
    this.errorMessage = page.locator("//div[@role='alert']/div");
    this.userIdElement = page.locator("//span[@class='text-muted-foreground truncate']");
    this.emailValidationMessage = page.locator("//div[@class='text-sm [&_p]:leading-relaxed']");
    this.passwordValidationMessage = page.locator("//div[@class='text-sm [&_p]:leading-relaxed']");
    this.emailEmptyError = page.locator("//p[@id='_r_2q_-form-item-message']")
    this.logoutMenuTrigger = page.locator("//span[@class='text-muted-foreground truncate']");
    this.logoutMenuItem = page.locator("//div[@role='menuitem']");
  }

  async goto(): Promise<void> {
    await this.page.goto('https://test1.gotrade.goquant.io/auth/login', {
      waitUntil: 'networkidle',
      timeout: 1200000
    });

    await this.page.waitForLoadState('domcontentloaded', { timeout: this.defaultTimeout });
    await this.page.waitForLoadState('load', { timeout: this.defaultTimeout });
    
    await this.page.waitForTimeout(5000);
  }

  async login(email: string, password: string): Promise<void> {
 
    await this.loginInput.waitFor({ 
      state: 'visible', 
      timeout: this.defaultTimeout 
    });
    await this.loginInput.waitFor({ 
      state: 'attached', 
      timeout: this.defaultTimeout 
    });
    
     await this.page.waitForTimeout(2000);
    await this.loginInput.click();
    await this.loginInput.fill(email);
    
    await this.page.waitForTimeout(1000);

    await this.passwordInput.waitFor({ 
      state: 'visible', 
      timeout: this.defaultTimeout 
    });
    await this.passwordInput.waitFor({ 
      state: 'attached', 
      timeout: this.defaultTimeout 
    });
    
    await this.page.waitForTimeout(2000);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    
    await this.page.waitForTimeout(1000);

    await this.loginButton.waitFor({ 
      state: 'visible', 
      timeout: this.defaultTimeout 
    });
    await this.loginButton.waitFor({ 
      state: 'attached', 
      timeout: this.defaultTimeout 
    });
 
    await this.page.waitForTimeout(2000);
    await this.loginButton.click();
 
    await Promise.race([
      this.page.waitForNavigation({ 
        timeout: this.defaultTimeout,
        waitUntil: 'networkidle'
      }).catch(() => {}),
      this.page.waitForTimeout(15000)
    ]);
 
    await this.page.waitForTimeout(5000);
   async function closePopupSafely(page: Page) {

  await page.waitForSelector('text=Welcome to GoTrade!', { timeout: 10000 });
  
  await page.getByText('Get Started').click();
  await page.waitForSelector('text=Welcome to GoTrade!', { state: 'hidden' });
}
}

  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ 
        state: 'visible', 
        timeout: 30000 
      });
      return await this.errorMessage.textContent();
    } catch (error) {
      return null;
    }
  }

  async getUsername(): Promise<Locator> {
    await this.userIdElement.waitFor({ 
      state: 'visible', 
      timeout: this.defaultTimeout 
    });
    return this.userIdElement;
  }

  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: this.defaultTimeout });
    await this.page.waitForTimeout(3000);
  }

  async getEmailValidationMessage(): Promise<string | null> {
    try {
      await this.emailValidationMessage.waitFor({ 
        state: 'visible', 
        timeout: 30000 
      });
      return await this.emailValidationMessage.textContent();
    } catch (error) {
      return null;
    }
  }
  async getEmailEmptyError(): Promise<string | null> {
    try {
      await this.emailEmptyError.waitFor({ 
        state: 'visible', 
        timeout: 30000 
      });
      return await this.emailEmptyError.textContent();
    } catch (error) {
      return null;
    }
  }
  async getPasswordValidationMessage(): Promise<string | null> {
    try {
      await this.passwordValidationMessage.waitFor({ 
        state: 'visible', 
        timeout: 30000 
      });
      return await this.passwordValidationMessage.textContent();
    } catch (error) {
      return null;
    }
  }

  async verifyErrorMessage(expectedText: string, timeout: number = 60000): Promise<void> {
    await this.errorMessage.waitFor({ 
      state: 'visible', 
      timeout 
    });
    const errorText = await this.errorMessage.textContent();
    if (!errorText?.includes(expectedText)) {
      throw new Error(`Expected error message to contain "${expectedText}" but got "${errorText}"`);
    }
  }
    async logout(): Promise<void> {
     await this.logoutMenuTrigger.waitFor({ 
      state: 'visible', 
      timeout: this.defaultTimeout 
    });
    await this.logoutMenuTrigger.click();
 
    await this.page.waitForTimeout(1000);
 
    await this.logoutMenuItem.waitFor({ 
      state: 'visible', 
      timeout: this.defaultTimeout 
    });
    await this.logoutMenuItem.click();
 
    await Promise.race([
      this.page.waitForNavigation({ 
        timeout: this.defaultTimeout,
        waitUntil: 'networkidle'
      }).catch(() => {}),
      this.page.waitForTimeout(10000)
    ]);
     await this.page.waitForTimeout(3000);
  }

}