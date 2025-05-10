// src/repositories/todo.repository.ts
import { Todo, CreateTodoDTO } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { TodoValidationError } from '../errors/todo.errors';

export class TodoRepository {
    private todos: Map<string, Todo> = new Map();

    async create(dto: CreateTodoDTO): Promise<Todo> {
        const title = dto.title.trim();
        if (!title) {
            throw new TodoValidationError('Title cannot be empty');
        }

        const description = dto.description ? dto.description.trim() : undefined;
        const now = new Date();

        const todo: Todo = {
            id: uuidv4(),
            title,
            description,
            completed: false,
            createdAt: now,
            updatedAt: now
        };

        this.todos.set(todo.id, todo);
        return todo;
    }
}
