# File Tree: src

**Generated:** 3/28/2026
**Root Path:** `src/`

```
src/
├── app/
│   ├── layouts/
│   │   ├── auth-layout.tsx
│   │   ├── dashboard-layout.tsx
│   │   └── root-layout.tsx
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   └── styles/
│       └── globals.css
├── entities/
│   └── movie/
│       ├── api/
│       │   └── fetch-movies.ts
│       ├── lib/
│       │   └── get-image-url.ts
│       ├── model/
│       │   └── types.ts
│       ├── ui/
│       │   ├── movie-card-skeleton.tsx
│       │   └── movie-card.tsx
│       └── index.ts
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── fake-auth.ts
│   │   ├── model/
│   │   │   ├── auth-schema.ts
│   │   │   └── auth-store.ts
│   │   ├── ui/
│   │   │   └── login-form.tsx
│   │   └── index.ts
│   ├── movie-filters/
│   │   ├── model/
│   │   │   └── filters-store.ts
│   │   ├── ui/
│   │   │   └── movie-filters.tsx
│   │   └── index.ts
│   ├── movie-search/
│   │   ├── ui/
│   │   │   └── search-bar.tsx
│   │   └── index.ts
│   ├── theme/
│   │   ├── model/
│   │   │   └── theme-store.ts
│   │   ├── ui/
│   │   │   └── theme-toggle.tsx
│   │   └── index.ts
│   └── watchlist/
│       ├── model/
│       │   └── watchlist-store.ts
│       ├── ui/
│       │   └── watchlist-table.tsx
│       └── index.ts
├── routes/
│   ├── _authenticated/
│   │   ├── movie/
│   │   │   └── $movieId.tsx
│   │   ├── dashboard.tsx
│   │   └── watchlist.tsx
│   ├── __root.tsx
│   ├── _authenticated.tsx
│   ├── 404.tsx
│   ├── index.tsx
│   └── login.tsx
├── shared/
│   ├── api/
│   │   ├── api-error.ts
│   │   └── tmdb-client.ts
│   ├── config/
│   │   └── env.ts
│   ├── hooks/
│   │   └── use-debounce.ts
│   ├── lib/
│   │   ├── cookies.ts
│   │   └── utils.ts
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── error-boundary.tsx
│       ├── error-fallback.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       └── sonner.tsx
├── App.tsx
├── main.tsx
├── router.ts
└── routeTree.gen.ts
```
