# PublicHelp LK — Passport Services

A multilingual (Sinhala / Tamil / English) government-service guidance assistant for Sri Lanka,
built from the *PublicHelp LK Proposal* deck. The first live service is **passports**: 15 verified cases taken
from the Department of Immigration and Emigration (immigration.gov.lk), last checked **12 Nov 2026**.

## Quick start

```bash
npm run install:all     # installs server + client dependencies
npm run dev             # API on :5000 + React app on :5173
```
Open http://localhost:5173. For production: `npm run build && npm start` (Express serves `client/dist` on :5000).

Copy `server/.env.example` to `server/.env` and set a long random `JWT_SECRET` before deploying.
Requires Node.js 22.13+ (uses the built-in `node:sqlite`, so there is no native database driver to install).

---

## What we need — Frontend

| Area | Choice | Why |
|---|---|---|
| Framework | **React 18 + Vite** | Fast dev server, simple build |
| Routing | **React Router 6** | Public pages + protected `/app/*` dashboard |
| Animation | **Framer Motion** | Page transitions, sidebar collapse, staggered cards, animated checklists, counters |
| Icons | **lucide-react** | Clean line icons |
| Styling | Plain CSS with design tokens (`src/index.css`) | Blue · black · white theme, no framework lock-in |
| Fonts | Plus Jakarta Sans + Noto Sans Sinhala + Noto Sans Tamil | Correct rendering of all three scripts |

**Pages**

| Route | Page |
|---|---|
| `/` | Landing: hero with an animated passport, ask bar, the 4 big buttons (New / Child / Lost / Abroad), problem → solution, the 5-step journey, services, risks & safeguards, SDG 16/10 |
| `/signin`, `/signup` | Split-screen auth with animated art, password strength meter, show/hide password, field-level errors |
| `/app` | Dashboard overview: greeting, quick actions, saved journeys, office hours |
| `/app/assistant` | Ask in any of the 3 languages; it detects the language and the task, then shows the official steps, source and last-checked date |
| `/app/cases`, `/app/cases/:id` | All 15 passport cases with filter tabs; detail page with a tickable step timeline, document checklist, progress ring (saved to the account), special situations, source box |
| `/app/journeys` | The user's saved progress across cases |
| `/app/fees` | Live fee calculator (passport type, normal/urgent, lost-passport fine, extra services) + official fee table |
| `/app/forms`, `/app/offices`, `/app/contacts` | Forms list, Head/Regional offices & hours, click-to-call contacts |
| `/app/profile` | Edit profile, preferred language, change password |
| `/app/services/*` | Birth certificate, NIC, driving licence, police clearance (coming soon) |

**Layout:** a collapsible black sidebar (it becomes a slide-in drawer on mobile), a sticky top bar with search, a language switch and a 1962 call button, and a floating "Not clear? Call 1962" button.

## What we need — Backend

| Area | Choice |
|---|---|
| Server | **Node.js + Express** (`server/src/index.js`) |
| Database | **SQLite** via built-in `node:sqlite` (`users`, `journeys`, `questions`). Swap for PostgreSQL in production. |
| Auth | **bcryptjs** password hashing + **JWT** (7-day) bearer tokens, login throttling |
| Data | Verified passport content in `server/src/data/passport.js`. Every case links to its official source page and last-checked date. |

**API**

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account (name, email, password, optional NIC/phone, language) |
| POST | `/api/auth/login` | – | Sign in, returns a JWT |
| GET/PUT | `/api/auth/me` | ✔ | Read / update profile |
| PUT | `/api/auth/password` | ✔ | Change password |
| GET | `/api/passport/meta` | – | Categories, sources, known gaps, last-checked date |
| GET | `/api/passport/cases[?category=&q=]` | – | Case list |
| GET | `/api/passport/cases/:id` | – | Full case: steps, documents, warnings, source |
| GET | `/api/passport/fees` · `/forms` · `/offices` · `/contacts` | – | Reference data |
| POST | `/api/passport/fees/calculate` | – | Fee breakdown + total |
| POST | `/api/assistant/ask` | optional | Language + task detection → matched case (or the "call 1962" safety answer) |
| GET/PUT/DELETE | `/api/journeys[/:caseId]` | ✔ | The user's saved step and document progress |

### Safety rules built in (from the proposal)
- Answers come **only** from verified case data, each with an official link and last-checked date.
- If the question isn't about passports, or nothing matches, the assistant says so and points to **1962**. It never guesses.
- Medium-confidence matches ask the user to confirm the task; alternatives are shown.
- Known gaps in the official pages are recorded in `gaps` and are not filled in by guessing.

## Next steps
- Have native speakers review the Sinhala/Tamil UI strings, then translate the full case content.
- Replace the rule-based matcher with an LLM + retrieval over the same verified data (keep the source and last-checked rules).
- Add an admin screen for re-verifying sources and updating last-checked dates.
- Move to PostgreSQL, add email verification and password reset, and deploy behind HTTPS.
- Run the evaluation from the proposal: guided task completion vs. normal manual search on 10–20 tasks.
