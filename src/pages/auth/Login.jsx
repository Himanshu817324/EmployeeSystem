import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff, Lock, Email } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const validateForm = () => {
    let newErrors = {};
    if (!email.includes("@")) newErrors.email = "Invalid email format!";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    if (validateForm()) {
      // Get stored users
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Find user with matching email and password
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        // Remove password before storing in context
        const { password: _, ...userWithoutPassword } = user;

        // Log user in
        login(userWithoutPassword);

        // Determine where to redirect
        const redirectPath = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/employee");
        navigate(redirectPath, { replace: true });
      } else {
        setLoginError("Invalid email or password");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <motion.div
        className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-white/20 w-96 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm text-center">
              {loginError}
            </div>
          )}

          {/* Email Input */}
          <div className="relative">
            <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className="w-full pl-10 pr-3 p-3 rounded-lg bg-white/20 focus:ring-2 focus:ring-blue-500 outline-none peer"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 p-3 rounded-lg bg-white/20 focus:ring-2 focus:ring-blue-500 outline-none peer"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-blue-400 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition">
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login; 