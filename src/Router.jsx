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

// Layout with Fixed Sidebar & Proper Content Alignment
const MainLayout = () => {
  const { user } = useAuth(); // Get user role

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar role={user?.role} />

      {/* Main Content - Ensuring it starts after the sidebar */}
      <div className="flex-1 p-6 bg-gray-800 text-gray-900 ml-64">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute role="admin"><Employees /></ProtectedRoute>} />

          {/* Employee Routes */}
          <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />

          {/* Shared Tasks Route */}
          <Route path="/tasks" element={<ProtectedRoute role={["admin", "employee"]}><Tasks /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRouter;
