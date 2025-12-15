# 🌐 Synapse-Synchrony Client (Frontend)

Professional-grade Vite/React landing/frontend for the Synapse-Synchrony platform. This client visualizes the CSE 4510 proposal (wellness, collaboration, inclusive communication, campus info) and pairs with the auth server you shared.

---

## 🎯 Overview
- **Goal:** Present the unified Synapse experience: wellness monitoring, inclusive chat, collaborative workspace, and campus portal.
- **Current state:** Static marketing/UX shell only (no backend calls). Dark/light theming, responsive layout, animated sections, placeholder navigation.
- **Upstream proposal pillars:** SynapseWorkspace, SynapseChat, MediLink, SynapsePortal (see mapping below).

---

## ✨ Frontend Features
- **Theming:** Light/dark/system toggle persisted in `localStorage` (`ThemeProvider`, `ModeToggle` using Radix + shadcn-style Button).
- **Routing:** React Router v7 `createBrowserRouter` with root layout and home page.
- **Responsive shell:** Sticky navbar (desktop + mobile sidebar), footer with CTA/social, hero CTA buttons, section anchors.
- **Animations:** AOS on scroll with per-section durations/delays.
- **Stats/visuals:** Count-up metrics (`react-countup`), imagery-driven hero and showcases, testimonial carousel with controls.
- **Styling:** Tailwind CSS v4 + custom `btn` utility and CSS tokens in `src/index.css`; utility-first component styling.
- **Assets:** Local hero/background/logo imagery and partner art under `src/assets`.

---

## 📁 Project Structure (client)
```
Synapse-Synchrony---client/
├── src/
│   ├── main.jsx              # Vite entry
│   ├── App.jsx               # ThemeProvider + RouterProvider
│   ├── routes/Router.jsx     # createBrowserRouter config
│   ├── layouts/RootLayout.jsx# Navbar + Outlet + Footer
│   ├── components/
│   │   ├── theme-provider.jsx
│   │   ├── mode-toggle.jsx
│   │   ├── ui/button.jsx     # cva + Radix Slot
│   │   └── Shared/
│   │       ├── Footer.jsx
│   │       └── Navbar/
│   │           ├── Navbar.jsx
│   │           ├── NavMenuGeneral.jsx
│   │           ├── NavButton.jsx
│   │           ├── HamburgerButton.jsx
│   │           ├── HamburgerSidebar.jsx
│   │           └── HabitudeLogo.jsx
│   ├── pages/HomePage/       # All homepage sections
│   │   ├── HeroSection.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Services.jsx
│   │   ├── FeaturedShowcase.jsx
│   │   ├── QuickStats.jsx
│   │   ├── StatsCounter.jsx
│   │   ├── FarmerSuccessStories.jsx
│   │   ├── BecomeAPartner.jsx
│   │   ├── OurTrustedPartners.jsx
│   │   └── ServiceCard.jsx
│   ├── index.css             # Tailwind imports, theme tokens, btn utility
│   └── assets/               # Logos, hero images, lottie, backgrounds
├── public/                   # Vite static
├── package.json
└── vite.config.js
```

---

## 🔐 Authentication Server (backend)
- **Purpose:** Express + MongoDB auth service for signup → verify → login → logout → reset flows. Issues JWT via HttpOnly cookie; bcrypt-hashed passwords; CORS pinned to localhost client.
- **Status:** Core flows live; password-reset email send is scaffolded but not wired; Mailtrap helpers exist though controllers currently use Brevo.
- **Quick start:** `npm install && npm run dev` (defaults to port `5000`); update CORS in `server.js` if the client URL changes.
- **Env (.env):** `PORT=5000`, `MONGODB_URI=...`, `JWT_SECRET=...`, `NODE_ENV=development`, `BREVO_API_KEY=...`, `MAILTRAP_TOKEN=...`, `CLIENT_URL=http://localhost:5173`.
- **API (base `/api/auth`):** `POST /signup`, `POST /verify-email`, `POST /login`, `POST /logout`, `POST /forgot-password`, `POST /reset-password/:token`, `GET /check-auth` (JWT cookie required).
- **Security:** HttpOnly + same-site cookies (secure in production), JWT 7d expiry, bcrypt salts=10, `VerifyToken` middleware reads `req.cookies.token`.
- **Gaps to harden:** add input validation (zod/celebrate), rate limiting + helmet, wire password reset email delivery, consider short-lived access+refresh with rotation, add logging/metrics and structured errors.

---

## 🔗 Proposal Alignment (Frontend vs Vision)
- **SynapseWorkspace:** Visual nods via Services/Features cards, but no file upload/preview, versioning, inline comments, or whiteboard channels.
- **SynapseChat:** CTA cards mention inclusive chat; no real-time messaging, E2E encryption, sign-language/speech translation, threads, or distraction-free mode.
- **MediLink:** Hero + copy reference wellness; no telemetry capture, stress/mood analytics, alerts, or dashboards.
- **SynapsePortal:** Campus events/updates mentioned in cards; no events feed, lost-and-found, blogs, notifications, or search/filter UX.

Outcome: UI-only marketing shell; all functional pillars remain to be built.

---

