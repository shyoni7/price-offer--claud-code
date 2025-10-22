import { Router } from 'express';
import { prisma } from '../db';
import { AppError } from '../middleware/errorHandler';
import { authenticate, requireAdmin } from '../middleware/auth';

export const templatesRouter = Router();

// All routes require authentication
templatesRouter.use(authenticate);

// GET /api/templates - Get all templates
templatesRouter.get('/', async (req, res, next) => {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' }
    });

    res.json({
      status: 'success',
      data: { templates }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/templates/:id - Get single template
templatesRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    res.json({
      status: 'success',
      data: { template }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/templates - Create new template (Admin only)
templatesRouter.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, description, code, headerHtml, footerHtml, styles } = req.body;

    if (!name || !code) {
      throw new AppError('Name and code are required', 400);
    }

    const template = await prisma.template.create({
      data: {
        name,
        description,
        code,
        headerHtml,
        footerHtml,
        styles
      }
    });

    res.status(201).json({
      status: 'success',
      data: { template }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/templates/:id - Update template (Admin only)
templatesRouter.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, headerHtml, footerHtml, styles, isActive } = req.body;

    const template = await prisma.template.update({
      where: { id },
      data: {
        name,
        description,
        headerHtml,
        footerHtml,
        styles,
        isActive
      }
    });

    res.json({
      status: 'success',
      data: { template }
    });
  } catch (error) {
    next(error);
  }
});
