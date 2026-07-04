import React from "react";

/* ------------------------------------------------------------------ *
 *  PLUG YOUR PROJECTS HERE
 *  Three columns, top-to-bottom, exactly like the joseph.cv grid.
 *  Each card:
 *    src      — image/video-poster URL or imported asset. "" = plain placeholder tile.
 *    title    — project name
 *    category — small uppercase label under the title
 *    href     — where the card links
 *    aspect   — cover aspect ratio, e.g. "16 / 10", "1 / 1", "4 / 5"
 *
 *    import notion from "./assets/notion.webp";
 *    COLUMNS[0][0] = { src: notion, title: "Notion", category: "Digital toolmaking", href: "/notion", aspect: "16 / 10" };
 * ------------------------------------------------------------------ */
export const COLUMNS = [
  [
    { src: "", title: "Notion",      category: "Digital toolmaking", href: "#", aspect: "16 / 10" },
    { src: "", title: "Azuki",       category: "Consumer product",   href: "#", aspect: "1 / 1"   },
    { src: "", title: "Skiff",       category: "Productivity",       href: "#", aspect: "16 / 10" },
    { src: "", title: "Cursor AI",   category: "AI code editor",     href: "#", aspect: "16 / 10" },
    { src: "", title: "Thinkspace",  category: "Assistive AI agents",href: "#", aspect: "16 / 9"  },
  ],
  [
    { src: "", title: "Multimodal Search", category: "Brain Technologies", href: "#", aspect: "4 / 5"  },
    { src: "", title: "Skiff Pages",       category: "Editor tool",        href: "#", aspect: "4 / 3"  },
    { src: "", title: "AIGA Hue",          category: "Data visualization", href: "#", aspect: "16 / 10"},
    { src: "", title: "Lighting Engine",   category: "Industrial design",  href: "#", aspect: "4 / 3"  },
  ],
  [
    { src: "", title: "Apple",             category: "Conversational AI",  href: "#", aspect: "16 / 9" },
    { src: "", title: "Brain Technologies",category: "Conversational AI",  href: "#", aspect: "16 / 10"},
    { src: "", title: "Skiff Mail",        category: "Productivity tooling",href: "#", aspect: "4 / 3" },
    { src: "", title: "Pixel Push",        category: "Multiplayer art",    href: "#", aspect: "1 / 1"  },
  ],
];

export default function Portfolio({
  columns = COLUMNS,
  name = "Hafiz Yoosuf",
  homeHref = "Portfolio.dc.html", // set to "/" in your app
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
    <a href={p.href || "#"} style={{ display: "flex", flexDirection: "column", gap: 12, textDecoration: "none", color: "inherit" }}>
      <div style={{ width: "100%", aspectRatio: p.aspect || "16 / 10", background: p.src ? "#ececec" : "#ededeb", overflow: "hidden", borderRadius: 3 }}>
        {p.src ? <img src={p.src} alt={p.title || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 18, lineHeight: "110%", color: "#000" }}>{p.title}</span>
        <span style={{ fontFamily: mono, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a8a8a" }}>{p.category}</span>
      </div>
    </a>
  );

  return (
    <div
      data-portfolio
      ref={rootRef}
      style={{
        position: "relative", width: "100%", minHeight: "100vh", background: "#ffffff",
        display: "flex", flexDirection: "column", padding: "18px 32px 64px",
        fontFamily: sans, color: "#000", boxSizing: "border-box",
      }}
    >
      <style>{`
        [data-portfolio] *{ box-sizing:border-box; }
        @keyframes pf-in{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:translateY(0); } }
        @media (prefers-reduced-motion: reduce){ *{ animation-duration:0.01ms !important; animation-delay:0ms !important; transition-duration:0.01ms !important; } }
        [data-portfolio] a.pf-name:hover{ opacity:0.5; }
        [data-portfolio] .pf-grid{ column-count:3; column-gap:16px; }
        @media (max-width: 900px){
          [data-portfolio] .pf-grid{ column-count:2; }
        }
        @media (max-width: 640px){
          [data-portfolio]{ padding:18px 20px 48px !important; }
          [data-portfolio] .pf-grid{ column-count:1; }
        }
      `}</style>

      {/* HEADER — consistent with the homepage: bold name top-left, links home */}
      <div style={{ display: "flex", alignItems: "center", padding: "4px 0", opacity: 0, animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 0ms forwards" }}>
        <a className="pf-name" href={homeHref} onClick={(e) => fadeNav(e, homeHref)} style={{ fontFamily: sans, fontWeight: 700, fontSize: 20, lineHeight: "100%", color: "#000", textDecoration: "none", transition: "opacity 150ms" }}>{name}</a>
      </div>
      <div style={{ padding: "28px 0 16px", opacity: 0, animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 80ms forwards" }}>
        <span style={{ fontFamily: mono, fontWeight: 500, fontSize: 14, lineHeight: "100%", letterSpacing: "0.08em", color: "#454545" }}>PROJECTS</span>
      </div>

      {/* PROJECT GRID — responsive masonry: 3 cols → 2 (tablet) → 1 (mobile) */}
      <div className="pf-grid">
        {columns.flat().map((p, i) => (
          <div key={i} style={{ breakInside: "avoid", marginBottom: 36, opacity: 0, animation: `pf-in 700ms cubic-bezier(0.16,1,0.3,1) ${140 + i * 45}ms forwards` }}>
            <Card p={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
