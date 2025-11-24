import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.describe('Sign In Page', () => {
    test('should display sign in form', async ({ page }) => {
      await page.goto('/auth/signin')
      await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
      await expect(page.getByLabel('Email')).toBeVisible()
      await expect(page.getByLabel('Password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    })

    test('should have link to sign up', async ({ page }) => {
      await page.goto('/auth/signin')
      await expect(page.getByRole('link', { name: /Sign up/i })).toBeVisible()
    })

    test('should show validation on empty submit', async ({ page }) => {
      await page.goto('/auth/signin')
      await page.getByRole('button', { name: 'Sign in' }).click()
      // Browser validation should prevent submission
      await expect(page.getByLabel('Email')).toBeFocused()
    })

    test('should validate email format', async ({ page }) => {
      await page.goto('/auth/signin')
      await page.getByLabel('Email').fill('invalid-email')
      await page.getByLabel('Password').fill('password123')
      await page.getByRole('button', { name: 'Sign in' }).click()
      // Browser validation should catch invalid email
    })
  })

  test.describe('Sign Up Page', () => {
    test('should display sign up form', async ({ page }) => {
      await page.goto('/auth/signup')
      await expect(page.getByRole('heading', { name: 'Begin your journey' })).toBeVisible()
      await expect(page.getByLabel('Email')).toBeVisible()
      await expect(page.getByLabel('Password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
    })

    test('should have link to sign in', async ({ page }) => {
      await page.goto('/auth/signup')
      await expect(page.getByRole('link', { name: /Sign in/i })).toBeVisible()
    })

    test('should show password requirements hint', async ({ page }) => {
      await page.goto('/auth/signup')
      await expect(page.getByText(/6 characters/i)).toBeVisible()
    })
  })
})
