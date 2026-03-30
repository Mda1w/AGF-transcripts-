import { put } from "@vercel/blob";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  // Verify secret
  const secret = req.headers["x-agf-secret"] || req.body?.secret;
  if (secret !== process.env.AGF_TRANSCRIPT_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const { filename, html } = req.body;
  if (!filename || !html) return res.status(400).json({ ok: false, error: "Missing filename or html" });

  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safe.endsWith(".html")) return res.status(400).json({ ok: false });

  try {
    const blob = await put(`transcripts/${safe}`, html, {
      access: "public",
      contentType: "text/html; charset=utf-8",
    });

    const publicUrl = `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""}/t/${encodeURIComponent(safe)}`;
    return res.json({ ok: true, url: publicUrl, blobUrl: blob.url });
  } catch (e) {
    console.error("Upload error:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
