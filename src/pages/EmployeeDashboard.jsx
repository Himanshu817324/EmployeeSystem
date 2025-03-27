import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Paper, Typography, Avatar, Box, Chip, Divider,
  Button, IconButton, LinearProgress, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {
  CheckCircle, Assignment, AccessTime, Pending,
  Search, Sort, FilterList, PriorityHigh, CalendarMonth,
  Close, Edit, Delete
} from "@mui/icons-material";
import { Canvas } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
import { OrbitControls, Text3D, Center } from "@react-three/drei";

// 3D Task Visualization
const TaskModel = ({ completionRate }) => {
  const props = useSpring({
    rotation: [0, Math.PI * 2, 0],
    from: { rotation: [0, 0, 0] },
    config: { duration: 15000 },
    loop: true
  });

  // Get color based on completion rate
  const getColor = (rate) => {
    if (rate > 75) return "#4ade80"; // green
    if (rate > 50) return "#60a5fa"; // blue
    if (rate > 25) return "#facc15"; // yellow
    return "#ef4444"; // red
  };

  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group rotation={props.rotation.get()}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.5}
            height={0.1}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.01}
            bevelSegments={5}
          >
            {`${completionRate}%`}
            <meshStandardMaterial color={getColor(completionRate)} />
          </Text3D>
        </Center>
      </group>
    </>
  );
};

