import request from 'supertest';
import { app } from '../app';

describe('Authenticate Controller (Integration)', () => {
  it('should be able to authenticate a user', async () => {
    const response = await request(app)
      .post('/sessions') 
      .send({
        email: 'lucas@email.com',
        password: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate with wrong password', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@example.com',
        password: 'wrong-password'
      });

    expect(response.status).toBe(400);
  });
});