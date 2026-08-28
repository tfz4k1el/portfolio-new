import React from "react";

// The projects page deliberately uses the same project source as the home-page
// strip, so a project is never represented differently after navigation.
export const PROJECTS = [
  {
    src: "./assets/projects/motion/Infinity.mp4", mediaType: "video",
    title: "Infinity", category: "Motion · Identity", aspect: "16 / 9",
    description: "A motion identity built on the logic of continuation — easing standards, loop architecture, and timing that holds across every brand touchpoint.",
  },
  {
    src: "./assets/projects/ui/Noveo.png", mediaType: "image",
    title: "Noveo", category: "UI · SaaS", aspect: "16 / 10",
    description: "End-to-end interface design for a B2B platform. A component system built for scale, with navigation that reduces cognitive load at every tier.",
  },
  {
    src: "./assets/projects/motion/StockBud.mp4", mediaType: "video",
    title: "StockBud", category: "Motion · Fintech", aspect: "16 / 9",
    description: "Motion design for a fintech trading app — data-driven charts, transitions, and real-time feedback that communicate momentum.",
  },
  {
    src: "./assets/projects/ui/Vire.png", mediaType: "image",
    title: "Vire", category: "UI · Web3", aspect: "16 / 10",
    description: "Interface design for a decentralised platform. A clean system that abstracts blockchain complexity and friction.",
  },
  {
    src: "./assets/projects/motion/T2Chat.mp4", mediaType: "video",
    title: "T2Chat", category: "Motion · AI", aspect: "16 / 9",
    description: "A motion system for AI messaging, tuned to make response latency feel intentional instead of like waiting.",
  },
  {
    src: "./assets/projects/ui/asmitha.png", mediaType: "image",
    title: "Asmitha", category: "UI · Portfolio", aspect: "16 / 10",
    description: "A typography-led portfolio for a creative professional, with motion that surfaces work without getting in the way.",
  },
  {
    src: "./assets/projects/motion/Vireclub.mp4", mediaType: "video",
    title: "Vireclub", category: "Motion · Community", aspect: "16 / 9",
    description: "A web3 community motion identity, built with subtle animations that reinforce an earned sense of exclusivity.",
  },
  {
    src: "./assets/projects/ui/nxhuman.png", mediaType: "image",
    title: "NxHuman", category: "UI · Agency", aspect: "16 / 10",
    description: "A design-agency website with a bold type system, restrained colour, and motion that demonstrates craft rather than describing it.",
  },
];

export const COLUMNS = [
  [PROJECTS[0], PROJECTS[3], PROJECTS[6]],
  [PROJECTS[1], PROJECTS[4], PROJECTS[7]],
  [PROJECTS[2], PROJECTS[5]],
];

function VideoPreview({ project }) {
  const videoRef = React.useRef(null);

  const keepMuted = (event) => {
    if (!event.currentTarget.muted) event.currentTarget.muted = true;
  };

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.load();

    const playRequest = video.play();
    if (playRequest && typeof playRequest.catch === "function") playRequest.catch(() => {});

    return undefined;
  }, [project.src]);

  return (
    <video
      ref={videoRef}
      data-pf-video={project.src}
      src={project.src}
      autoPlay
      muted
      defaultMuted
      loop
      playsInline
      preload="auto"
      onVolumeChange={keepMuted}
      aria-label={`${project.title} project preview`}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

export default function Portfolio({
  columns = COLUMNS,
  name = "Hafiz Yoosuf",
  homeHref = "Portfolio.dc.html",
}) {
  const rootRef = React.useRef(null);

  const fadeNav = (e, href) => {
    e.preventDefault();
    const el = rootRef.current;
    if (!el) { window.location.href = href; return; }
    el.style.transition = "opacity 260ms ease";
    el.style.opacity = "0";
    setTimeout(() => { window.location.href = href; }, 270);
  };
  const sans = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  const mono = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

  const Card = ({ p }) => (
    <article className="pf-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="pf-media" style={{ width: "100%", aspectRatio: p.aspect || "16 / 10", background: "#ededeb", overflow: "hidden", borderRadius: 3 }}>
        {p.mediaType === "video" ? (
          <VideoPreview project={p} />
        ) : (
          <img src={p.src} alt={`${p.title} project preview`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h2 style={{ margin: 0, fontFamily: sans, fontWeight: 600, fontSize: 18, lineHeight: "110%", color: "#000" }}>{p.title}</h2>
        <span style={{ fontFamily: mono, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666" }}>{p.category}</span>
        <p style={{ margin: "6px 0 0", fontFamily: sans, fontWeight: 400, fontSize: 14, lineHeight: "145%", color: "#454545" }}>{p.description}</p>
      </div>
    </article>
  );

  return (
    <main data-portfolio ref={rootRef} style={{ position: "relative", width: "100%", minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", padding: "18px 32px 64px", fontFamily: sans, color: "#000", boxSizing: "border-box" }}>
      <style>{`
        [data-portfolio] *{ box-sizing:border-box; }
        @keyframes pf-in{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:translateY(0); } }
        @media (prefers-reduced-motion: reduce){ *{ animation-duration:0.01ms !important; animation-delay:0ms !important; transition-duration:0.01ms !important; } }
        [data-portfolio] a.pf-name:hover{ opacity:0.5; }
        [data-portfolio] .pf-grid{ column-count:3; column-gap:16px; }
        [data-portfolio] .pf-media{ transition:transform 220ms ease, box-shadow 220ms ease; }
        [data-portfolio] .pf-card:hover .pf-media{ transform:translateY(-2px); box-shadow:0 10px 22px rgba(0,0,0,0.10); }
        @media (max-width:900px){ [data-portfolio] .pf-grid{ column-count:2; } }
        @media (max-width:640px){ [data-portfolio]{ padding:18px 20px 48px !important; } [data-portfolio] .pf-grid{ column-count:1; } }
      `}</style>

      <header style={{ display: "flex", alignItems: "center", padding: "4px 0", opacity: 0, animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 0ms forwards" }}>
        <a className="pf-name" href={homeHref} onClick={(e) => fadeNav(e, homeHref)} style={{ fontFamily: sans, fontWeight: 700, fontSize: 20, lineHeight: "100%", color: "#000", textDecoration: "none", transition: "opacity 150ms" }}>{name}</a>
      </header>
      <div style={{ padding: "28px 0 16px", opacity: 0, animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 80ms forwards" }}>
        <span style={{ fontFamily: mono, fontWeight: 500, fontSize: 14, lineHeight: "100%", letterSpacing: "0.08em", color: "#454545" }}>PROJECTS · 08</span>
      </div>
      <section className="pf-grid" aria-label="Selected projects">
        {columns.flat().map((p, i) => (
          <div key={p.title} style={{ breakInside: "avoid", marginBottom: 42, opacity: 0, animation: `pf-in 700ms cubic-bezier(0.16,1,0.3,1) ${140 + i * 45}ms forwards` }}>
            <Card p={p} />
          </div>
        ))}
      </section>
    </main>
  );
}
