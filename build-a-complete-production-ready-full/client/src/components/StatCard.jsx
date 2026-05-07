import { motion } from "framer-motion";

const StatCard = ({ label, value, icon: Icon, tone = "bg-blue-600" }) => (
  <motion.div
    className="glass rounded-lg p-5"
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 260, damping: 22 }}
  >
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </div>
      <div className={`grid h-11 w-11 place-items-center rounded-md text-white ${tone}`}>
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
);

export default StatCard;

