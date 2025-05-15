// src/services/todo.service.test.ts
import { TodoService } from './todo.service';
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoDTO } from '../types';

describe('TodoService', () => {
    let service: TodoService;
    let repository: TodoRepository;

    beforeEach(() => {
        repository = new TodoRepository();
        service = new TodoService(repository);
    });

    describe('createTodo', () => {
        it('creates a todo with valid input', async () => {
            const dto: CreateTodoDTO = {
                title: 'Test Todo',
                description: 'Test Description'
            };

            const todo = await service.createTodo(dto);
            
            expect(todo.title).toBe(dto.title);
            expect(todo.description).toBe(dto.description);
            expect(todo.completed).toBe(false);
        });

        it('sanitizes HTML content from input', async () => {
            const dto: CreateTodoDTO = {
                title: '<script>alert("xss")</script>Test Todo',
                description: '<img src="x" onerror="alert()">Description'
            };

            const todo = await service.createTodo(dto);
            
            expect(todo.title).toBe('Test Todo');
            expect(todo.description).toBe('Description');
        });
    });
});