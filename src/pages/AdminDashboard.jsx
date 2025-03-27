import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Paper, Typography, Avatar, Box, Chip, Tabs, Tab,
  Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Tooltip
} from '@mui/material';
import {
  SupervisorAccount, People, Assignment, BarChart, Settings,
  PersonAdd, Edit, Delete, Search, FilterList, Close,
  Mail, Key, AccountCircle
} from '@mui/icons-material';
import { Canvas } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import { OrbitControls, Text3D, Center } from '@react-three/drei';

// 3D Company Logo component
const CompanyLogo = () => {
  const props = useSpring({
    rotation: [0, Math.PI * 2, 0],
    from: { rotation: [0, 0, 0] },
    config: { duration: 10000 },
    loop: true
  });

  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group rotation={props.rotation.get()}>
        <Center>
          <Text3D
            font={"./fonts/helvetiker_regular.typeface.json"}
            size={0.75}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelSegments={5}
          >
            {`EMS`}
            <meshStandardMaterial color="#22d3ee" />
          </Text3D>
        </Center>
      </group>
    </>
  );
};

// Tab Panel component
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const AdminDashboard = () => {
  const { user: AUTH_USER } = useAuth(); // Renamed with allowed pattern
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [TASKS_LIST, setTasks] = useState([]); // Renamed with allowed pattern
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'employee',
    password: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  // Load users and tasks from localStorage
  useEffect(() => {
    // Get all users and tasks
    let allUsers = [];
    let allTasks = [];

    try {
      allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    } catch (error) {
      console.error('Error parsing data:', error);
      // Reset to empty arrays if parsing fails
      localStorage.setItem('users', '[]');
      localStorage.setItem('tasks', '[]');
    }

    setUsers(allUsers);
    setTasks(allTasks);

    // Calculate statistics
    const totalUsers = allUsers.length;
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = totalTasks - completedTasks;

    setStats({
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks
    });
  }, []);

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle dialog open/close
  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '' // Don't prefill password for security reasons
      });
    } else {
      setEditUser(null);
      setUserForm({
        name: '',
        email: '',
        role: 'employee',
        password: ''
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };

  // Handle user create/update
  const handleSaveUser = () => {
    if (editUser) {
      // Update existing user
      const updatedUsers = users.map(u =>
        u.id === editUser.id ? { ...u, ...userForm, password: userForm.password || u.password } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } else {
      // Create new user
      const newUser = {
        ...userForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    setOpen(false);
  };

  // Handle user delete
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <div className="container mx-auto bg-slate-900 text-gray-100">
      <div
        className="mb-6"
      >
        <Typography variant="h4" className="font-bold text-cyan-100 mb-2 flex items-center">
          <SupervisorAccount className="mr-2 text-cyan-300" /> Admin Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-300">
          Manage your organization, users, and system settings
        </Typography>
      </div>

      {/* Stats Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      >
        {/* Total Users Card */}
        <div>
          <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-cyan-500/30 transition-all" elevation={0}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-gray-400">Total Users</Typography>
                <Typography variant="h4" className="font-bold text-gray-100">{stats.totalUsers}</Typography>
              </div>
              <div className="p-3 rounded-full bg-cyan-500/20">
                <People className="text-cyan-400 text-3xl" />
              </div>
            </div>
          </Paper>
        </div>

        {/* Total Tasks Card */}
        <div>
          <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-purple-500/30 transition-all" elevation={0}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-gray-400">Total Tasks</Typography>
                <Typography variant="h4" className="font-bold text-gray-100">{stats.totalTasks}</Typography>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <Assignment className="text-purple-400 text-3xl" />
              </div>
            </div>
          </Paper>
        </div>

        {/* Completed Tasks Card */}
        <div>
          <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-green-500/30 transition-all" elevation={0}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-gray-400">Completed Tasks</Typography>
                <Typography variant="h4" className="font-bold text-gray-100">{stats.completedTasks}</Typography>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <BarChart className="text-green-400 text-3xl" />
              </div>
            </div>
          </Paper>
        </div>

        {/* Pending Tasks Card */}
        <div>
          <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-amber-500/30 transition-all" elevation={0}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subtitle2" className="text-gray-400">Pending Tasks</Typography>
                <Typography variant="h4" className="font-bold text-gray-100">{stats.pendingTasks}</Typography>
              </div>
              <div className="p-3 rounded-full bg-amber-500/20">
                <Assignment className="text-amber-400 text-3xl" />
              </div>
            </div>
          </Paper>
        </div>
      </div>

      {/* Admin Tabs & 3D Logo */}
      <div
        className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6"
      >
        {/* 3D Company Logo */}
        <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-gray-700 rounded-lg lg:col-span-1 flex items-center justify-center" elevation={0}>
          <div className="h-48 w-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <CompanyLogo />
            </Canvas>
          </div>
        </Paper>

        {/* Admin Actions */}
        <Paper className="p-6 bg-slate-900/70 backdrop-blur-sm border border-gray-700 rounded-lg lg:col-span-3" elevation={0}>
          <Typography variant="h6" className="font-semibold text-cyan-100 mb-6">
            Quick Actions
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outlined"
              className="flex flex-col items-center p-4 h-24 border-gray-700 hover:border-cyan-400 hover:bg-cyan-900/10 text-gray-200"
              onClick={() => handleOpenDialog()}
            >
              <PersonAdd className="text-cyan-400 text-3xl mb-2" />
              <Typography variant="body2">Add User</Typography>
            </Button>

            <Button
              variant="outlined"
              className="flex flex-col items-center p-4 h-24 border-gray-700 hover:border-green-400 hover:bg-green-900/10 text-gray-200"
              onClick={() => setValue(1)}
            >
              <Assignment className="text-green-400 text-3xl mb-2" />
              <Typography variant="body2">Manage Tasks</Typography>
            </Button>

            <Button
              variant="outlined"
              className="flex flex-col items-center p-4 h-24 border-gray-700 hover:border-purple-400 hover:bg-purple-900/10 text-gray-200"
              onClick={() => setValue(0)}
            >
              <People className="text-purple-400 text-3xl mb-2" />
              <Typography variant="body2">Manage Users</Typography>
            </Button>

            <Button
              variant="outlined"
              className="flex flex-col items-center p-4 h-24 border-gray-700 hover:border-amber-400 hover:bg-amber-900/10 text-gray-200"
            >
              <Settings className="text-amber-400 text-3xl mb-2" />
              <Typography variant="body2">Settings</Typography>
            </Button>
          </div>
        </Paper>
      </div>

      {/* Tab Interface */}
      <Paper className="bg-slate-900/70 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden" elevation={0}>
        <Box className="border-b border-gray-700">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="inherit"
            variant="fullWidth"
            className="text-cyan-100"
          >
            <Tab label="User Management" icon={<People />} iconPosition="start" />
            <Tab label="Task Management" icon={<Assignment />} iconPosition="start" />
            <Tab label="System Settings" icon={<Settings />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* User Management Tab */}
        <TabPanel value={value} index={0}>
          <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <TextField
                placeholder="Search users..."
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search className="text-cyan-400 mr-2" />,
                  style: { color: 'white', backgroundColor: 'rgba(15,23,42,0.7)' }
                }}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                className="md:max-w-md"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(100,116,139,0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(6,182,212,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(6,182,212,0.8)',
                    },
                  },
                }}
              />

              <FormControl
                variant="outlined"
                className="min-w-[150px]"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    backgroundColor: 'rgba(15,23,42,0.7)',
                    '& fieldset': {
                      borderColor: 'rgba(100,116,139,0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(6,182,212,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(6,182,212,0.8)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)'
                  },
                  '& .MuiPaper-root': {
                    backgroundColor: '#1e293b'
                  },
                  '& .MuiMenu-list': {
                    backgroundColor: '#1e293b'
                  }
                }}
              >
                <InputLabel id="role-filter-label">Role</InputLabel>
                <Select
                  labelId="role-filter-label"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role"
                  startAdornment={<FilterList className="text-cyan-400 mr-2" />}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#1e293b',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(75, 85, 99, 0.5)',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(14, 165, 233, 0.1)'
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(14, 165, 233, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(14, 165, 233, 0.3)'
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="team-lead">Team Lead</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => handleOpenDialog()}
              className="bg-cyan-600 hover:bg-cyan-700 whitespace-nowrap"
              sx={{
                backgroundColor: '#0891b2',
                '&:hover': {
                  backgroundColor: '#0e7490'
                }
              }}
            >
              Add User
            </Button>
          </div>

          <TableContainer sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-800/50">
                  <TableCell className="text-cyan-100 font-semibold">Name</TableCell>
                  <TableCell className="text-cyan-100 font-semibold">Email</TableCell>
                  <TableCell className="text-cyan-100 font-semibold">Role</TableCell>
                  <TableCell className="text-cyan-100 font-semibold">Created</TableCell>
                  <TableCell className="text-cyan-100 font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-800/40">
                      <TableCell className="text-gray-100">
                        <div className="flex items-center">
                          <Avatar
                            className="mr-2"
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: user.role?.toLowerCase() === 'admin' ? '#9333ea' :
                                user.role?.toLowerCase() === 'team-lead' ? '#0284c7' : '#16a34a'
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-100">{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          className={`capitalize ${user.role === 'admin'
                            ? 'bg-purple-900/40 text-purple-200 border border-purple-500/50'
                            : user.role === 'team-lead'
                              ? 'bg-blue-900/40 text-blue-200 border border-blue-500/50'
                              : 'bg-green-900/40 text-green-200 border border-green-500/50'
                            }`}
                          size="small"
                        />
                      </TableCell>
                      <TableCell className="text-gray-100">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Tooltip title="Edit User">
                            <IconButton
                              size="small"
                              className="text-cyan-400"
                              onClick={() => handleOpenDialog(user)}
                              sx={{
                                color: '#22d3ee',
                                '&:hover': {
                                  backgroundColor: 'rgba(8,145,178,0.15)'
                                }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              className="text-red-400"
                              onClick={() => handleDeleteUser(user.id)}
                              sx={{
                                color: '#f87171',
                                '&:hover': {
                                  backgroundColor: 'rgba(239,68,68,0.15)'
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Email">
                            <IconButton
                              size="small"
                              className="text-green-400"
                              sx={{
                                color: '#4ade80',
                                '&:hover': {
                                  backgroundColor: 'rgba(74,222,128,0.15)'
                                }
                              }}
                            >
                              <Mail fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="text-gray-300"
            sx={{
              '.MuiTablePagination-select': {
                color: 'white',
                backgroundColor: 'rgba(15,23,42,0.7)'
              },
              '.MuiTablePagination-selectIcon': {
                color: 'white'
              },
              '.MuiTablePagination-menuItem': {
                backgroundColor: '#1e293b',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(14, 165, 233, 0.1)'
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(14, 165, 233, 0.2)'
                }
              }
            }}
          />
        </TabPanel>

        {/* Task Management Tab */}
        <TabPanel value={value} index={1}>
          <div className="p-4 text-center">
            <Typography variant="h6" className="text-cyan-100">
              Task Management
            </Typography>
            <Typography variant="body2" className="text-gray-400 mt-2">
              Task management features are available on the Tasks page.
            </Typography>
            <Button
              variant="contained"
              className="mt-4 bg-cyan-600 hover:bg-cyan-700"
              href="/tasks"
              sx={{
                backgroundColor: '#0891b2',
                '&:hover': {
                  backgroundColor: '#0e7490'
                }
              }}
            >
              Go to Tasks
            </Button>
          </div>
        </TabPanel>

        {/* System Settings Tab */}
        <TabPanel value={value} index={2}>
          <div className="p-4 text-center">
            <Typography variant="h6" className="text-cyan-100">
              System Settings
            </Typography>
            <Typography variant="body2" className="text-gray-400 mt-2">
              System settings and configurations will be available soon.
            </Typography>
          </div>
        </TabPanel>
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#0f172a',
            color: 'white',
            borderRadius: '0.5rem',
            border: '1px solid rgba(75, 85, 99, 0.5)'
          }
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(15, 23, 42, 0.8)'
          }
        }}
      >
        <DialogTitle className="border-b border-gray-700 flex justify-between items-center">
          {editUser ? 'Edit User' : 'Add New User'}
          <IconButton onClick={handleCloseDialog} size="small" className="text-gray-400">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="mt-4 space-y-4">
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              name="name"
              value={userForm.name}
              onChange={handleFormChange}
              required
              InputProps={{
                startAdornment: <AccountCircle className="text-cyan-400 mr-2" />,
                style: { color: 'white', backgroundColor: 'rgba(15,23,42,0.7)' }
              }}
              InputLabelProps={{
                style: { color: 'rgba(255,255,255,0.7)' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(100,116,139,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(6,182,212,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(6,182,212,0.8)',
                  },
                },
              }}
            />

            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              name="email"
              type="email"
              value={userForm.email}
              onChange={handleFormChange}
              required
              InputProps={{
                startAdornment: <Mail className="text-cyan-400 mr-2" />,
                style: { color: 'white', backgroundColor: 'rgba(15,23,42,0.7)' }
              }}
              InputLabelProps={{
                style: { color: 'rgba(255,255,255,0.7)' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(100,116,139,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(6,182,212,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(6,182,212,0.8)',
                  },
                },
              }}
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              name="password"
              type="password"
              value={userForm.password}
              onChange={handleFormChange}
              required={!editUser}
              placeholder={editUser ? "Leave blank to keep current password" : ""}
              InputProps={{
                startAdornment: <Key className="text-cyan-400 mr-2" />,
                style: { color: 'white', backgroundColor: 'rgba(15,23,42,0.7)' }
              }}
              InputLabelProps={{
                style: { color: 'rgba(255,255,255,0.7)' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(100,116,139,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(6,182,212,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(6,182,212,0.8)',
                  },
                },
              }}
            />

            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  backgroundColor: 'rgba(15,23,42,0.7)',
                  '& fieldset': {
                    borderColor: 'rgba(100,116,139,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(6,182,212,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(6,182,212,0.8)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)'
                }
              }}
            >
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={userForm.role}
                onChange={handleFormChange}
                label="Role"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#1e293b',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(75, 85, 99, 0.5)',
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(14, 165, 233, 0.1)'
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(14, 165, 233, 0.2)',
                          '&:hover': {
                            backgroundColor: 'rgba(14, 165, 233, 0.3)'
                          }
                        }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="team-lead">Team Lead</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className="border-t border-gray-700 p-4">
          <Button
            onClick={handleCloseDialog}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            className="bg-cyan-600 hover:bg-cyan-700"
            disabled={!userForm.name || !userForm.email || (!editUser && !userForm.password)}
            sx={{
              backgroundColor: '#0891b2',
              '&:hover': {
                backgroundColor: '#0e7490'
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(14, 116, 144, 0.3)'
              }
            }}
          >
            {editUser ? 'Update User' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
