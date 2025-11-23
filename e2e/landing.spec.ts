import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Sacred Journal' })).toBeVisible()
  })

  test('should display the tagline', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Transformation of consciousness is the basis for all transformation')).toBeVisible()
  })

  test('should display core values', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Gratitude')).toBeVisible()
    await expect(page.getByText('Service')).toBeVisible()
    await expect(page.getByText('Growth')).toBeVisible()
    await expect(page.getByText('Responsibility')).toBeVisible()
  })

  test('should display feature cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Voice-First Reflection')).toBeVisible()
    await expect(page.getByText('Personal Constitution')).toBeVisible()
    await expect(page.getByText('Working Memory')).toBeVisible()
    await expect(page.getByText('Personality-Aware Guidance')).toBeVisible()
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/')

    const signupButton = page.getByRole('link', { name: 'Begin Your Journey' })
    await expect(signupButton).toBeVisible()
    await expect(signupButton).toHaveAttribute('href', '/auth/signup')

    const signinButton = page.getByRole('link', { name: 'Continue Your Path' })
    await expect(signinButton).toBeVisible()
    await expect(signinButton).toHaveAttribute('href', '/auth/signin')
  })

  test('should display philosophy quote', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/greatest wealth is in this way of life/)).toBeVisible()
  })

  test('should display approach section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Not a Sycophant')).toBeVisible()
    await expect(page.getByText('Deep Listening')).toBeVisible()
    await expect(page.getByText('Sacred Container')).toBeVisible()
  })
})
