import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import BinaryRadarLoader from "../components/BinaryRadarLoader";

const LASTFM_USER = "Zafkiel69";
const LASTFM_KEY = "c34fdb3897e465413e4fbf9d94b8da85";

export default function Home() {
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const panelRef = useRef(null);
  const tooltipRef = useRef(null);
  const socialsRef = useRef(null);
  const socialsWrapRef = useRef(null);
  const blogNoteRef = useRef(null);
  const leftColRef = useRef(null);

  const [socialsOpen, setSocialsOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [nowArtist, setNowArtist] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Motion designer scramble and radar states
  const [scrambleDone, setScrambleDone] = useState(false);
  const [linksReady, setLinksReady] = useState(false);
  const [showRadarLoader, setShowRadarLoader] = useState(true);
  const [isWiping, setIsWiping] = useState(false);

  // Lazy loading binary radar: 4 loops of 0.8s = 3.2s total
  useEffect(() => {
    // At 2.4s (start of 4th loop): zeroes wiped out by ones, media wipes in
    const wipeTimer = setTimeout(() => {
      setIsWiping(true);
    }, 2400);

    // At 3.2s (end of 4th loop): wipe complete, unmount loader
    const completeTimer = setTimeout(() => {
      setShowRadarLoader(false);
    }, 3200);

    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  // Drift loop animation references
  const clockRef = useRef(0);
  const lastTsRef = useRef(null);
  const hoveringRef = useRef(false);
  const realMouseOverRef = useRef(false);
  const rafRef = useRef(null);
  const maxShiftRef = useRef([0, 0, 0, 0]);

  // Seeded drift parameters - calibrated for smooth, gentle, subtle drift
  const paramsRef = useRef([
    { amplitude: 22 + 0.137 * 18, period: 8000 + 0.642 * 5000, phase: 0.871 * Math.PI * 2 },
    { amplitude: 22 + 0.642 * 18, period: 8000 + 0.318 * 5000, phase: 0.137 * Math.PI * 2 },
    { amplitude: 22 + 0.318 * 18, period: 8000 + 0.871 * 5000, phase: 0.642 * Math.PI * 2 },
    { amplitude: 22 + 0.871 * 18, period: 8000 + 0.137 * 5000, phase: 0.318 * Math.PI * 2 },
  ]);

  const strips = useCallback(() => {
    const root = containerRef.current;
    if (!root) return [];
    return [0, 1, 2, 3].map((i) => root.querySelector(`[data-strip="${i}"]`));
  }, []);

  const measure = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    maxShiftRef.current = [0, 1, 2, 3].map((i) => {
      const strip = root.querySelector(`[data-strip="${i}"]`);
      if (!strip || !strip.parentElement) return Infinity;
      return Math.max(0, (strip.scrollWidth - strip.parentElement.clientWidth) / 2);
    });
  }, []);

  const driftX = useCallback((i) => {
    const p = paramsRef.current[i];
    if (!p) return 0;
    const m = maxShiftRef.current[i] ?? Infinity;
    const amp = Math.min(p.amplitude, isFinite(m) ? m : p.amplitude);
    return amp * Math.sin((clockRef.current / p.period) * Math.PI * 2 + p.phase);
  }, []);

  const startLoop = useCallback(() => {
    lastTsRef.current = null;
    const step = (ts) => {
      if (hoveringRef.current) {
        rafRef.current = null;
        return;
      }
      if (lastTsRef.current == null) lastTsRef.current = ts;
      clockRef.current += ts - lastTsRef.current;
      lastTsRef.current = ts;

      const stripElements = strips();
      stripElements.forEach((el, i) => {
        if (el) el.style.transform = `translate3d(${driftX(i).toFixed(2)}px, 0, 0)`;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [strips, driftX]);

  // Hover handlers for drifting panel
  const handleEnter = useCallback((e) => {
    realMouseOverRef.current = true;
    hoveringRef.current = true;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const t = tooltipRef.current;
    if (t) {
      if (e && e.clientX != null) {
        t.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 18}px)`;
      }
      t.style.opacity = "1";
    }

    if (panelRef.current && window.innerWidth > 900) {
      const s = strips()[0];
      panelRef.current.style.width = (s ? s.scrollWidth : 784) + "px";
      panelRef.current.style.maxWidth = "70vw";
    }

    strips().forEach((el, i) => {
      if (!el) return;
      const x = driftX(i);
      el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      void el.offsetWidth;
      el.style.transition = "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "translate3d(0px, 0, 0)";
    });
  }, [strips, driftX]);

  const handleLeave = useCallback(() => {
    realMouseOverRef.current = false;
    hoveringRef.current = false;
    if (tooltipRef.current) tooltipRef.current.style.opacity = "0";

    if (panelRef.current && window.innerWidth > 900) {
      panelRef.current.style.width = "486px";
      panelRef.current.style.maxWidth = "48vw";
    }

    strips().forEach((el) => {
      if (el) el.style.transition = "none";
    });

    setTimeout(() => measure(), 950);
    startLoop();
  }, [strips, measure, startLoop]);

  // Initial projects bar hover hold for 3.0s, then smooth release and drift
  useEffect(() => {
    hoveringRef.current = true;
    if (panelRef.current && window.innerWidth > 900) {
      panelRef.current.style.width = "784px";
      panelRef.current.style.maxWidth = "70vw";
    }
    strips().forEach((el) => {
      if (el) el.style.transform = "translate3d(0px, 0, 0)";
    });

    // Release projects bar after 4th loop wipe completes (3.4s)
    const releaseTimer = setTimeout(() => {
      if (!realMouseOverRef.current) {
        handleLeave();
      }
    }, 3400);

    return () => clearTimeout(releaseTimer);
  }, [handleLeave, strips]);

  // Full-website Text Scramble Animation Engine:
  // Staggered top-to-bottom, left-to-right across 1.6s
  // Mix of random Latin letters and Japanese Katakana, flashing in accent color #f34951,
  // turning white #ffffff right before locking into final character.
  useEffect(() => {
    const leftEl = leftColRef.current;
    if (!leftEl) return;

    const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&?";
    const getRandomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

    const targets = Array.from(leftEl.querySelectorAll("[data-scramble]"));
    const charItems = [];

    targets.forEach((target) => {
      const text = target.textContent;
      const finalColor = target.getAttribute("data-final-color") || "#ffffff";
      target.textContent = "";

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const s = document.createElement("span");
        s.textContent = ch;
        // Space characters remain visible to guarantee zero layout shift
        s.style.visibility = ch === " " ? "visible" : "hidden";
        target.appendChild(s);
        charItems.push({
          el: s,
          char: ch,
          finalColor,
          top: 0,
          left: 0,
        });
      }
    });

    // Measure screen coordinates for exact 2D reading order
    charItems.forEach((item) => {
      const r = item.el.getBoundingClientRect();
      item.top = r.top;
      item.left = r.left;
    });

    // Sort by line (tolerance 8px), then left-to-right
    charItems.sort((a, b) => {
      if (Math.abs(a.top - b.top) > 8) {
        return a.top - b.top;
      }
      return a.left - b.left;
    });

    const total = charItems.length;
    const startMs = 40;
    const endMs = 2000;

    charItems.forEach((item, index) => {
      const tResolve = startMs + (index / Math.max(total - 1, 1)) * (endMs - startMs);
      const tScramble = Math.max(0, tResolve - 160);
      const tWhite = tResolve - 45;
      item.tResolve = tResolve;
      item.tScramble = tScramble;
      item.tWhite = tWhite;
    });

    let startTs = null;
    let animId = null;

    const step = (ts) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;

      for (let i = 0; i < total; i++) {
        const item = charItems[i];
        if (item.char === " ") continue;

        if (elapsed < item.tScramble) {
          item.el.style.visibility = "hidden";
        } else if (elapsed < item.tWhite) {
          item.el.style.visibility = "visible";
          item.el.textContent = getRandomGlyph();
          item.el.style.color = "#f34951";
        } else if (elapsed < item.tResolve) {
          item.el.style.visibility = "visible";
          item.el.textContent = item.char;
          item.el.style.color = "#ffffff";
        } else {
          item.el.style.visibility = "visible";
          item.el.textContent = item.char;
          item.el.style.color = item.finalColor;
        }
      }

      if (elapsed < 2000) {
        animId = requestAnimationFrame(step);
      } else {
        // Scramble complete at exactly 2.0s!
        for (let i = 0; i < total; i++) {
          const item = charItems[i];
          item.el.style.visibility = "visible";
          item.el.textContent = item.char;
          item.el.style.color = item.finalColor;
        }
        setScrambleDone(true);
        // Links smoothly appear over 250ms right after text animation finishes
        setLinksReady(true);
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Performance-optimised IntersectionObserver for videos:
  // Pauses hidden or off-screen videos so only visible videos consume GPU decode bandwidth
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !("IntersectionObserver" in window)) return;

    const vids = Array.from(container.querySelectorAll("video"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target;
          if (entry.isIntersecting && !document.hidden) {
            vid.play().catch(() => { });
          } else {
            vid.pause();
          }
        });
      },
      { root: container, threshold: 0.1 }
    );

    vids.forEach((v) => observer.observe(v));

    const onVisibility = () => {
      if (document.hidden) {
        vids.forEach((v) => v.pause());
      } else {
        vids.forEach((v) => {
          const rect = v.getBoundingClientRect();
          if (rect.right > 0 && rect.left < window.innerWidth && rect.bottom > 0 && rect.top < window.innerHeight) {
            v.play().catch(() => { });
          }
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Initialize loop, observers, and event listeners
  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    let ro;
    if (window.ResizeObserver && containerRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(containerRef.current);
      const s0 = containerRef.current.querySelector('[data-strip="0"]');
      if (s0) ro.observe(s0);
    }
    const tMeasure = setTimeout(() => measure(), 300);
    startLoop();

    const onDocClick = (e) => {
      if (socialsOpen && socialsWrapRef.current && !socialsWrapRef.current.contains(e.target)) {
        setSocialsOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onDocClick);
      if (ro) ro.disconnect();
      clearTimeout(tMeasure);
    };
  }, [measure, startLoop, socialsOpen]);

  // Last.fm live track fetch
  useEffect(() => {
    if (!LASTFM_USER || !LASTFM_KEY) return;
    const fetchNow = () => {
      fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`
      )
        .then((r) => r.json())
        .then((d) => {
          const tracks = d.recenttracks && d.recenttracks.track;
          const track = Array.isArray(tracks) ? tracks[0] : tracks;
          if (!track) return;
          setNowPlaying(track.name);
          setNowArtist((track.artist || {})["#text"] || "");
          setIsLive(Boolean((track["@attr"] || {}).nowplaying));
        })
        .catch(() => { });
    };

    fetchNow();
    const interval = setInterval(fetchNow, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMove = (e) => {
    const t = tooltipRef.current;
    if (!t) return;
    t.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 18}px)`;
  };

  const goToProjects = () => {
    navigate("/projects");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToProjects();
    }
  };

  const nowLabel = nowPlaying && !isLive ? "LAST PLAYED" : "NOW PLAYING";
  const nowTrack = nowPlaying ? `${nowPlaying} — ${nowArtist}` : "E85 – Don Tolover";

  const handleVideoMetadata = (e) => {
    e.currentTarget.muted = true;
    e.currentTarget.play().catch(() => { });
  };

  return (
    <div
      data-screen-label="Portfolio"
      data-el="page"
      ref={pageRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        padding: "0 32px",
        alignItems: "stretch",
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#ffffff",
      }}
    >
      {/* LEFT COLUMN */}
      <div
        data-el="left"
        ref={leftColRef}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
          padding: "18px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "4px 0",
          }}
        >
          <Link to="/" className="brand-link">
            <span data-scramble data-final-color="#ffffff">Hafiz Yoosuf</span>
          </Link>
        </div>

        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "24px",
            maxWidth: "720px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.08em",
                color: "#8a8a8a",
              }}
            >
              <span data-scramble data-final-color="#8a8a8a">ABOUT</span>
            </span>
            <span
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "145%",
                color: "#e5e5e5",
                textWrap: "pretty",
              }}
            >
              <span data-scramble data-final-color="#e5e5e5">
                Second-year engineering student and freelance designer. I do UI/UX
                Designs — clean interfaces, things that actually make sense to use — plus
                Motion Graphics and AMVs, mostly in{" "}
              </span>
              <a
                href="https://www.figma.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`about-link ${linksReady ? "is-ready" : ""}`}
              >
                <span data-scramble data-final-color="#ffffff">Figma</span>
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                >
                  <path d="M1.2 6.8L6.8 1.2M6.8 1.2H2.6M6.8 1.2V5.4" stroke="#f34951" strokeWidth="1.1" />
                </svg>
              </a>
              <span data-scramble data-final-color="#e5e5e5"> and </span>
              <a
                href="https://www.adobe.com/products/aftereffects.html"
                target="_blank"
                rel="noopener noreferrer"
                className={`about-link ${linksReady ? "is-ready" : ""}`}
              >
                <span data-scramble data-final-color="#ffffff">After Effects</span>
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                >
                  <path d="M1.2 6.8L6.8 1.2M6.8 1.2H2.6M6.8 1.2V5.4" stroke="#f34951" strokeWidth="1.1" />
                </svg>
              </a>
              <span data-scramble data-final-color="#e5e5e5">
                . On the side I&apos;m working on phii. When I&apos;m not working I&apos;m usually wandering irl, some of my best ideas show up mid-walk. Got an interesting idea?{" "}
              </span>
              <a
                href="mailto:hafizyoosuf710@gmail.com"
                className={`about-link ${linksReady ? "is-ready" : ""}`}
              >
                <span data-scramble data-final-color="#ffffff">get in touch</span>
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                >
                  <path d="M1.2 6.8L6.8 1.2M6.8 1.2H2.6M6.8 1.2V5.4" stroke="#f34951" strokeWidth="1.1" />
                </svg>
              </a>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.08em",
                color: "#8a8a8a",
              }}
            >
              <span data-scramble data-final-color="#8a8a8a">LINKS</span>
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-start" }}>
              <div ref={socialsWrapRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <button
                  type="button"
                  className={`nav-btn ${socialsOpen ? "is-active" : ""}`}
                  onClick={() => setSocialsOpen((v) => !v)}
                >
                  <span data-scramble data-final-color="#ffffff">SOCIALS</span>
                </button>
                <div
                  data-socials-popup
                  ref={socialsRef}
                  style={{
                    position: "absolute",
                    left: "calc(100% + 20px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: socialsOpen ? 1 : 0,
                    visibility: socialsOpen ? "visible" : "hidden",
                    transition: "opacity 180ms ease, visibility 180ms ease",
                    background: "rgba(18, 12, 16, 0.85)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    boxShadow: "0 16px 36px rgba(0,0,0,0.6)",
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    zIndex: 40,
                    whiteSpace: "nowrap",
                  }}
                >
                  <a
                    href="https://instagram.com/z4rchx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-item"
                  >
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#71717a", width: "82px" }}>
                      INSTAGRAM
                    </span>
                    <span className="social-handle" style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px", color: "#ffffff", transition: "color 180ms ease" }}>
                      z4rchx
                    </span>
                  </a>
                  <a
                    href="https://x.com/z4f3x"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-item"
                  >
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#71717a", width: "82px" }}>
                      X
                    </span>
                    <span className="social-handle" style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px", color: "#ffffff", transition: "color 180ms ease" }}>
                      z4f3x
                    </span>
                  </a>
                  <div className="social-item">
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#71717a", width: "82px" }}>
                      YOUTUBE
                    </span>
                    <span className="social-handle" style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px", color: "#ffffff" }}>
                      —
                    </span>
                  </div>
                  <div className="social-item">
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#71717a", width: "82px" }}>
                      DISCORD
                    </span>
                    <span className="social-handle" style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px", color: "#ffffff" }}>
                      —
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <button
                  type="button"
                  className={`nav-btn ${blogOpen ? "is-active" : ""}`}
                  onClick={() => setBlogOpen((v) => !v)}
                >
                  <span data-scramble data-final-color="#ffffff">BLOG</span>
                </button>
                <span
                  ref={blogNoteRef}
                  style={{
                    position: "absolute",
                    left: "calc(100% + 14px)",
                    opacity: blogOpen ? 1 : 0,
                    visibility: blogOpen ? "visible" : "hidden",
                    transition: "opacity 180ms ease, visibility 180ms ease",
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    fontWeight: 500,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    color: "var(--accent)",
                    whiteSpace: "nowrap",
                  }}
                >
                  COMING SOON
                </span>
              </div>

              <a href="#" className="nav-btn">
                <span data-scramble data-final-color="#ffffff">RESUME</span>
              </a>
              <Link to="/guestbook" className="nav-btn">
                <span data-scramble data-final-color="#ffffff">GUESTBOOK</span>
              </Link>
              <Link to="/wordle" className="nav-btn">
                <span data-scramble data-final-color="#ffffff">WORDLE</span>
              </Link>
            </div>
          </div>
        </div>

        <div
          data-el="nowplaying"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "4px 0",
          }}
        >
          <span
            style={{
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0.08em",
              color: "#8a8a8a",
            }}
          >
            {scrambleDone ? (
              <span>{nowLabel}</span>
            ) : (
              <span data-scramble data-final-color="#8a8a8a">{nowLabel}</span>
            )}
          </span>
          <span
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "100%",
              color: "#ffffff",
            }}
          >
            {scrambleDone ? (
              <span>{nowTrack}</span>
            ) : (
              <span data-scramble data-final-color="#ffffff">{nowTrack}</span>
            )}
          </span>
        </div>
      </div>

      {/* PROJECTS DRIFTING PANEL */}
      <div
        data-el="projects"
        ref={panelRef}
        style={{
          position: "relative",
          width: typeof window !== "undefined" && window.innerWidth > 900 ? "784px" : "100%",
          maxWidth: typeof window !== "undefined" && window.innerWidth > 900 ? "70vw" : "100%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transition: "width 900ms cubic-bezier(0.16,1,0.3,1), max-width 900ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          data-el="proj-inner"
          ref={containerRef}
          className={showRadarLoader ? (isWiping ? "is-wiping-media" : "is-loading-media") : ""}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onMouseMove={handleMove}
          onClick={goToProjects}
          role="link"
          aria-label="View all projects"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          {/* ROW 0 */}
          <div
            data-row="0"
            style={{
              position: "relative",
              flex: "none",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              data-strip="0"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "stretch",
                flexShrink: 0,
                willChange: "transform",
              }}
            >
              <div data-card style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <video
                  data-main-video
                  src="/assets/projects/motion/StockBud.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  onLoadedMetadata={handleVideoMetadata}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", willChange: "transform", transform: "translateZ(0)" }}
                />
              </div>
              <div data-card style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <img
                  src="/assets/projects/ui/Noveo.webp"
                  alt="Noveo interface project preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div data-card data-card-extra style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <video
                  data-main-video
                  src="/assets/projects/motion/Extraordinary.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  onLoadedMetadata={handleVideoMetadata}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", willChange: "transform", transform: "translateZ(0)" }}
                />
              </div>
              <div data-card data-card-extra style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <img
                  src="/assets/projects/ui/Vire.webp"
                  alt="Vire interface project preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* ROW 1 */}
          <div
            data-row="1"
            style={{
              position: "relative",
              flex: "none",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              data-strip="1"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "stretch",
                flexShrink: 0,
                willChange: "transform",
              }}
            >
              <div data-card style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <video
                  data-main-video
                  src="/assets/projects/motion/T2Chat.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  onLoadedMetadata={handleVideoMetadata}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", willChange: "transform", transform: "translateZ(0)" }}
                />
              </div>
              <div data-card style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <img
                  src="/assets/projects/ui/asmitha.webp"
                  alt="Asmitha interface project preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div data-card data-card-extra style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <video
                  data-main-video
                  src="/assets/projects/motion/Vireclub.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  onLoadedMetadata={handleVideoMetadata}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", willChange: "transform", transform: "translateZ(0)" }}
                />
              </div>
              <div data-card data-card-extra style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <img
                  src="/assets/projects/ui/nxhuman.webp"
                  alt="NxHuman interface project preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          <div
            data-row="2"
            style={{
              position: "relative",
              flex: "none",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              data-strip="2"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "stretch",
                flexShrink: 0,
                willChange: "transform",
              }}
            >
              <div data-card style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <video
                  data-main-video
                  src="/assets/projects/motion/Extraordinary.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  onLoadedMetadata={handleVideoMetadata}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", willChange: "transform", transform: "translateZ(0)" }}
                />
              </div>
              <div data-card style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <img
                  src="/assets/projects/ui/nxhuman.webp"
                  alt="NxHuman interface project preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* ROW 3 */}
          <div
            data-row="3"
            style={{
              position: "relative",
              flex: "none",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              data-strip="3"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "stretch",
                flexShrink: 0,
                willChange: "transform",
              }}
            >
              <div data-card style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <video
                  data-main-video
                  src="/assets/projects/motion/Muster AI.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  onLoadedMetadata={handleVideoMetadata}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", willChange: "transform", transform: "translateZ(0)" }}
                />
              </div>
              <div data-card style={{ width: "387px", aspectRatio: "16/9", background: "#171717" }}>
                {showRadarLoader && <BinaryRadarLoader isWiping={isWiping} />}
                <img
                  src="/assets/projects/ui/Vire.webp"
                  alt="Vire interface project preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CURSOR TOOLTIP */}
      <div
        data-tooltip
        ref={tooltipRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 50,
          transition: "opacity 150ms ease",
          background: "#ffffff",
          color: "#000000",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontWeight: 600,
          fontSize: "12px",
          lineHeight: "100%",
          letterSpacing: "0.08em",
          padding: "8px 14px",
          borderRadius: "999px",
          whiteSpace: "nowrap",
          boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
          border: "1px solid rgba(243, 73, 81, 0.4)",
        }}
      >
        CLICK TO VIEW ALL PROJECTS
      </div>
    </div>
  );
}
