import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Button, TextField, Chip, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Assignment, CalendarToday, PriorityHigh, Info } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

// Priority color mapping
const priorityColors = {
  "High": "bg-red-500/20 text-red-400 border-red-600/30",
  "Medium": "bg-yellow-500/20 text-yellow-400 border-yellow-600/30",
  "Low": "bg-green-500/20 text-green-400 border-green-600/30"
};

// Status color mapping
const statusColors = {
  "To Do": "bg-gray-500/20 text-gray-400 border-gray-600/30",
  "In Progress": "bg-blue-500/20 text-blue-400 border-blue-600/30",
  "Completed": "bg-green-500/20 text-green-400 border-green-600/30"
};

// Status options
const statusOptions = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

// Priority options
const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const customSelectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    '&:hover': {
      borderColor: 'rgba(59, 130, 246, 0.5)',
    },
  }),
  option: (styles, { isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? '#3b82f6' : 'white',
    color: isSelected ? 'white' : 'black',
    '&:hover': {
      backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6',
    },
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: '#3b82f6',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: '#3b82f6',
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      color: 'white',
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: 'white',
  }),
  placeholder: (styles) => ({
    ...styles,
    color: 'rgba(255, 255, 255, 0.5)',
  }),
  input: (styles) => ({
    ...styles,
    color: 'white',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'white',
  }),
};

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  // Form Fields
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [priority, setPriority] = useState(priorityOptions[1]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [dueDate, setDueDate] = useState("");

  // Load tasks and users from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Get all registered users for employee list
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const employeeOptions = users.map(user => ({
      value: user.id,
      label: user.name,
      email: user.email,
      role: user.role
    }));

    setEmployees(employeeOptions);
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add or Update Task
  const handleTask = () => {
    if (taskTitle.trim()) {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        assignedTo: assignedTo.map(e => ({
          id: e.value,
          name: e.label,
          email: e.email
        })),
        assignedBy: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        priority: priority.value,
        status: status.value,
        dueDate,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingTask) {
        // Update Task
        setTasks(tasks.map(task =>
          task.id === editingTask ? {
            ...task,
            ...taskData,
            comments: task.comments,
            createdAt: task.createdAt,
            updatedAt: new Date().toISOString()
          } : task
        ));
      } else {
        // Add New Task
        const newTask = {
          id: Date.now().toString(),
          ...taskData
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
    setTaskDescription(task.description || "");

    // Map task assignees to select options
    const assignees = task.assignedTo.map(person => {
      const employee = employees.find(e => e.value === person.id) ||
        { value: person.id, label: person.name };
      return employee;
    });

    setAssignedTo(assignees);
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
    setTaskDescription("");
    setAssignedTo([]);
    setPriority(priorityOptions[1]);
    setStatus(statusOptions[0]);
    setDueDate("");
  };

  // Filter Tasks
  let filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  // If user is employee, only show tasks assigned to them
  if (user.role === "employee") {
    filteredTasks = filteredTasks.filter(task =>
      task.assignedTo.some(person => person.id === user.id)
    );
  }

  // Apply filters
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
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Task Management</h2>
        <p className="text-gray-400 mb-6">Create, assign and manage tasks for your team</p>
      </div>

      {/* Task Form Card */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Assignment className="mr-2" />
          {editingTask ? "Update Task" : "Create New Task"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TextField
            label="Task Title"
            variant="outlined"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
            InputLabelProps={{
              style: { color: 'rgba(255,255,255,0.7)' }
            }}
          />

          <TextField
            type="date"
            label="Due Date"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              style: { color: 'rgba(255,255,255,0.7)' }
            }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputProps={{
              style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
          />
        </div>

        <div className="mb-4">
          <TextField
            label="Task Description"
            variant="outlined"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            InputProps={{
              style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
            InputLabelProps={{
              style: { color: 'rgba(255,255,255,0.7)' }
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Assign To</label>
            <Select
              options={employees}
              isMulti
              placeholder="Select Employees"
              value={assignedTo}
              onChange={setAssignedTo}
              styles={customSelectStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
            <Select
              options={priorityOptions}
              placeholder="Select Priority"
              value={priority}
              onChange={setPriority}
              styles={customSelectStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <Select
              options={statusOptions}
              placeholder="Select Status"
              value={status}
              onChange={setStatus}
              styles={customSelectStyles}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="contained"
            color={editingTask ? "secondary" : "primary"}
            onClick={handleTask}
            className={editingTask ? "bg-purple-600" : "bg-blue-600"}
          >
            {editingTask ? "Update Task" : "Create Task"}
          </Button>

          {editingTask && (
            <Button
              variant="outlined"
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextField
            label="Search Tasks..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
            InputLabelProps={{
              style: { color: 'rgba(255,255,255,0.7)' }
            }}
          />

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Priority Filter</label>
            <Select
              options={priorityOptions}
              placeholder="All Priorities"
              value={priorityFilter}
              onChange={setPriorityFilter}
              isClearable
              styles={customSelectStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status Filter</label>
            <Select
              options={statusOptions}
              placeholder="All Statuses"
              value={statusFilter}
              onChange={setStatusFilter}
              isClearable
              styles={customSelectStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Sort By</label>
            <Select
              options={[
                { value: "priority", label: "Priority (High to Low)" },
                { value: "dueDate", label: "Due Date (Soonest)" },
              ]}
              placeholder="Default Order"
              value={sortBy ? { value: sortBy, label: sortBy === "priority" ? "Priority (High to Low)" : "Due Date (Soonest)" } : null}
              onChange={(option) => setSortBy(option ? option.value : null)}
              isClearable
              styles={customSelectStyles}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Info className="mx-auto mb-2" />
            <p>No tasks found. Create a new task to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="p-4">Task</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="p-4">
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-400 mt-1">{task.description}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {task.assignedTo.map((person, index) => (
                          <Chip
                            key={index}
                            label={person.name}
                            size="small"
                            className="bg-blue-500/20 text-blue-300"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <CalendarToday fontSize="small" className="mr-1 text-gray-400" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Tooltip title="Edit Task">
                          <IconButton onClick={() => editTask(task)} size="small" className="text-blue-400">
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Task">
                          <IconButton onClick={() => deleteTask(task.id)} size="small" className="text-red-400">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
