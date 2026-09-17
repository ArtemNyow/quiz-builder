import type { Request, Response } from 'express';
import { createQuizSchema, quizIdSchema } from './quiz.schema.js';
import { quizService } from './quiz.service.js';

export const quizController = {
  async create(req: Request, res: Response): Promise<void> {
    const payload = createQuizSchema.parse(req.body);
    const quiz = await quizService.create(payload);
    res.status(201).json(quiz);
  },

  async list(_req: Request, res: Response): Promise<void> {
    res.json(await quizService.list());
  },

  async detail(req: Request, res: Response): Promise<void> {
    const { id } = quizIdSchema.parse(req.params);
    res.json(await quizService.findById(id));
  },

  async remove(req: Request, res: Response): Promise<void> {
    const { id } = quizIdSchema.parse(req.params);
    await quizService.remove(id);
    res.status(204).send();
  },
};
