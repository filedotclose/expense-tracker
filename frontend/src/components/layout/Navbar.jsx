import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, ListOrdered, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <Wallet className="icon-brand" />
        <span className="text-gradient">Expensify</span>

      </div>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/expenses" className={`nav-link ${location.pathname === '/expenses' ? 'active' : ''}`}>
          <ListOrdered size={20} />
          <span>Expenses</span>
        </Link>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
