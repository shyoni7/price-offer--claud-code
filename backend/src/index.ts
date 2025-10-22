import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { documentsRouter } from './routes/documents';
import { templatesRouter } from './routes/templates';
import { sendersRouter } from './routes/senders';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/docs', documentsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/senders', sendersRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 ORTAM Docs Builder API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
