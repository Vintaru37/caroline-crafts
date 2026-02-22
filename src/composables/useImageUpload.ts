/**
 * useImageUpload – browser-side image processing + Supabase Storage upload.
 *
 * Pipeline:
 *   1. Decode the file into an <img> element
 *   2. Draw onto a <canvas>, scaling down to fit the category's max dimensions
 *      (never upscaling). Aspect ratio is always preserved.
 *   3. canvas.toBlob("image/webp", 0.9) — free, no library needed
 *   4. Upload the resulting blob to the "product-images" Supabase Storage bucket
 *   5. Return the public URL → stored in the product's `image` field
 *
 */

import { supabase } from "../lib/supabase";
import type { ProductCategory } from "./useProducts";

/** Maximum output dimensions (width × height) per category. */
const MAX_DIMS: Record<ProductCategory, { w: number; h: number }> = {
  "coloring-book": { w: 500, h: 500 },
  notebook: { w: 500, h: 750 },
};

export type UploadPhase = "processing" | "uploading";

/**
 * Resize `file` to fit within the category's max dimensions, convert to WebP,
 * and upload to the "product-images" Supabase Storage bucket.
 *
 * @param file     The raw image File selected by the user.
 * @param category Determines the max output dimensions.
 * @param onPhase  Optional callback fired as the phase changes.
 * @returns        The public URL of the uploaded image.
 */
export async function uploadProductImage(
  file: File,
  category: ProductCategory,
  onPhase?: (phase: UploadPhase) => void,
): Promise<string> {
  // ── Step 1-3: resize + WebP conversion (browser canvas) ────────────────
  onPhase?.("processing");
  const webpBlob = await resizeAndConvertToWebP(file, MAX_DIMS[category]);

  // ── Step 4: upload to Supabase Storage ─────────────────────────────────
  onPhase?.("uploading");

  // Build a stable, URL-safe filename: "<category>/<timestamp>-<slug>.webp"
  const slug = file.name
    .replace(/\.[^.]+$/, "") // strip extension
    .replace(/[^a-z0-9]+/gi, "-") // non-alphanumeric → dash
    .toLowerCase()
    .slice(0, 60); // cap length
  const path = `${category}/${Date.now()}-${slug}.webp`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(path, webpBlob, { contentType: "image/webp", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // ── Step 5: return public URL ───────────────────────────────────────────
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a previously uploaded product image from Supabase Storage.
 * Silently no-ops if the URL is not a Storage URL (e.g. a bare filename or
 * external https link), so it's safe to call unconditionally.
 * Errors are logged but not re-thrown — the product update already succeeded.
 */
export async function deleteProductImage(url: string): Promise<void> {
  const path = storagePathFromUrl(url);
  if (!path) return;
  const { error } = await supabase.storage
    .from("product-images")
    .remove([path]);
  if (error) {
    console.warn(
      "[deleteProductImage] Could not delete old image:",
      error.message,
    );
  }
}

/** Extract the object path inside the bucket from a Supabase public URL. */
function storagePathFromUrl(url: string): string | null {
  const marker = "/product-images/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length).split("?")[0] ?? "");
}

/**
 * Load an image File, draw it onto a canvas scaled to fit within maxW × maxH
 * (never upscaling), then encode as WebP at 85 % quality.
 */
function resizeAndConvertToWebP(
  file: File,
  { w: maxW, h: maxH }: { w: number; h: number },
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Scale to fit — never upscale (ratio capped at 1)
      const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("canvas.toBlob produced no output"));
            return;
          }
          resolve(blob);
        },
        "image/webp",
        0.9,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not decode image file"));
    };

    img.src = objectUrl;
  });
}
