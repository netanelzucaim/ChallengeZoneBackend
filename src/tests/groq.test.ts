import request from 'supertest';
import express from 'express';
import groqController from '../controllers/groq_controller';

const app = express();
app.use(express.json());
app.post('/chat-response', groqController.getChatResponse);
app.post('/chat-response-raw', groqController.getChatResponseRaw);

jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Mocked response' } }]
          })
        }
      }
    };
  });
});

describe('Groq Controller', () => {
  it('should return a chat response', async () => {
    const response = await request(app)
      .post('/chat-response')
      .send({ messages: [{ role: 'user', content: 'Hello' }] });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('output', 'Mocked response');
  });

  it('should return an error if messages array is not provided', async () => {
    const response = await request(app)
      .post('/chat-response')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'messages array is required');
  });

  it('should return a raw chat response', async () => {
    const response = await request(app)
      .post('/chat-response-raw')
      .send({ messages: [{ role: 'user', content: 'Hello' }] });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Mocked response');
  });

  it('should return an error if messages array is not provided for raw response', async () => {
    const response = await request(app)
      .post('/chat-response-raw')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'messages array is required');
  });
});