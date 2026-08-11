/**
 * Client-side photo downscaling for the identification upload.
 *
 * A phone camera hands back a 3–12 MB, 4000px-wide JPEG. Sending that would be
 * slow on a boat ramp's worth of signal and would cost roughly four times as
 * many vision tokens as it needs to, since the identification rests on gross
 * features — a lateral line, a tail spot, a fin shape — not on pore detail. So
 * the photo is resized and re-encoded here, before it ever leaves the phone.
 *
 * 1024px on the long edge at JPEG q0.82 lands around 120–260 kB, which is
 * comfortably inside the Edge Function's own 1.5 MB ceiling and reads at about
 * a third of the vision-token cost of a full-resolution frame.
 */

/** Longest edge, in CSS pixels, of the image actually uploaded. */
export const MAX_EDGE = 1024;
/** JPEG quality for the re-encode. */
export const JPEG_QUALITY = 0.82;
/** Refuse absurd inputs before we even try to decode them. */
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

export interface PreparedImage {
  /** Bare base64, no `data:` prefix — what the Edge Function wants. */
  base64: string;
  /** Always image/jpeg after the re-encode. */
  mediaType: 'image/jpeg';
  /** Object URL for the on-screen preview. Caller revokes it. */
  previewUrl: string;
  /** Encoded size in bytes, for the "sent 180 kB" line. */
  bytes: number;
  width: number;
  height: number;
}

export class ImageError extends Error {
  constructor(
    message: string,
    readonly kind: 'too-large' | 'unreadable' | 'unsupported',
  ) {
    super(message);
    this.name = 'ImageError';
  }
}

/**
 * Scale (w, h) down to fit inside a `max`-pixel box, preserving aspect ratio.
 * Never scales up — a small photo is left alone rather than interpolated into
 * a bigger, blurrier one that costs more tokens for no extra information.
 */
export function fitWithin(
  width: number,
  height: number,
  max: number,
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= max || longest === 0) {
    return { width: Math.round(width), height: Math.round(height) };
  }
  const scale = max / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** ArrayBuffer -> base64, chunked so a large photo cannot blow the call stack. */
export function bytesToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

/**
 * Decode, downscale and re-encode a user-selected file.
 *
 * Throws `ImageError` for anything the user can act on (wrong file type,
 * enormous file, a "photo" the browser cannot decode) so the page can show a
 * specific sentence instead of a generic failure.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith('image/')) {
    throw new ImageError('That file is not an image.', 'unsupported');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new ImageError('That photo is too big to work with.', 'too-large');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // HEIC on a browser without a decoder lands here, as does a truncated file.
    throw new ImageError('That photo could not be opened on this device.', 'unreadable');
  }

  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_EDGE);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close?.();
    throw new ImageError('This browser could not process the photo.', 'unreadable');
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
  );
  if (!blob) throw new ImageError('This browser could not process the photo.', 'unreadable');

  return {
    base64: bytesToBase64(await blob.arrayBuffer()),
    mediaType: 'image/jpeg',
    previewUrl: URL.createObjectURL(blob),
    bytes: blob.size,
    width,
    height,
  };
}
