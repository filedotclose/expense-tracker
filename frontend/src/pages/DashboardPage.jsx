import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';

const DashboardPage = () => {
  const { expenses, loading } = useExpenses();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filters state
  const [dateFilter, setDateFilter] = useState('all'); // 'all', '7days', '30days'
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      let dateMatch = true;
      if (dateFilter === '7days') {
        dateMatch = isAfter(parseISO(exp.date), subDays(new Date(), 7));
      } else if (dateFilter === '30days') {
        dateMatch = isAfter(parseISO(exp.date), subDays(new Date(), 30));
      }
      
      let catMatch = true;
      if (categoryFilter !== 'all') {
        catMatch = exp.category === categoryFilter;
      }
      return dateMatch && catMatch;
    });
  }, [expenses, dateFilter, categoryFilter]);

  const totalSpent = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category for chart
  const categoryData = filteredExpenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient">Hello, {user?.email?.split('@')[0]}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is your financial overview</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/expenses', { state: { openAdd: true } })}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass glass-card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Filter size={18} /> Filters:
        </div>
        <select 
          className="form-input" 
          style={{ width: 'auto', padding: '0.5rem' }} 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
        
        <select 
          className="form-input" 
          style={{ width: 'auto', padding: '0.5rem' }} 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="glass glass-card stat-card">
          <span className="stat-label">Filtered Spend</span>
          <span className="stat-value">${totalSpent.toFixed(2)}</span>
        </div>
        <div className="glass glass-card stat-card">
          <span className="stat-label">Transactions</span>
          <span className="stat-value">{filteredExpenses.length}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass glass-card">
          <h3>Spending by Category</h3>
          {categoryData.length > 0 ? (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No data available for this filter.</p>
          )}
        </div>

        <div className="glass glass-card">
          <h3>Recent Transactions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {filteredExpenses.slice(0, 5).map(exp => (
              <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{exp.note || exp.category}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {exp.offline && <span style={{ color: 'var(--warning)', marginRight: '5px' }}>[Offline]</span>}
                    {format(new Date(exp.date), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div style={{ color: 'var(--danger)', fontWeight: 600 }}>
                  -${exp.amount.toFixed(2)}
                </div>
              </div>
            ))}
            {filteredExpenses.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No expenses recorded.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
