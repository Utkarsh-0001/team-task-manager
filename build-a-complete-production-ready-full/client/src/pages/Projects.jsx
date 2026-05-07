import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { formatDate } from "../utils/format";

const emptyForm = { name: "", description: "", deadline: "", teamMembers: [], color: "#2563eb" };

const Projects = () => {
  const [projects, setProjects] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const { isAdmin } = useAuth();

  const load = async () => {
    const [{ data: projectData }, userResponse] = await Promise.all([
      api.get("/projects"),
      isAdmin ? api.get("/auth/users") : Promise.resolve({ data: [] })
    ]);
    setProjects(projectData);
    setUsers(userResponse.data);
  };

  useEffect(() => {
    load();
  }, []);

  const createProject = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/projects", form);
      setProjects((current) => [data, ...current]);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Project created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create project");
    }
  };

  const removeProject = async (id) => {
    if (!confirm("Delete this project and all tasks?")) return;
    await api.delete(`/projects/${id}`);
    setProjects((current) => current.filter((project) => project._id !== id));
    toast.success("Project deleted");
  };

  if (!projects) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label">Portfolio</p>
          <h1 className="text-3xl font-extrabold">Projects</h1>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowForm((open) => !open)}>
            <Plus size={18} /> New project
          </button>
        )}
      </div>
      {showForm && (
        <form className="glass grid gap-4 rounded-lg p-5 lg:grid-cols-2" onSubmit={createProject}>
          <input className="input" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
          <textarea className="input lg:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <select
            className="input lg:col-span-2"
            multiple
            value={form.teamMembers}
            onChange={(e) => setForm({ ...form, teamMembers: Array.from(e.target.selectedOptions).map((option) => option.value) })}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name} - {user.role}</option>
            ))}
          </select>
          <button className="btn-primary lg:col-span-2">Create project</button>
        </form>
      )}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project._id} className="glass rounded-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <Link to={`/app/projects/${project._id}`} className="text-lg font-bold hover:text-brand">
                {project.name}
              </Link>
              {isAdmin && (
                <button className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => removeProject(project._id)} aria-label="Delete project">
                  <Trash2 size={17} />
                </button>
              )}
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={16} /> {formatDate(project.deadline)}
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-2 rounded-full" style={{ width: `${project.progress}%`, backgroundColor: project.color }} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.teamMembers?.slice(0, 4).map((member) => (
                <span key={member._id} className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {member.name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Projects;

