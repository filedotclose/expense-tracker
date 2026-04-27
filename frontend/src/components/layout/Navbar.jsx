import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, ReceiptText, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive
          ? 'bg-primary/10 text-primary'
          : 'text-text-muted hover:text-text-main hover:bg-white/5'
          }`}
      >
        <Icon size={18} />
        <span className="hidden md:block font-medium">{children}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-4 left-0 right-0 z-50 px-4 md:px-8">
      <div className="glass-card flex justify-between items-center px-6 py-3 max-w-7xl mx-auto border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-2xl font-extrabold tracking-tight text-gradient">ExpenseFlow</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-black/20 p-1 rounded-2xl border border-white/5">
            <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/expenses" icon={ReceiptText}>Expenses</NavLink>
          </div>

          <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={18} />
            <span className="hidden md:block font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
