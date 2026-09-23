export type Ticket = {
  id: string;
  subject: string;
  customer: string;
  status: "Open" | "Working on it" | "Done";
  priority: "Low" | "Normal" | "Urgent";
  updated: string;
};

const statusStyles: Record<Ticket["status"], string> = {
  Open: "bg-blue-50 text-blue-700",
  "Working on it": "bg-amber-50 text-amber-700",
  Done: "bg-emerald-50 text-emerald-700",
};

const priorityStyles: Record<Ticket["priority"], string> = {
  Low: "text-slate-500",
  Normal: "text-amber-600",
  Urgent: "text-rose-600",
};

export default function TicketTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3">Question</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
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
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className={`px-4 py-4 text-sm font-semibold ${priorityStyles[ticket.priority]}`}>
                <span className="mr-1.5">●</span>
                {ticket.priority}
              </td>
              <td className="px-6 py-4 text-right text-sm text-slate-500">{ticket.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
