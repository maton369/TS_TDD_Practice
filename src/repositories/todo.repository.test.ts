import { TodoRepository } from './todo.repository';
import { CreateTodoDTO, Todo, UpdateTodoDTO } from '../types';
import { TodoValidationError } from '../errors/todo.errors';
import { wait } from '../test-utils/helper';

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

  describe('update', () => {
        it('updates todo fields correctly', async () => {
            // テスト用のTodoを作成
            const todo = await repository.create({
                title: 'Original Title',
                description: 'Original Description'
            });

            // updatedAtの比較テストのため、
            // 意図的に時間差を作る
            await wait();

            // 更新用のDTOを作成
            const updateDto: UpdateTodoDTO = {
                title: 'Updated Title',
                description: 'Updated Description',
                completed: true
            };

            // Todoを更新
            const updated = await repository.update(todo.id, updateDto);

            // 更新結果の検証
            expect(updated.title).toBe(updateDto.title);
            expect(updated.description).toBe(updateDto.description);
            expect(updated.completed).toBe(true);
            expect(updated.updatedAt.getTime()).toBeGreaterThan(todo.updatedAt.getTime());
            expect(updated.id).toBe(todo.id);// IDは変更されないことを確認
        });

        it('maintains unchanged fields', async () => {
            // 元のTodoを作成
            const todo = await repository.create({
                title: 'Original Title',
                description: 'Original Description'
            });

            await wait();

            // タイトルのみを更新
            const updated = await repository.update(todo.id, {
                title: 'Updated Title'
            });

            // 説明文が維持されていることを確認
            expect(updated.title).toBe('Updated Title');
            expect(updated.description).toBe('Original Description');
            expect(updated.updatedAt.getTime()).toBeGreaterThan(todo.updatedAt.getTime());
        });

        it('throws error when todo does not exist', async () => {
            await expect(
                repository.update('non-existent-id', { title: 'New Title' })
            ).rejects.toThrow('Todo not found');
        });

        it('applies validation rules to updated fields', async () => {
            const todo = await repository.create({
                title: 'Original Title'
            });

            // 空白のタイトルでの更新を試みる
            await expect(
                repository.update(todo.id, { title: '   ' })
            ).rejects.toThrow('Title cannot be empty');
        });
    });
});
