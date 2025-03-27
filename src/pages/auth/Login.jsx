import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Paper, InputAdornment, IconButton } from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Find user in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Store user in auth context
        login(email, password);
        window.location.href = "/";
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Failed to log in. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Paper className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl">
        <div className="text-center mb-6">
          <Typography variant="h5" className="text-white font-bold">
            EMS Portal
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            Employee Management System
          </Typography>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-center mb-4">SignIn</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputLabelProps={{
                  shrink: email.length > 0 || false,
                  sx: { marginLeft: '30px' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' },
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    transform: email.length > 0 ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 16px) scale(1)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                  },
                }}
              />
            </div>

            <div>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputLabelProps={{
                  shrink: password.length > 0 || false,
                  sx: { marginLeft: '30px' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' },
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    transform: password.length > 0 ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 16px) scale(1)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                  },
                }}
              />
            </div>

            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition" disabled={loading}>
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Register
            </Link>
          </div>

          <div className="mt-2 text-center">
            <Link to="/forgot-password" className="text-gray-400 hover:text-gray-300 text-sm">
              Forgot Password?
            </Link>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Login; 