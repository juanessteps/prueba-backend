import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

export default app;
