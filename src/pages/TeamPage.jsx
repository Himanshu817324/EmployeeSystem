import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Paper, Typography, Avatar, Box, Chip,
  Button, TextField, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  People, Add, Edit, Delete, Send, Mail,
  PhoneAndroid, Assignment, AccessTime
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Select from 'react-select';

const TeamPage = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load team members and tasks from localStorage
  useEffect(() => {
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // For team leads, filter their team members (in a real app this would come from an API)
    // Here we'll just simulate by getting non-admin users
    const teamMembersList = users.filter(u =>
      u.role === 'employee' && u.id !== user.id
    );

    const allUsersList = users.filter(u => u.id !== user.id);

    // Get tasks
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    setTeamMembers(teamMembersList);
    setAllUsers(allUsersList);
    setTasks(allTasks);
  }, [user.id]);

  // Filter members based on search
  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get tasks for a specific team member
  const getTasksForMember = (memberId) => {
    return tasks.filter(task =>
      task.assignedTo.some(person => person.id === memberId)
    );
  };

  // Handle task progress
  const getTaskProgress = (memberId) => {
    const memberTasks = getTasksForMember(memberId);
    if (memberTasks.length === 0) return 0;

    const completed = memberTasks.filter(task => task.status === 'Completed').length;
    return Math.round((completed / memberTasks.length) * 100);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Animation variants
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

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Typography variant="h4" className="font-bold text-white mb-2 flex items-center">
          <People className="mr-2" /> Team Management
        </Typography>
        <Typography variant="body1" className="text-gray-400">
          Manage your team members and track their progress
        </Typography>
      </motion.div>

      {/* Search and Filter Section */}
      <Paper className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <TextField
            label="Search Team Members"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' },
              startAdornment: <People className="mr-2 text-gray-400" />
            }}
            InputLabelProps={{
              style: { color: 'rgba(255,255,255,0.7)' }
            }}
            className="md:max-w-md"
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedMember(null);
              setOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 whitespace-nowrap"
          >
            Add Team Member
          </Button>
        </div>
      </Paper>

      {/* Team Members List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredMembers.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="col-span-full text-center py-10 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700"
          >
            <People className="mx-auto text-4xl text-gray-500 mb-2" />
            <Typography variant="h6" className="text-gray-400">
              No team members found
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Add team members to your team or adjust your search
            </Typography>
          </motion.div>
        ) : (
          <>
            {filteredMembers.map((member) => (
              <motion.div key={member.id} variants={itemVariants}>
                <Paper className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg hover:shadow-lg hover:border-blue-500/30 transition-all">
                  <div className="flex items-start">
                    <Avatar
                      className="bg-blue-500 mr-3"
                      sx={{ width: 50, height: 50, bgcolor: '#3b82f6', fontSize: '1.25rem' }}
                    >
                      {getInitials(member.name)}
                    </Avatar>
                    <div className="flex-1">
                      <Typography variant="h6" className="text-white font-medium">
                        {member.name}
                      </Typography>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <Mail fontSize="small" className="mr-1" />
                        <Typography variant="body2" className="text-gray-400">
                          {member.email}
                        </Typography>
                      </div>
                      <div>
                        <Chip
                          label={member.role}
                          size="small"
                          className="mt-1 capitalize bg-blue-500/20 text-blue-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between mb-1">
                      <Typography variant="body2" className="text-gray-400 flex items-center">
                        <Assignment fontSize="small" className="mr-1" />
                        Tasks Progress
                      </Typography>
                      <Typography variant="body2" className="text-gray-400">
                        {getTaskProgress(member.id)}%
                      </Typography>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${getTaskProgress(member.id)}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 text-sm text-gray-400 flex items-center">
                      <AccessTime fontSize="small" className="mr-1" />
                      {getTasksForMember(member.id).length} assigned tasks
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Tooltip title="Edit Member">
                      <IconButton
                        size="small"
                        className="text-blue-400"
                        onClick={() => {
                          setSelectedMember(member);
                          setOpen(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Member">
                      <IconButton size="small" className="text-red-400">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Message">
                      <IconButton size="small" className="text-green-400">
                        <Send fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Paper>
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Add/Edit Member Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            color: 'white',
            borderRadius: '0.5rem',
            border: '1px solid rgba(75, 85, 99, 0.5)'
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="border-b border-gray-700">
          {selectedMember ? 'Edit Team Member' : 'Add Team Member'}
        </DialogTitle>
        <DialogContent>
          <Box className="mt-4 space-y-4">
            <Select
              options={allUsers.map(user => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
                user
              }))}
              placeholder="Select User"
              className="text-black"
            />
          </Box>
        </DialogContent>
        <DialogActions className="border-t border-gray-700">
          <Button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => setOpen(false)}
          >
            {selectedMember ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TeamPage; 