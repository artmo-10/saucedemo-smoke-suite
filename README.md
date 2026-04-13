# 🧪 Saucedemo Smoke Suite

Automated smoke test suite for [saucedemo.com](https://www.saucedemo.com) built with **Playwright + TypeScript**, following the **Page Object Model** pattern with **Allure** reporting.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation framework |
| TypeScript | Typed language for safer, more maintainable tests |
| Page Object Model | Design pattern for separation of concerns |
| Allure | Visual test reporting |
| JSON | External test data management |

---

## Project Structure

    saucedemo-smoke-suite/
    ├── playwright.config.ts
    ├── package.json
    ├── README.md
    ├── tests/
    │   └── smoke/
    │       ├── login.spec.ts
    │       ├── product-catalog.spec.ts
    │       ├── cart.spec.ts
    │       └── checkout.spec.ts
    ├── pages/
    │   ├── LoginPage.ts
    │   ├── InventoryPage.ts
    │   ├── CartPage.ts
    │   ├── CheckoutPage.ts
    │   └── CheckoutCompletePage.ts
    └── utils/
        ├── users.json
        ├── checkoutInfo.json
        └── helpers.ts

---

## Test Coverage

| Area | Tests | Type |
|---|---|---|
| Authentication | Valid login, invalid login | UI |
| Product Catalog | Items render, count validation | UI |
| Shopping Cart | Add item, remove item, multiple items | UI |
| Checkout | Full E2E purchase flow | UI |

> Non-login tests bypass UI authentication via **cookie injection** (session-username cookie),
> improving execution speed and isolating test concerns from the login flow.
> Login tests always use the full UI flow.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher

Verify it is installed:

```bash
node -v
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/artmo-10/saucedemo-smoke-suite.git
cd saucedemo-smoke-suite

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## Running Tests

```bash
# Run all tests (Chromium, Firefox, WebKit)
npm test

# Run smoke tests only
npm run test:smoke

# Run with visible browser
npm run test:headed

# Run on a specific browser only
npx playwright test --project=chromium
```

---

## Viewing Reports

### Allure Report (recommended)

```bash
npm run allure:serve
```

Or as two separate steps:

```bash
npm run allure:generate
npm run allure:open
```

### Playwright Built-in Report

```bash
npx playwright show-report
```

### Trace Viewer

Traces are captured on failure. To inspect a trace, upload the zip file at
[trace.playwright.dev](https://trace.playwright.dev) — no installation required.

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value | Reason |
|---|---|---|
| `baseURL` | `https://www.saucedemo.com` | Target application |
| `retries` | `1` | One retry to reduce flakiness noise |
| `workers` | `1` | Sequential execution for stability |
| `screenshot` | `only-on-failure` | Evidence on failure without noise |
| `trace` | `retain-on-failure` | Detailed debugging on failure only |

---

## Notes

- Tests use `standard_user` credentials only. Other Saucedemo user types are out of scope for a smoke suite.
- Saucedemo has no real API, so test data is managed through the UI and cookie-level session injection.