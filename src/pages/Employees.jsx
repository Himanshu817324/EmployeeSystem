import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";

const Employees = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", role: "Software Engineer" },
    { id: 2, name: "Jane Smith", role: "Project Manager" },
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: "", role: "" });
  const [editing, setEditing] = useState(null);

  // Create Employees
  const addEmployee = () => {
    if (newEmployee.name && newEmployee.role) {
      setEmployees([...employees, { id: Date.now(), ...newEmployee }]);
      setNewEmployee({ name: "", role: "" });
    }
  };

  // Edit Employees
  const editEmployee = (id) => {
    const emp = employees.find((emp) => emp.id === id);
    setEditing(id);
    setNewEmployee({ name: emp.name, role: emp.role });
  };

  // Update Employees
  const updateEmployee = () => {
    setEmployees(
      employees.map((emp) =>
        emp.id === editing ? { ...emp, name: newEmployee.name, role: newEmployee.role } : emp
      )
    );
    setEditing(null);
    setNewEmployee({ name: "", role: "" });
  };

  // Delete Employees
  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="p-6 text-white">
      <motion.h2
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Employees Management
      </motion.h2>

      {/* Employees Form */}
      <motion.div
        className="mb-6 flex gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Employee Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          className="p-2 text-black rounded-md"
        />
        <input
          type="text"
          placeholder="Role"
          value={newEmployee.role}
          onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
          className="p-2 text-black rounded-md"
        />
        <motion.div whileTap={{ scale: 0.9 }}>
          {editing ? (
            <Button variant="contained" color="secondary" onClick={updateEmployee}>
              Update
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={addEmployee}>
              Add
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Employees List with AnimatePresence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {employees.map((emp) => (
            <motion.div
              key={emp.id}
              className="p-4 bg-gray-800 rounded-lg shadow-md relative overflow-hidden max-w-[300px] mx-auto"
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 50 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold">{emp.name}</h3>
              <p className="text-sm opacity-75">{emp.role}</p>
              <div className="mt-2 flex gap-2">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button variant="contained" color="warning" onClick={() => editEmployee(emp.id)}>
                    Edit
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button variant="contained" color="error" onClick={() => deleteEmployee(emp.id)}>
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

export default Employees;