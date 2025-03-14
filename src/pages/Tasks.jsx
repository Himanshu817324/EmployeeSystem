import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design Employee Dashboard", completed: false },
    { id: 2, title: "Integrate Task API", completed: true },
  ]);

  const [newTask, setNewTask] = useState("");
  const [editing, setEditing] = useState(null);

  // Add Task
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
      setNewTask("");
    }
  };

  // Edit Task
  const editTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    setEditing(id);
    setNewTask(task.title);
  };

  // Update Task
  const updateTask = () => {
    setTasks(tasks.map((task) => (task.id === editing ? { ...task, title: newTask } : task)));
    setEditing(null);
    setNewTask("");
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle Task Completion
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-gray-200">
      {/* Page Title */}
      <motion.h2
        className="text-3xl font-bold mb-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Task Management
      </motion.h2>

      {/* Task Input */}
      <motion.div
        className="mb-6 flex gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Enter Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-2 bg-gray-800 text-white border border-gray-600 rounded-md"
        />
        <motion.div whileTap={{ scale: 0.9 }}>
          {editing ? (
            <Button variant="contained" color="secondary" onClick={updateTask}>
              Update
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={addTask}>
              Add
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              className={`p-4 rounded-lg shadow-lg border border-gray-700 ${task.completed ? "bg-green-700 text-white" : "bg-gray-800 text-gray-200"
                }`}
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 50 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-sm opacity-80">
                Status: {task.completed ? "Completed ✅" : "Pending ❌"}
              </p>
              <div className="mt-2 flex gap-2">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: task.completed ? "#10B981" : "#F59E0B",
                      color: "#fff",
                    }}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button variant="contained" color="info" onClick={() => editTask(task.id)}>
                    Edit
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button variant="contained" color="error" onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tasks;
