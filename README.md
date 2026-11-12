# Agletras Intelligence — Website

Official corporate website and product showcase for **Agletras Intelligence** — AI-native research infrastructure and Model Context Protocol (MCP) server.

## Overview

Agletras combines AI-native research infrastructure with human-led corporate intelligence to turn fragmented public information into structured, evidence-backed findings. Through its standardized Model Context Protocol interface, AI agents can orchestrate investigations, retrieve multi-format sources, index passages with exact character offsets, and verify factual claims against content-addressed local evidence stores.

## Architecture & Capabilities

- **Interactive Research Cockpit:** Inspect execution traces, passage evidence graphs, and verified epistemic claim matrices.
- **MCP Integration:** 40 registered Model Context Protocol tools spanning Ingestion, Evidence, Verification, Entity Resolution, and Synthesis.
- **Agent Interoperability:** Pre-configured integration profiles for OpenCode, Claude Desktop, Cursor IDE, and Model-Free CLI.
- **Local-First & Epistemic Rigor:** SQLite WAL storage, deterministic SHA-256 content addressing, outbound SSRF network guards, and 6 explicit epistemic states (`SUPPORTED`, `PARTIALLY SUPPORTED`, `CONTRADICTED`, `CONFLICTING EVIDENCE`, `UNSUPPORTED`, `UNVERIFIABLE`).

## Tech Stack

- **Framework:** [Astro](https://astro.build/) (Static Site Generation)
- **Language:** TypeScript
- **Styling:** Vanilla CSS design tokens & responsive fluid typography
- **Deployment:** GitHub Pages / Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Quality Assurance & Static Build

```bash
# Typecheck Astro files
npx astro check

# Execute test suite (Route integrity, brand checksums, ethical boundaries)
npm test

# Build production static distribution
npm run build
```

## Repository Structure

```
├── .github/workflows/   # GitHub Pages deployment automation
├── public/              # Static assets, logo.png, Cloudflare _headers & _redirects
├── src/
│   ├── components/      # UI components (Cockpit, Tool Directory, Snippets, Layout)
│   ├── lib/             # Routes, company data & utilities
│   ├── pages/           # Astro page routes (/, /intelligence, /about, /contact, etc.)
│   └── styles/          # Global styles and design system variables
├── tests/               # Route verification & brand integrity assertions
├── scripts/             # HTTP route verification runners
├── astro.config.mjs     # Astro static generation & routing configuration
└── tsconfig.json        # TypeScript compiler configuration
```

## Hosting & Deployment

The static distribution outputs to `./dist` via `npm run build`.

- **GitHub Pages:** Automated via `.github/workflows/deploy.yml` with workflow dispatch support.
- **Cloudflare Pages:** Pre-configured with `pages_build_output_dir = "./dist"`, edge `_headers`, and `_redirects`.

## Inquiry & Contact

- **Inquiries:** [info.agletras@gmail.com](mailto:info.agletras@gmail.com)
- **Official Repository:** [https://github.com/hrudyanshkayastha/agletras-intelligence.git](https://github.com/hrudyanshkayastha/agletras-intelligence.git)

---

© Agletras. All rights reserved.
