const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const screenshotDir = path.resolve(__dirname, '..', 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  // Admin Screenshots
  console.log('--- CAPTURING ADMIN DASHBOARD ---');
  const adminPage = await context.newPage();
  await adminPage.setViewportSize({ width: 1440, height: 900 });
  
  // Step 1: Login
  console.log('Admin: Performing Login...');
  await adminPage.goto('http://localhost:5174/login', { waitUntil: 'networkidle' });
  await adminPage.fill('input[type="email"]', 'admin@skillswap.id');
  await adminPage.fill('input[type="password"]', 'password');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForURL('**/dashboard');
  await adminPage.waitForTimeout(2000); 

  const adminPages = [
    { url: 'http://localhost:5174/dashboard', name: 'admin_dashboard.png' },
    { url: 'http://localhost:5174/users', name: 'admin_users.png' },
    { url: 'http://localhost:5174/activities', name: 'admin_activities.png' },
    { url: 'http://localhost:5174/reports', name: 'admin_reports.png' }
  ];

  for (const pageInfo of adminPages) {
    console.log(`Admin Trace: ${pageInfo.url}...`);
    try {
      await adminPage.goto(pageInfo.url, { waitUntil: 'networkidle' });
      await adminPage.waitForTimeout(2000);
      await adminPage.screenshot({ path: path.join(screenshotDir, pageInfo.name) });
    } catch (e) {
      console.error(`Failed Admin ${pageInfo.url}: ${e.message}`);
    }
  }
  await adminPage.close();

  // Mobile Screenshots (Flutter Web - Login Bypassed in Code)
  console.log('--- CAPTURING MOBILE UI ---');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 812 });
  
  console.log('Mobile: Navigating straight to App...');
  await mobilePage.goto('http://localhost:8080/#/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(8000); // Give Flutter time to load interior

  const mobilePages = [
    { url: 'http://localhost:8080/#/home', name: 'mobile_home.png' },
    { url: 'http://localhost:8080/#/search', name: 'mobile_search.png' },
    { url: 'http://localhost:8080/#/swap', name: 'mobile_swap.png' },
    { url: 'http://localhost:8080/#/profile', name: 'mobile_profile.png' }
  ];

  for (const pageInfo of mobilePages) {
    console.log(`Mobile Trace: ${pageInfo.url}...`);
    try {
      await mobilePage.goto(pageInfo.url, { waitUntil: 'networkidle' });
      await mobilePage.waitForTimeout(4000);
      await mobilePage.screenshot({ path: path.join(screenshotDir, pageInfo.name) });
    } catch (e) {
      console.error(`Failed Mobile ${pageInfo.url}: ${e.message}`);
    }
  }
  await mobilePage.close();

  await browser.close();
  console.log('Capture complete!');
}

capture().catch(console.error);
