import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();

  // Determine the home route based on authentication status
  const homeRoute = user ? "/dashboard" : "/login";

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cyan-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link
          to={homeRoute}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 