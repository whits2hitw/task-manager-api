import request from 'supertest';
import { app } from '../app';

describe('Auth (Integration)', () => {
  it('should be able to authenticate a user and return a token', async () => {
  
    const response = await request(app)
      .post('/sessions') 
      .send({
        email: 'lucas@email.com',
        password: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate with invalid credentials', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'email-errado@exemplo.com',
        password: 'senha-errada'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});