import {test, expect} from '@playwright/test';

test('theme choice survives navigation and reload, with keyboard operation', async ({page}) => {
  await page.goto('/');
  const toggle=page.locator('#theme-toggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAccessibleName('Switch to light mode');
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  await page.goto('/heic-to-avif/');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await toggle.click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('theme still switches when browser storage is unavailable', async ({page}) => {
  const errors: string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage unavailable');}}));
  await page.goto('/blog/');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  expect(errors).toEqual([]);
});

test('theme choice synchronizes between open tabs', async ({page, context}) => {
  await page.goto('/');
  const second=await context.newPage();
  await second.goto('/heic-to-jpg/');
  await page.locator('#theme-toggle').click();
  await expect(second.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(second.locator('#theme-toggle')).toHaveAccessibleName('Switch to light mode');
  await second.close();
});
