import { pinyin } from 'pinyin-pro';

// Generate a stable, readable slug for an article.
// Format: YYYY-MM-DD-<title-romanized>
// Falls back to YYYY-MM-DD-<short-hash> if no usable text.
export function slugifyArticle(article) {
  const t = Number(article.time);
  const date = (t && !isNaN(t)) ? new Date(t * 1000).toISOString().slice(0, 10) : '1970-01-02';
  let title = (article.title || '').trim();

  // First try ASCII extraction (preserves English/numbers as-is)
  let slug;
  if (/[\u4e00-\u9fa5]/.test(title)) {
    // Has Chinese — convert via pinyin
    const py = pinyin(title, { toneType: 'none', type: 'array', nonZh: 'consecutive' });
    slug = py.join('-');
  } else {
    slug = title;
  }

  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  if (!slug || slug.length < 2) slug = 'post';
  return `${date}-${slug}`;
}

// Resolve uniqueness across a set of taken slugs by appending -2, -3 ...
export function uniqueSlug(base, taken) {
  if (!taken.has(base)) { taken.add(base); return base; }
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  const s = `${base}-${i}`;
  taken.add(s);
  return s;
}
