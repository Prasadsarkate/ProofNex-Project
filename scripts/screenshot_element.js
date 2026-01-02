#!/usr/bin/env node
// Usage: node screenshot_element.js <origin> <selector>
const fs = require('fs');
// CLI: node screenshot_element.js <origin> <serial>
(async () => {
  const origin = process.argv[2];
  const serial = process.argv[3];
  if (!origin || !serial) {
    console.error('origin and serial required');
    process.exit(2);
  }
  try {
    const playwright = require('playwright');
    const browser = await playwright.chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    // Try multiple candidate pages where the certificate might be rendered.
    const candidatePages = [
      `${origin}/certificate/${encodeURIComponent(serial)}`,
      `${origin}/verify?serial=${encodeURIComponent(serial)}`,
      `${origin}/profile`,
      origin,
    ];

  let triedPages = [];
  let found = false;
  let element = null;
    // Try each candidate page until we find the certificate element
    for (const certPage of candidatePages) {
      try {
        console.error('navigating to', certPage);
        await page.goto(certPage, { waitUntil: 'networkidle' });
        triedPages.push(certPage);
        // Try multiple strategies to find the certificate element
    const strategies = [
      `[data-certificate="${serial}"]`,
      `[data-certificate*="${serial}"]`,
      `text="${serial}"`,
      `:scope` // fallback to whole page
    ];
  element = null;
        for (const sel of strategies) {
          try {
            if (sel === ':scope') {
              // use body as element
              element = page.locator('body').first();
              break;
            }
            await page.waitForSelector(sel, { timeout: 3000 });
            element = await page.locator(sel).first();
            break;
          } catch (e) {
            // try next selector
          }
        }

        if (element) {
          console.error('found certificate element on', certPage);
          found = true;
          break; // break out of candidate page loop
        }
        // otherwise continue to next candidate page
      } catch (navErr) {
        console.error('navigation error for', certPage, navErr && navErr.stack ? navErr.stack : navErr);
        // try next page
      }
    }

    if (!found) {
      // dump page HTML for debugging (from last page)
      const html = await page.content();
      console.error('selector not found after trying pages:', triedPages.join(', '));
      console.error('page html snippet:', html.slice(0, 2000));
      throw new Error('certificate element not found on any candidate page');
    }
    await page.waitForTimeout(250);
    // Try to make the element visible (remove opacity, transforms, hidden overflow) to allow screenshot
    const selector = await element.evaluate((el) => {
      // compute unique selector using dataset if available
      if (el.dataset && el.dataset.certificate) return `[data-certificate="${el.dataset.certificate}"]`;
      return null;
    });
    try {
      await page.evaluate((sel) => {
        try {
          const el = document.querySelector(sel);
          if (!el) return;
          const walk = (n) => {
            n.style.visibility = 'visible';
            n.style.display = 'block';
            n.style.opacity = '1';
            n.style.transform = 'none';
            n.style.transition = 'none';
            n.style.filter = 'none';
            n.style.pointerEvents = 'auto';
            n.style.zIndex = '99999';
            n.style.boxShadow = 'none';
            for (const c of Array.from(n.children || [])) walk(c);
          };
          walk(el);
          // also ensure parents are visible
          let p = el.parentElement;
          while (p) {
            p.style.display = p.style.display || 'block';
            p.style.visibility = p.style.visibility || 'visible';
            p = p.parentElement;
          }
        } catch (e) { /* ignore */ }
      }, selector || `body`);
    } catch (e) {
      // ignore
    }

    // Try element.screenshot, but fall back to clipping a full-page screenshot
    let buffer;
    try {
      buffer = await element.screenshot({ type: 'png' });
    } catch (err) {
      // fallback: compute bounding box and clip full page screenshot
      try {
        const box = await element.boundingBox();
        if (box && box.width > 0 && box.height > 0) {
          // ensure page is fully painted
          await page.waitForTimeout(120);
          buffer = await page.screenshot({ type: 'png', clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.max(1, Math.min(box.width, 16384)), height: Math.max(1, Math.min(box.height, 16384)) } });
        } else {
          // last resort: full page
          buffer = await page.screenshot({ type: 'png', fullPage: true });
        }
      } catch (e2) {
        console.error('final screenshot fallback failed', e2 && e2.stack ? e2.stack : e2);
        throw err; // rethrow original
      }
    }
    // write binary to stdout
  process.stdout.write(buffer);
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error(err && err.stack ? err.stack : String(err));
    process.exit(3);
  }
})();
