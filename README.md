# UI Automation - Playwright

Automated UI tests for Mageplaza using Playwright + TypeScript with Page Object Model (POM).

## Features

- User Registration (valid & invalid data)
- User Login (valid & invalid credentials)
- Checkout Flow (billing, cart, quantity)

## Tech Stack

- Playwright
- TypeScript
- Node.js

## Installation

```bash
git clone <repo-url>
cd <project-folder>
npm install
npx playwright install
```

## Run Tests

- All tests: `npx playwright test`
- Headed mode: `npx playwright test --headed`
- Debug mode: `npx playwright test --debug`

## Reports

`npx playwright show-report` to open HTML test report

## Environment Variables

- `BASE_URL`
- `EMAIL`
- `PASSWORD`

## Notes

- Page Object Model used for maintainability
- Shared fixtures for test data

## Author

Tereza Khachatryan
