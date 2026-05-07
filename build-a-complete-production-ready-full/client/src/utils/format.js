import { format, isBefore, parseISO } from "date-fns";

export const formatDate = (value) => (value ? format(parseISO(value), "MMM d, yyyy") : "No date");

export const isOverdue = (task) =>
  task?.status !== "Completed" && task?.dueDate && isBefore(parseISO(task.dueDate), new Date());

export const initials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

