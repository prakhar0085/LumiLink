import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Loader2, Link as LinkIcon } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-[#fcfcfd] dark:bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[380px] bg-white dark:bg-gray-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-gray-800"
      >
        <div className="text-center mb-6">
          {/* Logo in Login */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-slate-900 dark:bg-white text-white dark:text-black p-1 rounded-lg">
              <LinkIcon size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              LumiLink
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sign in to continue managing your links</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-900 dark:text-white ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-black/50 border border-slate-200 dark:border-gray-800 rounded-xl focus:bg-white dark:focus:bg-black focus:border-slate-900 dark:focus:border-white focus:outline-none transition-all placeholder:text-slate-400 text-xs"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-900 dark:text-white ml-1 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-black/50 border border-slate-200 dark:border-gray-800 rounded-xl focus:bg-white dark:focus:bg-black focus:border-slate-900 dark:focus:border-white focus:outline-none transition-all placeholder:text-slate-400 text-xs"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-slate-100 transition-all disabled:opacity-70 mt-2 shadow-lg shadow-slate-900/10 dark:shadow-none text-xs"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-slate-900 dark:text-white font-bold hover:underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
