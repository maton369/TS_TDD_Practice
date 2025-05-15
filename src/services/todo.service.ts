// src/services/todo.service.ts
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoDTO, Todo } from '../types';
import sanitizeHtml from 'sanitize-html';

export class TodoService {
    constructor(private repository: TodoRepository) {}

    async createTodo(dto: CreateTodoDTO): Promise<Todo> {
        // 入力値のサニタイズ
        const sanitizedTitle = this.sanitizeText(dto.title);
        const sanitizedDescription = dto.description 
            ? this.sanitizeText(dto.description)
            : undefined;

        // タイトルの長さチェック
        if (sanitizedTitle.length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }

        // 説明文の長さチェック（存在する場合）
        if (sanitizedDescription && 
            sanitizedDescription.length > 500) {
            throw new Error('Description cannot exceed 500 characters');
        }

        // リポジトリを使用してTodoを作成
        return this.repository.create({
            title: sanitizedTitle,
            description: sanitizedDescription
        });
    }

    private sanitizeText(text: string): string {
        return sanitizeHtml(text, {
            allowedTags: [],       // HTMLタグを全て除去
            allowedAttributes: {}, // 属性を全て除去
        }).trim();
    }
}