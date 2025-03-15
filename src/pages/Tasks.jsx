import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Button, TextField } from "@mui/material";
import { motion } from "framer-motion";

const employees = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Michael Johnson", label: "Michael Johnson" },
];

const statusOptions = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  // Form Fields
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [priority, setPriority] = useState(priorityOptions[1]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [dueDate, setDueDate] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add or Update Task
  const handleTask = () => {
    if (taskTitle.trim()) {
      if (editingTask) {
        // Update Task
        setTasks(tasks.map(task =>
          task.id === editingTask ? {
            ...task,
            title: taskTitle,
            assignedTo: assignedTo.map(e => e.value),
            priority: priority.value,
            status: status.value,
            dueDate,
          } : task
        ));
      } else {
        // Add New Task
        const newTask = {
          id: Date.now(),
          title: taskTitle,
          assignedTo: assignedTo.map(e => e.value),
          priority: priority.value,
          status: status.value,
          dueDate,
          comments: [],
        };
        setTasks([...tasks, newTask]);
      }
      resetForm();
    }
  };

  // Edit Task
  const editTask = (task) => {
    setEditingTask(task.id);
    setTaskTitle(task.title);
    setAssignedTo(employees.filter(e => task.assignedTo.includes(e.value)));
    setPriority(priorityOptions.find(p => p.value === task.priority));
    setStatus(statusOptions.find(s => s.value === task.status));
    setDueDate(task.dueDate);
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Reset Form
  const resetForm = () => {
    setEditingTask(null);
    setTaskTitle("");
    setAssignedTo([]);
    setPriority(priorityOptions[1]);
    setStatus(statusOptions[0]);
    setDueDate("");
  };

  // Filter Tasks
  let filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if (priorityFilter) {
    filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter.value);
  }

  if (statusFilter) {
    filteredTasks = filteredTasks.filter(task => task.status === statusFilter.value);
  }

  // Sort Tasks
  if (sortBy === "priority") {
    filteredTasks.sort((a, b) => {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  } else if (sortBy === "dueDate") {
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Task Management System
      </motion.h2>

      {/* Task Form */}
      <div className="mb-6 flex flex-col gap-4">
        <TextField
          label="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          fullWidth
        />
        <Select
          options={employees}
          isMulti
          placeholder="Assign Employees"
          value={assignedTo}
          onChange={setAssignedTo}
          className="text-black"
        />
        <Select
          options={priorityOptions}
          placeholder="Select Priority"
          value={priority}
          onChange={setPriority}
          className="text-black"
        />
        <Select
          options={statusOptions}
          placeholder="Select Status"
          value={status}
          onChange={setStatus}
          className="text-black"
        />
        <TextField
          type="date"
          label="Due Date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="contained"
            color={editingTask ? "secondary" : "primary"}
            onClick={handleTask}
          >
            {editingTask ? "Update Task" : "Add Task"}
          </Button>
        </motion.div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-4">
        <TextField
          label="Search Tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Select
          options={priorityOptions}
          placeholder="Filter by Priority"
          value={priorityFilter}
          onChange={setPriorityFilter}
          isClearable
          className="text-black"
        />
        <Select
          options={statusOptions}
          placeholder="Filter by Status"
          value={statusFilter}
          onChange={setStatusFilter}
          isClearable
          className="text-black"
        />
        <Select
          options={[
            { value: "priority", label: "Sort by Priority" },
            { value: "dueDate", label: "Sort by Due Date" },
          ]}
          placeholder="Sort Tasks"
          value={sortBy}
          onChange={(option) => setSortBy(option ? option.value : null)}
          isClearable
          className="text-black"
        />
      </div>

      {/* Task List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="border p-2">Task</th>
              <th className="border p-2">Assigned To</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="bg-gray-800">
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">{task.assignedTo.join(", ")}</td>
                <td className="border p-2">{task.priority}</td>
                <td className="border p-2">{task.status}</td>
                <td className="border p-2">{task.dueDate}</td>
                <td className="border p-2">
                  <Button onClick={() => editTask(task)}>Edit</Button>
                  <Button onClick={() => deleteTask(task.id)} color="error">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
