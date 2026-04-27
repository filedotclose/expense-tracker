import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

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
      // Error is already handled by the context (toast/setError)
      console.error('Failed to submit form', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient">Expenses</h1>
        {!isFormOpen && (
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="glass glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>New Expense</h3>
            <button className="btn-icon" onClick={() => setIsFormOpen(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input type="number" step="0.01" className="form-input" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="" disabled>Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Note (Optional)</label>
                <input type="text" className="form-input" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Expense</button>
          </form>
        </div>
      )}

      <div className="glass glass-card" style={{ padding: '0' }}>
        {expenses.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No expenses found. Start adding some!
          </div>
        ) : (
          expenses.map(exp => (
            <div key={exp._id} className="expense-item">
              <div className="expense-details">
                <div className="expense-category">{exp.category}</div>
                <div className="expense-info">
                  <h4>{exp.note || exp.category}</h4>
                  <div className="expense-date">{format(new Date(exp.date), 'MMM dd, yyyy')}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="expense-amount">-${exp.amount.toFixed(2)}</div>
                <div className="expense-actions">
                  <button className="btn-icon" onClick={() => deleteExpense(exp._id)}>
                    <Trash2 size={18} color="var(--danger)" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
