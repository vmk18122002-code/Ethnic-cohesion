import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import authRoutes from './routes/auth.js';
import passportRoutes from './routes/passport.js';
import journeyRoutes from './routes/journeys.js';
import assistantRoutes from './routes/assistant.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.disable('x-powered-by');
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',') }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'publichelp-lk' }));
app.use('/api/auth', authRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/journeys', journeyRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// In production, serve the built React app from client/dist.
const dist = path.resolve(import.meta.dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.type === 'entity.parse.failed' ? 'Invalid JSON.' : 'Something went wrong.' });
});

app.listen(PORT, () => console.log(`PublicHelp LK API running on http://localhost:${PORT}`));
