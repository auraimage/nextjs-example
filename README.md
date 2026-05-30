# AuraImage Next.js Example

A minimal Next.js app that uploads images to AuraImage and displays
transformed variants. Built with Next.js 16 (App Router), TypeScript,
and Tailwind CSS v4. Self-contained — no separate backend needed.

---

## Prerequisites

- **Node.js** 20 or later — check with `node --version`
- An **AuraImage account** — [sign up here](https://auraimage.ai)
- A **project** with at least one **secret key** — you'll create this in step 2

---

## Quick start

### Step 1 — Clone

```bash
git clone https://github.com/auraimage/nextjs-example
cd nextjs-example
```

### Step 2 — Create a project and secret key

**Option A (recommended)**: Let the CLI do everything.

```bash
npx aura init
```

It will create a project, generate a secret key, and write `.env` for you.

**Option B (manual)**: Create `.env` yourself.

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
AURAIMAGE_SECRET_KEY=sk_live_your_actual_key
AURAIMAGE_PROJECT_NAME=your_project_name
```

> **Never commit `.env`.** It's already in `.gitignore`.

### Step 3 — Install

```bash
npm install
```

### Step 4 — Start

```bash
npm run dev
```

You should see:

```
▲ Next.js 16.x.x (Turbopack)
- Local:    http://localhost:3000
```

### Step 5 — Try it

Open `http://localhost:3000` in your browser. You should see:

1. **"AuraImage Next.js Example"** heading
2. Green **"Server: Connected"** indicator
3. A file input button

Pick an image. You'll see:

- **"Uploading..."** while uploading
- Three cards showing your image at different sizes:
  - **Thumbnail 200w WebP** — cropped, WebP
  - **Medium 600w AVIF** — medium, AVIF format
  - **Full 1200w** — full resolution
- Each card shows the CDN URL with transform parameters

---

## What if something goes wrong?

| Problem | What to check |
|---|---|
| Red "Server: Not running" | `.env` is missing or has wrong values — redo step 2 |
| "Upload failed" | Secret key is invalid/revoked, or project name is wrong |
| Build error mentioning `secretKey` | Next.js pre-rendered the API route at build time — your `.env` wasn't available. Add `.env` and rebuild with `npm run dev` |
| Blank page | Node.js version — must be 20+ |

---

## How it works

This app is **self-contained** — the API routes that sign upload tokens run
inside Next.js itself. No separate backend server needed.

1. On load, the page calls `GET /api/health` — the route handler in
   `src/app/api/health/route.ts` responds with `{ status: "ok" }`
2. When you pick a file, the page calls `POST /api/upload-token` — the handler
   in `src/app/api/upload-token/route.ts` uses `@auraimage/sdk` to sign an
   HMAC token with your secret key
3. `@auraimage/sdk/client` (in the browser) uploads the image directly to the
   AuraImage CDN with the token in the `X-Aura-Signature` header
4. The CDN returns a URL — three transform presets display as labeled cards

```
Browser ──GET /api/health────────────► Next.js route handler → { status: "ok" }
Browser ──POST /api/upload-token─────► Next.js route handler → signs with SDK → { token }
Browser ──POST /v1/upload (to CDN)───► AuraImage CDN → { url, key, ... }
```

---

## Project structure

```
nextjs-example/
├── .env.example                  # Template for your secret key + project name
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs            # Tailwind CSS v4 PostCSS plugin
├── LICENSE
├── README.md
└── src/
    └── app/
        ├── layout.tsx            # Root layout
        ├── page.tsx              # Home page (server component)
        ├── globals.css           # Tailwind CSS import
        ├── upload.tsx            # Upload UI ('use client' component)
        └── api/
            ├── health/
            │   └── route.ts      # GET /api/health
            └── upload-token/
                └── route.ts      # POST /api/upload-token
```

---

## Links

- [AuraImage docs](https://auraimage.ai/docs)
- [Dashboard](https://app.auraimage.ai)
- [@auraimage/sdk on npm](https://www.npmjs.com/package/@auraimage/sdk)
