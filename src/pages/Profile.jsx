import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TextField, Button, Avatar, Paper, Box, Typography, Chip } from "@mui/material";
import { Edit, Person, Email, Work, EventNote, Save, Cancel } from "@mui/icons-material";

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || ""); // Email cannot be changed

  // Function to handle profile updates
  const handleUpdateProfile = () => {
    // In a real app, this would make an API call
    // For our demo with localStorage, we would update the user in localStorage

    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find and update the current user
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, name } : u
    );

    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update the current user in localStorage
    const updatedUser = { ...user, name };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Refresh the page to see changes
    window.location.reload();

    setIsEditing(false);
  };

  // Function to get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <Paper className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-lg overflow-hidden">
        {/* Header with background */}
        <Box className="bg-blue-600/20 p-6 flex flex-col md:flex-row items-center justify-between">
          <Box className="flex items-center mb-4 md:mb-0">
            <Avatar
              className="w-20 h-20 bg-blue-500 text-white text-2xl"
              sx={{ width: 80, height: 80, bgcolor: '#3b82f6', fontSize: '2rem' }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Box className="ml-6">
              <Typography variant="h4" className="text-white font-bold">
                {user.name}
              </Typography>
              <Chip
                label={user.role}
                color="primary"
                size="small"
                className="mt-1 capitalize bg-blue-500/30"
                icon={<Work className="text-blue-300" />}
              />
            </Box>
          </Box>

          {!isEditing && (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
              className="border-blue-400 text-blue-400 hover:bg-blue-400/20"
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {/* Profile Info */}
        <Box className="p-6">
          {isEditing ? (
            <Box className="space-y-4">
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: <Person className="mr-2 text-gray-400" />,
                  style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />

              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                value={email}
                disabled
                InputProps={{
                  startAdornment: <Email className="mr-2 text-gray-400" />,
                  style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />

              <Box className="flex space-x-2 pt-4">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleUpdateProfile}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box className="space-y-6">
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <Typography className="text-gray-400 text-sm mb-1">Full Name</Typography>
                  <Box className="flex items-center">
                    <Person className="mr-2 text-blue-400" />
                    <Typography className="text-white">{user.name}</Typography>
                  </Box>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <Typography className="text-gray-400 text-sm mb-1">Email Address</Typography>
                  <Box className="flex items-center">
                    <Email className="mr-2 text-blue-400" />
                    <Typography className="text-white">{user.email}</Typography>
                  </Box>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <Typography className="text-gray-400 text-sm mb-1">Role</Typography>
                  <Box className="flex items-center">
                    <Work className="mr-2 text-blue-400" />
                    <Typography className="text-white capitalize">{user.role}</Typography>
                  </Box>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <Typography className="text-gray-400 text-sm mb-1">Joined</Typography>
                  <Box className="flex items-center">
                    <EventNote className="mr-2 text-blue-400" />
                    <Typography className="text-white">
                      {user.createdAt ? formatDate(user.createdAt) : "Not Available"}
                    </Typography>
                  </Box>
                </div>
              </Box>

              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="mt-6 bg-red-500 hover:bg-red-600"
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default Profile;
