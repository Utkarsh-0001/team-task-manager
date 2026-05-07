import { AlertTriangle, CalendarDays, Paperclip } from "lucide-react";
import { formatDate, isOverdue } from "../utils/format";

const priorityClass = {
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  High: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
};

const TaskCard = ({ task }) => {
  const overdue = isOverdue(task);

  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 ${overdue ? "border-rose-300" : "border-slate-200 dark:border-slate-700"}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{task.title}</h3>
        <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${priorityClass[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={14} />
          {formatDate(task.dueDate)}
        </span>
        {task.attachments?.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <Paperclip size={14} />
            {task.attachments.length}
          </span>
        )}
        {overdue && (
          <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
            <AlertTriangle size={14} />
            Overdue
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{task.project?.name}</span>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {task.assignedTo?.name || "Unassigned"}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;

