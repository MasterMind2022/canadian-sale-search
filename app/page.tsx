'use client';
export default function Page() {
const [q, setQ] = useState('HDD');
const [selected, setSelected] = useState<string[]>([]);
const [loading, setLoading] = useState(false);
const [results, setResults] = useState<any[]>([]);
const [error, setError] = useState<string | null>(null);


const toggle = (id: string) => {
setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
};


async function doSearch(e?: React.FormEvent) {
e?.preventDefault();
setLoading(true); setError(null); setResults([]);
try {
const res = await fetch('/api/search', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ q, stores: selected })
});
if (!res.ok) throw new Error(await res.text());
const data = await res.json();
setResults(data.items || []);
} catch (err: any) {
setError(err.message || 'Search failed');
} finally {
setLoading(false);
}
}


return (
<div>
<form onSubmit={doSearch} style={{ display: 'grid', gap: 12 }}>
<input
value={q}
onChange={e => setQ(e.target.value)}
placeholder="Search term (e.g., HDD, SSD, GPU)"
style={{ padding: 12, borderRadius: 10, border: '1px solid #3a3f63', background: '#0f1633', color: 'white' }}
/>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
{STORES.map(s => (
<label key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#0f1633', border: '1px solid #3a3f63', padding: 8, borderRadius: 10 }}>
<input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
<span>{s.label}</span>
<span style={{ opacity: 0.6, fontSize: 12 }}>({s.id})</span>
</label>
))}
</div>
<button disabled={loading} onClick={doSearch} style={{ padding: 12, borderRadius: 10, background: '#5b7cfa', color: 'white', border: 0, cursor: 'pointer' }}>
{loading ? 'Searching…' : 'Search sales'}
</button>
</form>


{error && <p style={{ color: '#ff8a8a', marginTop: 12 }}>{error}</p>}


<div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
{results.map((r) => (
<a key={r.link} href={r.link} target="_blank" rel="noreferrer"
style={{ textDecoration: 'none', color: 'inherit', background: '#0f1633', border: '1px solid #3a3f63', padding: 16, borderRadius: 12 }}>
<div style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
<div style={{ opacity: 0.7, fontSize: 13, marginBottom: 6 }}>{r.displayLink}</div>
<div style={{ opacity: 0.9 }}>{r.snippet}</div>
</a>
))}
{!loading && results.length === 0 && (
<div style={{ opacity: 0.7 }}>No results yet. Try a query like <code>HDD</code> or <code>SSD 1TB</code>.</div>
)}
</div>
</div>
);
}
