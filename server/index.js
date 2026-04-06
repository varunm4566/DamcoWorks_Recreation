import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customersRouter from './routes/customers.routes.js';
import projectsRouter from './routes/projects.routes.js';
import deliveryRouter from './routes/delivery.routes.js';
import customerDetailRouter from './routes/customerDetail.routes.js';
import benchRouter from './routes/bench.routes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/customer-detail', customerDetailRouter);
app.use('/api/bench', benchRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`DamcoWorks server running on http://localhost:${PORT}`);
});
