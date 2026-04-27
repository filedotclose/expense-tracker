import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md relative overflow-hidden border-white/5 bg-surface/80 backdrop-blur-xl">
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-500">
              <Wallet size={40} className="text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Join ExpenseFlow</h1>
            <p className="text-text-muted">Start tracking your finances like a pro</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Email Address"
              type="email" 
              placeholder="name@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            
            <Input 
              label="Password"
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />

            <Input 
              label="Confirm Password"
              type="password" 
              placeholder="••••••••"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              error={error}
            />

            <Button 
              type="submit" 
              className="w-full mt-4" 
              icon={UserPlus}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
