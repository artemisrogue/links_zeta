const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT = 'C:\\Users\\seand\\claude_prime\\presentation\\walkthrough\\img';
const APP = 'file:///C:/Users/seand/claude_prime/index.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new', args: ['--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await page.goto(APP, { waitUntil: 'load' });
  await sleep(1600);

  const log = [];
  async function shot(name, sels, pad = 12, maxH = 3600) {
    await sleep(180);
    const rect = await page.evaluate((ss, p) => {
      let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9, found = false;
      for (const s of ss) {
        const el = document.querySelector(s);
        if (!el) continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) continue;
        found = true;
        x1 = Math.min(x1, b.x + scrollX); y1 = Math.min(y1, b.y + scrollY);
        x2 = Math.max(x2, b.x + scrollX + b.width); y2 = Math.max(y2, b.y + scrollY + b.height);
      }
      if (!found) return null;
      return { x: Math.max(0, x1 - p), y: Math.max(0, y1 - p), width: x2 - x1 + 2 * p, height: y2 - y1 + 2 * p };
    }, sels, pad);
    if (!rect || rect.width <= 0 || rect.height <= 0) { log.push('MISSING ' + name + ' :: ' + sels.join(',')); return; }
    rect.height = Math.min(rect.height, maxH);
    rect.width = Math.min(rect.width, 1400);
    await page.screenshot({ path: path.join(OUT, name + '.png'), clip: rect });
    log.push(name);
  }
  const go = async t => { await page.evaluate(x => window.gotoTab(x), t); await sleep(420); };
  const ev = async fn => { await page.evaluate(fn); await sleep(350); };
  const openCard = async id => { await page.evaluate(i => { document.getElementById(i).open = true; }, id); await sleep(320); };
  const closeCard = async id => { await page.evaluate(i => { document.getElementById(i).open = false; }, id); };

  /* ============ DICTIONARY ============ */
  await go('dict');
  await shot('d1-hero', ['header'], 14);
  await ev(() => { const b = [...document.querySelectorAll('.why-toggle')].find(x => x.dataset.why === 'whyKnots'); const box = document.getElementById('whyKnots'); if (box && getComputedStyle(box).display === 'none') b.click(); });
  await shot('d2-whyknots', ['#whyKnots']);
  await shot('d3-table', ['table.dict'], 10, 2600);
  await shot('d4-thread', ['#threadDict']);
  await ev(() => { const b = [...document.querySelectorAll('.why-toggle')].find(x => x.dataset.why === 'whyFS'); const box = document.getElementById('whyFS'); if (box && getComputedStyle(box).display === 'none') b.click(); });
  await shot('d5-whyfs', ['#whyFS']);

  /* ============ PAIRS ============ */
  await go('pairs');
  await shot('p1-lede', ['#tab-pairs > p'], 12);
  await shot('p2-canvas', ['#pairsCanvas', '#pairsStateLabel', '#pairsLiftNote']);
  await ev(() => document.getElementById('pairsToggleBtn').click());
  await shot('p3-hopf-canvas', ['#pairsCanvas', '#pairsStateLabel']);
  await ev(() => document.getElementById('pairsToggleBtn').click());
  await shot('p4-calculator', ['#legendreTable', '#pairsBanner'], 12);
  await ev(() => document.getElementById('preset513').click());
  await shot('p5-hopf-thread', ['#pairsThread']);
  await shot('p6-arc', ['#arcCanvas', '#arcCaption', '#arcNote']);
  await shot('p7-hilbert', ['#hilbertTable', '#hilbertNote']);
  await ev(() => { document.getElementById('pInput').value = '3'; document.getElementById('qInput').value = '7'; document.getElementById('computeLegendre').click(); });
  await shot('p8-withheld', ['#pairsWarn', '#pairsThread'], 12);
  await shot('p9-hilbert37', ['#hilbertTable', '#hilbertNote']);
  await ev(() => document.getElementById('preset529').click());
  await shot('p10-lift', ['#pairsCoverMini', '#pairsCoverCap', '#pairsCoverCorr']);

  /* ============ TRIPLES ============ */
  await go('triples');
  await shot('t1-hero', ['#tab-triples > p', '#borroCanvas'], 12);
  await shot('t2-steps', ['#topoTripleSteps', '#tripleSteps'], 12, 3000);
  await shot('t3-verdicts', ['#topoTripleBanner', '#tripleBanner'], 12);
  await shot('t4-towers', ['#tripleCoverHasse', '#tripleHasse'], 12);
  await shot('t5-tower-caps', ['#tripleCoverCap', '#tripleCoverCorr']);
  await ev(() => { const b = [...document.querySelectorAll('.why-toggle')].find(x => x.dataset.why === 'whyMu'); const box = document.getElementById('whyMu'); if (box && getComputedStyle(box).display === 'none') b.click(); });
  await shot('t6-whymu', ['#whyMu']);
  await shot('t7-cockpit', ['#ccRun', '#ccOut'], 14);
  await ev(() => { document.getElementById('ccP1').value = '5'; document.getElementById('ccP2').value = '29'; document.getElementById('ccQ').value = '109'; document.getElementById('ccRun').click(); });
  await shot('t8-cockpit-run', ['#ccOut'], 12);
  await shot('t9-ladder-intro', ['#surfaceLadder'], 12);
  await shot('t10-rung1', ['#rung1'], 10, 1700);
  await shot('t11-rung2', ['#rung2'], 10, 2600);
  await shot('t12-gamma-computed', ['#gammaComputed'], 10);
  await shot('t13-rung3', ['#rung3'], 10, 1900);
  await shot('t14-polys', ['#deltaBorGrid'], 12);

  /* ============ LADDER ============ */
  await go('ladder');
  await shot('l1-intro', ['#tab-ladder > h2', '#tab-ladder > p'], 12);
  await shot('l2-matrices', ['#matN2', '#matN3', '#matN4'], 12);
  await ev(() => document.getElementById('frobPreset937').click());
  await shot('l3-frob937', ['#frobMatrix', '#frobExplain'], 14);
  await ev(() => document.getElementById('frobPreset107').click());
  await shot('l4-frob107', ['#frobMatrix', '#frobExplain'], 14);
  await ev(() => document.getElementById('chebRun').click());
  await shot('l5-chebotarev', ['#chebOut'], 12);

  /* ============ QUADRUPLES ============ */
  await go('quads');
  await shot('q1-intro', ['#tab-quads > p'], 12);
  await shot('q2-b4', ['#b4Canvas', '#b4LkNote'], 12);
  await shot('q3-delete', ['#b4WordNote'], 12);
  await shot('q4-magnus', ['#magnusBox'], 12);
  await shot('q5-steps', ['#quadSteps'], 12, 3200);
  await shot('q6-banner', ['#quadBanner'], 12);
  await shot('q7-tower', ['#quadCoverTower', '#quadCoverCap'], 12);
  await shot('q8-fieldtower', ['#quadTower'], 12);
  await shot('q9-thread', ['#quadThread'], 12);

  /* ============ ZETA ============ */
  await go('zeta');
  await shot('z1-intro', ['#tab-zeta > p'], 12);
  await shot('z2-faces', ['#tab-zeta .twocol'], 12, 2400);
  await shot('z3-capstone', ['#zetaThread'], 12);
  await shot('z4-spine', ['#tab-zeta .zx-row-head'], 12, 2800);
  const cards = [['zxHopf', 'z5-hopf'], ['zxSqrt5', 'z6-sqrt5'], ['zxBorro', 'z7-borro'], ['zxBorroWorked', 'z8-borroworked'],
  ['zxK1361', 'z9-k1361'], ['zxB4', 'z10-b4'], ['zx449', 'z11-449'], ['zxFive', 'z12-five'], ['zxFig8', 'z14-fig8'], ['zxKnotted', 'z15-knotted']];
  for (const [id, name] of cards) { await openCard(id); await shot(name, ['#' + id], 10, 3400); await closeCard(id); }
  await shot('z13-fiveblank', ['#fiveBlank'], 12);
  await shot('z16-presmat', ['#presMatTopo', '#presMatArith'], 12, 2400);

  /* ============ Q&A ============ */
  await go('qa');
  await shot('a1-intro', ['#qaIntro'], 12);
  await ev(() => { document.querySelectorAll('#qaList details')[0].open = true; });
  await shot('a2-q1', ['#qaList details:nth-of-type(1)'], 10);
  await ev(() => { document.querySelectorAll('#qaList details').forEach(x => x.open = false); document.querySelectorAll('#qaList details')[8].open = true; });
  await shot('a3-q9', ['#qaList details:nth-of-type(9)'], 10);
  await ev(() => { document.querySelectorAll('#qaList details').forEach(x => x.open = false); const all = document.querySelectorAll('#qaList details'); all[all.length - 1].open = true; });
  await shot('a4-breakage', ['#qaList details:last-of-type'], 10);
  await ev(() => document.querySelectorAll('#qaList details').forEach(x => x.open = false));
  await shot('a5-list', ['#qaList'], 10, 2400);

  /* ============ EXPERIMENTAL ============ */
  await go('experimental');
  await shot('x1-banner', ['#tab-experimental .honest'], 12);
  await shot('x2-generators', ['#expTrefoil', '#expIwasawa'], 12, 2800);
  await shot('x3-pivot', ['#expPivot'], 12);
  await shot('x4-redei', ['#expRedeiEx'], 12);
  await shot('x5-dbit', ['#expDbit'], 12, 2600);
  await shot('x6-cubictable', ['#expCubicTable'], 12, 2400);
  await shot('x7-mod3topo', ['#expMod3Topo'], 12);
  await shot('x8-cubicworked', ['#expCubicWorked'], 12, 2400);
  await shot('x9-census', ['#expCubicCensus'], 12);
  await shot('x10-gaps', ['#tab-experimental .honest:last-of-type'], 12);

  /* ============ SELF-TESTS ============ */
  await ev(() => document.getElementById('runTestsBtn').click());
  await sleep(1300);
  const pass = await page.evaluate(() => document.getElementById('runTestsBtn').textContent);
  await shot('s1-tests', ['#runTestsBtn', '#testsPanel'], 12, 1500);

  fs.writeFileSync(path.join(OUT, '_manifest.txt'), log.join('\n') + '\n\nPASS: ' + pass + '\nERRORS: ' + JSON.stringify(errs));
  console.log('captured', log.filter(x => !x.startsWith('MISSING')).length, '| missing:', log.filter(x => x.startsWith('MISSING')).length);
  log.filter(x => x.startsWith('MISSING')).forEach(x => console.log(x));
  console.log('PASS:', pass, '| page errors:', errs.length);
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
