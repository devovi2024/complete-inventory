import 'dotenv/config';
import { execFile } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { promisify } from 'node:util';
const exec = promisify(execFile); const target = `backups/${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}`;
await mkdir(target, { recursive: true });
if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
await exec('mongodump', ['--uri', process.env.MONGO_URI, '--out', target], { windowsHide: true });
console.log(`MongoDB backup written to ${target}`);
