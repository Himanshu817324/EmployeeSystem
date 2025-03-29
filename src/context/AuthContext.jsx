import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = {
      ...userData,
      id: Date.now().toString()
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  // Login user
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      user => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setUser(foundUser);
      return foundUser;
    }
    return null;
  };

  // Logout user
  const logout = () => {
    // Save current tasks and users before logout
    const currentTasks = localStorage.getItem("tasks");
    const currentUsers = localStorage.getItem("users");

    // Clear localStorage (but don't remove tasks and users)
    localStorage.removeItem("currentUser");

    // Restore tasks and users
    if (currentTasks) localStorage.setItem("tasks", currentTasks);
    if (currentUsers) localStorage.setItem("users", currentUsers);

    setUser(null);
    setLoading(false);
    window.location.href = window.location.origin + window.location.pathname + "#/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);