import request from 'supertest';
import { app } from '../app';

describe('Teams (Integration)', () => {
  let token: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'lucas@email.com',
        password: '123456'
      });

    token = response.body.token;
  });

  it('should be able to create a new team', async () => {
    const response = await request(app)
      .post('/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Squad de Desenvolvimento Rocket',
        description: 'Time focado em entregar o desafio'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Squad de Desenvolvimento Rocket');
  });

  it('should not be able to create a team with an existing name', async () => {
    const response = await request(app)
      .post('/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Squad de Desenvolvimento Rocket'
      });

    expect(response.status).toBe(400); 
  });
});