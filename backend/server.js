import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import progressRoutes from './routes/progressRoutes.js';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/progress', progressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
