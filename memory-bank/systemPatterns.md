# System Patterns: eRădăuți v3

## Architecture Overview

The project follows **Blitz.js conventions** which is a Next.js meta-framework. The architecture is a monorepo-style structure with clear separation of concerns:

```
blitz-e4/
├── db/                    # Database schema, migrations, seeds
├── integrations/          # External service integrations (Meilisearch, SocketLabs)
├── mailers/               # Email templates
├── public/                # Static assets (images, fonts, icons)
├── src/
│   ├── auth/              # Auth mutations, schemas, components
│   ├── core/              # Shared components, hooks, layouts
│   ├── images/            # Image mutations, schemas
│   ├── meili/             # Meilisearch client config
│   ├── pages/             # Next.js pages (routes)
│   ├── posts/             # Post mutations, queries, components
│   ├── server/            # Server-side routers
│   ├── styles/            # Global CSS
│   └── users/             # User queries, mutations, hooks
├── static-pages/          # Markdown files for static pages
└── docker/                # Docker deployment files
```

## Key Design Patterns

### 1. Blitz.js RPC Pattern

All data mutations and queries use Blitz.js RPC resolvers:

- **Queries** (read operations): `src/*/queries/` - e.g., `getPost.ts`, `getCategories.ts`
- **Mutations** (write operations): `src/*/mutations/` - e.g., `createPost.ts`, `login.ts`
- Each resolver uses `resolver.pipe()` with Zod validation and authorization middleware

### 2. Server-Side Rendering (SSR) Pattern

Pages use `gSSP` (Blitz's wrapper around `getServerSideProps`) for data fetching:

- Cache headers are set in `getServerSideProps` for performance
- Pages like `anunt/[[...params]].tsx` use catch-all routes for SEO-friendly URLs
- Static pages are rendered from markdown files via `getMarkDownAsHTML()`

### 3. Component Architecture

- **Layouts**: `Layout.tsx` wraps all pages with header, footer, and navigation
- **Cells**: `PostCell.tsx`, `CategoryCell.tsx` are reusable display components
- **Form Components**: `Form.tsx`, `LabeledTextField.tsx` provide form building blocks
- **Overlay System**: `OverlayProvider.tsx` manages modal/overlay state globally
- **Image Components**: `ImageGallery.tsx`, `ImageUpload.tsx`, `UploadGrid.tsx` handle image lifecycle

### 4. Auth Pattern (Dual System)

```
User → Clerk (Google OAuth) OR Blitz Auth (email/password)
     → Middleware bridges Clerk session → Blitz session
     → `guardAuthenticated()` / `guardEdit()` for authorization
     → `useCurrentUser()` hook for client-side user data
```

### 5. Search Pattern (Meilisearch)

```
Post Create/Update/Delete → Prisma Middleware → Meilisearch Index Sync
Search Page → InstantSearch.js → Meilisearch API → Results
```

### 6. Image Pipeline Pattern

```
User selects file → Pica (client-side resize to 1280px max) → Base64 upload
→ Server saves to filesystem → GraphicsMagick creates thumbnails (600x340 webp)
→ Image served via `/api/poze/[[...uploadParams]]` route
```

## Route Structure

| Route                        | Page            | Description                             |
| ---------------------------- | --------------- | --------------------------------------- |
| `/`                          | `index.tsx`     | Homepage with categories + latest posts |
| `/anunturi/[[...params]]`    | Posts list      | Browse by category with pagination      |
| `/anunturi/de/[[...params]]` | Posts by author | Filter posts by author                  |
| `/anunt/[[...params]]`       | Post detail     | View single ad with images              |
| `/cautare/`                  | Search          | Full-text search with filters           |
| `/auth/login`                | Login           | Email/password login                    |
| `/auth/signup`               | Signup          | Registration form                       |
| `/auth/forgot-password`      | Forgot password | Password reset request                  |
| `/auth/reset-password`       | Reset password  | Password reset form                     |
| `/auth/verify`               | Verify email    | Email verification                      |
| `/clerk/sign-in`             | Clerk login     | Google OAuth login                      |
| `/clerk/sign-up`             | Clerk signup    | Google OAuth signup                     |
| `/profile/edit`              | Edit profile    | User profile management                 |
| `/foto-radauti/`             | Photo gallery   | Community photo gallery                 |
| `/static-page/[[...params]]` | Static pages    | Markdown-rendered pages                 |
| `/sitemap.xml`               | Sitemap         | XML sitemap for SEO                     |

## Data Models (Prisma)

### Core Models

- **User**: id, email, fullName, phone, hashedPassword, role (enum), activationKey
- **Post**: id, title, body, price, phone, status (enum), promotionLevel, categoryId, userId
- **Image**: id, fileName, width, height, postId, authorId
- **Category**: id, title, slug, description, icon
- **Token**: id, hashedToken, type (enum), expiresAt, sentTo, userId
- **Session**: id, expiresAt, handle, hashedSessionToken, antiCSRFToken, publicData, privateData, userId

### Key Relationships

- Post belongs to User (author) and Category
- Image belongs to Post and User (author)
- Token belongs to User
- Session belongs to User

## Error Handling Pattern

- Custom error classes: `ResetPasswordError`, `VerifyEmailError`
- Form errors use `FORM_ERROR` constant for general form-level errors
- Field-level errors returned as React nodes (e.g., links to signup/login)
- `ErrorNotification` component for overlay-based error display
