// Game servers listed on /play. Update the modpack version and CurseForge
// file ID together whenever the modded server moves to a new pack release,
// or players will install a version the server rejects.

export const modpack = {
	name: 'All the Mods 10',
	version: '8.2',
	minecraft: '1.21.1',
	curseforgeProjectId: 925200,
	curseforgeFileId: 8945086,
	pageUrl: 'https://www.curseforge.com/minecraft/modpacks/all-the-mods-10',
};

export const curseforgeInstallUrl = `curseforge://install?addonId=${modpack.curseforgeProjectId}&fileId=${modpack.curseforgeFileId}`;
export const curseforgeFileUrl = `${modpack.pageUrl}/files/${modpack.curseforgeFileId}`;
export const curseforgeAppUrl = 'https://www.curseforge.com/download/app';

export const statusUrl = 'https://metrics.shreeve.dev';

export const servers = {
	modded: { address: 'mc-modded.shreeve.dev' },
	minecraft: { address: 'minecraft.shreeve.dev', version: '26.3' },
	terraria: { address: 'terraria.shreeve.dev', port: 7777, version: '1.4.5.8' },
};
