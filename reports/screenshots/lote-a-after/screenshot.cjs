const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });

  const pages = [
    { name: 'home-bilbao', url: 'http://localhost:4321/' },
    { name: 'blog-hub', url: 'http://localhost:4321/blog/' },
    { name: 'calculadora-bano', url: 'http://localhost:4321/calculadora/bano-bilbao' },
  ];

  for (const p of pages) {
    const page = await context.newPage();
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.screenshot({ path: `${p.name}-375x812.png`, fullPage: false });
      console.log(`Screenshot: ${p.name}-375x812.png`);
    } catch(e) {
      console.error(`Error on ${p.name}: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('Done');
})();
