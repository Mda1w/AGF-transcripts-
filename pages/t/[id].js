export default function TranscriptPage() {
  return null; // handled server-side via getServerSideProps res.send
}

export async function getServerSideProps({ params, res }) {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const safe = decodeURIComponent(id).replace(/[^a-zA-Z0-9._-]/g, "");
    if (!safe.endsWith(".html")) {
      res.statusCode = 400;
      res.end("<h2>Invalid transcript ID</h2>");
      return { props: {} };
    }

    const blobUrl = `https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/transcripts/${safe}`;
    const resp = await fetch(blobUrl);

    if (!resp.ok) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{background:#313338;color:#dcddde;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}.box{text-align:center}.icon{font-size:64px;margin-bottom:16px}.title{font-size:24px;font-weight:700;color:#f2f3f5;margin-bottom:8px}.sub{color:#87898c}</style></head><body><div class="box"><div class="icon">📄</div><div class="title">Transcript Not Found</div><div class="sub">This transcript may have been deleted or the link is invalid.</div></div></body></html>`);
      return { props: {} };
    }

    const html = await resp.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(html);
    return { props: {} };
  } catch (e) {
    res.statusCode = 500;
    res.end("<h2>Server error: " + e.message + "</h2>");
    return { props: {} };
  }
}
