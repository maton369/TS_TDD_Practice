// src/middleware/validation.ts
import { body, query, ValidationChain } from 'express-validator';

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

export const updateTodoValidation: ValidationChain[] = [
    body('title')
        .optional()
        .notEmpty()
        .withMessage('Title must not be empty')
        .trim(),

    body('description')
        .optional()
        .trim(),

    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean value')
];

export const getTodosValidation: ValidationChain[] = [
    query('search')
        .optional()
        .isString()
        .withMessage('Search must be a string'),

    query('completed')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('Completed status must be true or false'),
];