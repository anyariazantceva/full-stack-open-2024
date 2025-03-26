const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        username: 'Adam55',
        name: 'Adam55',
        password: 'testadampassword'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const usernameInput = await page.getByTestId('username')
    const passwordInput = await page.getByTestId('password')
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  describe("Login", () => {
    test("Succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "Adam55", "testadampassword")
      await expect(page.getByText('Adam55')).toBeVisible()
    })

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "Adam55", "wrongpassword")
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "Adam55", "testadampassword")
      await createBlog(page, "New blog created by playwright", "Test author", "test@test.com")

    })

    test('a new blog can be created', async ({ page }) => {
      await expect(await page.getByText('New blog created by playwright')).toBeVisible()
    })

    test('a blog can be likable', async ({ page }) => {
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click();
      await expect(await page.getByText("likes", { exact: false })).toContainText("1")
    })

    test('a blog can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'show' }).click()

      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()
      await expect(await page.getByText("No blogs available")).toBeVisible()
    })

  })
})
