# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blend is a Next.js 16 developer blog with MDX-based content system. Uses React 19, TypeScript, Tailwind CSS 4, and styled-components.

## Commands

```bash
npm run dev         # Development server (webpack mode)
npm run build       # Production build
npm run lint        # ESLint
npm run format      # Prettier format
npm run format:check # Check formatting
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages
- `src/domain/` - Feature-based modules (layout, post-detail, post-list, main)
- `src/shared/` - Shared utilities, UI components, providers, icons
- `src/styles/` - styled-components registry
- `content/posts/` - MDX blog posts

### Path Alias

Use `@/*` for imports from `src/*`:
```typescript
import { mdxComponents } from '@/shared/ui/mdx-components';
```

### MDX Content System

Posts are MDX files in `content/posts/` with front matter:
```yaml
---
title: "Post Title"
date: "2025-01-26"
description: "Description"
category: "Category"
tags: ["tag1", "tag2"]
---
```

MDX processing uses `next-mdx-remote-client` with remark-gfm, rehype-slug, and rehype-highlight plugins. Key file: [mdx.ts](src/shared/lib/mdx.ts).

### Styling

- Tailwind CSS 4 with `@theme` directive for design tokens
- styled-components for dynamic styles (SSR registry in [registry.tsx](src/styles/registry.tsx))
- CSS variables for theming: `--color-background`, `--color-foreground`, `--color-primary`, `--color-line`, etc.
- Dark mode via `.dark` class with theme toggle (700ms transition)

### SVG Handling

SVGs are imported as React components via `@svgr/webpack`. Type declarations in `svgr.d.ts`.

## Key Patterns

- Server Components by default; `'use client'` only when needed
- Domain-driven organization: each feature in `src/domain/{feature}/components/`
- Comments stored in localStorage (paragraph-based comment system)
- Geist font family via `next/font`
