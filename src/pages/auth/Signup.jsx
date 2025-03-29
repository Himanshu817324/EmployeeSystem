import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, Lock, Person, Email } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState("");
  const { register } = useAuth();

  const validateForm = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required!";
    if (!email.includes("@")) newErrors.email = "Invalid email format!";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters!";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match!";
    if (!role) newErrors.role = "Role selection is required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupError("");

    if (validateForm()) {
      try {
        // Create user object with all necessary data
        const userData = {
          name,
          email,
          password, // Will be removed before storing in context
          role,
          createdAt: new Date().toISOString(),
          id: Date.now().toString()
        };

        // Register user (this will also log them in)
        register(userData);

        // Redirect after successful signup
        navigate('', { replace: true });
      } catch (error) {
        setSignupError(error.message);
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
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          {signupError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm text-center">
              {signupError}
            </div>
          )}

          {/* Full Name */}
          <div className="relative">
            <Person className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-3 p-3 rounded-lg bg-white/20 focus:ring-2 focus:ring-blue-500 outline-none peer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className={`absolute left-10 transition-all text-gray-400 ${name ? "-top-3 text-sm" : "top-3"} peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-400`}>
              Full Name
            </label>
          </div>
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          {/* Email */}
          <div className="relative">
            <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className="w-full pl-10 pr-3 p-3 rounded-lg bg-white/20 focus:ring-2 focus:ring-blue-500 outline-none peer"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className={`absolute left-10 transition-all text-gray-400 ${email ? "-top-3 text-sm" : "top-3"} peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-400`}>
              Email
            </label>
          </div>
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 p-3 rounded-lg bg-white/20 focus:ring-2 focus:ring-blue-500 outline-none peer"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className={`absolute left-10 transition-all text-gray-400 ${password ? "-top-3 text-sm" : "top-3"} peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-400`}>
              Password
            </label>
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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 p-3 rounded-lg bg-white/20 focus:ring-2 focus:ring-blue-500 outline-none peer"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label className={`absolute left-10 transition-all text-gray-400 ${confirmPassword ? "-top-3 text-sm" : "top-3"} peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-400`}>
              Confirm Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}

          {/* Role Selection (with floating label) */}
          <div className="relative">
            <label className="absolute left-3 transition-all text-gray-400 -top-3 text-sm peer-focus:text-blue-400">
              Role
            </label>
            <select
              className="w-full p-3 rounded-lg bg-white/20 focus:ring-2 focus:ring-blue-500 outline-none peer appearance-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option className="text-gray-500" value="" hidden>Select Role</option>
              <option className="text-gray-500" value="employee">Employee</option>
              <option className="text-gray-500" value="team-lead">Team Lead</option>
              <option className="text-gray-500" value="admin">Admin</option>
            </select>
          </div>
          {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition">
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400">
          Already have an account? <Link to="login" className="text-blue-400 hover:underline">Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
