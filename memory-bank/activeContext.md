# Active Context: eRădăuți v3

## Current Focus

The project is in a mature state with core functionality implemented. Recent work has focused on:

- Dual auth system integration (Clerk + Blitz Auth)
- Meilisearch search integration with Romanian language support
- Docker-based deployment infrastructure
- Image upload and processing pipeline

## Recent Changes

- Added Clerk authentication alongside existing Blitz Auth
- Implemented Meilisearch for full-text search with Romanian stop words
- Added post promotion levels for frontpage highlighting
- Created Docker deployment setup with PostgreSQL, Meilisearch, CAP.js
- Implemented client-side image resizing with Pica
- Added server-side thumbnail generation with GraphicsMagick

## Active Decisions

### Auth Migration

The project is transitioning from Blitz Auth-only to a dual system with Clerk. Currently:

- Clerk handles Google OAuth (sign-in/sign-up pages at `/clerk/*`)
- Blitz Auth still handles email/password auth
- Middleware bridges Clerk sessions to Blitz sessions
- The `UserInfo` component handles both auth paths

### Search Implementation

Meilisearch is the primary search engine with:

- Real-time index sync via Prisma middleware hooks
- Romanian language support with custom stop words
- InstantSearch.js for the client-side search UI
- Search page with filters (date range, sorting)

### Image Pipeline

Images go through a two-stage pipeline:

1. Client-side: Pica resizes to max 1280px before upload
2. Server-side: GraphicsMagick creates 600x340 webp thumbnails
3. Storage: Filesystem-based, served via `/api/poze/[[...uploadParams]]`

## Current Challenges

### Known Issues

- **TODO.dev.md** lists pending tasks (see file for details)
- Some TypeScript type issues (noted with `@ts-ignore` comments)
- Error handling in Prisma middleware for Meilisearch sync is minimal (empty catch blocks)
- Image upload error handling could be more robust
- Some console.log statements remain in production code

### Performance Considerations

- SSR pages have aggressive caching but some pages may benefit from ISR
- Image serving could be optimized with a CDN
- Bundle size could be analyzed and optimized

## Next Steps

1. Review and address items in `TODO.dev.md`
2. Clean up console.log statements in production code
3. Improve error handling in Prisma middleware
4. Consider adding ISR for frequently accessed pages
5. Optimize image delivery pipeline
6. Complete Clerk auth migration (potentially deprecate Blitz Auth email/password)

## Key Contacts

- **Superadmin**: Configured via `SUPERADMIN_EMAIL` env var
- **Email**: SocketLabs for transactional emails
- **Search**: Meilisearch with Romanian language support

## Important Paths

- **Uploads**: Filesystem path configured in `src/config.ts` as `UPLOADS_PATH`
- **Static Pages**: Markdown files in `static-pages/` directory
- **Database Migrations**: `db/migrations/` directory
- **Docker Config**: `docker/docker-compose.yml`
