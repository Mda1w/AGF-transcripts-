export default function Page() { return null; }

export async function getServerSideProps({ params, res }) {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const safe = decodeURIComponent(id).replace(/[^a-zA-Z0-9._-]/g, "");
    if (!safe.endsWith(".html")) {
      res.statusCode = 400; res.end("<h2>Invalid</h2>"); return { props: {} };
    }

    // Fetch from Vercel Blob public URL
    const blobBase = process.env.BLOB_STORE_URL;
    if (!blobBase) {
      res.statusCode = 500; res.end("<h2>Blob store not configured</h2>"); return { props: {} };
    }

    const url = `${blobBase}/transcripts/${safe}`;
    const resp = await fetch(url);

    if (!resp.ok) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{background:#313338;color:#dcddde;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}</style></head><body><div style="text-align:center"><div style="font-size:64px;margin-bottom:16px">📄</div><h2 style="color:#f2f3f5;margin-bottom:8px">Transcript Not Found</h2><p style="color:#87898c">This transcript may have expired or the link is invalid.</p></div></body></html>`);
      return { props: {} };
    }

    const html = await resp.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(html);
    return { props: {} };
  } catch (e) {
    res.statusCode = 500; res.end(`<h2>Error: ${e.message}</h2>`); return { props: {} };
  }
}
