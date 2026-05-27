# Project Brief: eRădăuți v3 (blitz-e4)

## Overview

eRădăuți v3 is a Romanian classified ads platform serving the Rădăuți/Suceava region. It's the third iteration of the platform, rebuilt using modern web technologies. The platform allows users to post, browse, and search classified advertisements across various categories.

## Core Mission

Provide a fast, accessible, and user-friendly classified ads platform for the local community, with features tailored to the Romanian market.

## Key Requirements

### User Features

- **Browse Ads**: View classified ads by category with pagination
- **Search**: Full-text search with filters (date range, sorting)
- **View Ad Details**: See ad details with image gallery, contact info
- **User Authentication**: Email/password + Google OAuth (via Clerk)
- **Post Ads**: Create, edit, and manage classified ads
- **Image Upload**: Upload and manage ad images with client-side resizing
- **Account Management**: Profile editing, password management

### Admin Features

- **Post Promotion**: Ability to promote/demote posts (frontpage highlighting)
- **Post Deletion**: Admin-level post deletion
- **Meilisearch Reindex**: Trigger search index rebuild

### Technical Requirements

- **Performance**: Server-side rendering, image optimization, caching headers
- **SEO**: Sitemap generation, Open Graph tags, canonical URLs, microdata
- **Security**: CAPTCHA (CAP.js), rate limiting via email throttling, session management
- **Internationalization**: Romanian language throughout (UI, dates, pluralization)
- **Responsive Design**: Mobile-first with TailwindCSS + daisyUI

## Target Audience

- Local residents of Rădăuți and Suceava county, Romania
- Both individuals posting personal ads and businesses advertising services
- Romanian-speaking users

## Success Metrics

- Fast page loads (SSR with aggressive caching)
- High search relevance (Meilisearch with Romanian language support)
- Reliable email delivery (SocketLabs integration)
- Easy ad posting workflow
