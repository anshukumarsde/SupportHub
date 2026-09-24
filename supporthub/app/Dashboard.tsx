"use client";

import { useState } from "react";
import NewTicketForm from "./NewTicketForm";
import TicketTable, { type Ticket } from "./TicketTable";

export default function Dashboard({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const openTickets = tickets.filter((ticket) => ticket.status !== "Done").length;
  const workingTickets = tickets.filter((ticket) => ticket.status === "Working on it").length;
  const finishedTickets = tickets.filter((ticket) => ticket.status === "Done").length;

  function updateTicket(updatedTicket: Ticket) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket,
      ),
    );
  }

  function addTicket(newTicket: Ticket) {
    setTickets((currentTickets) => [newTicket, ...currentTickets]);
  }

  return (
    <>
      <NewTicketForm onCreated={addTicket} />

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">All tickets</p>
          <p className="mt-2 text-3xl font-bold">{tickets.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Need an answer</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{openTickets}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Working on it</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{workingTickets}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Finished</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{finishedTickets}</p>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-bold">Recent tickets</h2>
          <p className="mt-1 text-sm text-slate-500">The latest questions from your customers.</p>
        </div>
        <TicketTable tickets={tickets} onTicketUpdated={updateTicket} />
      </section>
    </>
  );
}
