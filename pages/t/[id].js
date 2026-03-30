import { kv } from "@vercel/kv";

export default function Page() { return null; }

export async function getServerSideProps({ params, res }) {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const safe = decodeURIComponent(id).replace(/[^a-zA-Z0-9._-]/g, "");

  if (!safe.endsWith(".html")) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/html");
    res.end("<h2>Invalid</h2>");
    return { props: {} };
  }

  const html = await kv.get(`tr:${safe}`);

  if (!html) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{background:#313338;color:#dcddde;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}.b{text-align:center}</style></head><body><div class="b"><div style="font-size:64px">📄</div><h2 style="color:#f2f3f5;margin:16px 0 8px">Transcript Not Found</h2><p style="color:#87898c">This transcript may have expired or the link is invalid.</p></div></body></html>`);
    return { props: {} };
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(html);
  return { props: {} };
}
