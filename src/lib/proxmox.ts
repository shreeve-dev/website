// Reads the Proxmox API and reduces it to aggregates that are safe to show
// publicly. Nothing that identifies a machine (names, addresses, IDs) leaves
// this module, and errors are never passed on to the caller.
//
// Configuration, all from the environment at runtime:
//   PROXMOX_API_URL      https URL of the Proxmox API
//   PROXMOX_API_TOKEN    read-only token, as user@realm!tokenid=secret
//   PROXMOX_CA_CERT_B64  optional, base64 of the PEM CA that signed the
//                        API's certificate (for Proxmox's self-signed CA)
import https from 'node:https';

export type LabStatus =
	| {
			available: true;
			updatedAt: string;
			uptimeSeconds: number;
			cpuPercent: number;
			memoryPercent: number;
			runningContainers: number;
			runningVms: number;
	  }
	| { available: false };

const CACHE_MS = 60_000;
const TIMEOUT_MS = 4_000;
const MAX_BODY_BYTES = 1_000_000;

let cached: { expires: number; value: LabStatus } | null = null;
let pending: Promise<LabStatus> | null = null;

export function getLabStatus(): Promise<LabStatus> {
	if (cached && cached.expires > Date.now()) {
		return Promise.resolve(cached.value);
	}
	// Failures are cached too, so an outage costs one request a minute.
	pending ??= loadStatus()
		.catch((error: unknown) => {
			const code = (error as { code?: unknown } | null)?.code;
			console.error(`[lab-status] unavailable (${typeof code === 'string' ? code : 'error'})`);
			return { available: false } as LabStatus;
		})
		.then((value) => {
			cached = { expires: Date.now() + CACHE_MS, value };
			pending = null;
			return value;
		});
	return pending;
}

async function loadStatus(): Promise<LabStatus> {
	const apiUrl = process.env.PROXMOX_API_URL;
	const token = process.env.PROXMOX_API_TOKEN;
	if (!apiUrl || !token) {
		throw Object.assign(new Error('not configured'), { code: 'NOT_CONFIGURED' });
	}
	const url = new URL('/api2/json/cluster/resources', apiUrl);
	if (url.protocol !== 'https:') {
		throw Object.assign(new Error('https required'), { code: 'INSECURE_URL' });
	}
	const caB64 = process.env.PROXMOX_CA_CERT_B64;
	const body = await getJson(url, token, caB64 ? Buffer.from(caB64, 'base64') : undefined);
	return summarize((body as { data?: unknown } | null)?.data);
}

function getJson(url: URL, token: string, ca: Buffer | undefined): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const request = https.get(
			url,
			{
				ca,
				headers: { Authorization: `PVEAPIToken=${token}`, Accept: 'application/json' },
				timeout: TIMEOUT_MS,
			},
			(response) => {
				if (response.statusCode !== 200) {
					response.resume();
					reject(Object.assign(new Error('bad status'), { code: `HTTP_${response.statusCode}` }));
					return;
				}
				const chunks: Buffer[] = [];
				let size = 0;
				response.on('data', (chunk: Buffer) => {
					size += chunk.length;
					if (size > MAX_BODY_BYTES) {
						request.destroy(Object.assign(new Error('too large'), { code: 'BODY_TOO_LARGE' }));
						return;
					}
					chunks.push(chunk);
				});
				response.on('end', () => {
					try {
						resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
					} catch {
						reject(Object.assign(new Error('bad json'), { code: 'BAD_JSON' }));
					}
				});
				response.on('error', reject);
			},
		);
		request.on('timeout', () => {
			request.destroy(Object.assign(new Error('timeout'), { code: 'TIMEOUT' }));
		});
		request.on('error', reject);
	});
}

function summarize(resources: unknown): LabStatus {
	if (!Array.isArray(resources)) {
		throw Object.assign(new Error('unexpected shape'), { code: 'BAD_SHAPE' });
	}
	let cpuUsed = 0;
	let cpuTotal = 0;
	let memUsed = 0;
	let memTotal = 0;
	let uptimeSeconds = 0;
	let onlineNodes = 0;
	let runningContainers = 0;
	let runningVms = 0;

	for (const resource of resources as Record<string, unknown>[]) {
		if (resource?.type === 'node' && resource.status === 'online') {
			const cores = number(resource.maxcpu);
			onlineNodes += 1;
			cpuUsed += number(resource.cpu) * cores;
			cpuTotal += cores;
			memUsed += number(resource.mem);
			memTotal += number(resource.maxmem);
			uptimeSeconds = Math.max(uptimeSeconds, number(resource.uptime));
		} else if (resource?.status === 'running' && !resource.template) {
			if (resource.type === 'lxc') runningContainers += 1;
			if (resource.type === 'qemu') runningVms += 1;
		}
	}
	if (onlineNodes === 0 || cpuTotal === 0 || memTotal === 0) {
		throw Object.assign(new Error('no node data'), { code: 'NO_NODE_DATA' });
	}

	return {
		available: true,
		updatedAt: new Date().toISOString(),
		uptimeSeconds: Math.round(uptimeSeconds),
		cpuPercent: percent(cpuUsed / cpuTotal),
		memoryPercent: percent(memUsed / memTotal),
		runningContainers,
		runningVms,
	};
}

function number(value: unknown): number {
	return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

function percent(ratio: number): number {
	return Math.min(100, Math.max(0, Math.round(ratio * 100)));
}
