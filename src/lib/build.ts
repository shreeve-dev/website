// Build stamp shown in the footer. COMMIT_SHA is passed in as a Docker build
// argument by the image workflow; local builds have none.

const REPO_URL = 'https://github.com/shreeve-dev/website';

const rawSha = process.env.COMMIT_SHA?.trim() ?? '';
const sha = /^[0-9a-f]{7,40}$/.test(rawSha) ? rawSha : null;
const time = new Date();

export const build = {
	sha,
	shortSha: sha?.slice(0, 7) ?? null,
	commitUrl: sha ? `${REPO_URL}/commit/${sha}` : null,
	time,
	timeLabel: `${time.toISOString().slice(0, 16).replace('T', ' ')} UTC`,
};
