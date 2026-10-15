import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const fields = ["firstName", "lastName", "email", "prefix", "phone", "role"] as const;

// Phase 1: demo requests are stored locally in data/demo-requests.jsonl (git-ignored).
// Replace with database or email delivery when the backend is built.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const entry: Record<string, string> = {};
  for (const key of fields) {
    entry[key] = String(body[key] ?? "").trim().slice(0, 200);
  }
  if (!entry.firstName || !entry.lastName || !entry.phone || !/^\S+@\S+\.\S+$/.test(entry.email) || body.consent !== "on") {
    return Response.json({ ok: false }, { status: 422 });
  }

  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "demo-requests.jsonl"), JSON.stringify({ ...entry, at: new Date().toISOString() }) + "\n");
  return Response.json({ ok: true });
}
