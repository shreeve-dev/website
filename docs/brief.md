# Portfolio site brief

> Status note, 2026-10-10: after writing this brief, Carson approved working
> through all four phases and pushing. The original text follows unchanged,
> apart from the last sentence, which was cut off when it was pasted.

You are building out my personal portfolio site in this repo. Read this whole
brief, then do Phase 1 only and stop for my review.

## About the project

- Astro site with the Node adapter, containerized. Pushing to main triggers a
  GitHub Actions build, and my home server auto-deploys the new image within
  minutes. The live site is https://shreeve.dev.
- Work directly on main. Commit as you go, but do not push until I say so.
  Every push goes live within minutes.
- This repo is public. Never commit secrets, tokens, internal IPs, or
  internal hostnames.

## About me

Use only these facts, never invent any; if something is missing, leave a
visible TODO.

- Name: Carson Shreeve
- Current role: Technology Services Manager at Bank of Utah
- Focus: endpoint security, identity management, VDI, infrastructure
- Education:
  - B.S. Cybersecurity & Network Management Technologies, Weber State
    University, 2025
  - M.S. Cybersecurity Management, University of Utah, in progress
    [TODO: expected completion date]
- Certifications earned: CompTIA Security+, Network+, A+, Project+
  [TODO: Credly verification link for each]
- Certification in progress: CISSP, expected December 2026. Show it as in
  progress, never as earned.
- Experience:
  - Bank of Utah: PC Technician, then Systems Administrator, then
    Technology Services Manager (current) [TODO: dates]
  - Syracuse Arts Academy: IT Administrator. Managed 2,100+ users across
    three schools. [TODO: dates]
- Contact: carson@shreeve.dev, github.com/shreeve-dev [TODO: LinkedIn URL]
- List skills as my own skills by category. Do not describe my employer's
  internal environment or tooling.

## Design direction

- Audience: recruiters and hiring managers who spend about 30 seconds. Name,
  title, and credentials must be visible without scrolling.
- Clean, dark, professional, fast. Subtle technical character is fine, but
  readability comes first. No gimmick navigation.
- Mobile first, accessible (semantic HTML, good contrast, keyboard friendly).
- No third-party scripts, trackers, or externally hosted fonts. Self-host
  everything. Keep client-side JavaScript minimal.
- Anything not yet earned must be clearly labeled "in progress" with the
  expected date. Earned certifications link to their verification page.

## Phases

Phase 1: Static site. Home page with hero, credentials (education and
  certifications), experience, skills, and contact. Shared layout, header,
  and footer. Prerender these pages.

Phase 2: Security hardening for a top score on public header scanners.
  Strict Content Security Policy, HSTS, and the other standard security
  headers, set in the app. Add /.well-known/security.txt. Add a small
  "Security" section that links to live scan results for this domain.

Phase 3: Build stamp and request path. Footer shows the short commit hash
  and build time, linked to the commit on GitHub (pass the SHA in at build
  time through the workflow and Dockerfile). Add a "How this page reached
  you" section with a diagram of the path: visitor, Cloudflare DNS, a cloud
  VPS running Nginx Proxy Manager that terminates TLS, a Tailscale tunnel,
  and a container on a Proxmox host at home that sits behind NAT with no
  inbound ports open. No IPs or hostnames.

Phase 4: Live lab status. A server-side endpoint that reads the Proxmox API
  with a read-only token from an environment variable, caches results for
  60 seconds, and returns only sanitized aggregates (uptime, CPU and memory
  percent, counts of running guests). Never expose IPs, hostnames, or VM
  IDs. The page must render a graceful "unavailable" state if the API can't
  be reached. Do not start this phase until I provide the token setup.

## How to work

- Save this brief as docs/brief.md in your first commit so future sessions
  can read it.
- When the phase is done, tell me how to review it locally and list every
  TODO you left.
