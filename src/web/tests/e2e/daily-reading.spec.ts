import { expect, test } from '@playwright/test';

test('renders PDF-spaced January 21 reading', async ({ page }) => {
  await page.goto('/?date=01-21');

  await expect(page.getByRole('heading', { name: 'A MORNING RITUAL' })).toBeVisible();
  await expect(page.getByText('What am I lacking in attaining freedom from passion?')).toBeVisible();
  await expect(page.getByText('What did I fail to do in all these things?')).toBeVisible();
});

test('renders May 22 multiple readings separately', async ({ page }) => {
  await page.goto('/?date=05-22');

  await expect(page.getByRole('heading', { name: 'TODAY IS THE DAY' })).toBeVisible();
  await expect(page.getByText('MARCUS AURELIUS')).toBeVisible();
  await expect(page.getByText('MEDITATIONS, 8.22')).toBeVisible();
  await expect(page.getByText('SENECA')).toBeVisible();
  await expect(page.getByText('MEDEA, 423–425')).toBeVisible();
});

test('does not show previous today next buttons', async ({ page }) => {
  await page.goto('/?date=12-26');

  await expect(page.getByRole('button', { name: 'Previous' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Today' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Next' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'LIFE IS LONG—IF YOU KNOW HOW TO USE IT' })).toBeVisible();
});
