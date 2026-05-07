import { BarChart3, CheckSquare, FolderKanban, LogOut, UserCircle, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/app/projects", label: "Projects", icon: FolderKanban },
  { to: "/app/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/app/profile", label: "Profile", icon: UserCircle }
];

const SidebarContent = ({ onClose }) => {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full flex-col bg-ink text-white">
      <div className="flex h-16 items-center justify-between px-5">
        <NavLink to="/app/dashboard" className="text-lg font-extrabold" onClick={onClose}>
          Team Task Manager
        </NavLink>
        <button className="rounded-md p-2 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Close navigation">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-white text-ink" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

const Sidebar = ({ mobileOpen, onClose }) => (
  <>
    <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
      <SidebarContent />
    </div>
    {mobileOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <button className="absolute inset-0 bg-slate-950/60" onClick={onClose} aria-label="Close navigation overlay" />
        <div className="relative h-full w-72 max-w-[82vw]">
          <SidebarContent onClose={onClose} />
        </div>
      </div>
    )}
  </>
);

export default Sidebar;

