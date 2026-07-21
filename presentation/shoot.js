const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT = 'C:\\Users\\seand\\claude_prime\\presentation\\img';
const APP = 'file:///C:/Users/seand/claude_prime/index.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1360, height: 850, deviceScaleFactor: 2 });
  await page.goto(APP, { waitUntil: 'load' });
  await sleep(1500);

  const log = [];
  async function viewportShot(name) {
    await sleep(300);
    await page.screenshot({ path: path.join(OUT, name + '.png') });
    log.push(name);
  }
  // Document-coordinate clip (captureBeyondViewport handles off-screen regions).
  async function clipShot(name, sels, pad = 10, maxH = 4000) {
    await sleep(250);
    const rect = await page.evaluate((ss, p) => {
      let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9, found = false;
      for (const s of ss) {
        const el = document.querySelector(s);
        if (!el) continue;
        found = true;
        const r = el.getBoundingClientRect();
        const X = r.x + window.scrollX, Y = r.y + window.scrollY;
        x1 = Math.min(x1, X); y1 = Math.min(y1, Y);
        x2 = Math.max(x2, X + r.width); y2 = Math.max(y2, Y + r.height);
      }
      if (!found) return null;
      return { x: Math.max(0, x1 - p), y: Math.max(0, y1 - p), width: x2 - x1 + 2 * p, height: y2 - y1 + 2 * p };
    }, sels, pad);
    if (!rect || rect.width <= 0 || rect.height <= 0) { log.push('MISSING ' + name); return; }
    rect.height = Math.min(rect.height, maxH);
    await page.screenshot({ path: path.join(OUT, name + '.png'), clip: rect });
    log.push(name);
  }
  const go = async t => { await page.evaluate(x => window.gotoTab(x), t); await sleep(350); };
  const top = async () => { await page.evaluate(() => window.scrollTo(0, 0)); await sleep(250); };
  const scrollToSel = async (sel, off = -70) => {
    await page.evaluate((s, o) => { const el = document.querySelector(s); if (el) { el.scrollIntoView({ block: 'start' }); window.scrollBy(0, o); } }, sel, off);
    await sleep(300);
  };

  // 01 opening
  await go('dict'); await top();
  await viewportShot('01-opening');

  // 02 whyKnots + pinned Artin-Verdier tooltip
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('.why-toggle')].find(b => b.dataset.why === 'whyKnots');
    const box = document.getElementById('whyKnots');
    if (box && getComputedStyle(box).display === 'none' && btn) btn.click();
    const tt = [...document.querySelectorAll('#tab-dict .tt')].find(e => (e.dataset.tip || '').includes('Artin–Verdier duality (1964)'));
    if (tt) { tt.classList.add('tt-open'); tt.scrollIntoView({ block: 'center' }); }
  });
  await sleep(350);
  await viewportShot('02-whyknots-av');
  await page.evaluate(() => document.querySelectorAll('.tt-open').forEach(e => e.classList.remove('tt-open')));

  // 03 dictionary table
  await clipShot('03-dict-table', ['table.dict']);

  // 04 pairs top
  await go('pairs'); await top();
  await viewportShot('04-pairs-top');

  // 05 lift diagram
  await clipShot('05-pairs-lift', ['#pairsCoverMini', '#pairsCoverCap', '#pairsCoverCorr']);

  // 06 Hopf (5,13) thread
  await page.evaluate(() => document.getElementById('preset513').click());
  await sleep(700);
  await clipShot('06-pairs-thread-hopf', ['#pairsThread']);

  // 07 withheld (3,7)
  await page.evaluate(() => {
    document.getElementById('pInput').value = '3';
    document.getElementById('qInput').value = '7';
    document.getElementById('computeLegendre').click();
  });
  await sleep(700);
  await clipShot('07-pairs-withheld', ['#pairsThread']);
  await page.evaluate(() => document.getElementById('preset529').click()); // restore default
  await sleep(400);

  // Triples
  await go('triples'); await top();
  await viewportShot('08-triples-top');
  await clipShot('10-triples-verdicts', ['#topoTripleBanner', '#tripleBanner'], 12);
  await clipShot('11-rung1', ['#rung1']);
  await clipShot('12-rung2', ['#rung2']);
  await clipShot('13-rung3', ['#rung3']);
  await clipShot('14-cover-tower', ['#tripleCoverHasse', '#tripleCoverCap', '#tripleCoverCorr']);
  await clipShot('15-field-tower', ['#tripleBanner', '#tripleHasse']);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('.why-toggle')].find(b => b.dataset.why === 'whyMu');
    const box = document.getElementById('whyMu');
    if (box && getComputedStyle(box).display === 'none' && btn) btn.click();
  });
  await sleep(300);
  await clipShot('16-whymu', ['#whyMu']);

  // Quadruples
  await go('quads'); await top();
  await viewportShot('17-quads-top');
  await clipShot('18-quad-honesty', ['#magnusBox', '.honest']);
  await clipShot('19-quad-tower', ['#quadCoverTower', '#quadCoverCap']);
  await clipShot('20-quad-banner', ['#quadBanner'], 12);

  // Zeta
  await go('zeta'); await top();
  await viewportShot('21-zeta-top');
  await scrollToSel('#tab-zeta .col.topo h2');
  await viewportShot('22-zeta-faces');
  await scrollToSel('#tab-zeta .zx-row-head');
  await viewportShot('23-gallery-spine');

  const card = async (name, id) => {
    await page.evaluate(i => { document.getElementById(i).open = true; }, id);
    await sleep(350);
    await clipShot(name, ['#' + id]);
    await page.evaluate(i => { document.getElementById(i).open = false; }, id);
  };
  await card('24-hopf-card', 'zxHopf');
  await card('25-sqrt5-card', 'zxSqrt5');
  await card('26-k1361-card', 'zxK1361');
  await card('27-borro-worked', 'zxBorroWorked');
  await card('28-449-card', 'zx449');
  await card('29-b4-card', 'zxB4');
  await card('30-fig8-card', 'zxFig8');
  await card('31-knotted-card', 'zxKnotted');
  await clipShot('32-capstone', ['#zetaThread']);

  // Ladder, 937 preset
  await go('ladder');
  await page.evaluate(() => { const b = document.getElementById('frobPreset937'); if (b) b.click(); });
  await sleep(600);
  await clipShot('33-ladder-937', ['#frobMatrix', '#frobExplain'], 16);

  // Q&A
  await go('qa'); await top();
  await page.evaluate(() => { const d = document.querySelector('#qaList details'); if (d) d.open = true; });
  await sleep(300);
  await viewportShot('34-qa-first');
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('#qaList details')];
    items.forEach(d => d.open = false);
    items[items.length - 1].open = true;
  });
  await sleep(300);
  await clipShot('35-qa-breakage', ['#qaList details:last-of-type']);

  // Self-tests (restore closed-card state first)
  await page.evaluate(() => document.querySelectorAll('#qaList details, details.zx').forEach(d => d.open = false));
  await sleep(200);
  await page.evaluate(() => document.getElementById('runTestsBtn').click());
  await sleep(3000);
  const passLine = await page.evaluate(() => (document.body.innerText.match(/\d+\s*\/\s*\d+\s*pass/) || ['?'])[0]);
  fs.writeFileSync(path.join(OUT, '_passline.txt'), passLine);
  await page.evaluate(() => { document.getElementById('runTestsBtn').scrollIntoView({ block: 'start' }); window.scrollBy(0, -30); });
  await sleep(300);
  await viewportShot('36-selftests');

  await browser.close();
  console.log('captured:', log.length, '| pass line:', passLine);
  console.log(log.join('\n'));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
