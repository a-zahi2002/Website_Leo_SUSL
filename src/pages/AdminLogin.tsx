import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in a real app this would call an API
    if (email === 'admin@leoclub.com' && password === 'leo123') {
      navigate('/admin/dashboard');
    } else {
      alert('Invalid credentials! Try: admin@leoclub.com / leo123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-gray-500 hover:text-[var(--color-leo-maroon)] mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Home
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-leo-maroon)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[var(--color-leo-maroon)]" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Login</h2>
          <p className="text-gray-500 dark:text-gray-400">Sign in to manage club data</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-[var(--color-leo-maroon)] focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900 outline-none transition-all"
              placeholder="admin@leoclub.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-[var(--color-leo-maroon)] focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[var(--color-leo-maroon)] text-white font-bold py-3 rounded-lg hover:bg-red-900 transition-colors shadow-lg cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
