import express from 'express';
import Todo from '../models/Todo.js';
import { todoStore } from '../utils/todoStore.js';

const router = express.Router();

function extractUsername(req) {
  return req.query.username || req.header('x-username') || (req.body && req.body.username) || null;
}

router.get('/', async (req, res) => {
  const username = extractUsername(req);
  if (!username) return res.status(400).json({ error: 'username is required' });

  const items = await todoStore.loadTodos();
  const filtered = items.filter((it) => it.username === username);
  res.json(filtered);
});

router.post('/', async (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) return res.status(400).json({ error: 'username and text required' });

  const items = await todoStore.loadTodos();
  const todo = new Todo({ id: Date.now(), username, text, completed: false });
  const updated = [todo, ...items];
  await todoStore.saveTodos(updated);
  res.status(201).json(todo);
});

router.patch('/:id', async (req, res) => {
  const username = extractUsername(req);
  if (!username) return res.status(400).json({ error: 'username is required' });

  const id = Number(req.params.id);
  const { completed, text } = req.body;
  const items = await todoStore.loadTodos();
  const idx = items.findIndex((it) => it.id === id && it.username === username);
  if (idx === -1) return res.status(404).json({ error: 'todo not found' });

  const updatedItem = { ...items[idx] };
  if (typeof completed === 'boolean') updatedItem.completed = completed;
  if (typeof text === 'string') updatedItem.text = text;
  const newItems = items.map((it, i) => (i === idx ? updatedItem : it));
  await todoStore.saveTodos(newItems);
  res.json(updatedItem);
});

router.delete('/:id', async (req, res) => {
  const username = extractUsername(req);
  if (!username) return res.status(400).json({ error: 'username is required' });

  const id = Number(req.params.id);
  const items = await todoStore.loadTodos();
  const updated = items.filter((it) => !(it.id === id && it.username === username));
  await todoStore.saveTodos(updated);
  res.status(204).send();
});

export default router;
