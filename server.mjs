// Production entry point. The Astro Node adapter serves prerendered pages
// straight from disk, where Astro middleware never runs, so this wraps the
// adapter's request handler to put the security headers on every response:
// pages, assets and on-demand routes alike.
import http from 'node:http';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

// No inline scripts or styles anywhere on the site, so the policy needs no
// 'unsafe-inline', hashes or nonces.
const contentSecurityPolicy = [
	"default-src 'none'",
	"script-src 'self'",
	"style-src 'self'",
	"img-src 'self'",
	"font-src 'self'",
	"connect-src 'self'",
	"manifest-src 'self'",
	"base-uri 'none'",
	"form-action 'none'",
	"frame-ancestors 'none'",
].join('; ');

const securityHeaders = {
	'Content-Security-Policy': contentSecurityPolicy,
	// Browsers ignore this over plain HTTP; it takes effect behind the TLS proxy.
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy':
		'accelerometer=(), browsing-topics=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Cross-Origin-Resource-Policy': 'same-origin',
};

// Short links that point somewhere else. A temporary (302) redirect, so
// changing a target later never fights a cached permanent one. The site only
// redirects: the files themselves are served by GitHub, not by this server.
const redirects = {
	// DebloatTool one-line install: `irm https://shreeve.dev/win | iex`.
	// Always the latest release, never unreleased code on main.
	'/win': 'https://github.com/shreeve-dev/debloat/releases/latest/download/install.ps1',
};

const server = http.createServer((req, res) => {
	for (const [name, value] of Object.entries(securityHeaders)) {
		res.setHeader(name, value);
	}
	const path = (req.url ?? '/').split('?')[0].replace(/\/+$/, '');
	const target = redirects[path];
	if (target && (req.method === 'GET' || req.method === 'HEAD')) {
		res.writeHead(302, { Location: target, 'Cache-Control': 'no-store' });
		res.end();
		return;
	}
	handler(req, res);
});

const port = Number(process.env.PORT ?? 4321);
const host = process.env.HOST ?? 'localhost';

server.listen(port, host, () => {
	console.log(`Server listening on http://${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => {
		server.close(() => process.exit(0));
		server.closeAllConnections();
	});
}
