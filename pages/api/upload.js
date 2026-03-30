import { kv } from "@vercel/kv";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const secret = req.headers["x-agf-secret"] || req.body?.secret;
  if (secret !== process.env.AGF_TRANSCRIPT_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const { filename, html } = req.body;
  if (!filename || !html) return res.status(400).json({ ok: false, error: "Missing fields" });

  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safe.endsWith(".html")) return res.status(400).json({ ok: false });

  // Store in KV - key is filename, value is the HTML
  // Expire after 90 days (90 * 24 * 60 * 60 = 7776000 seconds)
  await kv.set(`tr:${safe}`, html, { ex: 7776000 });

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "";

  return res.json({ ok: true, url: `${baseUrl}/t/${encodeURIComponent(safe)}` });
}
