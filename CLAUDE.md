# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blend is a Next.js 16 developer blog with block-based content system. Uses React 19, TypeScript, Tailwind CSS 4, and styled-components. Backend API at `tteokyi.com`.

## Commands

```bash
npm run dev         # Development server (Turbopack)
npm run build       # Production build
npm run lint        # ESLint
npm run format      # Prettier format
npm run format:check # Check formatting
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages
- `src/domain/` - Feature-based modules (layout, post-detail, post-list, main)
- `src/shared/` - Shared utilities, UI components, providers, icons, API client
  - `src/shared/api/` - API client and service functions
  - `src/shared/types/` - TypeScript types (API responses)
  - `src/shared/lib/` - Utilities (markdown parser, TOC extraction)
- `src/styles/` - styled-components registry

### Path Alias

Use `@/*` for imports from `src/*`:
```typescript
import { postApi } from '@/shared/api';
import { Post } from '@/shared/types/api';
```

### API Integration

Backend API (Goblox) at `https://tteokyi.com/api/v1/`:
- `GET/POST /post` - Post CRUD with block-based content
- `GET/POST /comment` - Block-level comments
- `GET/POST /category` - Categories

API client in [client.ts](src/shared/api/client.ts) with typed service functions.

### Block-based Content

Posts consist of ordered blocks (LexoRank sorted):
```typescript
interface Post {
  id: string;
  title: string;
  blocks: PostBlock[];  // Markdown content per block
}

interface PostBlock {
  id: string;
  content: string;      // Markdown
  rank_order: string;   // LexoRank for ordering
}
```

Each block is rendered via [BlockRenderer](src/shared/ui/block-renderer.tsx) which parses markdown to HTML.

### Styling

- Tailwind CSS 4 with `@theme` directive for design tokens
- styled-components for dynamic styles (SSR registry in [registry.tsx](src/styles/registry.tsx))
- CSS variables: `--color-background`, `--color-foreground`, `--color-primary`, `--color-line`
- Dark mode via `.dark` class with theme toggle (700ms transition)
- Prose styles in `globals.css` (`.prose-custom`)

### SVG Handling

SVGs imported as React components via Turbopack loader. Type declarations in `svgr.d.ts`.

## Key Patterns

- Server Components by default; `'use client'` only when needed
- Domain-driven organization: `src/domain/{feature}/components/`
- Block-level comments via API (guest nickname + password for non-members)
- Geist font family via `next/font`

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://tteokyi.com  # API base URL
```
