# Tech Context: eRădăuți v3

## Technology Stack

### Core Framework

- **Blitz.js** v2.2.4 (Next.js meta-framework)
- **Next.js** v14.2.33 (React framework)
- **React** v18.3.1
- **TypeScript** v5.6.3

### Database & ORM

- **PostgreSQL** (via Docker)
- **Prisma** v5.6.0 (ORM with migrations)
- Custom Prisma middleware for Meilisearch sync

### Authentication

- **@blitzjs/auth** v2.2.4 (email/password auth)
- **@blitzjs/auth/secure-password** (password hashing)
- **@clerk/nextjs** v5.7.5 (Google OAuth)
- **CAP.js** (Proof-of-Work CAPTCHA via @takeshape/use-cap)

### Search

- **Meilisearch** v1.x (full-text search engine)
- **meilisearch** npm package v0.40.0
- **react-instantsearch** v7.14.0 (client-side search UI)
- **instantsearch.js** v4.75.5

### UI & Styling

- **TailwindCSS** v3.4.17
- **daisyUI** v4.12.23 (TailwindCSS component library)
- **lucide-react** (icons)
- **react-photo-gallery** (image gallery grid)
- **yet-another-react-lightbox** (image lightbox)
- **react-loader-spinner** (loading spinners)

### Forms & Validation

- **react-hook-form** v7.54.2
- **@hookform/error-message**
- **zod** v3.24.1 (schema validation)
- **@blitzjs/rpc** (RPC resolver with Zod integration)

### Image Processing

- **pica** v9.0.1 (client-side image resizing)
- **gm** (GraphicsMagick for Node.js - server-side thumbnails)

### Email

- **SocketLabs** (transactional email API)
- **preview-email** (dev email preview)
- **nodemailer** (email transport)

### Other Key Dependencies

- **dayjs** (date formatting)
- **slugify** (URL slug generation)
- **remark** + **remark-html** (markdown rendering)
- **crypto-js** (hashing utilities)
- **@next/bundle-analyzer** (bundle analysis)

## Development Setup

### Prerequisites

- Node.js (see `.nvmrc`)
- Yarn Berry (see `.yarnrc.yml`)
- Docker (for PostgreSQL, Meilisearch, CAP.js)

### Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `MEILI_URL` / `MEILI_MASTER_KEY` - Meilisearch connection
- `SOCKETLABS_*` - Email service credentials
- `CLERK_*` - Clerk auth credentials
- `SESSION_SECRET_KEY` - Session encryption key
- `NEXT_PUBLIC_APP_URL` - Public app URL
- `SUPERADMIN_EMAIL` - Admin user email

### Running Locally

1. Start Docker services: `docker compose -f docker/docker-compose.yml up -d`
2. Install dependencies: `yarn install`
3. Run migrations: `yarn blitz prisma migrate dev`
4. Seed database: `yarn blitz db seed`
5. Start dev server: `yarn blitz dev`

## Deployment

### Docker-based Deployment

- Multi-container setup with `docker-compose.yml`
- Services: PostgreSQL, Meilisearch, CAP.js, Node.js web app
- Production build: `yarn blitz build`
- Web command: `yarn blitz start` or custom production server

### Infrastructure

- **Database**: PostgreSQL with persistent volume
- **Search**: Meilisearch with persistent volume
- **CAPTCHA**: CAP.js service
- **Web**: Node.js with Next.js SSR
- **File Storage**: Filesystem-based uploads (mounted volume)

## Key Technical Constraints

### Performance

- SSR with aggressive caching headers (up to 31 days for static pages)
- Image optimization with responsive thumbnails
- Bundle analysis available via `@next/bundle-analyzer`

### Security

- CAP.js proof-of-work CAPTCHA on login/signup/forgot-password
- Secure password hashing with `@blitzjs/auth/secure-password`
- Session management with Blitz Auth
- Authorization guards: `guardAuthenticated()`, `guardEdit()`

### SEO

- Server-side rendered pages
- XML sitemap generation
- Open Graph tags for social sharing
- Canonical URLs
- Microdata/JSON-LD for rich snippets
- Romanian language meta tags

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design down to mobile viewports
- Font: Nunito (self-hosted woff2)
