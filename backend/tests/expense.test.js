const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Expense = require('../models/Expense');

let token;
let userId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI + '_test');
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany();
  await Expense.deleteMany();

  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'expense@example.com', password: 'password123' });
    
  token = res.body.token;
  userId = res.body._id;
});

describe('Expense Endpoints', () => {
  const mockExpense = {
    amount: 100,
    category: 'Food',
    note: 'Lunch',
  };

  it('should create a new expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send(mockExpense);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.amount).toEqual(100);
    expect(res.body.category).toEqual('Food');
  });

  it('should not create expense without token', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send(mockExpense);
      
    expect(res.statusCode).toEqual(401);
  });

  it('should get all expenses for user', async () => {
    await Expense.create({ ...mockExpense, user: userId });
    
    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].category).toEqual('Food');
  });

  it('should update an expense', async () => {
    const expense = await Expense.create({ ...mockExpense, user: userId });
    
    const res = await request(app)
      .put(`/api/expenses/${expense._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 150 });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.amount).toEqual(150);
  });

  it('should delete an expense', async () => {
    const expense = await Expense.create({ ...mockExpense, user: userId });
    
    const res = await request(app)
      .delete(`/api/expenses/${expense._id}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    
    const check = await Expense.findById(expense._id);
    expect(check).toBeNull();
  });
});
