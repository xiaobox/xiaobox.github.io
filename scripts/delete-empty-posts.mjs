#!/usr/bin/env node
// 删除 /tmp/wx-data/empty.json 列出的文章目录,
// 并删除它们对应在 R2 上的图片(prefix: post/<slug>/).
//
// 用法:
//   node --env-file=.env.r2 delete-empty-posts.mjs [--dry]

import { readFileSync, rmSync, existsSync } from 'fs';
import { resolve } from 'path';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const args = process.argv.slice(2);
const DRY = args.includes('--dry');

const required = ['R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT'];
for (const k of required) if (!process.env[k]) { console.error(`missing env: ${k}`); process.exit(1); }

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.R2_BUCKET;

const empty = JSON.parse(readFileSync('/tmp/wx-data/empty.json', 'utf8'));
console.log(`will delete ${empty.length} posts`);

let dirsRemoved = 0, r2KeysRemoved = 0;

for (const item of empty) {
  const dir = resolve('content/post', item.dir);
  // List R2 keys with prefix
  const prefix = `post/${item.dir}/`;
  let keys = [];
  let cont;
  do {
    const r = await client.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, ContinuationToken: cont }));
    if (r.Contents) keys = keys.concat(r.Contents.map((o) => o.Key));
    cont = r.NextContinuationToken;
  } while (cont);

  console.log(`  ${item.dir}  (md plain ${item.plainLen}c, R2 keys ${keys.length})`);

  if (DRY) continue;

  // Delete R2 keys
  if (keys.length) {
    await client.send(new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: { Objects: keys.map((Key) => ({ Key })) },
    }));
    r2KeysRemoved += keys.length;
  }

  // Delete local dir
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    dirsRemoved++;
  }
}

console.log(`\ndone${DRY ? ' (dry)' : ''}. dirs removed=${dirsRemoved}, R2 keys removed=${r2KeysRemoved}`);
