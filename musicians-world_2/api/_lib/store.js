import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Source of truth for lesson requests.
// Production: Upstash Redis (Vercel Marketplace) via its REST API.
// Local dev: a JSON file in .data/ so records survive a server restart.

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const HASH = "mw:lesson_requests";
const dupKey = (lessonId, email) => `mw:lr_pending:${lessonId}:${email}`;

function redisStore() {
  async function cmd(...args) {
    const r = await fetch(REDIS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    return data.result;
  }
  return {
    kind: "redis",
    async claimPending(lessonId, email, id) {
      return (await cmd("SET", dupKey(lessonId, email), id, "NX")) === "OK";
    },
    async releasePending(lessonId, email) {
      await cmd("DEL", dupKey(lessonId, email));
    },
    async put(record) {
      await cmd("HSET", HASH, record.id, JSON.stringify(record));
    },
    async get(id) {
      const raw = await cmd("HGET", HASH, id);
      return raw ? JSON.parse(raw) : null;
    },
    async list() {
      const flat = (await cmd("HGETALL", HASH)) || [];
      const out = [];
      for (let i = 1; i < flat.length; i += 2) out.push(JSON.parse(flat[i]));
      return out;
    },
  };
}

function fileStore() {
  const file = process.env.MW_DATA_FILE || path.join(process.cwd(), ".data", "lesson-requests.json");
  async function load() {
    try {
      return JSON.parse(await readFile(file, "utf8"));
    } catch {
      return { records: {}, pending: {} };
    }
  }
  async function save(db) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(db, null, 2));
  }
  return {
    kind: "file",
    async claimPending(lessonId, email, id) {
      const db = await load();
      const k = dupKey(lessonId, email);
      if (db.pending[k]) return false;
      db.pending[k] = id;
      await save(db);
      return true;
    },
    async releasePending(lessonId, email) {
      const db = await load();
      delete db.pending[dupKey(lessonId, email)];
      await save(db);
    },
    async put(record) {
      const db = await load();
      db.records[record.id] = record;
      await save(db);
    },
    async get(id) {
      return (await load()).records[id] || null;
    },
    async list() {
      return Object.values((await load()).records);
    },
  };
}

export function getStore() {
  if (REDIS_URL && REDIS_TOKEN) return redisStore();
  // A deployed function's filesystem is not durable, so refuse instead of losing data silently.
  if (process.env.VERCEL) return null;
  return fileStore();
}
