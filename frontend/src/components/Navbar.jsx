import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="bg-slate-900 dark:bg-white text-white dark:text-black p-1.5 rounded-lg shadow-lg shadow-black/10"
              >
                <Link2 size={20} />
              </motion.div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                LumiLink
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" current={location.pathname === '/'}>Overview</NavLink>
              <NavLink to="/dashboard" current={location.pathname.includes('/dashboard')}>Dashboard</NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, current }) => (
  <Link 
    to={to} 
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      current 
        ? 'text-foreground bg-gray-100 dark:bg-gray-800' 
        : 'text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-900'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
