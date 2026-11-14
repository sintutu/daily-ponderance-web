# Contribute

Please contribute ideas and changes that make the daily ponderance easier to read and share. The app is intended to run locally for a meeting host; hosting and a mobile app are future possibilities.

## Getting started

Install the web app dependencies from the project folder:

```sh
cd src/web
npm install
cd ../..
```

Run the automated checks from the project folder:

```sh
npm test
npm run test:e2e
npm run build
cd src/web && npm run lint
```

`npm test` runs the quick simulated-browser tests once. `npm run test:e2e` runs the app in Chromium and checks complete user journeys. The first local Playwright run may need its browser installed with `cd src/web && npx playwright install chromium`. A failed test names the behavior that did not match expectations; read the assertion and nearby test to see what the app was expected to do. Build and lint are separate checks.

To inspect and rerun browser tests interactively, use `npx playwright test --ui` from the project folder. The root Playwright config keeps this UI focused on `src/web/e2e`, separate from the Vitest files.

GitHub Actions runs the unit tests, Chromium end-to-end tests, and production build on pushes and pull requests.

## Requirements covered by tests

| App behavior | Test | What a passing test tells you |
| --- | --- | --- |
| Open the reading, preamble, and message pages; navigate between them and use browser Back | `src/App.test.tsx` — “opens each page…” | Each page is reachable, and browser history returns to the previous page. |
| Choose a day on the reading calendar | `src/App.test.tsx` — “chooses a reading date…” | Picking a calendar day updates the displayed reading date. |
| Format reading dates with the right ordinal and use the Pacific calendar day | `src/pages/DailyReading.test.tsx` | Dates such as the 1st, 11th, and 21st get the right ending, and the daily date follows Pacific time. |
| Expand direct messages and copy one | `src/App.test.tsx` — “expands direct messages…” | The messages can be revealed and copying reports success. |
| Show a useful message when copying is denied | `src/App.test.tsx` — “shows copy failure…” | A clipboard failure is visible instead of a success message. |
| Open the last five minutes reminder and close it | `src/App.test.tsx` — “opens and closes the meeting reminder” | The reminder appears at its scheduled time and can be dismissed. |
| Verify key user journeys in a real Chromium browser | `e2e/app.spec.ts` | The app works in a real browser for navigation, date selection, copy permissions, and the scheduled reminder. |
| Fire at 9:50 a.m. Pacific and save the day it fired | `src/hooks/usePacificAlert.test.tsx` — “fires at 9:50…” | The trigger uses Pacific time and records that day's reminder. |
| Avoid a second reminder on the same Pacific day | `src/hooks/usePacificAlert.test.tsx` — “does not repeat…” | A repeat visibility check does not show the reminder twice. |
| Check again when a hidden page becomes visible | `src/hooks/usePacificAlert.test.tsx` — “waits while the page is hidden…” | A hidden tab can catch up when it becomes visible after the scheduled time. |

Date behavior is exercised with a fixed clock where timing matters, so test results do not depend on the contributor's current time. The app's date display and copy behavior are covered through its visible controls.

## Adding or changing a test

Put a test next to the code it covers, use a fixed date for time-sensitive behavior, and describe the user-visible result in plain language. If you change an app requirement, update both the test and the table above. Keep the test focused on what a person can observe rather than internal implementation details.

## QA approach for future changes

Use a small test pyramid: add focused Vitest tests for date rules, component behavior, and other logic first; add Playwright tests when a change needs confidence in a complete user journey or real-browser behavior. Vitest tests may live beside the source they cover under `src/`. Playwright tests belong in `e2e/`, where they run against the app in Chromium. These layers complement each other: lower-level tests are quick and precise, while a smaller number of browser tests protect the most important end-to-end paths. Choose tests based on the behavior and regression risk, and keep the requirements table above aligned with the coverage.

## Manual check before contributing

Automated browser tests run in Chromium at a desktop viewport. They do not confirm appearance on every device or browser, or whether the reading and message wording is correct. Before contributing a user-facing change, run the app with `npm start`, check the affected page at desktop and phone widths, try its main interaction in your browser, and review any changed reading or message text.
