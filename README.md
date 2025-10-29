Brief Overview of Testing Approach
Our testing approach focuses on ensuring end-to-end reliability, functional correctness, and performance stability of the application. We adopt a layered testing strategy:
•	Unit Testing: Verifies individual functions and modules in isolation.
•	Integration Testing: Ensures communication and data flow between different modules (e.g., account management, trading, and reporting).
•	End-to-End (E2E) Testing: Simulates real user workflows across the application, covering scenarios such as account creation, trading, fund transfers, and analytics.
•	Regression Testing: Ensures that new changes do not break existing functionality.
•	Performance/Load Testing: Evaluates critical pages (e.g., Post Trade-Analytics, Market Charts) for responsiveness and stability under heavy usage.
Emphasized reliability, maintainability, and reusability through structured test design patterns such as the Page Object Model (POM) and helper functions for common workflows.
Test Categories Planned
The following test categories are planned for comprehensive coverage:
1.	Authentication & Authorization: Login, logout, invalid credentials
2.	Account Management: Add, modify, delete accounts; account validation across multiple exchanges.
3.	Trading Workflows: Order placement, cancellation, modification, fill progress validation.
4.	Market Data & Analytics: Real-time charts – GoMarket.
5.	UI/UX Validation: Keyboard shortcuts, error message consistency, table updates, and notifications.
6.	Performance & Stability: Page load times, high-volume trading.

3. Tools and Frameworks Chosen
Tool/Framework	Purpose	Reason
Playwright	Testing	Supports multi-browser automation, fast execution, reliable element handling, built-in reporting.
Typescript	Test Scripting	Provides type safety, better maintainability, and integration with Playwright.
Allure Reporting	Test Reporting	Generates detailed HTML reports with screenshots, logs, and execution traces for easier debugging.
Page Object Model (POM)	Test Structure	
Improves reusability, readability, and maintainability of automation scripts.


How to Run the Test Suite
1.	Install dependencies:
npm install
2.	Run all E2E tests with Playwright:
npx playwright test
3.	Run tests in specific browser:
npx playwright PomTest.spec.ts --project=chromium
npx playwright PomTest.spec.ts --project=firefox
npx playwright PomTest.spec.ts --project=webkit
4.	Generate Allure Report:
npx playwright test --reporter=allure-playwright
allure serve allure-results
npm run allure:generate
npm run allure:open

While pushing the files into Github repository Allure reporting files were causing issues hence I was not able to upload those test evidence.
npx playwright test --reporter=html
