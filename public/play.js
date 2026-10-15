// Copy buttons on /play. Served as a file, not inlined, so the Content
// Security Policy can stay at script-src 'self'. The buttons stay hidden
// when this cannot run; the addresses are plain text either way.
if (navigator.clipboard) {
	for (const button of document.querySelectorAll('[data-copy]')) {
		button.hidden = false;
		button.addEventListener('click', async () => {
			const label = button.textContent;
			try {
				await navigator.clipboard.writeText(button.dataset.copy);
				button.textContent = 'Copied';
			} catch {
				button.textContent = 'Copy failed';
			}
			setTimeout(() => {
				button.textContent = label;
			}, 2000);
		});
	}
}
