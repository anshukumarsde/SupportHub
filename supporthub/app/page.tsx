import TicketTable, { type Ticket } from "./TicketTable";

const tickets: Ticket[] = [
  {
    id: "SUP-1048",
    subject: "I cannot update my payment details",
    customer: "Olivia Martin",
    status: "Open",
    priority: "Urgent",
    updated: "12 minutes ago",
  },
  {
    id: "SUP-1047",
    subject: "My report is missing some rows",
    customer: "Ethan Wilson",
    status: "Working on it",
    priority: "Normal",
    updated: "34 minutes ago",
  },
  {
    id: "SUP-1046",
    subject: "How do I add a team member?",
    customer: "Sophia Chen",
    status: "Open",
    priority: "Low",
    updated: "1 hour ago",
  },
  {
    id: "SUP-1045",
    subject: "Two-step sign-in is not working",
    customer: "Liam Johnson",
    status: "Done",
    priority: "Urgent",
    updated: "2 hours ago",
  },
  {
    id: "SUP-1044",
    subject: "I want to change my email address",
    customer: "Mia Garcia",
    status: "Open",
    priority: "Normal",
    updated: "3 hours ago",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-indigo-700">SupportHub</h1>
            <p className="mt-1 text-sm text-slate-500">A simple place to manage customer questions.</p>
          </div>
          <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            New ticket
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="text-sm text-slate-500">Wednesday, September 23, 2026</p>
          <h2 className="mt-1 text-2xl font-bold">Hello, Jordan</h2>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">All tickets</p>
            <p className="mt-2 text-3xl font-bold">128</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Need an answer</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">24</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Finished</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">96</p>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold">Recent tickets</h2>
            <p className="mt-1 text-sm text-slate-500">The latest questions from your customers.</p>
          </div>
          <TicketTable tickets={tickets} />
        </section>
      </div>
    </main>
  );
}
