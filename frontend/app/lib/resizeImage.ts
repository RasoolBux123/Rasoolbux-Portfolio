// Shrinks a picture in the browser before uploading: at most `maxWidth` pixels wide, saved as JPEG.
// A 6 MB phone photo becomes ~200 KB, so uploads are fast and the database stays small.
export async function resizeImage(file: File, maxWidth = 1600, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file); // throws for formats the browser cannot read
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.fillStyle = "#ffffff"; // JPEG has no transparency
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", quality));
}