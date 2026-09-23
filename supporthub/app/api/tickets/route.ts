import { NextResponse } from "next/server";
import {
  createTicket,
  getTickets,
  updateTicket,
  type TicketRow,
} from "../../../lib/db";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(getTickets());
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    subject?: unknown;
    customer?: unknown;
  };

  if (
    typeof body.subject !== "string" ||
    typeof body.customer !== "string" ||
    !body.subject.trim() ||
    !body.customer.trim()
  ) {
    return NextResponse.json(
      { error: "Subject and customer name are required." },
      { status: 400 },
    );
  }

  const ticket = createTicket({
    subject: body.subject.trim(),
    customer: body.customer.trim(),
  });

  return NextResponse.json(ticket, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    id?: unknown;
    subject?: unknown;
    customer?: unknown;
    status?: unknown;
  };
  const statuses: TicketRow["status"][] = ["Open", "Working on it", "Done"];

  if (typeof body.id !== "string") {
    return NextResponse.json(
      { error: "A valid ticket ID is required." },
      { status: 400 },
    );
  }

  const changes: Parameters<typeof updateTicket>[1] = {};

  if (body.status !== undefined) {
    if (
      typeof body.status !== "string" ||
      !statuses.includes(body.status as TicketRow["status"])
    ) {
      return NextResponse.json({ error: "A valid status is required." }, { status: 400 });
    }
    changes.status = body.status as TicketRow["status"];
  }

  if (body.subject !== undefined) {
    if (typeof body.subject !== "string" || !body.subject.trim()) {
      return NextResponse.json({ error: "A valid question is required." }, { status: 400 });
    }
    changes.subject = body.subject.trim();
  }

  if (body.customer !== undefined) {
    if (typeof body.customer !== "string" || !body.customer.trim()) {
      return NextResponse.json({ error: "A valid customer name is required." }, { status: 400 });
    }
    changes.customer = body.customer.trim();
  }

  if (Object.keys(changes).length === 0) {
    return NextResponse.json({ error: "There is nothing to update." }, { status: 400 });
  }

  const ticket = updateTicket(body.id, changes);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  return NextResponse.json(ticket);
}
