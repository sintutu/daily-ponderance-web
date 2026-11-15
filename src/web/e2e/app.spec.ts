import { expect, test } from '@playwright/test';

test('navigate between pages and return with browser Back', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'YOU CHOOSE THE OUTCOME' })).toBeVisible();

  await page.getByRole('link', { name: 'Preamble' }).click();
  await expect(page.getByRole('heading', { name: 'Preamble' })).toBeVisible();
  await page.getByRole('link', { name: 'Items to paste in chat' }).click();
  await expect(page.getByRole('heading', { name: 'Items to paste in chat' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Preamble' })).toBeVisible();
});

test('choose a reading date from the calendar', async ({ page }) => {
  await page.goto('/daily-ponderance');
  await page.locator('.date-picker-trigger').click();
  await expect(page.getByRole('dialog', { name: 'Choose a date' })).toBeVisible();
  await page.getByRole('button', { name: '1', exact: true }).click();
  await expect(page.locator('.reading-date')).toContainText('1st');
});

test('expand direct messages and copy one with visible success feedback', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/items-to-paste-in-chat');
  const toggle = page.getByRole('button', { name: 'Show direct messages' });
  await toggle.click();
  const firstMessage = page.getByRole('button', { name: /Copy message: Please turn off video/ });
  await expect(firstMessage).toBeVisible();
  await firstMessage.click();
  await expect(firstMessage.getByRole('status')).toHaveText('Message copied to clipboard.');
});

test('show copy failure feedback when clipboard permission is denied', async ({ page, context }) => {
  await context.grantPermissions([]);
  await page.goto('/daily-ponderance');
  await page.getByRole('button', { name: 'Click to copy' }).click();
  await expect(page.getByRole('button', { name: 'Copy failed' })).toBeVisible();
});

test('open and close the meeting reminder at 9:50 a.m. Pacific', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-15T17:49:59Z') });
  await page.goto('/daily-ponderance');
  await page.clock.runFor(1_000);
  const reminder = page.getByRole('alertdialog');
  await expect(reminder).toBeVisible();
  await reminder.getByRole('button', { name: 'Close' }).click();
  await expect(reminder).toBeHidden();
});
