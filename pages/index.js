export default function Home() {
  return (
    <div style={{
      background: "#313338", color: "#dcddde", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'gg sans','Noto Sans',Whitney,'Helvetica Neue',Arial,sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎟️</div>
        <h1 style={{ color: "#f2f3f5", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          AGF Transcripts
        </h1>
        <p style={{ color: "#87898c", fontSize: 16 }}>
          Ticket transcripts for Anti Gangs Force
        </p>
      </div>
    </div>
  );
}
