import type { APIRoute } from 'astro';
import { profile } from '../../data/profile';

// Prerendered, so Expires is renewed by every build. RFC 9116 asks for a
// date less than a year out.
const EXPIRES_IN_DAYS = 330;

export const GET: APIRoute = ({ site }) => {
	const expires = new Date(Date.now() + EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
	const lines = [
		`Contact: mailto:${profile.email}`,
		`Expires: ${expires.toISOString()}`,
		'Preferred-Languages: en',
		`Canonical: ${new URL('/.well-known/security.txt', site)}`,
	];
	return new Response(lines.join('\n') + '\n', {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
