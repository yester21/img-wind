// 두 이미지의 PSNR(dB) 계산 — 품질 검증용. 사용: node scripts/quality-psnr.mjs a.jpg b.jpg
import sharp from "sharp";

const [a, b] = process.argv.slice(2);
if (!a || !b) {
  console.error("usage: node scripts/quality-psnr.mjs <원본> <압축본>");
  process.exit(1);
}
const A = await sharp(a).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const B = await sharp(b).removeAlpha().raw().toBuffer({ resolveWithObject: true });
if (A.info.width !== B.info.width || A.info.height !== B.info.height) {
  console.error(`dims differ: ${A.info.width}x${A.info.height} vs ${B.info.width}x${B.info.height}`);
  process.exit(1);
}
let se = 0;
for (let i = 0; i < A.data.length; i++) {
  const d = A.data[i] - B.data[i];
  se += d * d;
}
console.log((Math.round((10 * Math.log10(65025 / (se / A.data.length))) * 10) / 10) + " dB");
