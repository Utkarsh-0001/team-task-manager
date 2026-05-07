import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import TaskCard from "../components/TaskCard";
import { useDebounce } from "../hooks/useDebounce";
import api from "../services/api";

const Tasks = () => {
  const [tasks, setTasks] = useState(null);
  const [view, setView] = useState("board");
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", sort: "dueDate" });
  const debouncedSearch = useDebounce(filters.search);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries({ ...filters, search: debouncedSearch }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    api.get(`/tasks?${params.toString()}&limit=100`).then(({ data }) => setTasks(data.data));
  }, [filters.status, filters.priority, filters.sort, debouncedSearch]);

  if (!tasks) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label">Execution</p>
          <h1 className="text-3xl font-extrabold">Tasks</h1>
        </div>
        <div className="flex rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          {["board", "list"].map((mode) => (
            <button
              key={mode}
              className={`rounded px-3 py-1.5 text-sm font-semibold capitalize ${view === mode ? "bg-brand text-white" : "text-slate-500"}`}
              onClick={() => setView(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      <section className="glass grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_160px_160px_160px]">
        <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
          <Search size={17} className="text-slate-400" />
          <input
            className="w-full bg-transparent py-2 text-sm outline-none"
            placeholder="Search tasks"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </label>
        <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All status</option>
          <option>Todo</option><option>In Progress</option><option>Completed</option>
        </select>
        <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All priority</option>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <select className="input" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="dueDate">Due date</option>
          <option value="-createdAt">Newest</option>
          <option value="priority">Priority</option>
        </select>
      </section>
      {view === "board" ? (
        <KanbanBoard tasks={tasks} setTasks={setTasks} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => <TaskCard key={task._id} task={task} />)}
        </div>
      )}
    </div>
  );
};

export default Tasks;

