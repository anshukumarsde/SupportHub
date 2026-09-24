# SupportHub

SupportHub is a small customer support ticket dashboard. A support agent can
create a ticket, see all tickets, and change a ticket's status:

```text
Open -> Working on it -> Done
```

The dashboard counts update immediately when a status changes. The change is
also saved in a local SQLite database, so it remains after a page refresh.

This project is intentionally small and is designed to be easy to explain in
a technical interview.

## The one-minute explanation

> SupportHub is a Next.js application using React and TypeScript. The server
> loads tickets from SQLite and renders the initial page. The client-side
> dashboard owns the current ticket list so the status counts can update
> immediately. A small API route creates tickets and updates one ticket's
> status. SQLite provides simple local persistence without needing a separate
> database server.

## Technologies

- **Next.js** - web framework and server-side rendering
- **React** - UI components and client-side state
- **TypeScript** - type-safe application code
- **SQLite** - local ticket storage
- **better-sqlite3** - reads and writes the SQLite database
- **Tailwind CSS** - styling
- **ESLint** - code checks
- **npm** - dependency and script management

## How the application works

### 1. The page loads tickets

`app/page.tsx` runs on the server and calls `getTickets()` from
`lib/db.ts`. It passes the tickets to the client-side `Dashboard` component.

### 2. The dashboard owns the ticket list

`app/Dashboard.tsx` stores the tickets in React state. It calculates:

- All tickets
- Open tickets
- Tickets being worked on
- Done tickets

Because the dashboard owns this state, the summary numbers can change as soon
as a ticket status changes.

### 3. A user creates a ticket

`app/NewTicketForm.tsx` sends the customer name and question to:

```text
POST /api/tickets
```

The API validates the two fields, saves the ticket in SQLite, and returns the
new ticket. The dashboard adds it to the list.

### 4. A user changes a status

`app/TicketTable.tsx` displays the ticket rows and provides a status dropdown.
When the user selects a new status:

1. The dashboard is updated immediately.
2. The browser sends a `PATCH /api/tickets` request.
3. The API validates the ticket ID and status.
4. SQLite saves the new status and update time.
5. The saved ticket is returned to the dashboard.
6. If the request fails, the old status is restored.

This is called an **optimistic update**: the screen updates first while the
server saves the change.

## Project structure

```text
SupportHub/
├── README.md
└── supporthub/
    ├── app/
    │   ├── api/tickets/route.ts
    │   ├── Dashboard.tsx
    │   ├── NewTicketForm.tsx
    │   ├── TicketTable.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── data/
    │   └── supporthub.db
    ├── lib/
    │   └── db.ts
    ├── .gitignore
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    └── tsconfig.json
```

## What each important file does

| File | Responsibility |
| --- | --- |
| `app/page.tsx` | Server entry point. Reads tickets and loads the dashboard. |
| `app/Dashboard.tsx` | Client state, summary counts, and communication between child components. |
| `app/NewTicketForm.tsx` | Form for creating a ticket. |
| `app/TicketTable.tsx` | Displays tickets and changes one ticket's status. |
| `app/api/tickets/route.ts` | API for creating tickets and updating status. |
| `lib/db.ts` | Opens SQLite, creates the table, seeds sample rows, and runs database queries. |
| `data/supporthub.db` | Local SQLite database containing saved tickets. |
| `app/layout.tsx` | Shared HTML layout, page title, fonts, and global CSS import. |
| `app/globals.css` | Tailwind CSS entry point and global styles. |
| `package.json` | Dependencies and commands such as `dev`, `lint`, and `build`. |
| `tsconfig.json` | TypeScript compiler settings. |
| `next-env.d.ts` | Generated Next.js TypeScript declarations. |
| `postcss.config.mjs` | Connects Tailwind CSS to the build process. |
| `eslint.config.mjs` | ESLint rules for Next.js and TypeScript. |
| `.gitignore` | Keeps generated files, dependencies, and the local database out of Git. |

## Database design

The app uses one table:

```sql
CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  customer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  updated TEXT NOT NULL
);
```

The allowed statuses are represented as a TypeScript union:

```ts
type TicketStatus = "Open" | "Working on it" | "Done";
```

The first five sample tickets are inserted automatically when the database is
empty. The database file is ignored by Git because it is local development
data.

## Run the project

### Requirements

Install [Node.js LTS](https://nodejs.org/). npm is included with Node.js.

Check the installation:

```powershell
node --version
npm --version
```

### Start development

From the repository root:

```powershell
cd .\supporthub
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Stop the server with `Ctrl+C`.

### Available commands

```powershell
npm run lint
npm run build
npm run start
```

Run `npm run build` before `npm run start`.

## Why this design?

### Why SQLite?

SQLite is simple for a small demo. It stores data in one local file and does
not require installing or running a separate database server. In a production
application, this could be replaced with PostgreSQL or another shared
database.

### Why keep `Dashboard` as a client component?

The initial ticket data is loaded on the server, but the counts need to change
immediately in the browser. `Dashboard` is the small boundary that owns the
interactive state.

### Why use an API route?

The browser should not access SQLite directly. The API route validates input
and keeps database access on the server.

### Why use an optimistic update?

Changing a status is a quick action. Updating the screen immediately makes the
dashboard feel responsive. If the database request fails, the previous value
is restored.

## Common interview questions

### How does a status change reach the database?

The dropdown sends a `PATCH` request to `/api/tickets` with the ticket ID and
new status. The route validates the status and calls `updateTicketStatus()`
in `lib/db.ts`.

### How do the counts update?

`Dashboard` stores the ticket list in React state. When the table reports an
updated ticket, the dashboard replaces the old ticket in that list. React
rerenders the count expressions.

### What happens if the database update fails?

The table keeps the previous ticket, shows an error message, and tells the
dashboard to restore the previous counts.

### Why is the database code outside `app/`?

`app/` contains pages, components, and routes. `lib/db.ts` contains reusable
server-side database code, so keeping it separate makes responsibilities clear.

### How would you improve this for production?

- Use a shared PostgreSQL database
- Add authentication and authorization
- Validate requests with a schema library
- Add pagination and search
- Add automated tests
- Add migrations instead of creating the table on startup
- Use a real timestamp and format it in the UI
- Add logging and error monitoring

## Current scope

This is a focused interview/demo application. It supports:

- Creating tickets
- Viewing tickets
- Changing one ticket's status
- Saving tickets locally
- Updating summary counts immediately

It does not yet include login, ticket deletion, search, filtering, comments,
file uploads, or a shared cloud database.
