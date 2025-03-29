import { Routes, Route, Navigate } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/Profile";
import TeamPage from "./pages/TeamPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import { useState, createContext, useContext } from "react";

// Create sidebar context
const SidebarContext = createContext();

function AppRouter() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

// Handle all routes and layouts
const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      <Routes>
        {/* Auth Routes - accessible when NOT logged in */}
        {!user ? (
          <>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Signup />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Login />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </>
        ) : (
          <>
            {/* Main Layout with Sidebar for authenticated users */}
            <Route path="/*" element={<MainLayout />}>
              {/* Dashboard routes */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Admin Routes */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="employees"
                element={
                  <ProtectedRoute role="admin">
                    <Employees />
                  </ProtectedRoute>
                }
              />

              {/* Common Routes */}
              <Route
                path="tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Team Lead Routes */}
              <Route
                path="team"
                element={
                  <ProtectedRoute role="team-lead">
                    <TeamPage />
                  </ProtectedRoute>
                }
              />

              {/* Employee Routes */}
              <Route
                path="employee"
                element={
                  <ProtectedRoute role="employee">
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </>
        )}
      </Routes>
    </SidebarContext.Provider>
  );
};

// Layout with Fixed Sidebar & Dynamic Content Alignment
const MainLayout = () => {
  const { user } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content - Adjusts margin based on sidebar state */}
      <main className={`p-6 transition-all duration-300 flex-1 ${isSidebarOpen ? 'ml-[220px]' : 'ml-[60px]'}`}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <ProtectedRoute role="admin">
                <Employees />
              </ProtectedRoute>
            }
          />

          {/* Common Routes */}
          <Route
            path="tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Team Lead Routes */}
          <Route
            path="team"
            element={
              <ProtectedRoute role="team-lead">
                <TeamPage />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="employee"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="404" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRouter;