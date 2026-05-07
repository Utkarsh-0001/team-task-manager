import { Mail, ShieldCheck, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <p className="label">Account</p>
        <h1 className="text-3xl font-extrabold">Profile</h1>
      </div>
      <section className="glass rounded-lg p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-lg bg-brand text-2xl font-extrabold text-white">
            {initials(user?.name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{user?.title || "Team member"}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <Mail className="mb-3 text-brand" />
            <p className="label">Email</p>
            <p className="mt-1 font-semibold">{user?.email}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <ShieldCheck className="mb-3 text-mint" />
            <p className="label">Role</p>
            <p className="mt-1 font-semibold">{user?.role}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <UserCircle className="mb-3 text-coral" />
            <p className="label">Projects</p>
            <p className="mt-1 font-semibold">{user?.projects?.length || 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;

