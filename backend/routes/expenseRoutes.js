const express = require('express');
const router = express.Router();
const { z } = require('zod');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().or(z.date()).optional(),
  note: z.string().optional(),
});

router.route('/')
  .get(protect, getExpenses)
  .post(protect, validateRequest(expenseSchema), createExpense);

router.route('/:id')
  .put(protect, validateRequest(expenseSchema.partial()), updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;
