/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: 'npm run build && npm run preview',
    port: 3000,
  },
  testMatch: /.*\.e2e\.(js|ts|mjs)/,
}

export default config
