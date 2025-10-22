import { Router } from 'express';
import { prisma } from '../db';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth';
import { generateDocumentContent } from '../services/aiService';
import { generatePDF } from '../services/pdfService';

export const documentsRouter = Router();

// All routes require authentication
documentsRouter.use(authenticate);

// GET /api/docs - Get all documents
documentsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Editors can only see their own documents, Admins can see all
    const where = userRole === 'ADMIN' ? {} : { createdBy: userId };

    const documents = await prisma.document.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: { documents }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/docs/:id - Get single document
documentsRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        versions: {
          orderBy: {
            versionNumber: 'desc'
          },
          take: 10
        }
      }
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Check permissions
    if (userRole !== 'ADMIN' && document.createdBy !== userId) {
      throw new AppError('Access denied', 403);
    }

    res.json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/docs - Create new document
documentsRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const {
      docType,
      language = 'he',
      templateId = 'A',
      clientName,
      clientContactPerson,
      clientContactPhone,
      subject,
      priceAmount,
      showPrice = true,
      userPrompt,
      sender
    } = req.body;

    if (!docType) {
      throw new AppError('Document type is required', 400);
    }

    const document = await prisma.document.create({
      data: {
        docType,
        language,
        templateId,
        clientName,
        clientContactPerson,
        clientContactPhone,
        subject,
        priceAmount,
        priceCurrency: 'ILS',
        vatPercent: 18,
        showPrice,
        userPrompt,
        sender,
        createdBy: userId,
        status: 'DRAFT'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/docs/:id/generate - Generate document content using AI
documentsRouter.post('/:id/generate', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    if (userRole !== 'ADMIN' && document.createdBy !== userId) {
      throw new AppError('Access denied', 403);
    }

    // Generate content using AI
    const generatedContent = await generateDocumentContent({
      docType: document.docType,
      language: document.language,
      clientName: document.clientName ?? undefined,
      clientContactPerson: document.clientContactPerson ?? undefined,
      subject: document.subject ?? undefined,
      priceAmount: document.priceAmount ?? undefined,
      showPrice: document.showPrice,
      userPrompt: document.userPrompt ?? undefined
    });

    // Update document with generated content
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        generatedBody: generatedContent,
        editedBody: generatedContent // Initialize editedBody with generated content
      }
    });

    // Create version snapshot
    const versionCount = await prisma.documentVersion.count({
      where: { documentId: id }
    });

    await prisma.documentVersion.create({
      data: {
        documentId: id,
        versionNumber: versionCount + 1,
        content: generatedContent,
        snapshot: updatedDocument as any
      }
    });

    res.json({
      status: 'success',
      data: {
        document: updatedDocument,
        generatedContent
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/docs/:id - Update document
documentsRouter.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    if (userRole !== 'ADMIN' && document.createdBy !== userId) {
      throw new AppError('Access denied', 403);
    }

    if (document.status === 'LOCKED') {
      throw new AppError('Cannot edit locked document', 400);
    }

    const {
      editedBody,
      status,
      clientName,
      clientContactPerson,
      clientContactPhone,
      subject,
      priceAmount,
      showPrice,
      userPrompt,
      sender,
      templateId
    } = req.body;

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        editedBody,
        status,
        clientName,
        clientContactPerson,
        clientContactPhone,
        subject,
        priceAmount,
        showPrice,
        userPrompt,
        sender,
        templateId
      }
    });

    res.json({
      status: 'success',
      data: { document: updatedDocument }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/docs/:id/export/pdf - Export document as PDF
documentsRouter.post('/:id/export/pdf', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    if (userRole !== 'ADMIN' && document.createdBy !== userId) {
      throw new AppError('Access denied', 403);
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(document);

    // Update document status to EXPORTED
    await prisma.document.update({
      where: { id },
      data: { status: 'EXPORTED' }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${document.docType}-${document.clientName || 'document'}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/docs/:id - Delete document (Admin only)
documentsRouter.delete('/:id', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.document.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      message: 'Document deleted'
    });
  } catch (error) {
    next(error);
  }
});
