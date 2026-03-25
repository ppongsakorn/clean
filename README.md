# Clean

A personal project management tool — self-hosted, free, and built for anyone who wants full control over their tasks and workflows.

> Simple. Colorful. Powerful. Meaningful.

---

## What is Clean?

Clean is a self-hosted web application for managing projects, tasks, and team workflows. Built as a personal project and open to anyone interested in using or contributing to it.

No subscriptions. No per-seat fees. No data sent to third parties. You own everything.

**Why Clean?**
- Free forever — self-host it yourself at zero cost
- Unlimited users, projects, tasks, and custom columns
- A unique **Human % : AI %** column to track how much of your work is AI-assisted
- Clean, fast UI that gets out of your way

---

## Key Features

- **Task management** — List View grouped by status, subtasks, priority flags, due dates, assignees
- **Human : AI ratio** — Built-in column tracking how much of each task was done by human vs. AI (blue / purple split bar)
- **Custom columns** — 12 field types: text, number, date, checkbox, dropdown, multi-select, URL, email, phone, rating, progress, decimal
- **Milestones** — Track project milestones with progress bars linked to tasks
- **Collaboration** — Comments, @mentions, file attachments, in-app notifications, task history
- **Dashboards** — Personal, project, and admin dashboards with Human:AI trend charts
- **Integrations** — LINE Group Chat and Microsoft Teams webhook notifications
- **Export** — CSV / Excel and PDF export
- **Auth** — Username/password + Azure AD SSO (OIDC, config-toggled)
- **RBAC** — Admin, Project Manager, Team Member, Viewer roles
- **Dark mode** — Default dark theme with light mode toggle

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Nuxt.js 3 (Vue 3) |
| Backend | Nuxt.js server routes (Nitro) |
| Database | MySQL 8.x + Prisma ORM |
| Auth | bcrypt + JWT + Azure AD SSO |
| Cache | Redis |
| File Storage | Azure Blob Storage / local volume |
| Notifications | LINE Messaging API + MS Teams Webhooks |
| Hosting | Docker (Azure AKS or on-prem) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Seed sample data
npx prisma db seed

# Start development server
npm run dev
```

App runs at `http://localhost:3000`

---

## Environment Variables

```env
DATABASE_URL=mysql://user:password@localhost:3306/clean
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
AZURE_AD_ENABLED=false
AZURE_AD_TENANT_ID=
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
```

---

## Project Structure

```
/
├── prisma/             # Database schema and migrations
├── server/
│   ├── api/            # REST API routes (/api/v1/)
│   ├── middleware/     # Auth, RBAC, rate limiting
│   └── utils/          # Shared server utilities
├── components/         # Vue components
├── pages/              # Nuxt pages
├── composables/        # Vue composables
├── stores/             # Pinia state management
└── assets/             # CSS design tokens, fonts
```

---

## Contributing

Interested in using or contributing to Clean? Feel free to fork the repo, open issues, or submit pull requests. All contributions are welcome.
