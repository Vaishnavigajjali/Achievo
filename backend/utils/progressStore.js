import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Progress from '../models/Progress.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const defaultDataFile = path.join(workspaceRoot, 'backend', 'data', 'progress.json');

export function createProgressStore(dataFile = defaultDataFile) {
  async function ensureDataFile() {
    await mkdir(path.dirname(dataFile), { recursive: true });

    try {
      const raw = await readFile(dataFile, 'utf8');
      const parsed = JSON.parse(raw);
      // migrate old entries that lack a `username` field
      if (Array.isArray(parsed) && parsed.some((e) => !Object.prototype.hasOwnProperty.call(e, 'username'))) {
        const migrated = parsed.map((e) => ({ ...e, username: e.username || null }));
        await writeFile(dataFile, JSON.stringify(migrated, null, 2));
        return migrated;
      }

      return parsed;
    } catch (error) {
      if (error.code === 'ENOENT') {
        const seedEntries = [
          new Progress({ id: 1, title: 'Completed onboarding module', minutes: 45, note: 'Finished the first learning milestone.', username: 'system' }),
          new Progress({ id: 2, title: 'Built the project skeleton', minutes: 60, note: 'Set up the frontend and backend structure.', username: 'system' })
        ];
        await writeFile(dataFile, JSON.stringify(seedEntries, null, 2));
        return seedEntries;
      }

      throw error;
    }
  }

  async function loadProgressEntries() {
    const entries = await ensureDataFile();
    return entries.map((entry) => new Progress(entry));
  }

  async function saveProgressEntries(entries) {
    await mkdir(path.dirname(dataFile), { recursive: true });
    await writeFile(dataFile, JSON.stringify(entries, null, 2));
  }

  return {
    loadProgressEntries,
    saveProgressEntries
  };
}

export const progressStore = createProgressStore();
