# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: application/greenways-os/extension/test/launcher.spec.js >> two launchers converge globally, isolate surfaces, and survive a cold worker restart
- Location: application/greenways-os/extension/test/launcher.spec.js:203:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('status')
Expected substring: "Local kernel ready"
Received string:    ""

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByRole('status')

```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```