import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AsciiReveal } from "ascii-reveal";
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
      { threshold: 0.05 }
    );

    observer.observe(vid);

    const onVis = () => {
      if (document.hidden) {
        vid.pause();
      } else {
        const rect = vid.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
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
    <article
      className="pf-card"
      data-ascii="surface"
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      <div
        className="pf-media"
        style={{
          width: "100%",
          background: "#171717",
          overflow: "hidden",
          borderRadius: "3px",
          position: "relative",
        }}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={project.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedMetadata={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => { });
            }}
            style={{ width: "100%", height: "auto", display: "block", willChange: "transform", transform: "translateZ(0)" }}
          />
        ) : (
          <img
            src={project.src}
            alt={`${project.title} project preview`}
            decoding="async"
            style={{ width: "100%", height: "auto", display: "block" }}
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
          data-ascii="fade"
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
    <AsciiReveal
      as="main"
      preset="dither"
      duration="cinematic"
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
          padding: "4px 0",
        }}
      >
        <Link to="/" className="brand-link" data-ascii="fade">
          Hafiz Yoosuf
        </Link>
      </header>

      <div
        style={{
          padding: "28px 0 16px",
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
        {PROJECT_COLUMNS.flat().map((p) => (
          <div
            key={p.id}
            style={{
              breakInside: "avoid",
              marginBottom: "42px",
            }}
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </section>
    </AsciiReveal>
  );
}
