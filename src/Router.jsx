import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import "./App.css";

function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

// Layout with Fixed Sidebar & Dynamic Content Alignment
const MainLayout = () => {
  const { user } = useAuth(); // Get user role
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

  return (
    <div className="flex min-h-screen bg-gray-800">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content - Adjust margin dynamically */}
      <div
        className={`p-6 transition-all duration-300 flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"
          }`}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute role="admin"><Employees /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute role="admin"><Tasks /></ProtectedRoute>} />

          {/* Employee Routes */}
          <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute role="employee"><Tasks /></ProtectedRoute>} />
        </Routes>

      </div>
    </div>
  );
};


export default AppRouter;