const EmployeeDashboard = () => {
  const { user: AUTH_USER } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    let allTasks = [];

    try {
      allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

      // Show all tasks to everyone
      setTasks(allTasks);
      setFilteredTasks(allTasks);

      // Calculate statistics
      const total = allTasks.length;
      const completed = allTasks.filter(task => task.status === "Completed").length;
      const inProgress = allTasks.filter(task => task.status === "In Progress").length;
      const pending = allTasks.filter(task => task.status === "Not Started").length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({ total, completed, inProgress, pending, completionRate });
    } catch (error) {
      console.error('Error parsing data:', error);
      localStorage.setItem('tasks', '[]');
      setTasks([]);
      setFilteredTasks([]);
      setStats({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        completionRate: 0
      });
    }
  }, []);  // Remove dependency on user.id to load all tasks regardless of user

  // Filter and sort tasks when dependencies change
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(task => task.status === filterStatus);
    }

    // Apply sorting
    if (sortBy === "deadline") {
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === "priority") {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "status") {
      const statusOrder = { "To Do": 0, "In Progress": 1, "Completed": 2 };
      result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, sortBy, filterStatus]);

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get relative time (e.g., "2 days ago")
  const getRelativeTime = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Handle update task status
  const handleUpdateStatus = () => {
    if (!selectedTask || !newStatus) return;

    try {
      // Get all tasks from localStorage
      const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

      // Create updated task
      const updatedTask = {
        ...selectedTask,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      // Update the task in all tasks
      const updatedAllTasks = allTasks.map(task =>
        task.id === selectedTask.id ? updatedTask : task
      );

      // Save back to localStorage
      localStorage.setItem("tasks", JSON.stringify(updatedAllTasks));

      // Update local state
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);

      // Recalculate statistics
      const total = updatedTasks.length;
      const completed = updatedTasks.filter(task => task.status === "Completed").length;
      const inProgress = updatedTasks.filter(task => task.status === "In Progress").length;
      const pending = updatedTasks.filter(task => task.status === "Not Started").length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({ total, completed, inProgress, pending, completionRate });

      // Close the dialogs
      setUpdateStatusOpen(false);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating task status:", error);
      // Handle the error (show message to user, etc.)
    }
  };

  // Status color mapping
  const statusColors = {
    "Not Started": "text-gray-400 bg-gray-500/20 border-gray-500/30",
    "In Progress": "text-blue-400 bg-blue-500/20 border-blue-500/30",
    "Completed": "text-green-400 bg-green-500/20 border-green-500/30",
  };

  // Status icons
  const statusIcons = {
    "Not Started": <AccessTime className="text-gray-400" />,
    "In Progress": <Pending className="text-blue-400" />,
    "Completed": <CheckCircle className="text-green-400" />,
  };

  // Priority color mapping
  const priorityColors = {
    Urgent: "text-red-400 bg-red-500/20 border-red-500/30",
    High: "text-red-400 bg-red-500/20 border-red-500/30",
    Medium: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
    Low: "text-green-400 bg-green-500/20 border-green-500/30",
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-white mb-2 flex items-center">
          <Assignment className="mr-2" /> My Tasks
        </Typography>
        <Typography variant="body1" className="text-gray-400">
          View and manage tasks assigned to you
        </Typography>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Total Tasks */}
          <Paper className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-gray-400">Total Tasks</Typography>
                <Typography variant="h4" className="font-bold text-white">{stats.total}</Typography>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <Assignment className="text-blue-400 text-2xl" />
              </div>
            </div>
          </Paper>

          {/* Completed Tasks */}
          <Paper className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-gray-400">Completed</Typography>
                <Typography variant="h4" className="font-bold text-white">{stats.completed}</Typography>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <CheckCircle className="text-green-400 text-2xl" />
              </div>
            </div>
          </Paper>

          {/* In Progress Tasks */}
          <Paper className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-gray-400">In Progress</Typography>
                <Typography variant="h4" className="font-bold text-white">{stats.inProgress}</Typography>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <Pending className="text-blue-400 text-2xl" />
              </div>
            </div>
          </Paper>
        </div>

        {/* 3D Task Completion Visualization */}
        <Paper className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
          <Typography variant="subtitle2" className="text-gray-400 mb-2">Task Completion</Typography>
          <div className="h-24">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <TaskModel completionRate={stats.completionRate} />
            </Canvas>
          </div>
        </Paper>
      </div>

      {/* Task Progress */}
      <Paper className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <Typography variant="subtitle1" className="text-white">Task Progress</Typography>
          <Typography variant="body2" className="text-gray-400">{stats.completionRate}% Complete</Typography>
        </div>
        <LinearProgress
          variant="determinate"
          value={stats.completionRate}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.05)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#60a5fa'
            }
          }}
        />
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div>
            <div className="flex justify-between">
              <Typography variant="caption" className="text-gray-400">Not Started</Typography>
              <Typography variant="caption" className="text-gray-400">{stats.pending}</Typography>
            </div>
            <LinearProgress
              variant="determinate"
              value={stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#9ca3af'
                }
              }}
            />
          </div>
          <div>
            <div className="flex justify-between">
              <Typography variant="caption" className="text-gray-400">In Progress</Typography>
              <Typography variant="caption" className="text-gray-400">{stats.inProgress}</Typography>
            </div>
            <LinearProgress
              variant="determinate"
              value={stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#60a5fa'
                }
              }}
            />
          </div>
          <div>
            <div className="flex justify-between">
              <Typography variant="caption" className="text-gray-400">Completed</Typography>
              <Typography variant="caption" className="text-gray-400">{stats.completed}</Typography>
            </div>
            <LinearProgress
              variant="determinate"
              value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4ade80'
                }
              }}
            />
          </div>
        </div>
      </Paper>

      {/* Task Filters */}
      <Paper className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            placeholder="Search tasks..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search className="text-gray-400 mr-2" />,
              style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            className="md:max-w-xs"
            fullWidth
            size="small"
          />

          <Box className="flex gap-2 ml-auto">
            <TextField
              select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <Sort className="text-gray-400 mr-1" />,
                style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
              }}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="deadline">Deadline</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </TextField>

            <TextField
              select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <FilterList className="text-gray-400 mr-1" />,
                style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
              }}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Box>
        </div>
      </Paper>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Paper className="p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-center">
            <Assignment className="text-gray-500 text-4xl mb-2" />
            <Typography variant="h6" className="text-gray-400">No Tasks Found</Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "You don't have any tasks assigned yet"}
            </Typography>
          </Paper>
        ) : (
          filteredTasks.map(task => (
            <Paper
              key={task.id}
              className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-blue-500/30 transition-all"
              onClick={() => {
                setSelectedTask(task);
                setDialogOpen(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    {statusIcons[task.status]}
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white font-medium">
                      {task.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 line-clamp-1 mb-2">
                      {task.description || "No description"}
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        label={task.status}
                        size="small"
                        className={`${statusColors[task.status]} text-xs border`}
                      />
                      <Chip
                        label={task.priority}
                        size="small"
                        icon={<PriorityHigh />}
                        className={`${priorityColors[task.priority]} text-xs border`}
                      />
                      <Chip
                        label={formatDate(task.deadline)}
                        size="small"
                        icon={<CalendarMonth />}
                        className="text-xs border border-gray-600 bg-gray-700/30 text-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-xs">
                  Updated {getRelativeTime(task.updatedAt)}
                </div>
              </div>
            </Paper>
          ))
        )}
      </div>

      {/* Task Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            color: 'white',
            borderRadius: '0.5rem',
            border: '1px solid rgba(75, 85, 99, 0.5)'
          }
        }}
      >
        {selectedTask && (
          <>
            <DialogTitle className="flex justify-between items-center border-b border-gray-700">
              <Typography variant="h6">{selectedTask.title}</Typography>
              <IconButton onClick={() => setDialogOpen(false)} size="small" className="text-gray-400">
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent className="mt-4">
              <div className="mb-6">
                <Typography variant="body1" className="text-white whitespace-pre-line">
                  {selectedTask.description || "No description provided"}
                </Typography>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Typography variant="subtitle2" className="text-gray-400">Status</Typography>
                  <Chip
                    label={selectedTask.status}
                    className={`${statusColors[selectedTask.status]} mt-1`}
                  />
                </div>
                <div>
                  <Typography variant="subtitle2" className="text-gray-400">Priority</Typography>
                  <Chip
                    label={selectedTask.priority}
                    className={`${priorityColors[selectedTask.priority]} mt-1`}
                  />
                </div>
                <div>
                  <Typography variant="subtitle2" className="text-gray-400">Deadline</Typography>
                  <Typography variant="body2" className="text-white mt-1">
                    {formatDate(selectedTask.deadline)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" className="text-gray-400">Created</Typography>
                  <Typography variant="body2" className="text-white mt-1">
                    {formatDate(selectedTask.createdAt)}
                  </Typography>
                </div>
              </div>

              <Divider className="bg-gray-700 mb-6" />

              <div>
                <Typography variant="subtitle2" className="text-gray-400 mb-2">Assigned To</Typography>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.assignedTo?.map(person => (
                    <Chip
                      key={person.id}
                      avatar={<Avatar>{person.name[0]}</Avatar>}
                      label={person.name}
                      className="bg-blue-500/20 text-blue-300"
                    />
                  ))}
                </div>
              </div>
            </DialogContent>
            <DialogActions className="border-t border-gray-700 p-4">
              <Button
                onClick={() => {
                  setNewStatus(selectedTask.status);
                  setUpdateStatusOpen(true);
                }}
                className="border-gray-600 text-blue-400 hover:text-blue-300 hover:border-blue-400/50"
                variant="outlined"
              >
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={updateStatusOpen}
        onClose={() => setUpdateStatusOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            color: 'white',
            borderRadius: '0.5rem',
            border: '1px solid rgba(75, 85, 99, 0.5)'
          }
        }}
      >
        <DialogTitle className="border-b border-gray-700">
          Update Task Status
        </DialogTitle>
        <DialogContent className="pt-4">
          <TextField
            select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            variant="outlined"
            label="Status"
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)'
                }
              }
            }}
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions className="border-t border-gray-700 p-4">
          <Button
            onClick={() => setUpdateStatusOpen(false)}
            className="text-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeDashboard;
