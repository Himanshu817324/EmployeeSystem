import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Button, Avatar, Chip, TextField,
  Paper, IconButton, Tooltip, Divider
} from "@mui/material";
import {
  Add, Edit as EditIcon, Delete as DeleteIcon,
  Save, Cancel, Person, Work, Search, AccountCircle, Email
} from "@mui/icons-material";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", email: "" });
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("");

  // Load employees from localStorage on component mount
  useEffect(() => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      setEmployees(users);
    } catch (error) {
      console.error("Error loading employees:", error);
      setEmployees([]);
    }
  }, []);

  // Create Employee
  const addEmployee = () => {
    if (newEmployee.name && newEmployee.role) {
      const newEmployeeData = {
        id: Date.now().toString(),
        name: newEmployee.name,
        role: newEmployee.role,
        email: newEmployee.email || `${newEmployee.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
        createdAt: new Date().toISOString()
      };

      try {
        // Get current users from localStorage
        const currentUsers = JSON.parse(localStorage.getItem("users") || "[]");

        // Add new employee
        const updatedUsers = [...currentUsers, newEmployeeData];

        // Save back to localStorage
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Update state
        setEmployees(updatedUsers);
        setNewEmployee({ name: "", role: "", email: "" });
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    }
  };

  // Edit Employee
  const editEmployee = (id) => {
    const emp = employees.find((emp) => emp.id === id);
    if (emp) {
      setEditing(id);
      setNewEmployee({
        name: emp.name,
        role: emp.role,
        email: emp.email || ""
      });
    }
  };

  // Update Employee
  const updateEmployee = () => {
    if (!editing) return;

    try {
      // Create updated employee object
      const updatedEmployees = employees.map((emp) =>
        emp.id === editing
          ? {
            ...emp,
            name: newEmployee.name,
            role: newEmployee.role,
            email: newEmployee.email || emp.email,
            updatedAt: new Date().toISOString()
          }
          : emp
      );

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(updatedEmployees));

      // Update state
      setEmployees(updatedEmployees);
      setEditing(null);
      setNewEmployee({ name: "", role: "", email: "" });
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // Delete Employee
  const deleteEmployee = (id) => {
    try {
      // Filter out the employee to delete
      const updatedEmployees = employees.filter((emp) => emp.id !== id);

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(updatedEmployees));

      // Update state
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Get user role color
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return "bg-purple-900/40 text-purple-200 border-purple-500/50";
      case 'team-lead':
        return "bg-blue-900/40 text-blue-200 border-blue-500/50";
      case 'employee':
        return "bg-green-900/40 text-green-200 border-green-500/50";
      default:
        return "bg-gray-900/40 text-gray-200 border-gray-600/50";
    }
  };

  // Filter employees based on search input
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(filter.toLowerCase()) ||
    emp.role.toLowerCase().includes(filter.toLowerCase()) ||
    (emp.email && emp.email.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="p-6 text-gray-100 bg-gray-900">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2 flex items-center text-cyan-100">
          <Person className="mr-2 text-cyan-300" /> Employees Management
        </h2>
        <p className="text-gray-300">
          Add, edit and manage employees in your organization
        </p>
      </motion.div>

      {/* Search & Add Employees Form */}
      <Paper className="p-6 mb-8 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl" elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3">
            <TextField
              fullWidth
              placeholder="Search employees by name, role or email..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: <Search className="text-cyan-400 mr-2" />,
                style: { color: 'white', backgroundColor: 'rgba(15,23,42,0.7)' }
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
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
          </div>
          <div className="md:col-span-1">
            <Button
              fullWidth
              variant="contained"
              className="bg-cyan-700 hover:bg-cyan-600 h-full shadow-lg text-white"
              startIcon={<Add />}
              onClick={() => {
                setEditing(null);
                setNewEmployee({ name: "", role: "", email: "" });
                document.getElementById('employeeForm').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Add Employee
            </Button>
          </div>
        </div>

        {/* Employee Form */}
        <div id="employeeForm" className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-5 rounded-lg border border-gray-700">
          <div className="md:col-span-3 mb-2">
            <h3 className="text-lg font-medium text-gray-100 flex items-center">
              {editing ? <EditIcon className="mr-2 text-cyan-400" /> : <Add className="mr-2 text-cyan-400" />}
              {editing ? "Edit Employee" : "Add New Employee"}
            </h3>
            <Divider className="my-3 bg-gray-700" />
          </div>
          <TextField
            label="Employee Name"
            variant="outlined"
            fullWidth
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            required
            InputProps={{
              startAdornment: <AccountCircle className="text-cyan-400 mr-2" />,
              style: { color: 'white', backgroundColor: 'rgba(15,23,42,0.7)' }
            }}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
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
            label="Role"
            variant="outlined"
            fullWidth
            value={newEmployee.role}
            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
            required
            InputProps={{
              startAdornment: <Work className="text-cyan-400 mr-2" />,
              style: { color: 'white', backgroundColor: 'rgba(15,23,42,0.7)' }
            }}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
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
            label="Email (optional)"
            variant="outlined"
            fullWidth
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            InputProps={{
              startAdornment: <Email className="text-cyan-400 mr-2" />,
              style: { color: 'white', backgroundColor: 'rgba(15,23,42,0.7)' }
            }}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
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
          <div className="md:col-span-3 flex justify-end mt-2">
            {editing ? (
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditing(null);
                    setNewEmployee({ name: "", role: "", email: "" });
                  }}
                  startIcon={<Cancel />}
                  className="border-red-500/30 text-red-300 hover:bg-red-900/20"
                  sx={{
                    borderColor: 'rgba(239,68,68,0.5)',
                    '&:hover': {
                      borderColor: 'rgba(239,68,68,0.8)',
                      backgroundColor: 'rgba(239,68,68,0.08)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={updateEmployee}
                  startIcon={<Save />}
                  disabled={!newEmployee.name || !newEmployee.role}
                  className="bg-cyan-700 hover:bg-cyan-600 shadow-lg text-white"
                  sx={{
                    backgroundColor: '#0e7490',
                    '&:hover': {
                      backgroundColor: '#0891b2'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(14, 116, 144, 0.3)'
                    }
                  }}
                >
                  Update
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                onClick={addEmployee}
                startIcon={<Add />}
                disabled={!newEmployee.name || !newEmployee.role}
                className="bg-cyan-700 hover:bg-cyan-600 shadow-lg text-white"
                sx={{
                  backgroundColor: '#0e7490',
                  '&:hover': {
                    backgroundColor: '#0891b2'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(14, 116, 144, 0.3)'
                  }
                }}
              >
                Add Employee
              </Button>
            )}
          </div>
        </div>
      </Paper>

      {/* Employees List Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-cyan-100">
          {filteredEmployees.length} {filteredEmployees.length === 1 ? 'Employee' : 'Employees'} Found
        </h3>
      </div>

      {/* Employees List with AnimatePresence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredEmployees.length === 0 ? (
            <motion.div
              className="col-span-full text-center p-8 bg-slate-800/30 backdrop-blur-sm border border-gray-700 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Person className="text-cyan-400/50 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl text-cyan-100 mb-2">No employees found</h3>
              <p className="text-gray-400">
                {filter
                  ? "Try adjusting your search criteria"
                  : "Add your first employee using the form above"}
              </p>
            </motion.div>
          ) : (
            filteredEmployees.map((emp) => (
              <motion.div
                key={emp.id}
                className="bg-slate-900/70 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)" }}
              >
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-center mb-4">
                    <Avatar
                      className="mr-4"
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: emp.role?.toLowerCase() === 'admin' ? '#9333ea' :
                          emp.role?.toLowerCase() === 'team-lead' ? '#0284c7' : '#16a34a'
                      }}
                    >
                      {emp.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">{emp.name}</h3>
                      <Chip
                        icon={<Work className="text-xs" />}
                        label={emp.role}
                        className={`text-xs border ${getRoleColor(emp.role)}`}
                        size="small"
                      />
                    </div>
                  </div>

                  {emp.email && (
                    <p className="text-sm text-gray-300 mb-3 flex items-center">
                      <Email className="text-cyan-400 mr-2 text-sm" /> {emp.email}
                    </p>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                    {emp.createdAt && (
                      <p className="text-xs text-gray-400">
                        Added: {new Date(emp.createdAt).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex space-x-1">
                      <Tooltip title="Edit Employee">
                        <IconButton
                          size="small"
                          className="text-cyan-400 hover:bg-cyan-900/30"
                          onClick={() => editEmployee(emp.id)}
                          sx={{
                            color: '#22d3ee',
                            '&:hover': {
                              backgroundColor: 'rgba(8,145,178,0.15)'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Employee">
                        <IconButton
                          size="small"
                          className="text-red-400 hover:bg-red-900/30"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${emp.name}?`)) {
                              deleteEmployee(emp.id);
                            }
                          }}
                          sx={{
                            color: '#f87171',
                            '&:hover': {
                              backgroundColor: 'rgba(239,68,68,0.15)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Employees;