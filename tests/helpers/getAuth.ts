import fs from 'fs';
import path from 'path';

export type Auth = { login: string; password: string };

export function getAuth(): Auth {
  const p = path.resolve(__dirname, '../../auth.json');
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw) as Auth;
  } catch (e) {
    throw new Error(`Cannot read auth.json at ${p}: ${String(e)}`);
  }
}
