import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <motion.div
        className="glassmorphism p-8 rounded-lg shadow-lg w-96"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" className="text-center text-white mb-4">
          Forgot Password?
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link to="login" className="text-blue-400 hover:text-blue-300">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
