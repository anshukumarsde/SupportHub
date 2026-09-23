"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Ticket } from "./TicketTable";

export default function NewTicketForm({ onCreated }: { onCreated: (ticket: Ticket) => void }) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [customer, setCustomer] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, customer }),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error ?? "Could not save the ticket.");
      setSaving(false);
      return;
    }

    const newTicket = (await response.json()) as Ticket;
    setSubject("");
    setCustomer("");
    setSaving(false);
    onCreated(newTicket);
    router.refresh();
  }

  return (
    <form className="rounded-xl border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold">Add a ticket</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
        <label className="block text-sm font-medium text-slate-700">
          Customer name
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" onChange={(event) => setCustomer(event.target.value)} required value={customer} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Question
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" onChange={(event) => setSubject(event.target.value)} required value={subject} />
        </label>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={saving} type="submit">{saving ? "Saving..." : "Save ticket"}</button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </form>
  );
}
