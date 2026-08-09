import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Todo from '../models/Todo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const defaultDataFile = path.join(workspaceRoot, 'backend', 'data', 'todos.json');

export function createTodoStore(dataFile = defaultDataFile) {
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

  async function loadTodos() {
    const items = await ensureDataFile();
    return items.map((it) => new Todo(it));
  }

  async function saveTodos(items) {
    await mkdir(path.dirname(dataFile), { recursive: true });
    await writeFile(dataFile, JSON.stringify(items, null, 2));
  }

  return { loadTodos, saveTodos };
}

export const todoStore = createTodoStore();
