import Dashboard from "./Dashboard";
import { getTickets } from "../lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  const tickets = getTickets();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-indigo-700">SupportHub</h1>
            <p className="mt-1 text-sm text-slate-500">A simple place to manage customer questions.</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Ticket dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Create and view customer questions.</p>
        </div>

        <Dashboard
          initialTickets={tickets}
        />
      </div>
    </main>
  );
}
