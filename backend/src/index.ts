import express from 'express';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { documentsRouter } from './routes/documents';
import { templatesRouter } from './routes/templates';
import { sendersRouter } from './routes/senders';
import { errorHandler } from './middleware/errorHandler';
import { seedAdminUser } from './services/adminSeeder';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
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

async function start() {
  try {
    try {
      await seedAdminUser();
    } catch (seedError) {
      console.error('⚠️  Failed to seed admin user during startup');
      console.error(seedError);
    }

    app.listen(PORT, () => {
      console.log(`🚀 ORTAM Docs Builder API running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server', error);
    process.exit(1);
  }
}

void start();
