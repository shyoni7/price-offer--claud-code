import { Router } from 'express';
import { prisma } from '../db';
import { AppError } from '../middleware/errorHandler';
import { authenticate, requireAdmin } from '../middleware/auth';

export const sendersRouter = Router();

// All routes require authentication
sendersRouter.use(authenticate);

// GET /api/senders - Get all senders
sendersRouter.get('/', async (req, res, next) => {
  try {
    const senders = await prisma.sender.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({
      status: 'success',
      data: { senders }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/senders - Create new sender (Admin only)
sendersRouter.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, email, phone, title } = req.body;

    if (!name) {
      throw new AppError('Name is required', 400);
    }

    const sender = await prisma.sender.create({
      data: {
        name,
        email,
        phone,
        title
      }
    });

    res.status(201).json({
      status: 'success',
      data: { sender }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/senders/:id - Update sender (Admin only)
sendersRouter.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, title, isActive } = req.body;

    const sender = await prisma.sender.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        title,
        isActive
      }
    });

    res.json({
      status: 'success',
      data: { sender }
    });
  } catch (error) {
    next(error);
  }
});
