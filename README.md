# 🧪 Saucedemo Smoke Suite

Automated smoke test suite for [saucedemo.com](https://www.saucedemo.com) built with **Playwright + TypeScript**, demonstrating cross-browser parallelism, `storageState` authentication, and Trace Viewer debugging.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation framework |
| TypeScript | Typed language for safer, maintainable tests |
| Page Object Model | Separation of concerns design pattern |
| `storageState` | Persistent auth – no repeated UI logins |
| GitHub Actions | Free-tier CI with parallel browser matrix |
| Playwright HTML Report | Built-in visual reporting |
| Trace Viewer | Step-by-step failure analysis |
| JSON | External test data management |

---

## Project Structure

    saucedemo-smoke-suite/
    ├── playwright.config.ts          # Cross-browser + storageState config
    ├── package.json
    ├── tsconfig.json
    ├── README.md
    ├── .gitignore
    │
    ├── .auth/                        # Auto-created at runtime (gitignored)
    │   ├── chromium.json
    │   ├── firefox.json
    │   └── webkit.json
    │
    ├── .github/
    │   └── workflows/
    │       └── playwright.yml        # CI – parallel browser matrix
    │
    ├── tests/
    │   ├── auth.setup.ts             # Runs once per browser, saves storageState
    │   └── smoke/
    │       ├── login.spec.ts
    │       ├── product-catalog.spec.ts
    │       ├── cart.spec.ts
    │       └── checkout.spec.ts      # Includes intentional failure for trace demo
    │
    ├── pages/
    │   ├── LoginPage.ts
    │   ├── InventoryPage.ts
    │   ├── CartPage.ts
    │   ├── CheckoutPage.ts
    │   └── CheckoutCompletePage.ts
    │
    └── utils/
        ├── globalSetup.ts
        ├── helpers.ts
        ├── users.json
        └── checkoutInfo.json

---

## Test Coverage

| Area | Tests | Notes |
|---|---|---|
| Authentication | Valid login, invalid login | Full UI flow – no storageState |
| Product Catalog | Title visible, items listed, sort dropdown | storageState auth |
| Shopping Cart | Add, remove, name match, multi-item count | storageState auth |
| Checkout | Full E2E purchase, empty-field validation, trace demo | storageState auth |

> **Login tests** always use the full UI flow because they exercise the login feature itself.
> **All other tests** skip the login UI by loading a pre-saved `storageState` – faster and isolated.

**Total: 39 tests × 3 browsers running in parallel.**

---

## Key Architecture Decisions

### 1. `storageState` – Auth Once, Run Everywhere

Instead of repeating the login UI flow before every test, this suite logs in once per browser and saves the session to disk:

```
auth.setup.ts → logs in via UI → saves .auth/<browser>.json
                                          ↓
playwright.config.ts loads that file into every subsequent test context
```

Each browser has its own auth file because cookies are domain-scoped per browser engine.

### 2. True Cross-Browser Parallelism

`playwright.config.ts` defines three test projects (Chromium, Firefox, WebKit) with `fullyParallel: true`. GitHub Actions runs them in a matrix so all three browsers execute simultaneously:

```
CI wall-clock time ≈ time for the slowest browser (not the sum of all three)
```

### 3. Trace Viewer – Always On

```ts
trace: 'on',  // every test produces a trace.zip
```

The `checkout.spec.ts` file includes an intentional failure test that simulates a real regression — the confirmation message text doesn't match what the developer expected. The Trace Viewer captures the entire purchase flow before the failure, making it a realistic debugging example.

### 4. `globalSetup` + Per-Browser Setup Specs

```
globalSetup.ts   → creates .auth/ directory (once, before any project)
auth.setup.ts    → logs in and writes storageState (once per browser)
smoke/*.spec.ts  → load storageState, skip login entirely
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher

```bash
node -v
```

---

## Installation

```bash
# Clone
git clone https://github.com/<your-username>/saucedemo-smoke-suite.git
cd saucedemo-smoke-suite

# Install dependencies
npm install

# Install Playwright browser binaries
npx playwright install
```

---

## Running Tests

```bash
# Run everything (all browsers, parallel)
npm test

# Smoke tests only
npm run test:smoke

# Single browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Headed mode (watch the browser)
npm run test:headed

# Interactive UI mode
npm run test:ui

# Debug mode
npm run test:debug
```

### Run only the intentional failure test

```bash
npx playwright test --grep "trace.zip demo" --project=chromium
```

---

## Viewing Reports

### Playwright HTML Report

```bash
npm run report
```

### Trace Viewer

```bash
npx playwright show-trace "$(find test-results -name 'trace.zip' | grep -v retry | grep checkout | head -1)"
```

Or drag and drop any `trace.zip` onto [trace.playwright.dev](https://trace.playwright.dev) — no installation needed.

The Trace Viewer shows:
- A timeline of every action
- Before/after DOM snapshots
- Network requests
- Console logs
- The exact line of code that failed

---

## CI / GitHub Actions

The workflow at `.github/workflows/playwright.yml` runs on every push and pull request. Each browser runs as a separate parallel job:

```
Smoke Tests – chromium   ✅
Smoke Tests – firefox    ✅
Smoke Tests – webkit     ✅
```

`fail-fast: false` ensures all browsers always complete even if one fails.

Artifacts uploaded per run:
- `playwright-report-<browser>/` – HTML report
- `traces-<browser>/` – all trace.zip files

---

## Generating a `trace.zip` Deliverable

```bash
# Run the intentional failure test
npx playwright test --grep "trace.zip demo" --project=chromium

# Open the trace
npx playwright show-trace "$(find test-results -name 'trace.zip' | grep -v retry | grep checkout | head -1)"

# Or copy it to your Desktop
cp "$(find test-results -name 'trace.zip' | grep -v retry | grep checkout | head -1)" ~/Desktop/trace.zip
```

Then upload `trace.zip` to [trace.playwright.dev](https://trace.playwright.dev).

---

## Configuration Reference

| Setting | Value | Reason |
|---|---|---|
| `fullyParallel` | `true` | Specs run in parallel within a project |
| `workers` | `4` on CI, auto locally | Maximize CPU utilisation |
| `retries` | `2` on CI, `1` locally | Absorb transient network flakiness |
| `trace` | `on` | Always capture traces for debugging |
| `screenshot` | `only-on-failure` | Evidence without noise |
| `video` | `retain-on-failure` | Full playback on failures |
| `storageState` | `.auth/<browser>.json` | Skip login UI for non-login tests |

---

## Notes

- Tests use `standard_user` credentials only. Other SauceDemo user types are out of scope for a smoke suite.
- The `.auth/` directory is gitignored — auth state is always regenerated fresh at the start of each run.
- SauceDemo has no real backend API; test data is managed through the UI and storageState session persistence.