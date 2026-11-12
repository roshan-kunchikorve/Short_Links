# ShortLinks: URL Shortener

A fast URL shortener that needs no sign-up. Paste a long link, optionally pick your own alias and an expiry date, and get a short link with a QR code. A "My links" page shows click counts and lets you delete the links you created.

**Live demo:** https://your-app.vercel.app <!-- replace with your Vercel URL -->

<!-- Save a screenshot as public/screenshot.png, then uncomment the next line -->
<!-- ![ShortLinks screenshot](public/screenshot.png) -->

## Features

- Custom aliases (3 to 30 characters) or auto-generated 7-character codes
- Optional expiry: 1, 7 or 30 days
- Click analytics: total clicks and time of the last click
- QR code for every short link
- "My links" page with copy and delete, no account needed
- Server-side validation: only http/https, reserved aliases blocked, links to itself rejected
- Rate limiting: 10 new links per minute per visitor
- Light and dark theme (follows your system, with a toggle)
- Responsive UI built with Tailwind CSS v4

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js (App Router), React |
| Database | MongoDB Atlas with the official `mongodb` driver |
| Styling | Tailwind CSS v4 |
| Extras | `qrcode` for QR images |
| Hosting | Vercel |

## How it works

```
Create a link                               Open a link
Browser --POST /api/generate--> API         Browser --GET /:code--> Route Handler
  1. rate limit                               1. find the code in MongoDB
  2. validate URL and alias                   2. check it has not expired
  3. insert (unique index on the code)        3. send a 307 redirect
  <-- { shorturl, manageKey }                 4. count the click after the response
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/generate` | Create a link. Body: `{ url, shorturl?, expiresInDays? }` |
| GET | `/api/links?codes=a,b` | Stats (clicks, dates) for up to 50 codes |
| DELETE | `/api/links` | Delete a link. Body: `{ shorturl, manageKey }` |
| GET | `/:code` | Redirect to the original URL |

## Project structure

```
app/
  page.tsx               Home page (create a link)
  links/page.js          My links: stats, copy, delete
  link-not-found/        Page shown for missing or expired links
  [shorturl]/route.js    Redirect + click counting
  api/generate/route.js  Create a short link
  api/links/route.js     Stats and delete
components/
  Navbar.js, ShortenForm.js
lib/
  mongodb.js             Cached connection + indexes
  links.js               Validation, code generator, key hashing
  rateLimit.js           MongoDB-backed rate limiter
  savedLinks.js          localStorage helpers
```

## Getting started

You need Node.js 20.9 or newer and a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

```bash
git clone https://github.com/roshan-kunchikorve/Short_Links.git
cd Short_Links
npm install
cp .env.example .env.local   # then paste your MongoDB connection string
npm run dev
```

Open http://localhost:3000.

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add the environment variable `MONGODB_URI` in Project Settings.
4. In MongoDB Atlas open Network Access and allow `0.0.0.0/0`. Vercel uses changing IP addresses, so a fixed allow-list will not work.
5. Deploy. After changing an environment variable later, redeploy so it takes effect.

## Security notes

- Only `http` and `https` destinations are accepted, so `javascript:` and `data:` links are rejected.
- Links containing a username or password (`https://google.com@evil.com`) are rejected.
- Input types are checked before database queries to prevent NoSQL injection.
- A unique index on the short code stops duplicates, even under concurrent requests.
- The delete key is stored only as a SHA-256 hash and compared in constant time.
- Rate-limit counters use a hash of the IP address and expire automatically.

## Roadmap

- User accounts (Clerk or NextAuth) to sync links across devices
- Click chart and referrer/device breakdown
- Google Safe Browsing check for malicious destinations
- Automated tests for the validators and API routes
- Redis cache for hot links

## License

MIT, see [LICENSE](LICENSE).
