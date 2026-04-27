import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, Filter, TrendingDown, ArrowUpRight, Calendar, Tag, ReceiptText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const DashboardPage = () => {
  const { expenses, loading } = useExpenses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dateFilter, setDateFilter] = useState('all');
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

  const categoryData = filteredExpenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">
            Hello, <span className="text-gradient">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-text-muted flex items-center gap-2">
            <TrendingDown size={18} className="text-red-400" />
            Your spending overview is looking sharp today.
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/expenses', { state: { openAdd: true } })}
          icon={Plus}
        >
          Add Expense
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden group border-white/5 bg-surface/40 hover:bg-surface/60">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingDown size={80} className="text-primary" />
          </div>
          <p className="text-text-muted font-medium mb-1">Filtered Spending</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-text-main">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <span className="text-accent text-sm font-semibold flex items-center">
              <ArrowUpRight size={14} /> 2.4%
            </span>
          </div>
        </Card>
        <Card className="relative overflow-hidden group border-white/5 bg-surface/40 hover:bg-surface/60">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ReceiptText size={80} className="text-primary" />
          </div>
          <p className="text-text-muted font-medium mb-1">Total Transactions</p>
          <h2 className="text-4xl font-bold text-text-main">{filteredExpenses.length}</h2>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 md:p-4 flex flex-col md:flex-row gap-4 items-center bg-black/20 border-white/5">
        <div className="flex items-center gap-2 text-text-muted font-medium mr-2">
          <Filter size={18} /> Filters
        </div>
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <select 
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/5 rounded-xl appearance-none focus:outline-none focus:border-primary/30 transition-colors text-text-main"
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <select 
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/5 rounded-xl appearance-none focus:outline-none focus:border-primary/30 transition-colors text-text-main"
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Card */}
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            Spending by Category
          </h3>
          {categoryData.length > 0 ? (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(15, 23, 42, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '16px',
                      backdropFilter: 'blur(8px)',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-text-muted bg-white/5 rounded-2xl border border-dashed border-white/10">
              No data available for selected filters.
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recent</h3>
            <button onClick={() => navigate('/expenses')} className="text-cta text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {filteredExpenses.slice(0, 6).map(exp => (
              <div key={exp._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Tag size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-text-main">{exp.note || exp.category}</div>
                    <div className="text-xs text-text-muted">
                      {exp.offline && <span className="text-primary mr-1 font-bold">●</span>}
                      {format(new Date(exp.date), 'MMM dd')}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-red-400">
                  -${exp.amount.toFixed(2)}
                </div>
              </div>
            ))}
            {filteredExpenses.length === 0 && (
              <div className="py-12 text-center text-text-muted">
                No recent transactions.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
