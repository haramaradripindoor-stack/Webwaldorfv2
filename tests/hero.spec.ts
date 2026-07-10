import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Hero Section (Tier 1)', () => {
  test('test_hero_video_exists: video background should be present', async ({ page }) => {
    const video = page.locator('section#inicio video');
    await expect(video).toBeAttached();
  });

  test('test_hero_title_present: title should be visible and contain the main text', async ({ page }) => {
    const title = page.locator('section#inicio h1');
    await expect(title).toBeVisible();
    // Use regex to match since inline-block words concatenate without spaces in textContent
    await expect(title).toContainText(/Donde.*el.*niño.*camina.*con.*voluntad/);
  });

  test('test_hero_audio_control_present: audio control button should exist', async ({ page }) => {
    const audioBtn = page.locator('button:has-text("Atmósfera")');
    await expect(audioBtn).toBeVisible();
  });
});

test.describe('Hero Section Interactions (Tier 2)', () => {
  test('test_hero_audio_toggle: clicking atmosphere button toggles mute state', async ({ page }) => {
    const video = page.locator('section#inicio video');
    const audioBtn = page.locator('button:has-text("Atmósfera")');

    // Initially video is muted
    const initialMuted = await video.evaluate((el: HTMLVideoElement) => el.muted);
    expect(initialMuted).toBe(true);

    // Click button to unmute
    await audioBtn.click();
    
    // Video should not be muted
    const newMuted = await video.evaluate((el: HTMLVideoElement) => el.muted);
    expect(newMuted).toBe(false);
  });
});
