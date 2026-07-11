/**
 * Generates the PWA/Play Store icon set from the Little Guy pixel rig.
 * Regenerate after changing the mascot: `node scripts/generate-icons.mjs`
 *
 * Uses the sandbox's preinstalled Chromium (never `playwright install`).
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const OUT = new URL("../public/icons/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// Little Guy idle pose as a 24x14 cell bitmap (subset of the app rig),
// matching src/components/mascot/little-guy.tsx geometry.
const page_html = `<!doctype html><meta charset="utf-8">
<style>body{margin:0}</style>
<canvas id="c"></canvas>
<script>
const BODY='#D9755A', INK='#141414';
function guyCells(){
  const C=[]; const add=(x,y,w=1,h=1,c=BODY)=>{for(let i=0;i<w;i++)for(let j=0;j<h;j++)C.push([x+i,y+j,c]);};
  add(26,26,12,2); add(24,28,16,6);
  add(20,30,4,2); add(40,30,4,2);
  [[24],[28],[34],[38]].forEach(([lx])=>add(lx,34,2,6));
  add(27,29,2,2,INK); add(35,29,2,2,INK);
  return C.map(([x,y,c])=>[x-20,y-26,c]); // normalize to 24w x 14h at origin
}
// draw(tile, padding fraction) -> dataURL
window.renderIcon = (px, padFrac, bg1, bg2, radiusFrac) => {
  const cv = document.getElementById('c');
  cv.width = px; cv.height = px;
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  // rounded-square gradient tile
  const r = px * radiusFrac;
  ctx.beginPath();
  ctx.moveTo(r,0); ctx.arcTo(px,0,px,px,r); ctx.arcTo(px,px,0,px,r);
  ctx.arcTo(0,px,0,0,r); ctx.arcTo(0,0,px,0,r); ctx.closePath();
  const g = ctx.createLinearGradient(0,0,px,px);
  g.addColorStop(0,bg1); g.addColorStop(1,bg2);
  ctx.fillStyle = g; ctx.fill();
  // guy, centered, integer-scaled
  const cells = guyCells();
  const usable = px * (1 - padFrac*2);
  const scale = Math.max(1, Math.floor(usable / 24));
  const w = 24*scale, h = 14*scale;
  const ox = Math.round((px - w)/2), oy = Math.round((px - h)/2);
  for (const [x,y,c] of cells){
    ctx.fillStyle = c;
    ctx.fillRect(ox + x*scale, oy + y*scale, scale, scale);
  }
  return cv.toDataURL('image/png');
};
</script>`;

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});
const page = await browser.newPage();
await page.setContent(page_html);

const DARK1 = "#1F1F1F";
const DARK2 = "#0D0D0D";

const jobs = [
  // [file, size, pad, radius] — maskable icons need >=20% safe-zone padding
  ["icon-192.png", 192, 0.1, 0.22],
  ["icon-512.png", 512, 0.1, 0.22],
  ["icon-maskable-192.png", 192, 0.22, 0],
  ["icon-maskable-512.png", 512, 0.22, 0],
  ["apple-touch-icon.png", 180, 0.12, 0],
];

for (const [file, size, pad, radius] of jobs) {
  const dataUrl = await page.evaluate(
    ([s, p, b1, b2, r]) => window.renderIcon(s, p, b1, b2, r),
    [size, pad, DARK1, DARK2, radius],
  );
  const base64 = dataUrl.split(",")[1];
  const { writeFileSync } = await import("fs");
  writeFileSync(OUT + file, Buffer.from(base64, "base64"));
  console.log("wrote", file);
}

await browser.close();
console.log("done");
