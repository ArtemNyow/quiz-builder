import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { quizController } from './quiz.controller.js';

export const quizRouter = Router();

quizRouter.post('/', asyncHandler(quizController.create));
quizRouter.get('/', asyncHandler(quizController.list));
quizRouter.get('/:id', asyncHandler(quizController.detail));
quizRouter.delete('/:id', asyncHandler(quizController.remove));
