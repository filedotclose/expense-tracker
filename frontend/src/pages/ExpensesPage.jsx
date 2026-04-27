import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { Trash2, Edit2, Plus, X, Tag, Calendar, DollarSign, StickyNote, Filter, ReceiptText } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const ExpensesPage = () => {
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  useEffect(() => {
    if (location.state?.openAdd) {
      setIsFormOpen(true);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setIsFormOpen(false);
      setFormData({ amount: '', category: '', date: new Date().toISOString().split('T')[0], note: '' });
    } catch (err) {
      console.error('Failed to submit form', err);
    }
  };

  const CategoryIcon = ({ category }) => {
    return (
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500">
        <Tag size={20} />
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient">Expenses</h1>
          <p className="text-text-muted mt-1">Manage and track your detailed transactions</p>
        </div>
        {!isFormOpen && (
          <Button 
            variant="primary" 
            onClick={() => setIsFormOpen(true)}
            icon={Plus}
          >
            Add New
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="relative overflow-hidden border-primary/20 shadow-primary/5 bg-surface/80">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Log New Expense</h3>
            <button 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted"
              onClick={() => setIsFormOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <DollarSign className="absolute left-3 top-[38px] text-text-muted" size={18} />
                <Input 
                  label="Amount"
                  type="number" 
                  step="0.01" 
                  className="pl-10"
                  required 
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})} 
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted px-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <select 
                    className="input-field pl-10 appearance-none bg-black/20" 
                    required 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="" disabled>Select Category</option>
                    {['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-[38px] text-text-muted" size={18} />
                <Input 
                  label="Date"
                  type="date" 
                  className="pl-10"
                  required 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                />
              </div>
            </div>

            <div className="relative">
              <StickyNote className="absolute left-3 top-[38px] text-text-muted" size={18} />
              <Input 
                label="Note (Optional)"
                type="text" 
                className="pl-10"
                value={formData.note} 
                onChange={e => setFormData({...formData, note: e.target.value})} 
                placeholder="What was this for?"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="ghost" type="button" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save Transaction</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-hidden border-white/5 bg-black/20">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="font-bold flex items-center gap-2">
            <Filter size={18} className="text-text-muted" />
            Transaction History
          </h3>
          <span className="text-sm text-text-muted bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {expenses.length} Records
          </span>
        </div>
        
        <div className="divide-y divide-white/5">
          {expenses.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                <ReceiptText size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold">No transactions yet</p>
                <p className="text-text-muted">Start tracking your spending today.</p>
              </div>
              <Button variant="secondary" onClick={() => setIsFormOpen(true)} className="mt-2">
                Add Your First Expense
              </Button>
            </div>
          ) : (
            expenses.map(exp => (
              <div key={exp._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-4">
                  <CategoryIcon category={exp.category} />
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {exp.note || exp.category}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold text-text-main">
                        {exp.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(exp.date), 'MMMM dd, yyyy')}
                      </span>
                      {exp.offline && (
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                          Offline Sync
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                  <div className="text-2xl font-black text-red-400">
                    -${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-text-muted hover:text-red-400"
                      onClick={() => deleteExpense(exp._id)}
                      title="Delete transaction"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExpensesPage;
