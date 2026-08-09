import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const defaultDataFile = path.join(workspaceRoot, 'backend', 'data', 'users.json');

export function createAuthStore(dataFile = defaultDataFile) {
  async function ensureDataFile() {
    await mkdir(path.dirname(dataFile), { recursive: true });

    try {
      const raw = await readFile(dataFile, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await writeFile(dataFile, JSON.stringify([], null, 2));
        return [];
      }

      throw error;
    }
  }

  async function loadUsers() {
    const users = await ensureDataFile();
    return users.map((user) => new User(user));
  }

  async function saveUsers(users) {
    await mkdir(path.dirname(dataFile), { recursive: true });
    await writeFile(dataFile, JSON.stringify(users, null, 2));
  }

  return { loadUsers, saveUsers };
}

export const authStore = createAuthStore();
