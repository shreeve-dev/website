# Deployment

The site runs as a Docker Compose project in `/opt/website` on the server.

- `compose.yaml` goes to `/opt/website/compose.yaml`.
- `website-update.service` and `website-update.timer` go to
  `/etc/systemd/system/`. The timer pulls the latest image every minute and
  recreates the container only when the image changed.

These files are not synced automatically. After editing one, copy it to the
server again, then run `systemctl daemon-reload` (for the units) or
`docker compose up -d` (for the compose file).

## Live lab status

`/api/lab-status.json` reads the Proxmox API and returns only aggregates.
Until it is configured, the page shows "unavailable".

1. On the Proxmox host, create a read-only user and token:

   ```
   pveum user add status@pve --comment "Read-only site status"
   pveum acl modify / --users status@pve --roles PVEAuditor
   pveum user token add status@pve website --privsep 0
   ```

   The last command prints the token secret once.

2. On the server, create `/opt/website/.env` from `env.example`, readable
   only by root (`chmod 600`).

3. Run `docker compose up -d` in `/opt/website`.

The container logs one line per failed check, such as
`[lab-status] unavailable (ECONNREFUSED)`, with no addresses in it.
