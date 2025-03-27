import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Assignment, Done, Pending, AccessTime, Person,
  Schedule, CalendarMonth, WorkOutline
} from '@mui/icons-material';
import { Paper, Typography, LinearProgress, Box, Chip, Avatar } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

// 3D Task Sphere component
const TaskSphere = ({ stats }) => {
  const meshRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  // Calculate color based on completion rate
  const getColorFromCompletion = (rate) => {
    if (rate > 75) return new THREE.Color(0x4ade80); // green
    if (rate > 50) return new THREE.Color(0x60a5fa); // blue
    if (rate > 25) return new THREE.Color(0xfacc15); // yellow
    return new THREE.Color(0xef4444); // red
  };

  return (
    <mesh ref={meshRef} scale={viewport.width / 8}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={getColorFromCompletion(stats.completionRate)}
        metalness={0.5}
        roughness={0.2}
        emissive={getColorFromCompletion(stats.completionRate)}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Floating particles in the background
const Particles = ({ count = 100 }) => {
  const mesh = useRef();
  const { viewport } = useThree();

  // Generate random particles
  const particles = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * viewport.width * 3;
    const y = (Math.random() - 0.5) * viewport.height * 3;
    const z = (Math.random() - 5) * 3;
    const size = Math.random() * 0.03 + 0.01;
    particles.push({ position: [x, y, z], size });
  }

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      mesh.current.rotation.z = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => p.position))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#22d3ee"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// 3D Scene with lights and environment
const Scene = ({ stats }) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <TaskSphere stats={stats} />
      <Particles />
    </>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Get all users for employees count
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setEmployees(users.filter(u => u.id !== user.id));

    // Show all tasks to everyone
    setTasks(savedTasks);

    // Calculate statistics
    const total = savedTasks.length;
    const completed = savedTasks.filter(task => task.status === 'Completed').length;
    const inProgress = savedTasks.filter(task => task.status === 'In Progress').length;
    const pending = savedTasks.filter(task => task.status === 'Not Started').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({ total, completed, inProgress, pending, completionRate });
  }, [user.id]);

  // Get recent tasks (last 5)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  // Format date to relative time (e.g. "2 days ago")
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Status color mapping
  const statusColors = {
    "Not Started": "bg-slate-700/30 text-slate-300 border-slate-600/30",
    "In Progress": "bg-cyan-800/30 text-cyan-300 border-cyan-700/30",
    "Completed": "bg-green-800/30 text-green-300 border-green-700/30"
  };

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Get today's day name and date
  const getTodayInfo = () => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    return { dayName, dateStr };
  };

  const { dayName, dateStr } = getTodayInfo();

  return (
    <div className="container mx-auto">
      {/* Welcome Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" className="font-bold text-slate-100 mb-2">
          Welcome, {user.name}!
        </Typography>
        <div className="flex items-center text-slate-400">
          <Schedule className="mr-2" />
          <Typography>
            {dayName}, {dateStr}
          </Typography>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Tasks Card */}
        <motion.div variants={itemVariants}>
          <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-lg hover:border-cyan-500/30 transition-all shadow-lg" elevation={0}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-slate-400">Total Tasks</Typography>
                <Typography variant="h4" className="font-bold text-slate-100">{stats.total}</Typography>
              </div>
              <div className="p-3 rounded-full bg-cyan-800/30">
                <Assignment className="text-cyan-300 text-3xl" />
              </div>
            </div>
          </Paper>
        </motion.div>

        {/* Completed Tasks Card */}
        <motion.div variants={itemVariants}>
          <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-lg hover:border-green-500/30 transition-all shadow-lg" elevation={0}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-slate-400">Completed</Typography>
                <Typography variant="h4" className="font-bold text-slate-100">{stats.completed}</Typography>
              </div>
              <div className="p-3 rounded-full bg-green-800/30">
                <Done className="text-green-300 text-3xl" />
              </div>
            </div>
          </Paper>
        </motion.div>

        {/* In Progress Tasks Card */}
        <motion.div variants={itemVariants}>
          <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-lg hover:border-cyan-500/30 transition-all shadow-lg" elevation={0}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-slate-400">In Progress</Typography>
                <Typography variant="h4" className="font-bold text-slate-100">{stats.inProgress}</Typography>
              </div>
              <div className="p-3 rounded-full bg-cyan-800/30">
                <AccessTime className="text-cyan-300 text-3xl" />
              </div>
            </div>
          </Paper>
        </motion.div>

        {/* Pending Tasks Card */}
        <motion.div variants={itemVariants}>
          <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-lg hover:border-amber-500/30 transition-all shadow-lg" elevation={0}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-slate-400">Pending</Typography>
                <Typography variant="h4" className="font-bold text-slate-100">{stats.pending}</Typography>
              </div>
              <div className="p-3 rounded-full bg-amber-800/30">
                <Pending className="text-amber-300 text-3xl" />
              </div>
            </div>
          </Paper>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Completion Progress with 3D visualization */}
        <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-lg lg:col-span-1" elevation={0}>
          <Typography variant="h6" className="font-semibold text-slate-100 mb-4">
            Task Completion
          </Typography>

          <div className="h-52 w-full mb-4">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Scene stats={stats} />
            </Canvas>
          </div>

          <div className="text-center my-4">
            <Typography variant="h4" className="font-bold text-slate-100">{stats.completionRate}%</Typography>
            <Typography variant="body2" className="text-slate-400">Task Completion Rate</Typography>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <Typography variant="body2" className="text-slate-400 flex items-center">
                  <Done fontSize="small" className="mr-1 text-green-300" />
                  Completed
                </Typography>
                <Typography variant="body2" className="text-slate-400">{stats.completed}/{stats.total}</Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={stats.completionRate}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: 'rgba(15,23,42,0.7)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4ade80'
                  }
                }}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <Typography variant="body2" className="text-slate-400 flex items-center">
                  <Pending fontSize="small" className="mr-1 text-amber-300" />
                  In Progress
                </Typography>
                <Typography variant="body2" className="text-slate-400">
                  {stats.inProgress}/{stats.total}
                </Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: 'rgba(15,23,42,0.7)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#facc15'
                  }
                }}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <Typography variant="body2" className="text-slate-400 flex items-center">
                  <AccessTime fontSize="small" className="mr-1 text-red-300" />
                  To Do
                </Typography>
                <Typography variant="body2" className="text-slate-400">
                  {stats.pending}/{stats.total}
                </Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: 'rgba(15,23,42,0.7)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ef4444'
                  }
                }}
              />
            </div>
          </div>
        </Paper>

        {/* Recent Activity */}
        <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-lg lg:col-span-2" elevation={0}>
          <Typography variant="h6" className="font-semibold text-slate-100 mb-4 flex items-center">
            <CalendarMonth className="mr-2 text-cyan-400" />
            Recent Activity
          </Typography>

          {recentTasks.length === 0 ? (
            <motion.div
              className="text-center py-8 text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Assignment className="mx-auto mb-2 text-4xl opacity-30" />
              <Typography>No tasks found. Create a new task to get started!</Typography>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {recentTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  className="border-b border-slate-700/50 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="subtitle1" className="font-medium text-slate-200">
                        {task.title}
                      </Typography>
                      <Typography variant="body2" className="text-slate-400 mb-2 line-clamp-1">
                        {task.description}
                      </Typography>
                    </div>
                    <Chip
                      label={task.status}
                      size="small"
                      className={`text-xs ${statusColors[task.status]} border`}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex -space-x-2">
                      {task.assignedTo.slice(0, 3).map((person, index) => (
                        <Avatar
                          key={index}
                          sx={{ width: 24, height: 24 }}
                          className="border border-slate-800"
                        >
                          {person.name.charAt(0).toUpperCase()}
                        </Avatar>
                      ))}
                      {task.assignedTo.length > 3 && (
                        <Avatar sx={{ width: 24, height: 24 }} className="bg-slate-700 text-xs border border-slate-800">
                          +{task.assignedTo.length - 3}
                        </Avatar>
                      )}
                    </div>
                    <Typography variant="caption" className="text-slate-400">
                      {getRelativeTime(task.updatedAt)}
                    </Typography>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Paper>
      </div>

      {/* Team Stats Section - Only visible for admins and team leads */}
      {(user.role === 'admin' || user.role === 'team-lead') && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Paper className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
            <Typography variant="h6" className="font-semibold text-white mb-4 flex items-center">
              <WorkOutline className="mr-2 text-purple-400" />
              Team Overview
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <Typography className="text-gray-400 text-sm">Team Members</Typography>
                <Typography className="text-white text-2xl font-bold">{employees.length}</Typography>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg">
                <Typography className="text-gray-400 text-sm">Avg Task Completion</Typography>
                <Typography className="text-white text-2xl font-bold">{stats.completionRate}%</Typography>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg">
                <Typography className="text-gray-400 text-sm">Active Projects</Typography>
                <Typography className="text-white text-2xl font-bold">{
                  [...new Set(tasks.map(task => task.project || 'Default'))].length
                }</Typography>
              </div>
            </div>
          </Paper>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
