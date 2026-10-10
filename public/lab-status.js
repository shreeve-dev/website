// Fills in the "Live lab status" section. Served as a file, not inlined, so
// the Content Security Policy can stay at script-src 'self'.
const section = document.querySelector('[data-lab-status]');

if (section) {
	const message = section.querySelector('[data-lab-message]');
	const fields = {
		uptime: section.querySelector('[data-lab="uptime"]'),
		cpu: section.querySelector('[data-lab="cpu"]'),
		memory: section.querySelector('[data-lab="memory"]'),
		guests: section.querySelector('[data-lab="guests"]'),
	};

	const formatUptime = (seconds) => {
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor((seconds % 86400) / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		if (days > 0) return `${days}d ${hours}h`;
		if (hours > 0) return `${hours}h ${minutes}m`;
		return `${minutes}m`;
	};

	const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

	const showUnavailable = () => {
		for (const field of Object.values(fields)) field.textContent = '–';
		message.textContent = 'Live status is unavailable right now.';
		section.dataset.labStatus = 'unavailable';
	};

	const refresh = async () => {
		try {
			const response = await fetch('/api/lab-status.json', { cache: 'no-store' });
			const status = response.ok ? await response.json() : null;
			if (!status || status.available !== true) {
				showUnavailable();
				return;
			}
			fields.uptime.textContent = formatUptime(status.uptimeSeconds);
			fields.cpu.textContent = `${status.cpuPercent}%`;
			fields.memory.textContent = `${status.memoryPercent}%`;
			fields.guests.textContent = `${plural(status.runningContainers, 'container')}, ${plural(status.runningVms, 'VM')}`;
			const time = new Date(status.updatedAt).toISOString().slice(11, 19);
			message.textContent = `Updated ${time} UTC.`;
			section.dataset.labStatus = 'live';
		} catch {
			showUnavailable();
		}
	};

	message.textContent = 'Checking live status…';
	refresh();
	setInterval(() => {
		if (!document.hidden) refresh();
	}, 15_000);
}
