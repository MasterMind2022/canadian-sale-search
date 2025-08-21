export const metadata = { title: 'Canadian Sale Search' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 24, background: '#0b1020', color: 'white' }}>
<div style={{ maxWidth: 920, margin: '0 auto' }}>
<h1 style={{ fontSize: 28, marginBottom: 12 }}>🇨🇦 Canadian Sale Search</h1>
<p style={{ opacity: 0.85, marginBottom: 24 }}>Search big Canadian stores for deals (e.g., “HDD”). Select stores or search all.</p>
{children}
<footer style={{ opacity: 0.6, marginTop: 48, fontSize: 12 }}>MVP • Powered by Google Programmable Search • Results link to retailers</footer>
</div>
</body>
</html>
);
}
