"use client";

import { useState } from "react";

export type Ticket = {
  id: string;
  subject: string;
  customer: string;
  status: "Open" | "Working on it" | "Done";
  updated: string;
};

export type TicketTableProps = {
  tickets: Ticket[];
  onTicketUpdated: (ticket: Ticket) => void;
};

const statusStyles: Record<Ticket["status"], string> = {
  Open: "bg-blue-50 text-blue-700",
  "Working on it": "bg-amber-50 text-amber-700",
  Done: "bg-emerald-50 text-emerald-700",
};

export default function TicketTable({
  tickets,
  onTicketUpdated,
}: TicketTableProps) {
  const [ticketValues, setTicketValues] = useState(
    Object.fromEntries(tickets.map((ticket) => [ticket.id, ticket])),
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function saveTicket(id: string, changes: Partial<Pick<Ticket, "subject" | "customer" | "status">>) {
    const previousTicket = ticketValues[id];
    const nextTicket = { ...previousTicket, ...changes };
    setTicketValues((current) => ({ ...current, [id]: nextTicket }));
    setSavingId(id);
    setError("");

    try {
      const response = await fetch("/api/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...changes }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Could not update the ticket.");
      }

      const savedTicket = (await response.json()) as Ticket;
      setTicketValues((current) => ({ ...current, [id]: savedTicket }));
      onTicketUpdated(savedTicket);
    } catch (statusError) {
      setTicketValues((current) => ({ ...current, [id]: previousTicket }));
      setError(statusError instanceof Error ? statusError.message : "Could not update the ticket.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3">Question</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-6 py-3 text-right">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => {
            const currentTicket = ticketValues[ticket.id] ?? ticket;

            return (
            <tr className="hover:bg-slate-50" key={ticket.id}>
              <td className="px-6 py-4">
                <input
                  aria-label={`Question for ${ticket.id}`}
                  className="w-full rounded border border-transparent bg-transparent px-1 text-sm font-semibold text-slate-800 outline-none focus:border-slate-300 focus:bg-white"
                  defaultValue={currentTicket.subject}
                  disabled={savingId === ticket.id}
                  onBlur={(event) => {
                    const subject = event.target.value.trim();
                    if (subject && subject !== currentTicket.subject) {
                      void saveTicket(ticket.id, { subject });
                    }
                  }}
                />
                <p className="mt-1 text-xs text-slate-400">{ticket.id}</p>
              </td>
              <td className="px-4 py-4">
                <input
                  aria-label={`Customer for ${ticket.id}`}
                  className="w-full rounded border border-transparent bg-transparent px-1 text-sm text-slate-700 outline-none focus:border-slate-300 focus:bg-white"
                  defaultValue={currentTicket.customer}
                  disabled={savingId === ticket.id}
                  onBlur={(event) => {
                    const customer = event.target.value.trim();
                    if (customer && customer !== currentTicket.customer) {
                      void saveTicket(ticket.id, { customer });
                    }
                  }}
                />
              </td>
              <td className="px-4 py-4">
                <select
                  aria-label={`Status for ${ticket.subject}`}
                  className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${statusStyles[currentTicket.status]}`}
                  disabled={savingId === ticket.id}
                  onChange={(event) => void saveTicket(ticket.id, { status: event.target.value as Ticket["status"] })}
                  value={currentTicket.status}
                >
                  <option>Open</option>
                  <option>Working on it</option>
                  <option>Done</option>
                </select>
              </td>
              <td className="px-6 py-4 text-right text-sm text-slate-500">{currentTicket.updated}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
      {error && <p className="px-6 py-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
