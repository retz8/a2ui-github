// A single shared inline `data:` URI so every avatar fixture shows a deterministic,
// network-free loaded image (a small geometric "face" placeholder) rather than a
// broken-image glyph. Keeping it in one module means all avatar fixtures render the
// identical image, so size/shape is the only differing axis across the galleries.
const PLACEHOLDER_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">',
  '<rect width="64" height="64" fill="#ddf4ff"/>',
  '<circle cx="32" cy="26" r="12" fill="#54aeff"/>',
  '<circle cx="32" cy="66" r="20" fill="#54aeff"/>',
  '</svg>',
].join('');

export const AVATAR_PLACEHOLDER_SRC = `data:image/svg+xml,${encodeURIComponent(PLACEHOLDER_SVG)}`;
