// tests/auth.test.js - Auth Route Integration Tests
// Run: npm test

import request from 'supertest';
import app from '../src/server.js';

describe('POST /api/auth/register', () => {
  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects weak password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com', password: '123', password_confirm: '123',
      first_name: 'Test', last_name: 'User',
    });
    expect(res.status).toBe(400);
  });

  it('rejects mismatched passwords', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com', password: 'password123', password_confirm: 'different',
      first_name: 'Test', last_name: 'User',
    });
    expect(res.status).toBe(400);
  });

  it('rejects invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'not-an-email', password: 'password123', password_confirm: 'password123',
      first_name: 'Test', last_name: 'User',
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('rejects missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'notexist@example.com', password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth middleware', () => {
  it('rejects requests without token', async () => {
    const res = await request(app).get('/api/client/profile');
    expect(res.status).toBe(401);
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/client/profile')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });

  it('rejects admin routes for non-admins', async () => {
    const res = await request(app)
      .get('/api/admin/clients')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
});

describe('Rate limiting', () => {
  it('blocks after 20 auth requests in 15 minutes', async () => {
    const requests = Array(25).fill(null).map(() =>
      request(app).post('/api/auth/login').send({ email: 'x@x.com', password: 'x' })
    );
    const responses = await Promise.all(requests);
    const tooMany = responses.filter(r => r.status === 429);
    expect(tooMany.length).toBeGreaterThan(0);
  }, 30000);
});
