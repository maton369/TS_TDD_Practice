// src/services/todo.service.ts
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoDTO, Todo, UpdateTodoDTO } from '../types';
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

    async updateTodo(id: string, dto: UpdateTodoDTO): Promise<Todo> {
        // 既存のTodoを取得
        const existingTodo = await this.repository.findById(id);
        if (!existingTodo) {
            throw new Error('Todo not found');
        }

        // 完了済みTodoの更新を防止
        if (existingTodo.completed) {
            throw new Error('Cannot update completed todo');
        }

        // 更新用のDTOを準備
        const updateData: UpdateTodoDTO = {};

        // タイトルの更新処理
        if (dto.title !== undefined) {
            const sanitizedTitle = this.sanitizeText(dto.title);
            if (sanitizedTitle.length > 100) {
                throw new Error('Title cannot exceed 100 characters');
            }
            updateData.title = sanitizedTitle;
        }

        // 説明文の更新処理
        if (dto.description !== undefined) {
            const sanitizedDescription = this.sanitizeText(dto.description);
            if (sanitizedDescription.length > 500) {
                throw new Error('Description cannot exceed 500 characters');
            }
            updateData.description = sanitizedDescription;
        }

        // 完了状態の更新
        if (dto.completed !== undefined) {
            updateData.completed = dto.completed;
        }

        // リポジトリを使用してTodoを更新
        return this.repository.update(id, updateData);
    }

    private sanitizeText(text: string): string {
        return sanitizeHtml(text, {
            allowedTags: [],       // HTMLタグを全て除去
            allowedAttributes: {}, // 属性を全て除去
        }).trim();
    }


}