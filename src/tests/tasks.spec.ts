import request from 'supertest';
import { app } from '../app';

describe('Tasks (Integration)', () => {
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

  it('should be able to create a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`) 
      .send({
        title: 'Tarefa de Teste Rocketseat',
        description: 'Testando a criação via Supertest',
        priority: 'high',
        team_id: '8755fe6d-2718-4615-b814-e7d943251d4f', 
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Tarefa de Teste Rocketseat');
  });

  it('should not be able to create a task without title', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Sem título',
        team_id: 'ID-DE-UM-TIME-EXISTENTE',
      });


    expect(response.status).toBe(400);
  });
});