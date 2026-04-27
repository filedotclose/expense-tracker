import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { addSyncAction } from '../services/db';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [user]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(res.data);
      // Sync to local storage for offline support
      localStorage.setItem('offline_expenses', JSON.stringify(res.data));
    } catch (err) {
      setError('Failed to fetch expenses');
      // Load offline data if network fails
      const offline = localStorage.getItem('offline_expenses');
      if (offline) setExpenses(JSON.parse(offline));
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    // Optimistic UI update
    const optimisticExp = { ...expenseData, _id: Date.now().toString(), offline: true };
    setExpenses(current => [optimisticExp, ...current]);
    
    try {
      const res = await axios.post('http://localhost:5000/api/expenses', expenseData);
      setExpenses(current => current.map(e => e._id === optimisticExp._id ? res.data : e));
    } catch (err) {
      if (!navigator.onLine || err.code === 'ERR_NETWORK') {
        // We're offline, use background sync or IDB fallback
        await addSyncAction({ type: 'ADD_EXPENSE', payload: expenseData });
        setError('Saved offline. Will sync when back online.');
      } else {
        setError('Failed to add expense');
        // Rollback optimistic update on real error
        setExpenses(current => current.filter(e => e._id !== optimisticExp._id));
        throw err;
      }
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/expenses/${id}`, expenseData);
      setExpenses(current => current.map(exp => (exp._id === id ? res.data : exp)));
    } catch (err) {
      setError('Failed to update expense');
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    setExpenses(current => {
      const backup = current;
      const filtered = current.filter(exp => exp._id !== id);
      // We handle the backup via closure in the error block
      return filtered;
    });
    
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    } catch (err) {
      if (!navigator.onLine || err.code === 'ERR_NETWORK') {
        await addSyncAction({ type: 'DELETE_EXPENSE', payload: { id } });
        setError('Deleted offline. Will sync when back online.');
      } else {
        setError('Failed to delete expense');
        // On error, fetch again to restore state
        fetchExpenses();
        throw err;
      }
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, error, fetchExpenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};
