# AuraImage Next.js Example

A minimal Next.js app that uploads images to AuraImage and displays
transformed variants. Built with Next.js 16 (App Router), TypeScript,
and Tailwind CSS v4. Self-contained — no separate backend needed.

## Prerequisites

- **Node.js** 20 or later
- An **AuraImage account** — [sign up](https://auraimage.ai) if you don't have one
- A project with at least one **secret key** — create one in the
  [dashboard](https://app.auraimage.ai) or run `npx aura init`

## Quick start

```bash
# 1. Clone and navigate
git clone https://github.com/auraimage/nextjs-example
cd nextjs-example

# 2. Set up your environment
#
# Option A (recommended): use the AuraImage CLI to create a project and key
npx aura init

# Option B: copy .env.example and fill in your secret key manually
cp .env.example .env
# AURAIMAGE_SECRET_KEY=sk_live_...
# AURAIMAGE_PROJECT_NAME=my-project

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open `http://localhost:3000`. You should see a "Server: Connected" indicator,
a file input, and an upload area.

## How it works

1. The page pings `GET /api/health` to confirm the API route is working
2. Pick an image from your computer
3. The app requests a signed upload token from `POST /api/upload-token`
4. The API route uses `@auraimage/sdk` (server-side) to sign an HMAC token
5. `@auraimage/sdk/client` uploads the image directly to the AuraImage CDN
6. The CDN returns a URL — the app shows three transform presets
   (thumbnail, medium, full) as labeled cards with copyable URL snippets

The API routes run within Next.js — no separate backend server required.

## Project structure

```
nextjs-example/
├── .env.example                  # Template for environment variables
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
        ├── upload.tsx            # Upload UI (client component)
        └── api/
            ├── health/
            │   └── route.ts      # GET /api/health
            └── upload-token/
                └── route.ts      # POST /api/upload-token
```

## Links

- [AuraImage docs](https://auraimage.ai/docs)
- [Dashboard](https://app.auraimage.ai)
- [SDK on npm](https://www.npmjs.com/package/@auraimage/sdk)
