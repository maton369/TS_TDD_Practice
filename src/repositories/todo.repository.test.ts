import { TodoRepository } from './todo.repository';
import { CreateTodoDTO, Todo } from '../types';
import { TodoValidationError } from '../errors/todo.errors';

describe('TodoRepository', () => {
    let repository: TodoRepository;

    beforeEach(() => {
        repository = new TodoRepository();
    });

    describe('create', () => {
        it('creates a new todo with required fields', async () => {
            const dto: CreateTodoDTO = {
                title: 'Test Todo'
            };

            const todo = await repository.create(dto);

            expect(todo.id).toBeDefined();
            expect(todo.title).toBe(dto.title);
            expect(todo.completed).toBe(false);
            expect(todo.createdAt).toBeInstanceOf(Date);
            expect(todo.updatedAt).toBeInstanceOf(Date);
        });

        it('throws error for empty title', async () => {
            const dto: CreateTodoDTO = {
                title: ''
            };

            await expect(repository.create(dto))
                .rejects
                .toThrow('Title cannot be empty');
        });

        it('throws error for title with only whitespace', async () => {
            const dto: CreateTodoDTO = {
                title: '   '
            };

            await expect(repository.create(dto))
                .rejects
                .toThrow('Title cannot be empty');
        });

        it('trims whitespace from title', async () => {
            const dto: CreateTodoDTO = {
                title: '  Test Todo  '
            };

            const todo = await repository.create(dto);
            expect(todo.title).toBe('Test Todo');
        });

        it('trims whitespace from description when provided', async () => {
            const dto: CreateTodoDTO = {
                title: 'Test Todo',
                description: '  Test Description  '
            };

            const todo = await repository.create(dto);
            expect(todo.description).toBe('Test Description');
        });
    });
});
