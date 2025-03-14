import React, { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Menu as MenuIcon } from "@mui/icons-material";

const Sidebar = () => {
  const { userRole } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: "/", label: "Dashboard" },
    ...(userRole === "admin"
      ? [
        { path: "/admin", label: "Admin Dashboard" },
        { path: "/employees", label: "Employees" },
        { path: "/tasks", label: "Tasks" },
      ]
      : [
        { path: "/employee", label: "Employee Dashboard" },
        { path: "/tasks", label: "My Tasks" },
      ]),
  ];

  return (
    <motion.div
      className="bg-gray-900 text-white h-screen fixed top-0 left-0 z-50 transition-all"
      animate={{ width: isOpen ? 220 : 60 }}
    >
      {/* Toggle Button */}
      <motion.button
        className="p-3"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
      >
        <MenuIcon />
      </motion.button>

      {/* Sidebar Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="mt-4 space-y-4 p-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {menuItems.map((item) => (
              <motion.li
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={item.path} className="hover:text-gray-400 block p-2">
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;
