import type { APIRoute } from 'astro';
import { getLabStatus } from '../../lib/proxmox';

export const prerender = false;

export const GET: APIRoute = async () => {
	const status = await getLabStatus();
	return new Response(JSON.stringify(status), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
		},
	});
};
