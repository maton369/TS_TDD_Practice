// src/repositories/todo.repository.ts
import { Todo, CreateTodoDTO } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class TodoRepository {
    private todos: Map<string, Todo> = new Map();

    async create(dto: CreateTodoDTO): Promise<Todo> {
        const todo: Todo = {
            id: uuidv4(),          // ユニークなIDを生成
            title: dto.title,      // DTOからタイトルを取得
            description: dto.description,
            completed: false,      // 新規作成時は未完了
            createdAt: new Date(), // 現在の日時
            updatedAt: new Date()  // 現在の日時
        };

        this.todos.set(todo.id, todo);
        return todo;
    }
}