## 🧩 Page/Section Breakdown
- **Navbar:** Sticky, translucent, desktop links + mobile hamburger/overlay; brand logo; mode toggle; login/logout buttons are stubs (`user` undefined).
- **HeroSection:** Gradient hero over banner image; four pillar cards (wellness, inclusive chat, collaborative learning, campus engagement); CTA buttons (`/add-habit`, `/browse` placeholders); quick stats counters.
- **Features:** 8-card grid (community, messaging, goals, events, dashboard, journal, resources, achievements); clicks use `window.location.href` to placeholder paths.
- **HowItWorks:** Four-step narrative (join community, join conversations, stay informed, track progress) with AOS.
- **Services + FeaturedShowcase:** Four service cards (community, messaging, campus updates, wellness/progress) and imagery showcase; embeds `StatsCounter` percent metrics.
- **StudentSuccessStoriesSection:** Carousel with ratings, metrics, arrows, dots; remote images; static data only.
- **BecomePartner:** Partner benefits grid + CTA buttons (mail/guide) without logic.
- **OurTrustedPartners:** Marquee of logos/descriptions (not rendered in Home composition by default).
- **Footer:** Brand blurb, contacts, newsletter form (console.log only), social icons placeholders, quick links, legal links.

---

## 🛠️ Tech Stack
- **Core:** Vite 7, React 19, React Router 7.
- **Styling:** Tailwind CSS 4, custom CSS tokens, `btn` utility class, `tailwind-merge`, `clsx`.
- **UI/UX:** Radix Dropdown, class-variance-authority button, AOS animations, react-countup stats, lucide-react icons.
- **State/auth:** None implemented; `user` placeholders in navbar/sidebar.

---

## 🚧 Gaps vs Functional Goals
- No backend/API integration, auth, or persistence.
- No real-time chat, encryption, accessibility translators, or notification controls.
- No MediLink analytics (stress/mood detection, context-aware alerts, dashboards).
- No Workspace features (uploads, previews, versioning, inline comments, collaborative whiteboard).
- No Portal features (events feed, lost-and-found, blogs, announcements, search/filter, notifications).
- Navigation targets (`/auth`, `/community`, `/dashboard`, etc.) and CTA routes are placeholders.
- No tests, CI, security headers, or performance safeguards on the client.

---

## 🚀 Quick Start (client)
```bash
npm install
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview
npm run lint     # ESLint (eslint.config.js)
```

Dev server defaults to Vite’s port (5173). Update CORS/client URL on the server side accordingly.

---

## 🔄 Next Steps to Match the Auth Server & Proposal
- Wire auth flows to the server: login/register/OAuth/OTP, token refresh, logout, and `/me`.
- Add protected routes and role-aware UI (user/admin/moderator/farmer/partner).
- Implement real navigation/pages for chat, workspace, portal, dashboards, and wellness analytics; replace placeholder links/CTAs.
- Build SynapseChat UI: channels, threads, message list, composer, typing/read receipts, distraction-free mode, accessibility translators (sign-language→text, speech↔text).
- Build SynapseWorkspace UI: uploads with preview/versioning, inline comments, channel scoping/permissions, whiteboard canvas.
- Build SynapsePortal UI: events feed, lost-and-found submissions, blogs, announcements, search/filter, notifications.
- Add client-side guards, optimistic updates, error surfaces, skeletons/spinners, and toast handling.
- Instrument A11y: keyboard nav, focus rings, reduced motion, aria labels; ensure contrast.
- Add testing (unit/component/e2e) and CI checks; performance budgets and lazy loading where needed.

---

## 📚 Reference: Proposal Snapshot (from PDF)
- Motivation: rising student stress; fragmented collab; distracting chat; scattered campus updates.
- Objective: unified platform for academic/social/mental well-being; proactive and inclusive.
- Critical challenges: privacy/ethics, encryption latency, AI accuracy, concurrent editing, moderation, timeliness, inclusivity vs performance, notification load vs wellness.
- Suggested stack: React/Tailwind; Node/Express/Mongo; JWT/bcrypt; Multer+S3/Cloudinary; Jest/Supertest; Helmet; OpenCV + Gemini; CI/CD.

---

## ⚙️ Routing & Layout Notes
- `Router.jsx`: single route `/` → `RootLayout` → `Home`. Expand with nested routes when backend endpoints exist.
- `RootLayout`: sticky navbar, main outlet, footer. Navbar currently uses client-side links; auth buttons are placeholders.
- Theming is global via root class toggles; `storageKey` is `vite-ui-theme`.

---

## 📦 Assets & Styling Notes
- Assets live in `src/assets/` (logos, hero images, partners, backgrounds, lottie).
- `src/index.css` defines Tailwind imports, `btn` utility, theme tokens for light/dark palettes, and base `@layer` styles.

---

## 🧪 Testing Status
- No automated tests yet; add component tests (Vitest/RTL) and integration/e2e after wiring data.

---

## 🔒 Security & Hardening (client-side to add)
- Auth token handling with secure storage strategy, CSRF-aware refresh calls, route guards.
- Input validation on forms, sane error/UI messaging, rate-limit feedback from server responses.
- Sensible defaults for notifications to support wellness goals; user controls for focus/distraction-free modes.

