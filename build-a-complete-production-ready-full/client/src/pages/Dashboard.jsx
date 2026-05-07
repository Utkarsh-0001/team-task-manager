import { AlertOctagon, CheckCircle2, Clock3, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import LoadingSkeleton from "../components/LoadingSkeleton";
import StatCard from "../components/StatCard";
import api from "../services/api";

const colors = ["#2563eb", "#f97316", "#10b981"];

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(({ data }) => setDashboard(data));
  }, []);

  if (!dashboard) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <p className="label">Overview</p>
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total projects" value={dashboard.totalProjects} icon={FolderKanban} tone="bg-blue-600" />
        <StatCard label="Completed tasks" value={dashboard.completedTasks} icon={CheckCircle2} tone="bg-emerald-600" />
        <StatCard label="Pending tasks" value={dashboard.pendingTasks} icon={Clock3} tone="bg-orange-500" />
        <StatCard label="Overdue tasks" value={dashboard.overdueTasks} icon={AlertOctagon} tone="bg-rose-600" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="glass rounded-lg p-5">
          <h2 className="text-lg font-bold">Task Completion</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dashboard.chart} dataKey="value" nameKey="name" innerRadius={62} outerRadius={94} paddingAngle={4}>
                  {dashboard.chart.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="glass rounded-lg p-5">
          <h2 className="text-lg font-bold">Member Performance</h2>
          <div className="mt-4 space-y-4">
            {dashboard.memberPerformance.map((member) => {
              const pct = member.total ? Math.round((member.completed / member.total) * 100) : 0;
              return (
                <div key={member._id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold">{member.name}</span>
                    <span className="text-slate-500">{member.completed}/{member.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-mint" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <section className="glass rounded-lg p-5">
        <h2 className="text-lg font-bold">Recent Activity</h2>
        <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
          {dashboard.recentActivity.map((item) => (
            <div key={item._id} className="flex items-center gap-3 py-3 text-sm">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {item.actor?.name?.[0] || "A"}
              </div>
              <p>
                <span className="font-semibold">{item.actor?.name}</span> {item.action}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

