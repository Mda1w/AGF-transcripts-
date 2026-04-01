import { put } from "@vercel/blob";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  try {
    const { data, name } = req.body;
    if (!data || !name) return res.status(400).json({ ok: false });
    // data is base64 data URL
    const base64 = data.split(",")[1];
    const mimeMatch = data.match(/data:([^;]+);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const buf = Buffer.from(base64, "base64");
    const filename = `appeal-proofs/${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
    const blob = await put(filename, buf, { access: "public", contentType: mime, addRandomSuffix: false });
    return res.json({ ok: true, url: blob.url });
  } catch(e) {
    return res.json({ ok: false, error: e.message });
  }
}
