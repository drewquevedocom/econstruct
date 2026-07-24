const MAX_DIMENSION = 1600;
const TARGET_BYTES = 500 * 1024;
const QUALITY_STEPS = [0.8, 0.6, 0.45, 0.3];

/** Resizes + recompresses an image file in the browser. Non-image files pass through unchanged. */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  for (const quality of QUALITY_STEPS) {
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob) continue;
    if (blob.size <= TARGET_BYTES || quality === QUALITY_STEPS[QUALITY_STEPS.length - 1]) {
      return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
    }
  }
  return file;
}
