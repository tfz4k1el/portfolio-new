import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { PROJECTS, PROJECT_COLUMNS } from "../data/projects";

const SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

function ProjectCard({ project }) {
  const isVideo = project.mediaType === "video";
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isVideo || !videoRef.current || !("IntersectionObserver" in window)) return;
    const vid = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !document.hidden) {
            vid.play().catch(() => { });
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.05, rootMargin: "150px 0px" }
    );

    observer.observe(vid);

    const onVis = () => {
      if (document.hidden) {
        vid.pause();
      } else {
        const rect = vid.getBoundingClientRect();
        if (rect.bottom > -150 && rect.top < window.innerHeight + 150) {
          vid.play().catch(() => { });
        }
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [isVideo]);

  return (
    <article className="pf-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        className="pf-media"
        style={{
          width: "100%",
          aspectRatio: project.aspect || (isVideo ? "16 / 9" : "16 / 10"),
          background: "#120e10",
          overflow: "hidden",
          borderRadius: "4px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "3px 8px",
            borderRadius: "999px",
            background: "rgba(8, 4, 6, 0.65)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            fontFamily: MONO,
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: isVideo ? "var(--accent)" : "#d4d4d8",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {isVideo ? "MOTION" : project.category.includes("Game") ? "GAME" : "INTERFACE"}
        </div>
        {isVideo ? (
          <video
            ref={videoRef}
            src={project.src}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedMetadata={(e) => {
              e.currentTarget.muted = true;
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          />
        ) : (
          <img
            src={project.src}
            alt={`${project.title} project preview`}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "18px",
            lineHeight: "110%",
            color: "#ffffff",
            transition: "color 200ms ease",
          }}
        >
          {project.title}
        </h2>
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8a8a8a",
          }}
        >
          {project.category}
        </span>
        <p
          style={{
            margin: "6px 0 0",
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "145%",
            color: "#a1a1aa",
          }}
        >
          {project.description}
        </p>
      </div>
    </article>
  );
}

export default function Projects() {
  const countStr = PROJECTS.length.toString().padStart(2, "0");

  return (
    <main
      data-portfolio
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        padding: "18px 32px 64px",
        fontFamily: SANS,
        color: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 0",
          opacity: 0,
          animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 0ms forwards",
        }}
      >
        <Link to="/" className="brand-link">
          Hafiz Yoosuf
        </Link>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#8a8a8a",
            textDecoration: "none",
            fontFamily: MONO,
            fontSize: "12px",
            letterSpacing: "0.06em",
            transition: "color 180ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8a8a")}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          BACK
        </Link>
      </header>

      <div
        style={{
          padding: "28px 0 16px",
          opacity: 0,
          animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 80ms forwards",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0.08em",
            color: "#8a8a8a",
          }}
        >
          PROJECTS · {countStr}
        </span>
      </div>

      <section className="pf-grid" aria-label="Selected projects">
        {PROJECT_COLUMNS.flat().map((p, i) => (
          <div
            key={p.id}
            style={{
              breakInside: "avoid",
              marginBottom: "42px",
              opacity: 0,
              animation: `pf-in 700ms cubic-bezier(0.16,1,0.3,1) ${140 + i * 45}ms forwards`,
            }}
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </section>
    </main>
  );
}
