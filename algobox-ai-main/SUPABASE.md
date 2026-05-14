Supabase Environment Setup

This project requires the following Vite environment variables to be set before running the dev server:

- `VITE_SUPABASE_URL` — your Supabase project URL (e.g. `https://your-project-ref.supabase.co`)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — your project's publishable (anon) key

1. Copy `.env.example` to `.env.local` and fill in the values.

```bash
cp .env.example .env.local
# edit .env.local and add your values
```

2. Restart the dev server:

```bash
npm run dev
```

If the variables are missing, the app will throw a helpful error on startup explaining what to set.