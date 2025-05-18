// src/controllers/todo.controller.test.ts
import { TodoController } from './todo.controller';
import { TodoService } from '../services/todo.service';
import { TodoRepository } from '../repositories/todo.repository';
import request from 'supertest';
import express, { Express } from 'express';

describe('TodoController', () => {
    let app: Express;
    let controller: TodoController;
    let service: TodoService;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        const repository = new TodoRepository();
        service = new TodoService(repository);
        controller = new TodoController(service);

        // ルートの設定
        app.post('/todos', controller.createTodo.bind(controller));
    });

    describe('POST /todos', () => {
        it('creates a new todo with valid input', async () => {
            const response = await request(app)
                .post('/todos')
                .send({
                    title: 'Test Todo',
                    description: 'Test Description'
                });

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                title: 'Test Todo',
                description: 'Test Description',
                completed: false
            });
            expect(response.body.id).toBeDefined();
        });

        it('returns 400 when title is missing', async () => {
            const response = await request(app)
                .post('/todos')
                .send({
                    description: 'Test Description'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Title cannot be empty'
            });
        });

        it('returns 400 when title is empty', async () => {
            const response = await request(app)
                .post('/todos')
                .send({
                    title: '',
                    description: 'Test Description'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Title cannot be empty'
            });
        });

    });
});
