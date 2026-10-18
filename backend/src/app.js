import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}));

app.use('/api/health', healthRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
