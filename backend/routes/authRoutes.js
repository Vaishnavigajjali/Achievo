import express from 'express';
import User from '../models/User.js';
import { authStore } from '../utils/authStore.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const users = await authStore.loadUsers();
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(409).json({ error: 'User already exists.' });
  }

  const user = new User({
    id: Date.now(),
    username,
    password,
    streak: 0,
    lastLoginDate: null
  });

  const updatedUsers = [user, ...users];
  await authStore.saveUsers(updatedUsers);
  res.status(201).json({ username: user.username, streak: user.streak });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await authStore.loadUsers();
  const user = users.find((entry) => entry.username === username && entry.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const today = new Date().toISOString().split('T')[0];
  let streak = user.streak || 0;
  const lastLoginDate = user.lastLoginDate || null;

  if (lastLoginDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastLoginDate === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const updatedUser = { ...user, streak, lastLoginDate: today };
  const updatedUsers = users.map((entry) => (entry.id === user.id ? updatedUser : entry));
  await authStore.saveUsers(updatedUsers);

  res.json({ username: updatedUser.username, streak: updatedUser.streak });
});

export default router;
