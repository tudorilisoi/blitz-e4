# Product Context: eRădăuți v3

## Why This Project Exists

eRădăuți is a long-running local community platform (since 2005) for the Rădăuți area in Romania. This v3 rebuild modernizes the platform with a new tech stack while preserving the core classified ads functionality. The previous version (e3) was built on Razzle, and this version migrates to Blitz.js/Next.js for better performance, SEO, and developer experience.

## User Experience Goals

### For Ad Browsers (Anonymous Users)

- **Fast loading**: Pages are server-side rendered with aggressive caching (up to 31 days for static content)
- **Easy navigation**: Browse by category with pagination, search with instant results
- **Rich ad details**: Image gallery with lightbox, contact info reveal, microdata for search engines
- **Mobile-friendly**: Responsive design using TailwindCSS + daisyUI components

### For Ad Posters (Registered Users)

- **Simple signup**: Email/password or Google OAuth (via Clerk)
- **Easy posting**: Tabbed form (ad details + photos) with client-side image resizing
- **Post management**: Edit, delete, and view personal ads
- **Email verification**: Account activation via email link

### For Administrators

- **Post promotion**: Ability to highlight ads on the frontpage
- **Content moderation**: Delete inappropriate content
- **Search index management**: Trigger Meilisearch reindexing

## User Flow

1. **Landing**: Homepage shows latest promoted + recent ads and category list
2. **Browse**: Click a category to see paginated ads, or use search
3. **View Ad**: See full details, images, contact info (revealed on button click)
4. **Post Ad**: Sign up/login → fill form → upload images → publish
5. **Manage**: View personal ads, edit, or delete

## Key Design Decisions

### Dual Auth System

- **Clerk** handles Google OAuth and provides a modern auth UI
- **Blitz Auth** handles traditional email/password auth with secure-password hashing
- A middleware bridges Clerk sessions to Blitz sessions for seamless integration

### Search Architecture

- **Meilisearch** provides fast, typo-tolerant full-text search
- Romanian language support with stop words and synonyms
- Real-time index sync via Prisma middleware hooks
- InstantSearch.js for the client-side search UI with infinite scroll

### Image Pipeline

- **Client-side**: Pica library resizes images before upload (max 1280px)
- **Server-side**: GraphicsMagick creates responsive thumbnails (600x340 webp)
- **Storage**: Filesystem-based uploads served via a custom API route

### Caching Strategy

- **SSR pages**: Long-lived cache headers (31 days) for static content
- **API routes**: 1-hour cache for posts API, no-cache for admin endpoints
- **Images**: Conditional requests with If-Modified-Since, 1-hour cache
