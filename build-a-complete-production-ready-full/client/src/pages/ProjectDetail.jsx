import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getSocket } from "../services/socket";
import { formatDate } from "../utils/format";

const emptyTask = { title: "", description: "", priority: "Medium", status: "Todo", dueDate: "", assignedTo: "" };

const ProjectDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [form, setForm] = useState(emptyTask);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`).then(({ data }) => {
      setProject(data.project);
      setTasks(data.tasks);
      setActivity(data.activity);
    });

    const socket = getSocket();
    socket?.emit("join:project", id);
    socket?.on("task:created", ({ task }) => setTasks((current) => [task, ...current]));
    socket?.on("task:updated", ({ task }) => setTasks((current) => current.map((item) => (item._id === task._id ? task : item))));
    socket?.on("task:deleted", ({ id: taskId }) => setTasks((current) => current.filter((item) => item._id !== taskId)));
    return () => {
      socket?.off("task:created");
      socket?.off("task:updated");
      socket?.off("task:deleted");
    };
  }, [id]);

  const createTask = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/tasks", { ...form, project: id });
      setTasks((current) => [data, ...current]);
      setForm(emptyTask);
      setShowForm(false);
      toast.success("Task created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create task");
    }
  };

  if (!project) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <Link to="/app/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand">
        <ArrowLeft size={16} /> Back to projects
      </Link>
      <section className="glass rounded-lg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label">Project</p>
            <h1 className="text-3xl font-extrabold">{project.name}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
          </div>
          {isAdmin && (
            <button className="btn-primary" onClick={() => setShowForm((open) => !open)}>
              <Plus size={18} /> Add task
            </button>
          )}
        </div>
        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
          <div><span className="label">Deadline</span><p className="font-semibold">{formatDate(project.deadline)}</p></div>
          <div><span className="label">Progress</span><p className="font-semibold">{project.progress}%</p></div>
          <div><span className="label">Team</span><p className="font-semibold">{project.teamMembers?.length} members</p></div>
        </div>
      </section>
      {showForm && (
        <form className="glass grid gap-4 rounded-lg p-5 lg:grid-cols-2" onSubmit={createTask}>
          <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} required>
            <option value="">Assign to</option>
            {project.teamMembers?.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}
          </select>
          <textarea className="input lg:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn-primary lg:col-span-2">Create task</button>
        </form>
      )}
      <KanbanBoard tasks={tasks} setTasks={setTasks} />
      <section className="glass rounded-lg p-5">
        <h2 className="text-lg font-bold">Activity</h2>
        <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
          {activity.map((item) => (
            <div key={item._id} className="py-3 text-sm">
              <span className="font-semibold">{item.actor?.name}</span> {item.action}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;

