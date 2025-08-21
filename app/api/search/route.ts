import { NextResponse } from 'next/server';

const DEFAULT_STORES = [
  'canadacomputers.com',
  'bestbuy.ca',
  'staples.ca',
  'walmart.ca',
  'memoryexpress.com',
  'thesource.ca',
  'costco.ca'
];

function buildQuery(q: string, stores: string[]) {
  const terms = q.trim();
  const saleSynonyms = '(sale OR clearance OR deal OR "save $" OR discount OR promo)';
  const sites = (stores.length ? stores : DEFAULT_STORES)
    .map(d => `site:${d}`)
    .join(' OR ');
  return `${terms} ${saleSynonyms} (${sites})`;
}

export async function POST(req) {
  try {
    const { q, stores } = await req.json();
    if (!q || typeof q !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const cx = process.env.GOOGLE_CSE_ID;
    const key = process.env.GOOGLE_API_KEY;
    if (!cx || !key) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const query = buildQuery(q, Array.isArray(stores) ? stores : []);
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('q', query);
    url.searchParams.set('cx', cx);
    url.searchParams.set('key', key);
    url.searchParams.set('num', '10');
    url.searchParams.set('safe', 'active');

    const resp = await fetch(url.toString(), { cache: 'no-store' });
    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `CSE error: ${text}` }, { status: 500 });
    }

    const data = await resp.json();
    const items = (data.items || []).map(it => ({
      title: it.title,
      link: it.link,
      snippet: it.snippet,
      displayLink: it.displayLink
    }));

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
