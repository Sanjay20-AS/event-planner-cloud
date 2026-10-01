import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-indigo-500 text-2xl">⚡</span> 
          CloudEvent
        </Link>
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-300 text-sm hidden md:block">{user.email}</span>
              <button 
                onClick={signOut}
                className="text-slate-400 hover:text-white transition text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
