Judge0 integration

This project can optionally execute and check code using the Judge0 Community API.

Environment variables (optional):

- `JUDGE0_API_URL` — base URL for Judge0 API (defaults to `https://judge0.p.rapidapi.com`)
- `JUDGE0_API_KEY` — optional API key (e.g., RapidAPI key). If omitted, the function will try to call the API without auth (works for self-hosted Judge0 instances).
- `JUDGE0_API_HOST` — optional RapidAPI host header (e.g., `judge0-ce.p.rapidapi.com`) used alongside `JUDGE0_API_KEY`.

How it works:

- `supabase/functions/debug-code` will attempt to map the provided language to a Judge0 `language_id` by calling `/languages`.
- If the language is supported and `JUDGE0_API_URL` is reachable, it will run submissions for any provided `tests` (array of { input, expected }) or do a single run otherwise.
- The function returns an `execution` object summarizing results (stdout, stderr, compile output, status) and a boolean `passed` where tests are provided.
- The AI analysis (Lovable) will receive the execution summary and include it in the reasoning.

Usage (in request body to `debug-code` function):

{
  "code": "...",
  "language": "python",
  "tests": [
    { "input": "1 2\n", "expected": "3\n" }
  ]
}

Notes:
- Judge0 may require an API key / RapidAPI key for community endpoints; add `JUDGE0_API_KEY` and `JUDGE0_API_HOST` to your environment or replace `JUDGE0_API_URL` with a self-hosted Judge0 instance.
- For local development, put these env vars in your supabase function environment configuration (or set them in the hosting environment).
