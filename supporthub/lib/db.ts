import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

export type TicketRow = {
  id: string;
  subject: string;
  customer: string;
  status: "Open" | "Working on it" | "Done";
  updated: string;
};

const dataDirectory = path.join(process.cwd(), "data");
mkdirSync(dataDirectory, { recursive: true });

const database = new Database(path.join(dataDirectory, "supporthub.db"));

database.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    customer TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open',
    updated TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const ticketCount = database
  .prepare("SELECT COUNT(*) AS count FROM tickets")
  .get() as { count: number };

if (ticketCount.count === 0) {
  const insert = database.prepare(`
    INSERT OR IGNORE INTO tickets (id, subject, customer, status, updated)
    VALUES (@id, @subject, @customer, @status, @updated)
  `);

  const seedTickets: TicketRow[] = [
    { id: "SUP-1048", subject: "I cannot update my payment details", customer: "Olivia Martin", status: "Open", updated: "12 minutes ago" },
    { id: "SUP-1047", subject: "My report is missing some rows", customer: "Ethan Wilson", status: "Working on it", updated: "34 minutes ago" },
    { id: "SUP-1046", subject: "How do I add a team member?", customer: "Sophia Chen", status: "Open", updated: "1 hour ago" },
    { id: "SUP-1045", subject: "Two-step sign-in is not working", customer: "Liam Johnson", status: "Done", updated: "2 hours ago" },
    { id: "SUP-1044", subject: "I want to change my email address", customer: "Mia Garcia", status: "Open", updated: "3 hours ago" },
  ];

  const seed = database.transaction((tickets: TicketRow[]) => {
    for (const ticket of tickets) insert.run(ticket);
  });

  seed(seedTickets);
}

export function getTickets(): TicketRow[] {
  return database
    .prepare("SELECT id, subject, customer, status, updated FROM tickets ORDER BY rowid DESC")
    .all() as TicketRow[];
}

export function createTicket(input: {
  subject: string;
  customer: string;
}): TicketRow {
  const ticket: TicketRow = {
    id: `SUP-${Date.now()}`,
    subject: input.subject,
    customer: input.customer,
    status: "Open",
    updated: "just now",
  };

  database
    .prepare(`
      INSERT INTO tickets (id, subject, customer, status, updated)
      VALUES (@id, @subject, @customer, @status, @updated)
    `)
    .run(ticket);

  return ticket;
}

export function updateTicketStatus(
  id: string,
  status: TicketRow["status"],
): TicketRow | undefined {
  database
    .prepare("UPDATE tickets SET status = @status, updated = @updated WHERE id = @id")
    .run({ id, status, updated: "just now" });

  return database
    .prepare("SELECT id, subject, customer, status, updated FROM tickets WHERE id = ?")
    .get(id) as TicketRow | undefined;
}
