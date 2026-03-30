export default function Page() { return null; }

export async function getServerSideProps({ params, res }) {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const safe = decodeURIComponent(id).replace(/[^a-zA-Z0-9._-]/g, "");
    if (!safe.endsWith(".html")) {
      res.statusCode = 400; res.setHeader("Content-Type","text/html"); res.end("<h2>Invalid</h2>"); return { props: {} };
    }

    const blobBase = process.env.BLOB_STORE_URL || "https://fqil4oporztb64ks.public.blob.vercel-storage.com";
    const url = `${blobBase}/transcripts/${safe}`;
    const resp = await fetch(url);

    if (!resp.ok) {
      res.statusCode = 404;
      res.setHeader("Content-Type","text/html; charset=utf-8");
      res.end(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Not Found</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#313338;color:#dcddde;font-family:Whitney,'Helvetica Neue',Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}</style></head><body><div style="text-align:center"><div style="font-size:72px;margin-bottom:20px">📄</div><h2 style="color:#f2f3f5;font-size:24px;margin-bottom:8px">Transcript Not Found</h2><p style="color:#87898c">This transcript has expired or the link is invalid.</p></div></body></html>`);
      return { props: {} };
    }

    const html = await resp.text();
    // Serve as HTML — this is the key fix, forces browser to render not download
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.end(html);
    return { props: {} };
  } catch(e) {
    res.statusCode = 500;
    res.setHeader("Content-Type","text/html");
    res.end(`<h2 style="color:red">Error: ${e.message}</h2>`);
    return { props: {} };
  }
}
