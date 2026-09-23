# Full-Stack Blog

A Turborepo monorepo containing a public-facing blog and an admin CMS, both built with Next.js 15, Prisma, and PostgreSQL (Neon).

## Live URLs

- **Client :** [full-stack-project-wsu-20061920.vercel.app](https://full-stack-project-wsu-20061920.vercel.app/)
- **Admin :** [full-stack-project-wsu-20061920-adm.vercel.app](https://full-stack-project-wsu-20061920-adm.vercel.app/)

## Set up Environment

Create a .env file in the project root:

   DATABASE_URL="database-url"
   ADMIN_USERNAME=admin
   PASSWORD=Some-Password
   JWT_SECRET=your-secret-here
   

## Installing the project

- pnpm install
- nvm install 22
- pnpm playwright install
- pnpm --filter @repo/db db:generate
- pnpm --filter @repo/db db:push

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
<img width="1401" height="967" alt="image" src="https://github.com/user-attachments/assets/df9e2350-d749-4fa3-b03d-544d0d592494" />



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
<img width="1417" height="961" alt="image" src="https://github.com/user-attachments/assets/560ac0cd-e53d-4eff-9447-c72433f933cf" />


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
