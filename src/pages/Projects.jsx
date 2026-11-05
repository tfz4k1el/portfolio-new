import React from "react";
import { Link } from "react-router-dom";
import { PROJECTS, PROJECT_COLUMNS } from "../data/projects";

const SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

function ProjectCard({ project }) {
  const isVideo = project.mediaType === "video";

  return (
    <article className="pf-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        className="pf-media"
        style={{
          width: "100%",
          aspectRatio: project.aspect || "16 / 10",
          background: "#171717",
          overflow: "hidden",
          borderRadius: "3px",
        }}
      >
        {isVideo ? (
          <video
            src={project.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <img
            src={project.src}
            alt={`${project.title} project preview`}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
        background: "#0a0a0a",
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
          opacity: 0,
          animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 0ms forwards",
        }}
      >
        <Link to="/" className="brand-link">
          Hafiz Yoosuf
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
