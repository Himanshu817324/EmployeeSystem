import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaUsers, FaTasks, FaChartPie } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const totalEmployees = 25;
  const totalTasks = 42;
  const completedTasks = 30;
  const pendingTasks = totalTasks - completedTasks;

  // Pie Chart Data
  const data = [
    { name: "Completed", value: completedTasks, color: "#4CAF50" },
    { name: "Pending", value: pendingTasks, color: "#FF9800" },
  ];

  return (
    <div className="p-6 text-white">
      {/* Page Title */}
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Employees */}
        <motion.div
          className="p-6 bg-gray-800 rounded-lg flex items-center gap-4 shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaUsers size={40} className="text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold">Total Employees</h3>
            <p className="text-2xl font-bold">{totalEmployees}</p>
          </div>
        </motion.div>

        {/* Total Tasks */}
        <motion.div
          className="p-6 bg-gray-800 rounded-lg flex items-center gap-4 shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FaTasks size={40} className="text-yellow-400" />
          <div>
            <h3 className="text-lg font-semibold">Total Tasks</h3>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </div>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          className="p-6 bg-gray-800 rounded-lg flex items-center gap-4 shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FaChartPie size={40} className="text-green-400" />
          <div>
            <h3 className="text-lg font-semibold">Completed Tasks</h3>
            <p className="text-2xl font-bold">{completedTasks}</p>
          </div>
        </motion.div>
      </div>

      {/* Pie Chart Section */}
      <motion.div
        className="bg-gray-800 p-6 mt-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4">Task Completion Status</h3>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
