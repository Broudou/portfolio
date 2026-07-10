# Personal Professional Showcase Website

A production-ready personal showcase site for a software engineer — biography, projects,
technical articles, publications/talks, a career timeline, and contact — with every piece
of content editable from a secure admin panel. No CMS, no page-builder: a small, well-typed
monorepo with a clear boundary between frontend, backend, database, and shared contracts.

Seeded out of the box with a complete "John Doe" example so the site is immediately
browsable and the admin panel immediately usable.

---

## Table of contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Database seeding](#database-seeding)
- [Local development](#local-development)
- [Production build](#production-build)
- [Ubuntu Server 24.04 deployment](#ubuntu-server-2404-deployment)
- [Fonts](#fonts)

---

## Architecture

```
Browser
  │  (HTML/CSS/JS + relative /uploads/* image requests)
  ▼
SvelteKit (Node adapter, port 3000)
  │  server-to-server fetch, Authorization: Bearer <jwt>
  ▼
Express API (port 4000) ── MongoDB 7
  │
  └─ /uploads/* served statically
```

Three decisions shape everything else in this codebase:

1. **The browser never calls the Express API directly** — only SvelteKit's server-side
   code does (`+page.server.ts`, form actions, `hooks.server.ts`). The one exception is
   loading uploaded media files directly from `/uploads/*`, which in production sits behind
   the same public domain as the rest of the site (see the nginx config below). This keeps
   the JWT out of the browser entirely (it lives only in an httpOnly cookie SvelteKit reads
   server-side) and avoids CORS being a real concern.
2. **`shared/` ships TypeScript source, not a build artifact.** Both `client/` and `server/`
   import `@portfolio/shared` directly from its `src/`, via npm workspaces. Vite/esbuild
   transpile it inline — there's no `dist/` to go stale and no "did you rebuild shared?"
   step in onboarding.
3. **Two independent Node processes in production**: the SvelteKit app and the Express API,
   each its own systemd service, both behind one nginx reverse proxy on the public domain.

### Content model

Twelve MongoDB collections, each with a Mongoose model in `server/src/models/`:
`User`, `Biography` (singleton), `Project`, `Article`, `Category`, `Tag`, `Media`,
`NavigationItem`, `Setting` (singleton), `TimelineEvent`, `Publication`, `ContactMessage`.

`Biography` and `Setting` are **singletons** — enforced by a unique, immutable
`singletonKey: 'main'` field plus a `getOrCreate`/`update` service
(`server/src/services/singleton.service.ts`) instead of a create/delete route. There is
exactly one biography and one site-settings document, ever.

### Auth

JWT (HS256, 7-day expiry by default) signed by Express on login. Express returns the raw
token in the JSON response body (never sets a cookie itself, since it never talks to the
browser); SvelteKit's `admin/login/+page.server.ts` action stores it in an httpOnly,
`sameSite=lax` cookie. `client/src/hooks.server.ts` verifies that cookie's signature and
expiry on every request (using the same `JWT_SECRET` as the API) and populates
`event.locals.user`/`event.locals.token`. `admin/+layout.server.ts` redirects to
`/admin/login` server-side if `locals.user` is missing — there is no route in this app that
is protected only by hiding a link client-side.

### Content editing

Articles and the biography are authored as Markdown (`*Markdown` fields in MongoDB) and
rendered to sanitized HTML in SvelteKit via a unified/remark/rehype pipeline
(`client/src/lib/utils/markdown.ts`) with syntax highlighting — the same pipeline powers
both the public pages and the admin's live preview, so they never disagree.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js 20+ | LTS, native `fetch`, required by SvelteKit 2 / Vite 5 |
| API | Express 4 | Simple, well-understood middleware model |
| Database | MongoDB 7 + Mongoose 8 | Document model fits content-shaped data (projects, articles) well |
| Frontend | SvelteKit 2 + Vite 5 | SSR by default (SEO), file-based routing, form actions |
| Validation | zod | One schema per entity, shared by server validation and admin forms |
| Auth | jsonwebtoken + bcryptjs | Stateless JWT, no session store to run |
| Uploads | multer (local disk) | No external dependency required to self-host |
| Markdown | unified / remark / rehype | Sanitized HTML, syntax highlighting, one pipeline shared client + admin preview |
| Logging | pino | Structured JSON logs, consumed natively by `journald` under systemd |
| Language | TypeScript everywhere | Shared types/schemas package (`shared/`) between client and server |

---

## Project structure

```
/
  shared/     @portfolio/shared — types, zod schemas, API envelope contracts
  server/     @portfolio/server — Express API, MongoDB models, seed data
  client/     @portfolio/client — SvelteKit app (public site + /admin panel)
```

See `shared/src/`, `server/src/`, and `client/src/` for the full file layout — each
directory is organized by concern (`models/`, `routes/`, `controllers/`, `services/`,
`middleware/` on the server; `lib/api/`, `lib/components/`, `lib/utils/`, `routes/` on the
client). The client's public pages live under `client/src/routes/(public)/` (a route group,
so it doesn't affect URLs) and share one layout with the site nav/footer; `/admin/**` has
its own layout with its own sidebar chrome and a server-side auth guard.

---

## Environment variables

Copy `.env.example` in both `server/` and `client/` to `.env` and fill in real values. Both
must share the same `JWT_SECRET` and `COOKIE_NAME` — `hooks.server.ts` verifies the API's
tokens locally.

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | no (default `development`) | `development` \| `production` \| `test` |
| `PORT` | no (default `4000`) | Express listen port |
| `MONGODB_URI` | **yes** | MongoDB connection string |
| `JWT_SECRET` | **yes** | Signing secret — must match client's `JWT_SECRET` |
| `JWT_EXPIRES_IN` | no (default `7d`) | Token lifetime |
| `COOKIE_NAME` | no (default `portfolio_token`) | Cookie name the client stores the JWT under — informational on the server (it never sets this cookie itself) |
| `CORS_ORIGINS` | no | Comma-separated allowlist, defense-in-depth only |
| `UPLOAD_DIR` | no (default `uploads`) | Local disk path for media uploads |
| `MAX_UPLOAD_SIZE_MB` | no (default `8`) | Multer file-size limit |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | no | Contact-form email notifications; the email service silently no-ops if unset |
| `LOG_LEVEL` | no (default `info`) | pino log level |

### `client/.env`

| Variable | Required | Description |
|---|---|---|
| `API_BASE_URL` | **yes** | Where SvelteKit's server-side code reaches Express, e.g. `http://127.0.0.1:4000/api/v1` |
| `JWT_SECRET` | **yes** | Must match server's `JWT_SECRET` |
| `JWT_EXPIRES_IN` | no (default `7d`) | Used to compute the auth cookie's `maxAge` |
| `COOKIE_NAME` | no (default `portfolio_token`) | Must match server's `COOKIE_NAME` |
| `PUBLIC_SITE_URL` | no | Used as a fallback absolute origin in a couple of server contexts; canonical/OG URLs are otherwise built from the incoming request's origin |

Generate a strong `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Database seeding

On every server boot (`server/src/index.ts`), the app checks whether a `Setting` document
already exists. If not, it seeds every collection with a complete "John Doe" example: one
admin user, a full biography, 4 categories, 10 tags, ~12 placeholder images (generated as
SVGs at seed time — no binary assets committed to the repo), 5 projects, 4 articles, 7 nav
items, a 10-event timeline, 3 publications/talks, site settings, and 2 sample contact
messages. Seeding is idempotent — it's a no-op on every subsequent boot.

The seeded admin login is:

```
email:    john.doe@example.com
password: ChangeMe123!
```

**Change this password immediately after your first login** (`/admin` → your profile isn't
exposed via UI yet in this version — update it directly via the API or re-seed with a new
password before going live).

To re-run seeding manually:

```bash
npm run seed --workspace=server            # no-ops if already seeded
npm run seed --workspace=server -- --force # wipes every collection and reseeds
```

---

## Local development

> This repository was scaffolded without running `npm install` or any dev/build commands —
> the authoring machine is not the intended runtime environment. Run the following on your
> own machine or server.

```bash
# 1. Install dependencies for all three workspaces
npm install

# 2. Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# edit both files — at minimum set MONGODB_URI and a shared JWT_SECRET

# 3. Start MongoDB locally (see deployment section for a proper install,
#    or use Docker for local dev: docker run -d -p 27017:27017 mongo:7)

# 4. Run both apps in dev mode (concurrently)
npm run dev
```

This starts the Express API on `http://localhost:4000` and the SvelteKit dev server on
`http://localhost:5173`. On first boot, the API seeds the database and logs the admin
credentials. Visit `http://localhost:5173/admin/login` to sign in.

Useful scripts (run from the repo root unless noted):

| Command | Effect |
|---|---|
| `npm run dev` | Runs `server` and `client` dev servers concurrently |
| `npm run build` | Builds `server` (esbuild bundle) then `client` (`vite build`, adapter-node) |
| `npm run seed` / `npm run seed:force` | Manual (re-)seed |
| `npm run typecheck` | `tsc --noEmit` across all three workspaces + `svelte-check` |
| `npm run lint` / `npm run format` | ESLint / Prettier across the monorepo |

---

## Production build

```bash
npm ci
npm run build
```

- `server`'s build bundles `src/index.ts` (and the inlined `@portfolio/shared` source) into
  a single `server/dist/index.js` via esbuild, with `node_modules` dependencies kept
  external. Run it with `node dist/index.js` (or `npm run start --workspace=server`).
- `client`'s build runs `vite build` with `@sveltejs/adapter-node`, producing
  `client/build/index.js`. Run it with `node build/index.js` (or
  `npm run start --workspace=client`).

Both processes read their configuration from environment variables at runtime (see above) —
nothing is baked into the build.

---

## Ubuntu Server 24.04 deployment

This walks through a from-scratch deployment on a fresh Ubuntu Server 24.04 LTS VPS:
Node 20, MongoDB 7, the app under two systemd services, and nginx as the public-facing
reverse proxy with TLS.

### 1. System prep

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl gnupg ufw git
```

### 2. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x
```

### 3. Install MongoDB 7

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org

sudo systemctl enable --now mongod
systemctl status mongod --no-pager
```

By default MongoDB listens on `127.0.0.1:27017` only — leave it that way unless you have a
specific reason to expose it, and if you do, enable authentication first.

### 4. Create a deploy user and fetch the code

```bash
sudo adduser --system --group --home /opt/portfolio deploy
sudo -u deploy git clone <your-repo-url> /opt/portfolio/app
cd /opt/portfolio/app
```

### 5. Install dependencies and configure environment

```bash
sudo -u deploy npm ci

sudo -u deploy cp server/.env.example server/.env
sudo -u deploy cp client/.env.example client/.env
sudo -u deploy nano server/.env   # set MONGODB_URI, JWT_SECRET, NODE_ENV=production, ...
sudo -u deploy nano client/.env   # set API_BASE_URL, matching JWT_SECRET, PUBLIC_SITE_URL
```

Set `MONGODB_URI=mongodb://127.0.0.1:27017/portfolio`, `NODE_ENV=production` in
`server/.env`, and generate a strong shared `JWT_SECRET` (see the command above) — put the
identical value in both `.env` files.

### 6. Build

```bash
sudo -u deploy npm run build
```

### 7. systemd services

Create `/etc/systemd/system/portfolio-api.service`:

```ini
[Unit]
Description=Portfolio API (Express)
After=network.target mongod.service

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/portfolio/app/server
EnvironmentFile=/opt/portfolio/app/server/.env
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Create `/etc/systemd/system/portfolio-web.service`:

```ini
[Unit]
Description=Portfolio Web (SvelteKit)
After=network.target portfolio-api.service

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/portfolio/app/client
EnvironmentFile=/opt/portfolio/app/client/.env
Environment=PORT=3000
ExecStart=/usr/bin/node build/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start both:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-api portfolio-web
sudo systemctl status portfolio-api portfolio-web --no-pager
journalctl -u portfolio-api -f   # tail logs (pino JSON, readable natively by journald)
```

### 8. nginx reverse proxy + TLS

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/portfolio`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10m;

    # Uploaded media and the API are served by the Express process.
    location /uploads/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Everything else is the SvelteKit app.
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

> Note: the browser is not actually expected to call `/api/*` directly in this
> architecture (see [Architecture](#architecture)) — that `location /api/` block exists so
> the setup is safe/consistent if it's ever needed (health checks, future integrations), not
> because the SPA calls it from client-side JS.

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t
sudo systemctl reload nginx

# TLS
sudo certbot --nginx -d your-domain.com
```

Certbot edits the nginx config in place to add the TLS server block and sets up automatic
renewal (`systemctl status certbot.timer`).

### 9. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Ports 3000, 4000, and 27017 should **not** be exposed publicly — only nginx (80/443) and SSH
are.

### 10. Verify

```bash
curl -I https://your-domain.com/            # SvelteKit home page, 200
curl https://your-domain.com/api/v1/settings # Express API via nginx
```

Visit `https://your-domain.com/admin/login` and sign in with the seeded credentials (change
the password immediately).

### Deploying updates

```bash
cd /opt/portfolio/app
sudo -u deploy git pull
sudo -u deploy npm ci
sudo -u deploy npm run build
sudo systemctl restart portfolio-api portfolio-web
```

---

## Fonts

The design uses self-hosted variable fonts (Inter for UI text, JetBrains Mono for code) via
`@font-face` in `client/src/lib/styles/global.css`, pointing at
`client/static/fonts/inter-variable.woff2` and
`client/static/fonts/jetbrains-mono-variable.woff2`. Those files aren't committed to the
repository — download them from their respective open-source releases (Inter:
rsms.me/inter, JetBrains Mono: jetbrains.com/lp/mono) and place them at those paths. Until
you do, both fall back to the system font stack automatically — nothing breaks.
