// src/middleware/validation.ts
import { body, ValidationChain } from 'express-validator';

export const createTodoValidation: ValidationChain[] = [
    // titleのバリデーション
    body('title')
        .exists()
        .withMessage('Title is required')
        .bail()
        .notEmpty()
        .withMessage('Title must not be empty')
        .trim(),

    // descriptionのバリデーション
    body('description')
        .optional()
        .trim(),
];