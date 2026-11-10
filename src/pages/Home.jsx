import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import SwarmRebuildLoader from "../components/SwarmRebuildLoader";

const LASTFM_USER = "Zafkiel69";
const LASTFM_KEY = "c34fdb3897e465413e4fbf9d94b8da85";

// ============================================================================
// RESUME LINK CONFIGURATION
// Paste your Google Drive link between the quotes below:
// Example: export const RESUME_DRIVE_URL = "https://drive.google.com/file/d/YOUR_DRIVE_ID/view";
// If left empty (""), clicking the RESUME button opens the generated PDF resume (/Hafiz_Yoosuf_Resume.pdf).
// ============================================================================
export const RESUME_DRIVE_URL = "https://drive.google.com/file/d/1rYfnak_k59h56W3ollowrfinta5PnhXU/view?usp=drive_link";

// ============================================================================
// PROJECT FEE LINK CONFIGURATION
// Paste your project link for 'fee' between the quotes below:
// Example: export const FEE_PROJECT_URL = "https://your-fee-link.com";
// ============================================================================
export const FEE_PROJECT_URL = "#";

function HomeMediaCard({ isVideo, src, alt, extra, onLoadedMetadata }) {
  const isInfinity = src && src.includes("Infinity");
  return (
    <div
      data-card
      {...(extra ? { "data-card-extra": "" } : {})}
      style={{
        width: "387px",
        aspectRatio: "16/9",
        background: isInfinity ? "#0a0608" : "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isVideo ? (
        <video
          data-main-video
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onLoadedMetadata={onLoadedMetadata}
          style={{
            width: "100%",
            height: "100%",
            objectFit: isInfinity ? "contain" : "cover",
            display: "block",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        />
      ) : (
        <img
          src={src}
          alt={alt}
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
  );
}

// Module-level persistent flag across client-side router navigation
// Resets automatically on full page refresh or fresh visit
let hasInitialRebuildFinished = false;

export default function Home({ onShowBg }) {
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const panelRef = useRef(null);
  const tooltipRef = useRef(null);
  const socialsRef = useRef(null);
  const socialsWrapRef = useRef(null);
  const blogNoteRef = useRef(null);

  const [socialsOpen, setSocialsOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [nowArtist, setNowArtist] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Preloader state
  const [loadingPercent, setLoadingPercent] = useState(hasInitialRebuildFinished ? 100 : 0);
  const [isLoaded, setIsLoaded] = useState(hasInitialRebuildFinished);
  const [swarmActive, setSwarmActive] = useState(false);

  // Drift loop animation references
  const clockRef = useRef(0);
  const lastTsRef = useRef(null);
  const hoveringRef = useRef(!hasInitialRebuildFinished); // Locked in expanded state only on first visit/refresh
  const isRealHoverRef = useRef(false); // Tracks actual mouse hover
  const rafRef = useRef(null);
  const maxShiftRef = useRef([0, 0, 0, 0]);
  const isCollapsingRef = useRef(false);
  const hasCollapsedRef = useRef(hasInitialRebuildFinished);

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
    const amp = Math.min(p.amplitude, isFinite(m) && m > 0 ? m : p.amplitude);
    return amp * Math.sin((clockRef.current / p.period) * Math.PI * 2 + p.phase);
  }, []);

  const startLoop = useCallback(() => {
    lastTsRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
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

  // Staging Pipeline: Preload assets, wait for fonts, fetch real Last.fm track
  useEffect(() => {
    if (hasInitialRebuildFinished) {
      // Re-visiting from /projects, /wordle, etc.
      // Skip staging pipeline and swarm rebuild, directly show background and start drift loop
      onShowBg?.();
      window.dispatchEvent(new CustomEvent("show-harness-bg"));
      measure();
      startLoop();
      return;
    }

    let cancelled = false;
    const imageUrls = [
      "/assets/projects/ui/Noveo.webp",
      "/assets/projects/ui/Vire.webp",
      "/assets/projects/ui/asmitha.webp",
      "/assets/projects/ui/nxhuman.webp",
    ];

    const preloadImg = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
        if (img.complete) resolve();
      });

    // 3. Fetch real Last.fm track during staging
    const fetchLastFm = async () => {
      if (!LASTFM_USER || !LASTFM_KEY) return;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1400);
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (!res.ok) return;
        const d = await res.json();
        const tracks = d.recenttracks && d.recenttracks.track;
        const track = Array.isArray(tracks) ? tracks[0] : tracks;
        if (track && !cancelled) {
          setNowPlaying(track.name);
          setNowArtist((track.artist || {})["#text"] || "");
          setIsLive(Boolean((track["@attr"] || {}).nowplaying));
        }
      } catch (_) {
        // failed silently, no hardcoding
      }
    };

    const runStaging = async () => {
      setLoadingPercent(30);
      const fontPromise = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      const imagePromises = Promise.all(imageUrls.map(preloadImg));
      const lastFmPromise = fetchLastFm();

      Promise.all([imagePromises, fontPromise]).then(() => {
        if (!cancelled) setLoadingPercent(75);
      });

      await Promise.allSettled([imagePromises, fontPromise, lastFmPromise]);
      if (cancelled) return;

      setLoadingPercent(100);
      // Ensure React commits nowPlaying & DOM nodes, then mount swarm rebuild loader
      // Preloader remains visible until SwarmRebuildLoader signals onReady (zero-flash hand-off)
      setTimeout(() => {
        if (!cancelled) {
          setSwarmActive(true);
        }
      }, 50);
    };

    runStaging();

    const safetyTimer = window.setTimeout(() => {
      if (!cancelled) {
        setLoadingPercent(100);
        setIsLoaded(true);
        setSwarmActive(true);
      }
    }, 2000);

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimer);
    };
  }, []);

  // Performance-optimised IntersectionObserver for videos:
  // Pauses hidden or off-screen videos so only visible videos consume GPU decode bandwidth
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !("IntersectionObserver" in window)) return;

    const vids = Array.from(container.querySelectorAll("video"));
    vids.forEach((v) => {
      v.muted = true;
      if (!isLoaded || swarmActive) {
        v.pause();
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target;
          if (entry.isIntersecting && !document.hidden && !swarmActive && isLoaded) {
            vid.play().catch(() => { });
          } else if (!entry.isIntersecting) {
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
      } else if (!swarmActive && isLoaded) {
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
  }, [swarmActive, isLoaded]);

  // Initialize observers and event listeners (drift loop held paused during expanded staging)
  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    let ro;
    if (window.ResizeObserver && containerRef.current) {
      ro = new ResizeObserver(() => {
        if (!isCollapsingRef.current) {
          measure();
        }
      });
      ro.observe(containerRef.current);
      const s0 = containerRef.current.querySelector('[data-strip="0"]');
      if (s0) ro.observe(s0);
    }
    const tMeasure = setTimeout(() => measure(), 300);

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
  }, [measure, socialsOpen]);

  // Hand-off triggered when the swarm rebuild completes:
  // Step 1: Unmount swarm overlay cleanly
  const handleSwarmComplete = useCallback(() => {
    setSwarmActive(false);
  }, []);

  // Step 2: Trigger smooth collapse of the drift panel ONLY AFTER the swarm overlay has fully unmounted
  useEffect(() => {
    if (!swarmActive && isLoaded && !hasCollapsedRef.current) {
      hasCollapsedRef.current = true;

      // Double requestAnimationFrame + 80ms buffer ensures:
      // a) React has completely unmounted SwarmRebuildLoader
      // b) Browser has painted clean frames with zero overlay overhead
      // c) AudioContext closing and garbage collection are completely idle
      let timerId;
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          timerId = setTimeout(() => {
            if (panelRef.current && window.innerWidth > 900) {
              isCollapsingRef.current = true;
              panelRef.current.style.willChange = "width, max-width";
              panelRef.current.style.transition = "width 900ms cubic-bezier(0.16, 1, 0.3, 1), max-width 900ms cubic-bezier(0.16, 1, 0.3, 1)";
              panelRef.current.style.width = "486px";
              panelRef.current.style.maxWidth = "48vw";
            }

            strips().forEach((el) => {
              if (el) el.style.transition = "none";
            });

            // Start drift loop immediately when collapse begins
            isRealHoverRef.current = false;
            hoveringRef.current = false;
            measure();
            startLoop();

            // Resume all background videos smoothly once swarm rebuild overlay is completely unmounted
            if (containerRef.current) {
              const vids = containerRef.current.querySelectorAll("video");
              vids.forEach((v) => {
                v.muted = true;
                v.play().catch(() => {});
              });
            }

            // Once the collapse transition finishes (950ms):
            setTimeout(() => {
              isCollapsingRef.current = false;
              hasInitialRebuildFinished = true;
              if (panelRef.current) {
                panelRef.current.style.willChange = "auto";
              }
              measure();
              // After collapse is done: fade in background gradient
              onShowBg?.();
              window.dispatchEvent(new CustomEvent("show-harness-bg"));
            }, 950);
          }, 80);
        });
      });

      return () => {
        cancelAnimationFrame(raf1);
        if (timerId) clearTimeout(timerId);
      };
    }
  }, [swarmActive, isLoaded, measure, startLoop, strips, onShowBg]);

  // Periodic Last.fm live track fetch
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
        .catch(() => {});
    };

    const interval = setInterval(fetchNow, 30000);
    return () => clearInterval(interval);
  }, []);

  // Hover handlers for drifting panel
  const handleEnter = (e) => {
    if (isCollapsingRef.current || !hasInitialRebuildFinished) return;
    isRealHoverRef.current = true;
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
  };

  const handleLeave = () => {
    isRealHoverRef.current = false;
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
  };

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
  const nowTrack = nowPlaying ? `${nowPlaying} — ${nowArtist}` : "";

  const handleVideoMetadata = (e) => {
    e.currentTarget.muted = true;
    e.currentTarget.pause();
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
      {/* MINIMALIST DARK LOADER */}
      <div
        data-main-loader
        className={isLoaded ? "is-hidden" : ""}
        aria-live="polite"
        aria-label="Loading"
      >
        <div data-main-loader-inner>
          <div data-main-loader-heading>
            <span>Loading</span>
            <span data-main-loader-percent>{loadingPercent}%</span>
          </div>
          <div
            data-main-loader-track
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={loadingPercent}
          >
            <div
              data-main-loader-progress
              style={{ transform: `scaleX(${Math.max(loadingPercent / 100, 0.02)})` }}
            />
          </div>
        </div>
      </div>

      {/* LEFT COLUMN */}
      <div
        data-el="left"
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
            Hafiz Yoosuf
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
              ABOUT
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
              Second-year engineering student and freelance designer. I do UI/UX
              Designs — clean interfaces, things that actually make sense to use — plus
              Motion Graphics and AMVs, mostly in{" "}
              <a
                href="https://www.figma.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#ffffff",
                  textDecoration: "underline",
                  textDecorationColor: "var(--accent)",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                  cursor: "pointer",
                  transition: "color 180ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
              >
                Figma
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  style={{ verticalAlign: "super", marginLeft: "2px" }}
                >
                  <path d="M1.2 6.8L6.8 1.2M6.8 1.2H2.6M6.8 1.2V5.4" stroke="#f34951" strokeWidth="1.1" />
                </svg>
              </a>{" "}
              and{" "}
              <a
                href="https://www.adobe.com/products/aftereffects.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#ffffff",
                  textDecoration: "underline",
                  textDecorationColor: "var(--accent)",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                  cursor: "pointer",
                  transition: "color 180ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
              >
                After Effects
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  style={{ verticalAlign: "super", marginLeft: "2px" }}
                >
                  <path d="M1.2 6.8L6.8 1.2M6.8 1.2H2.6M6.8 1.2V5.4" stroke="#f34951" strokeWidth="1.1" />
                </svg>
              </a>
              . On the side I&apos;m working on{" "}
              <a
                href={FEE_PROJECT_URL}
                target={FEE_PROJECT_URL && FEE_PROJECT_URL !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  color: "#ffffff",
                  textDecoration: "underline",
                  textDecorationColor: "var(--accent)",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                  cursor: "pointer",
                  transition: "color 180ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
              >
                fee
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  style={{ verticalAlign: "super", marginLeft: "2px" }}
                >
                  <path d="M1.2 6.8L6.8 1.2M6.8 1.2H2.6M6.8 1.2V5.4" stroke="#f34951" strokeWidth="1.1" />
                </svg>
              </a>
              . When I&apos;m not working I&apos;m usually wandering around, some of my best ideas show up mid-walk. Got an interesting idea?{" "}
              <a
                href="mailto:hafizyoosuf710@gmail.com"
                style={{
                  color: "#ffffff",
                  textDecoration: "underline",
                  textDecorationColor: "var(--accent)",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                  cursor: "pointer",
                  transition: "color 180ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
              >
                get in touch
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  style={{ verticalAlign: "super", marginLeft: "2px" }}
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
              LINKS
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-start" }}>
              <div ref={socialsWrapRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <button
                  type="button"
                  className={`nav-btn ${socialsOpen ? "is-active" : ""}`}
                  onClick={() => setSocialsOpen((v) => !v)}
                >
                  SOCIALS
                </button>
                <div
                  data-socials-popup
                  className={socialsOpen ? "is-open" : ""}
                  ref={socialsRef}
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
                  <a
                    href="https://www.youtube.com/@zafkiel3429"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-item"
                  >
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#71717a", width: "82px" }}>
                      YOUTUBE
                    </span>
                    <span className="social-handle" style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px", color: "#ffffff", transition: "color 180ms ease" }}>
                      @zafkiel3429
                    </span>
                  </a>
                  <div className="social-item">
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#71717a", width: "82px" }}>
                      DISCORD
                    </span>
                    <span className="social-handle" style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px", color: "#ffffff" }}>
                      z4k1el
                    </span>
                  </div>
                  <a
                    href="https://wa.me/918592882354"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-item"
                  >
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#71717a", width: "82px" }}>
                      WHATSAPP
                    </span>
                    <span className="social-handle" style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px", color: "#ffffff", transition: "color 180ms ease" }}>
                      +91 8592882354
                    </span>
                  </a>
                  <a
                    href="mailto:hafizyoosuf710@gmail.com"
                    className="social-item"
                  >
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#71717a", width: "82px" }}>
                      MAIL
                    </span>
                    <span className="social-handle" style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px", color: "#ffffff", transition: "color 180ms ease" }}>
                      hafizyoosuf710
                    </span>
                  </a>
                </div>
              </div>

              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <button
                  type="button"
                  className={`nav-btn ${blogOpen ? "is-active" : ""}`}
                  onClick={() => setBlogOpen((v) => !v)}
                >
                  BLOG
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

              <a
                href={RESUME_DRIVE_URL && RESUME_DRIVE_URL.trim() !== "" ? RESUME_DRIVE_URL : "/Hafiz_Yoosuf_Resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-btn"
              >
                RESUME
              </a>
              <Link to="/guestbook" className="nav-btn">
                GUESTBOOK
              </Link>
              <Link to="/wordle" className="nav-btn">
                WORDLE
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
            {nowLabel}
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
            {nowTrack}
          </span>
        </div>
      </div>

      {/* PROJECTS DRIFTING PANEL */}
      <div
        data-el="projects"
        ref={panelRef}
        style={{
          position: "relative",
          width: hasInitialRebuildFinished ? "486px" : "784px",
          maxWidth: hasInitialRebuildFinished ? "48vw" : "70vw",
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
              <HomeMediaCard
                isVideo
                src="/assets/projects/motion/StockBud.webm"
                onLoadedMetadata={handleVideoMetadata}
              />
              <HomeMediaCard
                src="/assets/projects/ui/Noveo.webp"
                alt="Noveo interface project preview"
              />
              <HomeMediaCard
                isVideo
                extra
                src="/assets/projects/motion/Infinity.webm"
                onLoadedMetadata={handleVideoMetadata}
              />
              <HomeMediaCard
                extra
                src="/assets/projects/ui/Vire.webp"
                alt="Vire interface project preview"
              />
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
              <HomeMediaCard
                isVideo
                src="/assets/projects/motion/T2Chat.webm"
                onLoadedMetadata={handleVideoMetadata}
              />
              <HomeMediaCard
                src="/assets/projects/ui/asmitha.webp"
                alt="Asmitha interface project preview"
              />
              <HomeMediaCard
                isVideo
                extra
                src="/assets/projects/motion/Vireclub.webm"
                onLoadedMetadata={handleVideoMetadata}
              />
              <HomeMediaCard
                extra
                src="/assets/projects/ui/nxhuman.webp"
                alt="NxHuman interface project preview"
              />
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
              <HomeMediaCard
                isVideo
                src="/assets/projects/motion/Extraordinary.webm"
                onLoadedMetadata={handleVideoMetadata}
              />
              <HomeMediaCard
                src="/assets/projects/ui/nxhuman.webp"
                alt="NxHuman interface project preview"
              />
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
              <HomeMediaCard
                isVideo
                src="/assets/projects/motion/Muster AI.webm"
                onLoadedMetadata={handleVideoMetadata}
              />
              <HomeMediaCard
                src="/assets/projects/ui/Vire.webp"
                alt="Vire interface project preview"
              />
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

      {/* SWARM REBUILD MULTIPLAYER LOADER */}
      {swarmActive && (
        <SwarmRebuildLoader
          targetSelector='[data-el="page"]'
          onReady={() => setIsLoaded(true)}
          onComplete={handleSwarmComplete}
        />
      )}
    </div>
  );
}
