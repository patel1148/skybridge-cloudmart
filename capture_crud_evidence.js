/**
 * Automated Browser Verification Script using Puppeteer-Core
 * Captures all 8 required Task 2.2 CRUD evidence screenshots.
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.resolve(__dirname, '../Screenshots/Task_2_App_CRUD');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching headless Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 960, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Dialog auto-accept for deletes
  page.on('dialog', async dialog => {
    console.log(`[Browser Dialog] ${dialog.type()}: ${dialog.message()}`);
    await dialog.accept();
  });

  try {
    // ------------------------------------------------------------------------
    // FLOW 1: Customer Registration Validation
    // ------------------------------------------------------------------------
    console.log('\n--- Capturing Flow 1: Registration Validation ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(800);

    // Scroll to Auth Section
    await page.evaluate(() => {
      document.querySelector('#authSection').scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await sleep(400);

    // Enter invalid inputs
    await page.type('#regFullName', 'Al', { delay: 30 }); // <3 chars
    await page.type('#regEmail', 'invalid-user-email', { delay: 30 });
    await page.type('#regPassword', '123', { delay: 30 }); // <6 chars

    await page.click('#btnSubmitRegister');
    await sleep(600);

    const shot1Path = path.join(OUTPUT_DIR, '01_Customer_Registration_Validation.png');
    await page.screenshot({ path: shot1Path, fullPage: false });
    console.log('Saved:', shot1Path);

    // ------------------------------------------------------------------------
    // FLOW 2: Customer Registration Success
    // ------------------------------------------------------------------------
    console.log('\n--- Capturing Flow 2: Registration Success ---');
    await page.evaluate(() => {
      document.querySelector('#regFullName').value = '';
      document.querySelector('#regEmail').value = '';
      document.querySelector('#regPassword').value = '';
    });

    await page.type('#regFullName', 'Elena Vance', { delay: 30 });
    await page.type('#regEmail', 'elena.vance@customer.co.nz', { delay: 30 });
    await page.type('#regPassword', 'SecureCloud2026!', { delay: 30 });

    await page.click('#btnSubmitRegister');
    await sleep(1000);

    const shot2Path = path.join(OUTPUT_DIR, '02_Customer_Registration_Success.png');
    await page.screenshot({ path: shot2Path, fullPage: false });
    console.log('Saved:', shot2Path);

    // ------------------------------------------------------------------------
    // FLOW 3: Customer Login and Catalog
    // ------------------------------------------------------------------------
    console.log('\n--- Capturing Flow 3: Customer Login & Catalog ---');
    // Login as Customer Jay Kumar
    await page.evaluate(() => {
      document.querySelector('#loginEmail').value = 'jaykumar@customer.co.nz';
      document.querySelector('#loginPassword').value = 'Customer@123';
      document.querySelector('#formLogin').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await sleep(1000);

    // Scroll down to Storefront Catalog
    await page.evaluate(() => {
      document.querySelector('#storefrontSection').scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(600);

    const shot3Path = path.join(OUTPUT_DIR, '03_Customer_Login_and_Catalog.png');
    await page.screenshot({ path: shot3Path, fullPage: false });
    console.log('Saved:', shot3Path);

    // ------------------------------------------------------------------------
    // FLOW 4: Customer Cart Add & Edit Quantity
    // ------------------------------------------------------------------------
    console.log('\n--- Capturing Flow 4: Cart Add & Edit Quantity ---');
    // Add product 103 (Azure Virtual Datacenter Architecture)
    await page.click('.btn-add-cart[data-id="103"]');
    await sleep(800);

    // Scroll to Shopping Cart Section
    await page.evaluate(() => {
      document.querySelector('#cartSection').scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await sleep(600);

    // Increase quantity of the first item
    await page.click('.btn-qty-plus');
    await sleep(700);

    const shot4Path = path.join(OUTPUT_DIR, '04_Customer_Cart_Add_and_Edit.png');
    await page.screenshot({ path: shot4Path, fullPage: false });
    console.log('Saved:', shot4Path);

    // ------------------------------------------------------------------------
    // FLOW 5: Admin Login and CMS View
    // ------------------------------------------------------------------------
    console.log('\n--- Capturing Flow 5: Admin Login & CMS Dashboard ---');
    // Scroll to top and logout
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);
    await page.click('#btnLogout');
    await sleep(500);

    // Login as Admin
    await page.evaluate(() => {
      document.querySelector('#loginEmail').value = 'admin@skybridge.co.nz';
      document.querySelector('#loginPassword').value = 'Admin@123';
      document.querySelector('#formLogin').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await sleep(1200);

    // Scroll to Admin CMS Section
    await page.evaluate(() => {
      document.querySelector('#adminCmsSection').scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(600);

    const shot5Path = path.join(OUTPUT_DIR, '05_Admin_Login_and_CMS_View.png');
    await page.screenshot({ path: shot5Path, fullPage: false });
    console.log('Saved:', shot5Path);

    // ------------------------------------------------------------------------
    // FLOW 6: Admin Add Product Live
    // ------------------------------------------------------------------------
    console.log('\n--- Capturing Flow 6: Admin Add Product Live ---');
    await page.type('#cmsProductName', 'AI-Driven Cloud Threat Sentinel & SIEM', { delay: 20 });
    await page.select('#cmsCategory', 'Artificial Intelligence');
    await page.type('#cmsPrice', '3450.00', { delay: 20 });
    await page.type('#cmsStock', '30', { delay: 20 });
    await page.type('#cmsDescription', 'Real-time threat hunting powered by machine learning models, automated SIEM incident triage, and 24/7 autonomous SOC alerting.', { delay: 15 });

    await page.click('#btnCmsSave');
    await sleep(1000);

    const shot6Path = path.join(OUTPUT_DIR, '06_Admin_Add_Product_Live.png');
    await page.screenshot({ path: shot6Path, fullPage: false });
    console.log('Saved:', shot6Path);

    // ------------------------------------------------------------------------
    // FLOW 7: Admin Edit Product Before & After
    // ------------------------------------------------------------------------
    console.log('\n--- Capturing Flow 7: Admin Edit Product ---');
    // Click Edit on Product #101
    await page.click('.btn-cms-edit[data-id="101"]');
    await sleep(600);

    // Update Price and Description
    await page.evaluate(() => {
      document.querySelector('#cmsPrice').value = '2799.00';
      document.querySelector('#cmsProductName').value = 'SkyBridge Enterprise Cloud Security Audit [ISO 27001 Certified]';
    });
    await sleep(300);

    await page.click('#btnCmsSave');
    await sleep(1000);

    const shot7Path = path.join(OUTPUT_DIR, '07_Admin_Edit_Product_Before_After.png');
    await page.screenshot({ path: shot7Path, fullPage: false });
    console.log('Saved:', shot7Path);

    // ------------------------------------------------------------------------
    // FLOW 8: Admin Delete Product Live
    // ------------------------------------------------------------------------
    console.log('\n--- Capturing Flow 8: Admin Delete Product Live ---');
    // Delete product #105
    await page.click('.btn-cms-delete[data-id="105"]');
    await sleep(1000);

    const shot8Path = path.join(OUTPUT_DIR, '08_Admin_Delete_Product_Live.png');
    await page.screenshot({ path: shot8Path, fullPage: false });
    console.log('Saved:', shot8Path);

    console.log('\n>>> ALL 8 TASK 2.2 SCREENSHOTS CAPTURED SUCCESSFULLY! <<<');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

run();
