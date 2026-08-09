import express from 'express';
import Progress from '../models/Progress.js';
import { progressStore } from '../utils/progressStore.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const username = req.query.username || req.header('x-username');
  if (!username) return res.status(400).json({ error: 'username query param required' });

  const progressEntries = await progressStore.loadProgressEntries();
  const filtered = progressEntries.filter((entry) => entry.username === username);
  res.json(filtered);
});

router.post('/', async (req, res) => {
  const username = req.body.username || req.header('x-username');
  if (!username) return res.status(400).json({ error: 'username required in body' });

  const progressEntries = await progressStore.loadProgressEntries();
  const entry = new Progress({
    id: Date.now(),
    title: req.body.title,
    minutes: req.body.minutes,
    note: req.body.note || '',
    username
  });

  const updatedEntries = [entry, ...progressEntries];
  await progressStore.saveProgressEntries(updatedEntries);
  res.status(201).json(entry);
});

router.delete('/:id', async (req, res) => {
  const username = req.query.username || req.header('x-username') || req.body.username;
  if (!username) return res.status(400).json({ error: 'username required' });

  const progressEntries = await progressStore.loadProgressEntries();
  const updatedEntries = progressEntries.filter((entry) => !(entry.id === Number(req.params.id) && entry.username === username));
  await progressStore.saveProgressEntries(updatedEntries);
  res.status(204).send();
});

export default router;
