import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LayoutDashboard, ShieldCheck, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => (
  <main className="min-h-screen bg-slate-950 text-white">
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-45"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1800&q=80)"
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/86 to-slate-950/28" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-lg font-extrabold">
          Team Task Manager
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
            Login
          </Link>
          <Link to="/signup" className="btn-primary">
            Start
          </Link>
        </div>
      </nav>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-20 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-4 inline-flex rounded-full border border-white/20 px-3 py-1 text-sm font-semibold text-blue-100">
            Projects, tasks, analytics, and team flow
          </p>
          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
            Team Task Manager
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            A polished workspace for planning projects, assigning work, tracking delivery, and keeping every teammate aligned in real time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="btn-primary">
              Create workspace <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">
              Use demo login
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="glass rounded-lg p-5 text-slate-900 dark:text-white"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: LayoutDashboard, title: "Analytics", text: "Completion charts and performance." },
              { icon: UsersRound, title: "Teams", text: "Admin and member workflows." },
              { icon: CheckCircle2, title: "Kanban", text: "Drag tasks through delivery." },
              { icon: ShieldCheck, title: "Secure", text: "JWT, RBAC, validation, limits." }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
                <Icon className="mb-4 text-brand" />
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  </main>
);

export default Landing;

