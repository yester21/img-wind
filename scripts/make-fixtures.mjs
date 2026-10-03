/**
 * 검증용 테스트 이미지 생성. `npm run fixtures`로 실행하고
 * scripts/out/ 에 결과물을 만든다.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "scripts", "out");

/** 격자 + 원 + 그라디언트: JPEG로 압축해도 눈에 띄는 패턴 */
const svg = (w, h, label) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4a90d9"/>
      <stop offset="0.5" stop-color="#7ec8e3"/>
      <stop offset="1" stop-color="#f5d76e"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${Array.from({ length: 24 }, (_, i) => {
    const x = ((i * 97) % w) | 0;
    const y = ((i * 53) % h) | 0;
    const r = 10 + ((i * 37) % Math.max(40, Math.floor(Math.min(w, h) / 6)));
    const colors = ["#ffffff", "#1d1d1f", "#e74c3c", "#2ecc71", "#8e44ad"];
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${colors[i % 5]}" opacity="0.55"/>`;
  }).join("")}
  <text x="${w / 2}" y="${h / 2}" font-family="sans-serif" font-size="${Math.floor(
    Math.min(w, h) / 8,
  )}" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" opacity="0.9">${label}</text>
</svg>`;

async function make(name, width, height, format, options = {}) {
  const input = Buffer.from(svg(width, height, `${width}×${height}`));
  const image = sharp(input).resize(width, height);
  await image.toFormat(format, options).toFile(path.join(OUT, name));
  console.log("✓", name, `${width}×${height}`, format);
}

await mkdir(OUT, { recursive: true });

await make("photo-large.jpg", 4000, 3000, "jpeg", { quality: 95 });
await make("photo-medium.jpg", 1920, 1280, "jpeg", { quality: 90 });
await make("photo-small.jpg", 1200, 900, "jpeg", { quality: 85 });
await make("graphic.png", 800, 800, "png");
await make("photo.webp", 1600, 1067, "webp", { quality: 90 });
await make("photo.avif", 1600, 1067, "avif", { quality: 60 });
await make("scan.tiff", 1200, 800, "tiff");
await make("icon.ico-source.png", 256, 256, "png");

// 알파 채널이 있는 PNG (JPEG 변환 시 배경색 확인용)
const alphaSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
  <circle cx="300" cy="300" r="260" fill="#0071e3"/>
  <text x="300" y="300" font-family="sans-serif" font-size="60" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ALPHA</text>
</svg>`);
await sharp(alphaSvg).png().toFile(path.join(OUT, "alpha-circle.png"));
console.log("✓ alpha-circle.png");

// 워터마크용 로고 SVG (원본 그대로 사용)
await writeFile(path.join(OUT, "sample.svg"), svg(640, 480, "SVG"));
console.log("✓ sample.svg");

console.log("\n테스트 이미지가 scripts/out/ 에 생성되었습니다.");
