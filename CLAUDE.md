# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blend is a Next.js 16 developer blog with Tiptap-based rich text editor. Uses React 19, TypeScript, Tailwind CSS 4. Backend API at `tteokyi.com`.

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
- `src/domain/` - Feature-based modules
  - `post-detail/` - Post viewing, TOC, comments
  - `post-write/` - Tiptap editor, post creation
  - `post-list/` - Post listing, filters
  - `main/` - Homepage components
  - `layout/` - Header, footer
- `src/shared/` - Shared code
  - `api/` - API client and service functions
  - `lib/` - Utilities (date, scroll, toc, tiptap-extensions)
  - `types/` - TypeScript types
  - `ui/` - Shared UI components (PostViewer, etc.)

### Path Alias

Use `@/*` for imports from `src/*`:
```typescript
import { postApi } from '@/shared/api';
import { formatRelativeTime } from '@/shared/lib/date';
```

### Tiptap Editor

Posts use Tiptap (ProseMirror-based) for rich text:

**Editor** (`src/domain/post-write/components/tiptap-editor.tsx`):
- StarterKit + CodeBlockLowlight for syntax highlighting
- `EditableBlockIdExtension` assigns unique IDs to blocks

**Viewer** (`src/shared/ui/post-viewer.tsx`):
- Read-only Tiptap with `BlockIdExtension`
- Comment indicators added via DOM manipulation after render

**Extensions** (`src/shared/lib/tiptap-extensions.ts`):
```typescript
// Viewer mode - renders id, data-block-id, class
export const BlockIdExtension = createBlockIdExtension({ editable: false });

// Editor mode - generates IDs, uses data-id
export const EditableBlockIdExtension = createBlockIdExtension({ editable: true });
```

### Block-level Comments

Each block has a unique ID for targeted comments:
- `CommentIndicator` - Hover button on blocks to add comments
- `CommentsSection` - Lists and manages comments
- `useComments` hook - Comment CRUD operations

### Shared Utilities

- `date.ts` - `formatDate`, `formatRelativeTime`, `formatTimestamp`, `formatSavedTime`
- `scroll.ts` - `scrollToElement`
- `toc.ts` - `extractTocFromContent` (extracts headings from Tiptap JSON)
- `tiptap-extensions.ts` - Block ID extensions for editor/viewer

### API Integration

Backend at `https://tteokyi.com/api/v1/`:
- `GET/POST /post` - Post CRUD
- `GET/POST /comment` - Block-level comments
- `GET/POST /category` - Categories

### Styling

- Tailwind CSS 4 with CSS variables: `--color-background`, `--color-foreground`, `--color-primary`, `--color-line`, `--color-gray`
- Dark mode via `.dark` class
- Prose styles in `globals.css` (`.prose-custom`)
- Monospace font (`font-mono`) for metadata and code

## Key Patterns

- Server Components by default; `'use client'` only when needed
- Domain hooks in `src/domain/{feature}/hooks/`
- Shared utilities in `src/shared/lib/`
- CSS variables for theming, Tailwind classes reference them directly (e.g., `text-foreground`, `border-line`)

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://tteokyi.com
```
