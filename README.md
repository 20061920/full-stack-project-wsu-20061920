# Full-Stack Blog

A Turborepo monorepo containing a public-facing blog and an admin CMS, both built with Next.js 15, Prisma, and PostgreSQL (Neon).

## Live URLs

- **Client (public blog):** [full-stack-project-wsu-20061920.vercel.app](https://full-stack-project-wsu-20061920.vercel.app/)
- **Admin (CMS):** [full-stack-project-wsu-20061920-adm.vercel.app](https://full-stack-project-wsu-20061920-adm.vercel.app/)

## Client (`apps/web`)

A public blog with:

- Homepage listing active posts, 6 per page
- Category, tag, and date archive pages
- Full-text search over post titles
- Post detail pages with Markdown-rendered content
- Per-IP likes on post detail pages
- View counter that increments on each visit
- Dark/light theme toggle
- Responsive layout

## Admin (`apps/admin`)

A CMS for managing blog posts:

- JWT-based login with `httpOnly` cookie
- Dashboard listing all posts (active + inactive)
- Filters for title and visibility
- Sort by name or date, ascending or descending
- Create, edit, and delete posts
- Rich Text Editor for post content using TipTap
- Image preview for post thumbnails
- Toggle active/inactive status inline
- Logout

## Tech Stack

| Layer | Tool |
|-------|------|
| Monorepo | Turborepo + pnpm workspaces |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7 |
| Database | PostgreSQL via Neon |
| ORM | Prisma 6 |
| Styling | Tailwind CSS v4 |
| Auth | JWT + bcrypt, `httpOnly` cookie |
| Testing | Vitest (unit + browser), Playwright (E2E) |
| CI | GitHub Actions |
| Deployment | Vercel (two projects: web + admin) |
