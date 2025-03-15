import React from "react";
import { NavLink } from "react-router-dom";
import { Menu as MenuIcon, Dashboard, People, Assignment } from "@mui/icons-material";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: "/", label: "Dashboard", icon: <Dashboard /> },
    { path: "/admin", label: "Admin Dashboard", icon: <Dashboard /> },
    { path: "/employees", label: "Employees", icon: <People /> },
    { path: "/tasks", label: "Tasks", icon: <Assignment /> },
  ];

  return (
    <motion.div
      className="bg-gray-900 text-white h-screen fixed top-0 left-0 z-50 flex flex-col transition-all"
      animate={{ width: isOpen ? 220 : 60 }}
      transition={{ duration: 0.2, ease: "easeInOut" }} // Faster transition
    >
      {/* Toggle Button */}
      <motion.button
        className="p-3"
        onClick={toggleSidebar}
        whileTap={{ scale: 0.9 }}
      >
        <MenuIcon />
      </motion.button>

      {/* Sidebar Menu */}
      <ul className="mt-4 space-y-2 p-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md transition-all 
              ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
          >
            {item.icon}
            <motion.span
              className={`ml-2 ${!isOpen && "hidden"}`} // Hide text when collapsed
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
          </NavLink>
        ))}
      </ul>
    </motion.div>
  );
};

export default Sidebar;
