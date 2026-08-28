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

function VideoPreview({ project, onProgress, onReady }) {
  const videoRef = React.useRef(null);

  const syncProgress = (event) => {
    const video = event.currentTarget;
    const buffered = video.duration && video.buffered.length
      ? video.buffered.end(video.buffered.length - 1) / video.duration
      : 0;
    onProgress(project.src, Math.max(0.12, Math.min(buffered, 0.92)));
  };

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
      onLoadedData={(event) => { onProgress(project.src, 0.65); syncProgress(event); }}
      onProgress={syncProgress}
      onCanPlay={(event) => { onProgress(project.src, 0.9); syncProgress(event); }}
      onCanPlayThrough={() => { onProgress(project.src, 1); onReady(project.src); }}
      onError={() => onReady(project.src)}
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
  const videoProjects = React.useMemo(
    () => columns.flat().filter((project) => project.mediaType === "video"),
    [columns],
  );
  const [videoProgress, setVideoProgress] = React.useState(() => Object.fromEntries(videoProjects.map((project) => [project.src, 0])));
  const [readyVideos, setReadyVideos] = React.useState(() => new Set());
  const [isLoading, setIsLoading] = React.useState(videoProjects.length > 0);
  const readyCount = readyVideos.size;
  const loadingProgress = videoProjects.length
    ? videoProjects.reduce((total, project) => total + (videoProgress[project.src] || 0), 0) / videoProjects.length
    : 1;

  const handleVideoProgress = React.useCallback((src, value) => {
    setVideoProgress((current) => ({ ...current, [src]: Math.max(current[src] || 0, value) }));
  }, []);

  const handleVideoReady = React.useCallback((src) => {
    setReadyVideos((current) => {
      if (current.has(src)) return current;
      const next = new Set(current);
      next.add(src);
      return next;
    });
    handleVideoProgress(src, 1);
  }, [handleVideoProgress]);

  React.useEffect(() => {
    if (!videoProjects.length || readyCount < videoProjects.length) return undefined;
    const timer = window.setTimeout(() => setIsLoading(false), 220);
    return () => window.clearTimeout(timer);
  }, [readyCount, videoProjects.length]);

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
          <VideoPreview project={p} onProgress={handleVideoProgress} onReady={handleVideoReady} />
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
        [data-portfolio] .pf-loader{ position:fixed; inset:0; z-index:20; display:grid; place-items:center; padding:24px; background:#fff; transition:opacity 420ms ease, visibility 420ms ease; }
        [data-portfolio] .pf-loader.is-hidden{ opacity:0; visibility:hidden; pointer-events:none; }
        [data-portfolio] .pf-loader-inner{ width:min(100%, 360px); }
        [data-portfolio] .pf-loader-heading{ display:flex; justify-content:space-between; gap:20px; margin-bottom:12px; font-family:${mono}; font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:#454545; }
        [data-portfolio] .pf-loader-track{ height:2px; overflow:hidden; background:#e3e3e1; }
        [data-portfolio] .pf-loader-progress{ width:100%; height:100%; background:#000; transform-origin:left center; transition:transform 220ms ease; }
        [data-portfolio] .pf-loader-meta{ margin-top:10px; font-family:${mono}; font-size:11px; color:#777; }
        @media (prefers-reduced-motion: reduce){ *{ animation-duration:0.01ms !important; animation-delay:0ms !important; transition-duration:0.01ms !important; } }
        [data-portfolio] a.pf-name:hover{ opacity:0.5; }
        [data-portfolio] .pf-grid{ column-count:3; column-gap:16px; }
        [data-portfolio] .pf-media{ transition:transform 220ms ease, box-shadow 220ms ease; }
        [data-portfolio] .pf-card:hover .pf-media{ transform:translateY(-2px); box-shadow:0 10px 22px rgba(0,0,0,0.10); }
        @media (max-width:900px){ [data-portfolio] .pf-grid{ column-count:2; } }
        @media (max-width:640px){ [data-portfolio]{ padding:18px 20px 48px !important; } [data-portfolio] .pf-grid{ column-count:1; } }
      `}</style>

      <div className={`pf-loader${isLoading ? "" : " is-hidden"}`} data-pf-loader aria-live="polite" aria-label="Loading project videos">
        <div className="pf-loader-inner">
          <div className="pf-loader-heading">
            <span>Loading motion</span>
            <span>{Math.round(loadingProgress * 100)}%</span>
          </div>
          <div className="pf-loader-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(loadingProgress * 100)}>
            <div className="pf-loader-progress" style={{ transform: `scaleX(${Math.max(loadingProgress, 0.02)})` }} />
          </div>
          <div className="pf-loader-meta">{readyCount} / {videoProjects.length} videos ready</div>
        </div>
      </div>

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
