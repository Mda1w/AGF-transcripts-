import { put } from "@vercel/blob";

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

  const blob = await put(`transcripts/${safe}`, html, {
    access: "public",
    contentType: "text/html; charset=utf-8",
    addRandomSuffix: false,
  });

  const baseUrl = "https://agf-transcripts.vercel.app";
  return res.json({ ok: true, url: `${baseUrl}/t/${encodeURIComponent(safe)}`, blobUrl: blob.url });
}
