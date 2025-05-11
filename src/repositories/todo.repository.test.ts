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

    describe('findById', () => {
        it('returns todo when exists', async () => {
            // テスト用のTodoを作成
            const created = await repository.create({
                title: 'Find Me'
            });

            // 作成したTodoをIDで検索
            const found = await repository.findById(created.id);
            
            // 検索結果が作成したTodoと一致することを確認
            expect(found).toEqual(created);
        });

        it('returns null when todo does not exist', async () => {
            const found = await repository.findById('non-existent-id');
            expect(found).toBeNull();
        });
    });

    describe('findAll', () => {
    it('returns empty array when no todos exist', async () => {
        const todos = await repository.findAll();
        expect(todos).toEqual([]);
    });

    it('returns all todos', async () => {
        // テスト用のTodoを2件作成
        const todo1 = await repository.create({ title: 'Todo 1' });
        const todo2 = await repository.create({ title: 'Todo 2' });

        const todos = await repository.findAll();
        
        // 件数の確認
        expect(todos).toHaveLength(2);
        // 作成したTodoが含まれていることを確認
        expect(todos).toEqual(expect.arrayContaining([todo1, todo2]));
    });
});
});
