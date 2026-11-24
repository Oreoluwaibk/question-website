# Question Bank

Web app for Question Bank: turn study materials into practice tests. A visitor can read the marketing site. A signed-in learner can upload a PDF or DOCX, generate questions, take a timed test, and review history, analytics, and the leaderboard.

The API is [question-bank-backend](https://github.com/Oreoluwaibk/question-bank-backend). The admin desk is [question-admin-backend](https://github.com/Oreoluwaibk/question-admin-backend). Android package id: `com.oreoluwacreatives.questionapp`.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, and Supabase.

## Pages

Marketing and account pages: `/`, `/about`, `/support`, `/contact`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify`, `/privacy`, `/terms`, `/delete-account`.

The signed-in product lives under these paths:

| Path | What it is |
| --- | --- |
| `/app` | Home, including upload |
| `/materials`, `/materials/add` | Study files |
| `/test/setup`, `/test/[attemptId]` | A test, then `/results` |
| `/history` | Past attempts |
| `/analytics` | Score summary |
| `/leaderboard` | Rankings |
| `/subscription` | Plan checkout (`/success` and `/cancel`) |
| `/profile` | Profile |
| `/accept-terms` | Terms acceptance |

Site name, tagline, and store links are in `lib/site.ts`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set the public site URL, admin URL, and Supabase keys the app expects before signing in. The defaults in `lib/site.ts` point at the Netlify deployments.

`npm run build` then `npm start` runs the production server. `npm run lint` checks the project.
