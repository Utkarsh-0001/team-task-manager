import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import api from "../services/api";
import TaskCard from "./TaskCard";

const columns = ["Todo", "In Progress", "Completed"];

const KanbanBoard = ({ tasks, setTasks }) => {
  const grouped = columns.reduce((acc, column) => {
    acc[column] = tasks.filter((task) => task.status === column);
    return acc;
  }, {});

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;

    const previous = tasks;
    setTasks((current) =>
      current.map((task) => (task._id === draggableId ? { ...task, status: destination.droppableId } : task))
    );

    try {
      await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      toast.success("Task moved");
    } catch (error) {
      setTasks(previous);
      toast.error(error.response?.data?.message || "Could not move task");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided, snapshot) => (
              <section
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[360px] rounded-lg border p-3 transition ${
                  snapshot.isDraggingOver
                    ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30"
                    : "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/60"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-bold">{column}</h2>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">
                    {grouped[column].length}
                  </span>
                </div>
                <div className="space-y-3">
                  {grouped[column].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

