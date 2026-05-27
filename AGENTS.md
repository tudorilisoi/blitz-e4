# AGENTS.md - AI Agent Guide for eRădăuți v3

## Project Overview

eRădăuți v3 is a Romanian classified ads platform built with Blitz.js (Next.js). This guide helps AI agents understand the codebase structure, conventions, and how to work effectively.

## Quick Start

### Development Setup

```bash
# Start Docker services (PostgreSQL, Meilisearch, CAP.js)
docker compose -f docker/docker-compose.yml up -d

# Install dependencies
yarn install

# Run migrations
yarn blitz prisma migrate dev

# Seed database
yarn blitz db seed

# Start dev server
yarn blitz dev
```

### Key Commands

- `yarn blitz dev` - Start development server
- `yarn blitz build` - Production build
- `yarn blitz prisma migrate dev` - Run database migrations
- `yarn blitz db seed` - Seed database
- `yarn test` - Run tests
- `yarn lint` - Run ESLint

## Project Structure

```
blitz-e4/
├── db/                    # Database schema, migrations, seeds
│   ├── schema.prisma      # Prisma schema (data models)
│   ├── migrations/        # Database migrations
│   ├── seeds.ts           # Seed data
│   ├── importPosts.ts     # Post import utility
│   └── importUsers.ts     # User import utility
├── integrations/          # External service integrations
│   ├── socketlabsEmail.ts # Email service
│   └── meili/             # Meilisearch integration
├── mailers/               # Email templates
│   ├── forgotPasswordMailer.ts
│   └── verifyEmailMailer.ts
├── public/                # Static assets
│   ├── fonts/             # Self-hosted Nunito font
│   └── images/            # Icons and logos
├── src/
│   ├── auth/              # Authentication
│   │   ├── mutations/     # Auth RPC mutations
│   │   ├── components/    # Login/Signup forms
│   │   ├── schemas.ts     # Zod validation schemas
│   │   └── helpers.tsx    # Auth guards
│   ├── core/              # Shared code
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   └── layouts/       # Page layouts
│   ├── images/            # Image management
│   │   ├── mutations/     # Image CRUD mutations
│   │   └── schemas.ts     # Image validation
│   ├── meili/             # Meilisearch client
│   │   └── client.ts      # Search client config
│   ├── pages/             # Next.js pages (routes)
│   │   ├── anunt/         # Post detail page
│   │   ├── anunturi/      # Posts list pages
│   │   ├── auth/          # Auth pages
│   │   ├── cautare/       # Search page
│   │   ├── clerk/         # Clerk auth pages
│   │   └── profile/       # User profile pages
│   ├── posts/             # Post management
│   │   ├── mutations/     # Post CRUD mutations
│   │   ├── queries/       # Post queries
│   │   ├── components/    # Post UI components
│   │   ├── schemas.ts     # Post validation
│   │   └── helpers.tsx    # Post utilities
│   ├── users/             # User management
│   │   ├── mutations/     # User mutations
│   │   ├── queries/       # User queries
│   │   ├── hooks/         # User hooks
│   │   └── schemas.ts     # User validation
│   ├── config.ts          # App configuration
│   ├── helpers.ts         # Shared utilities
│   └── styles/            # Global CSS
├── static-pages/          # Markdown static pages
├── docker/                # Docker deployment
├── test/                  # Test setup and utilities
├── memory-bank/           # Project documentation
├── AGENTS.md              # This file
├── TODO.dev.md            # Development tasks
└── types.ts               # Shared TypeScript types
```

## Key Conventions

### 1. Blitz.js RPC Pattern

All data operations use Blitz.js RPC resolvers:

- **Queries** (read): `src/*/queries/` - files export default resolver functions
- **Mutations** (write): `src/*/mutations/` - files export default resolver functions
- Resolvers use `resolver.pipe(resolver.zod(Schema), async (input, ctx) => {...})`
- Authorization via `resolver.authorize()` or custom guard functions

### 2. Page Structure

- Pages use `gSSP` (Blitz's `getServerSideProps`) for SSR data fetching
- Catch-all routes: `[[...params]].tsx` for SEO-friendly URLs
- Layouts via `Page.getLayout = (page) => <Layout>{page}</Layout>`
- Auth protection via `Page.authenticate = true` or `Page.redirectAuthenticatedTo`

### 3. Component Patterns

- **Cells**: Display components (e.g., `PostCell.tsx`, `CategoryCell.tsx`)
- **Forms**: Use `Form.tsx` with Zod schema + `LabeledTextField.tsx`
- **Overlay**: Use `useOverlay()` hook for modals/notifications
- **Error handling**: Return `{ [FORM_ERROR]: message }` for form errors

### 4. Auth Guards

```typescript
import { guardAuthenticated, guardEdit } from "src/auth/helpers"

// In a resolver:
const currentUser = await guardAuthenticated(ctx) // throws if not logged in
await guardEdit(resource, ctx) // throws if not owner or superadmin
```

### 5. Database Access

- Import `db` from `db/index.ts` (enhanced Prisma client)
- Prisma middleware in `db/index.ts` syncs to Meilisearch
- Use `postInclude` and `authorSelect` from `src/config.ts` for includes

### 6. Image Handling

- Upload: Client-side resize with Pica → Base64 → Server save
- Thumbnails: GraphicsMagick creates 600x340 webp versions
- URLs: Use `getImageUrl(image, isThumb)` from `src/core/components/image/helpers.ts`
- Delete: `removeStoredImages(fileName)` removes files from disk

### 7. Search

- Meilisearch client: `src/meili/client.ts`
- Index sync: Automatic via Prisma middleware in `db/index.ts`
- Search UI: InstantSearch.js in `src/pages/cautare/`
- Romanian language: Stop words in `integrations/meili/stopwords.ts`

### 8. Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL` - PostgreSQL connection
- `MEILI_*` - Meilisearch config
- `CLERK_*` - Clerk auth config
- `SESSION_SECRET_KEY` - Session encryption
- `SUPERADMIN_EMAIL` - Admin user

## Common Tasks

### Adding a New Page

1. Create file in `src/pages/` (use `[[...params]].tsx` for dynamic routes)
2. Use `gSSP` for server-side data fetching
3. Set cache headers in `getServerSideProps`
4. Add layout via `getLayout`
5. Add auth protection if needed

### Adding a New Mutation/Query

1. Create file in `src/*/mutations/` or `src/*/queries/`
2. Use `resolver.pipe(resolver.zod(Schema), handler)`
3. Add Zod schema in corresponding `schemas.ts`
4. Import and use in pages/components

### Adding a New Database Model

1. Add model to `db/schema.prisma`
2. Run `yarn blitz prisma migrate dev --name description`
3. Update Prisma middleware in `db/index.ts` if Meilisearch sync needed
4. Add includes/selects to `src/config.ts`

## Important Notes for AI Agents

1. **Language**: All UI text is in Romanian. Keep this when adding/modifying UI strings.
2. **TypeScript**: Use strict TypeScript. Avoid `any` where possible.
3. **Error Messages**: User-facing errors should be in Romanian.

## Memory Bank

The `memory-bank/` directory contains comprehensive project documentation:

- `projectbrief.md` - Core requirements and goals
- `productContext.md` - Why the project exists and user experience
- `systemPatterns.md` - Architecture and design patterns
- `techContext.md` - Technology stack and setup
- `activeContext.md` - Current focus and decisions
- `progress.md` - What's done and what's left

Always check these files first when starting work on a new task.
