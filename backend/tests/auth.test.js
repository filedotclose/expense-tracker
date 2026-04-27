const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  // Connect to a test database if not connected
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
});

describe('Auth Endpoints', () => {
  const mockUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(mockUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toEqual(mockUser.email);
  });

  it('should not register user with existing email', async () => {
    await request(app).post('/api/auth/register').send(mockUser);
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(mockUser);
      
    expect(res.statusCode).toEqual(400);
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/register').send(mockUser);
    
    const res = await request(app)
      .post('/api/auth/login')
      .send(mockUser);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    await request(app).post('/api/auth/register').send(mockUser);
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: mockUser.email, password: 'wrongpassword' });
      
    expect(res.statusCode).toEqual(401);
  });
});
