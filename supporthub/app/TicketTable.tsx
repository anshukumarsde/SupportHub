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
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function changeStatus(ticket: Ticket, status: Ticket["status"]) {
    const previousTicket = ticket;
    const nextTicket = { ...ticket, status, updated: "just now" };
    onTicketUpdated(nextTicket);
    setSavingId(ticket.id);
    setError("");

    try {
      const response = await fetch("/api/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticket.id, status }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Could not update the ticket.");
      }

      const savedTicket = (await response.json()) as Ticket;
      onTicketUpdated(savedTicket);
    } catch (statusError) {
      onTicketUpdated(previousTicket);
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
          {tickets.map((ticket) => (
            <tr className="hover:bg-slate-50" key={ticket.id}>
              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-800">{ticket.subject}</p>
                <p className="mt-1 text-xs text-slate-400">{ticket.id}</p>
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">{ticket.customer}</td>
              <td className="px-4 py-4">
                <select
                  aria-label={`Status for ${ticket.subject}`}
                  className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${statusStyles[ticket.status]}`}
                  disabled={savingId === ticket.id}
                  onChange={(event) => void changeStatus(ticket, event.target.value as Ticket["status"])}
                  value={ticket.status}
                >
                  <option>Open</option>
                  <option>Working on it</option>
                  <option>Done</option>
                </select>
              </td>
              <td className="px-6 py-4 text-right text-sm text-slate-500">{ticket.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="px-6 py-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
