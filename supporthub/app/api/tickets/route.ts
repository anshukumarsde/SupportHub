import { NextResponse } from "next/server";
import {
  createTicket,
  type TicketRow,
  updateTicketStatus,
} from "../../../lib/db";

export const runtime = "nodejs";

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
    status?: unknown;
  };
  const statuses: TicketRow["status"][] = ["Open", "Working on it", "Done"];

  if (typeof body.id !== "string") {
    return NextResponse.json(
      { error: "A valid ticket ID is required." },
      { status: 400 },
    );
  }

  if (
    typeof body.status !== "string" ||
    !statuses.includes(body.status as TicketRow["status"])
  ) {
    return NextResponse.json({ error: "A valid status is required." }, { status: 400 });
  }

  const ticket = updateTicketStatus(body.id, body.status as TicketRow["status"]);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  return NextResponse.json(ticket);
}
