/**
 * PNG 블록들을 Vista+ 형식 ICO로 묶는다 (PNG-in-ICO).
 * 크기는 1~256px — 256은 디렉터리에 0으로 기록한다.
 */
export interface IcoEntry {
  size: number;
  data: Uint8Array;
}

export function createIco(entries: IcoEntry[]): Blob {
  const count = entries.length;
  const headerSize = 6 + count * 16;
  const total = headerSize + entries.reduce((s, e) => s + e.data.length, 0);
  const buf = new Uint8Array(total);
  const view = new DataView(buf.buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, count, true);

  let offset = headerSize;
  entries.forEach((e, i) => {
    const o = 6 + i * 16;
    const s = Math.min(255, Math.max(1, e.size));
    view.setUint8(o, s >= 256 ? 0 : s); // width
    view.setUint8(o + 1, s >= 256 ? 0 : s); // height
    view.setUint8(o + 2, 0); // palette
    view.setUint8(o + 3, 0); // reserved
    view.setUint16(o + 4, 1, true); // planes
    view.setUint16(o + 6, 32, true); // bpp
    view.setUint32(o + 8, e.data.length, true);
    view.setUint32(o + 12, offset, true);
    buf.set(e.data, offset);
    offset += e.data.length;
  });

  return new Blob([buf] as unknown as BlobPart[], { type: "image/x-icon" });
}
