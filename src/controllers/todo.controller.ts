// src/controllers/todo.controller.ts
import { Request, Response } from 'express';
import { TodoService } from '../services/todo.service';
import { CreateTodoDTO, UpdateTodoDTO } from '../types';
import { validationResult } from 'express-validator';

export class TodoController {
    constructor(private service: TodoService) { }
    async createTodo(req: Request, res: Response): Promise<void> {
        try {
            // バリデーション結果のチェック
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array().map(err => err.msg)
                });
                return;
            }

            const todo = await this.service.createTodo(req.body as CreateTodoDTO);
            res.status(201).json(todo);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    errors: [error.message]
                });
            } else {
                res.status(500).json({
                    errors: ['Internal server error']
                });
            }
        }
    }

    async getTodos(req: Request, res: Response): Promise<void> {
        try {
            const { search, completed } = req.query;

            // バリデーション: completed が true/false 以外なら 400 を返す
            if (completed !== undefined && completed !== 'true' && completed !== 'false') {
                res.status(400).json({
                    errors: ['Completed status must be true or false']
                });
            }

            const filters = {
                title: typeof search === 'string' ? search : undefined,
                completed: completed === 'true' ? true : completed === 'false' ? false : undefined
            };

            const todos = await this.service.findTodos(filters);
            res.status(200).json(todos);
        } catch (error) {
            res.status(500).json({
                errors: ['Internal server error']
            });
        }
    }

    async updateTodo(req: Request, res: Response): Promise<void> {
        try {
            const updated = await this.service.updateTodo(
                req.params.id,
                req.body as UpdateTodoDTO
            );
            res.status(200).json(updated);
        } catch (error) {
            res.status(400).json({
                errors: [error instanceof Error ? error.message : 'Unknown error']
            });
        }
    }
}