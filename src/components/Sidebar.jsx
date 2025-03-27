import React from "react";
import { NavLink } from "react-router-dom";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Assignment,
  Person,
  Logout,
  SupervisorAccount,
  Group,
  ExitToApp,
  AdminPanelSettings,
  Close
} from "@mui/icons-material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  // Define menu items based on role
  const getMenuItems = () => {
    // Common items for all users
    const items = [
      { path: "/", label: "Dashboard", icon: <Dashboard />, roles: ["admin", "employee", "team-lead"] },
      { path: "/profile", label: "My Profile", icon: <Person />, roles: ["admin", "employee", "team-lead"] },
      { path: "/tasks", label: "Tasks", icon: <Assignment />, roles: ["admin", "employee", "team-lead"] },
    ];

    // Admin-specific items
    if (user?.role === "admin") {
      items.push(
        { path: "/admin", label: "Admin Panel", icon: <SupervisorAccount />, roles: ["admin"] },
        { path: "/employees", label: "Employees", icon: <People />, roles: ["admin"] }
      );
    }

    // Team lead specific items
    if (user?.role === "team-lead") {
      items.push(
        { path: "/team", label: "My Team", icon: <People />, roles: ["team-lead"] }
      );
    }

    return items;
  };

  const handleLogout = () => {
    logout();
  };

  // Filter menu items based on user role
  const menuItems = getMenuItems().filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <motion.div
      className="bg-gray-900 text-white h-screen fixed top-0 left-0 z-50 flex flex-col transition-all shadow-lg border-r border-gray-800 overflow-hidden"
      animate={{ width: isOpen ? 220 : 60 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        {isOpen && <span className="font-bold text-blue-400">EMS</span>}
        <motion.button
          className={`hover:bg-gray-800 rounded-full flex items-center justify-center ${isOpen ? 'p-1' : 'p-1'}`}
          onClick={toggleSidebar}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ?
            <Close className="text-xl" /> :
            <MenuIcon className="text-xs text-blue-400" />
          }
        </motion.button>
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="px-3 py-4 border-b border-gray-800">
          <div className="text-sm font-semibold text-gray-200">{user?.name}</div>
          <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
        </div>
      )}

      {/* Sidebar Menu */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="mt-2 space-y-1 p-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-all 
                  ${isActive ? "bg-blue-600/20 text-blue-400" : "hover:bg-gray-800"}`
                }
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <motion.span
                    className="ml-3 text-sm"
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-800 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center p-2 w-full text-left rounded-md hover:bg-gray-800 transition-all text-gray-400 hover:text-white"
        >
          <Logout />
          {isOpen && (
            <motion.span
              className="ml-3 text-sm"
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;