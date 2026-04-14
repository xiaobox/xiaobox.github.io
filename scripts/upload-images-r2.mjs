#!/usr/bin/env node
// 把 content/post/**/*.{jpg,png,gif,webp,svg} 上传到 R2。
// Key 命名: post/<slug>/<filename>
// 跳过已存在(用 HeadObject 探测)。
//
// 用法:
//   node --env-file=.env.r2 upload-images-r2.mjs [--dry] [--concurrency 8]

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime-types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const POSTS = resolve(ROOT, 'content/post');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const CONCURRENCY = parseInt(args[args.indexOf('--concurrency') + 1] ?? '8', 10) || 8;

const required = ['R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT'];
for (const k of required) {
  if (!process.env[k]) { console.error(`missing env: ${k}`); process.exit(1); }
}

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.R2_BUCKET;

// Collect all images
const tasks = [];
const dirs = readdirSync(POSTS).filter(d => statSync(resolve(POSTS, d)).isDirectory());
for (const dir of dirs) {
  const postDir = resolve(POSTS, dir);
  const files = readdirSync(postDir).filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
  for (const f of files) {
    const local = resolve(postDir, f);
    const size = statSync(local).size;
    tasks.push({
      slug: dir,
      filename: f,
      local,
      key: `post/${dir}/${f}`,
      size,
    });
  }
}
console.log(`scanned ${tasks.length} images, total ${(tasks.reduce((s,t)=>s+t.size,0)/1024/1024).toFixed(1)} MB`);

if (DRY) {
  console.log('[dry] sample 5:');
  tasks.slice(0,5).forEach(t => console.log(' ', t.key, `(${t.size}b)`));
  process.exit(0);
}

let uploaded = 0, skipped = 0, failed = 0, idx = 0;
const total = tasks.length;
const t0 = Date.now();

async function headExists(key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (e) {
    if (e.$metadata?.httpStatusCode === 404 || e.name === 'NotFound' || e.name === 'NoSuchKey') return false;
    throw e;
  }
}

async function uploadOne(t) {
  if (await headExists(t.key)) {
    skipped++;
    return;
  }
  const ct = mime.lookup(t.filename) || 'application/octet-stream';
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: t.key,
    Body: readFileSync(t.local),
    ContentType: ct,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  uploaded++;
}

async function worker() {
  while (true) {
    const my = idx++;
    if (my >= total) return;
    const t = tasks[my];
    try {
      await uploadOne(t);
    } catch (e) {
      failed++;
      console.warn(`! ${t.key}: ${e.message}`);
    }
    if ((my + 1) % 50 === 0 || my + 1 === total) {
      const dt = (Date.now() - t0) / 1000;
      console.log(`[${my + 1}/${total}] uploaded=${uploaded} skipped=${skipped} failed=${failed} (${dt.toFixed(0)}s, ${((my+1)/dt).toFixed(1)}/s)`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`\ndone. uploaded=${uploaded} skipped=${skipped} failed=${failed}`);
