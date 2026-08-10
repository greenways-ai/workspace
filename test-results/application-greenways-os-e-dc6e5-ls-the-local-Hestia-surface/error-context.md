# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: application/greenways-os/extension/test/launcher.spec.js >> launcher restores system apps and installs the local Hestia surface
- Location: application/greenways-os/extension/test/launcher.spec.js:171:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator:  getByRole('region', { name: 'Installed apps' }).getByRole('heading', { name: 'Greenways Home' })
Expected: visible
Received: undefined

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('region', { name: 'Installed apps' }).getByRole('heading', { name: 'Greenways Home' })

```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```