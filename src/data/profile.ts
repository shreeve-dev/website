// Every fact on the site comes from docs/brief.md. A `todo` value marks
// something the brief leaves open; it renders as a visible TODO on the page.

export const profile = {
	name: 'Carson Shreeve',
	role: 'Technology Services Manager',
	employer: 'Bank of Utah',
	focus: ['Endpoint security', 'Identity management', 'VDI', 'Infrastructure'],
	email: 'carson@shreeve.dev',
	github: { label: 'github.com/shreeve-dev', url: 'https://github.com/shreeve-dev' },
	linkedin: { url: null as string | null, todo: 'LinkedIn URL' },
};

export const education = [
	{
		degree: 'B.S. Cybersecurity & Network Management Technologies',
		short: 'B.S. Cybersecurity',
		school: 'Weber State University',
		completed: '2025',
		expected: null as string | null,
		todo: null as string | null,
	},
	{
		degree: 'M.S. Cybersecurity Management',
		short: 'M.S. Cybersecurity Management',
		school: 'University of Utah',
		completed: null as string | null,
		expected: null as string | null,
		todo: 'expected completion date',
	},
];

export const certifications = [
	{ name: 'CompTIA Security+', short: 'Security+', verifyUrl: null as string | null },
	{ name: 'CompTIA Network+', short: 'Network+', verifyUrl: null as string | null },
	{ name: 'CompTIA A+', short: 'A+', verifyUrl: null as string | null },
	{ name: 'CompTIA Project+', short: 'Project+', verifyUrl: null as string | null },
];

export const certificationsInProgress = [{ name: 'CISSP', expected: 'December 2026' }];

export const experience = [
	{
		employer: 'Bank of Utah',
		// Most recent first.
		roles: [
			{ title: 'Technology Services Manager', current: true },
			{ title: 'Systems Administrator', current: false },
			{ title: 'PC Technician', current: false },
		],
		highlights: [] as string[],
		todo: 'dates',
	},
	{
		employer: 'Syracuse Arts Academy',
		roles: [{ title: 'IT Administrator', current: false }],
		highlights: ['Managed 2,100+ users across three schools.'],
		todo: 'dates',
	},
];

// Categories are the focus areas from the brief. Specific skills under each
// are not in the brief yet.
export const skills = profile.focus.map((category) => ({
	category,
	items: [] as string[],
	todo: 'specific skills',
}));
