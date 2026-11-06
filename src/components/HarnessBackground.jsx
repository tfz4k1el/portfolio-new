import React, { useEffect, useRef, useState } from "react";

const VERTEX_SHADER = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Calm, refined Red, Pink, and White palette
const vec3 c_dark  = vec3(7., 4., 6.) / 255.;          // Deepest dark obsidian black
const vec3 c_wine  = vec3(38., 8., 16.) / 255.;        // Deep velvet crimson shadow
const vec3 c_red   = vec3(228., 42., 62.) / 255.;      // Radiant ruby / signature accent red
const vec3 c_pink  = vec3(255., 170., 198.) / 255.;    // Soft blush / rose pink
const vec3 c_white = vec3(255., 246., 248.) / 255.;   // Luminous soft white highlight

const float u_scale = 1.05;
const vec2 u_offset = vec2(-0.85, -0.35);

out vec4 fragColor;

// Simplex 3D noise
vec3 mod289v3(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289v4(vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 permute(vec4 x) { return mod289v4(((x * 34.) + 1.) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - .85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1. / 6., 1. / 3.);
  const vec4 D = vec4(0., .5, 1., 2.);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1. - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289v3(i);
  vec4 p = permute(permute(permute(i.z + vec4(0., i1.z, i2.z, 1.)) + i.y + vec4(0., i1.y, i2.y, 1.)) + i.x + vec4(0., i1.x, i2.x, 1.));
  float n_ = .142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49. * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7. * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1. - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2. + 1.;
  vec4 s1 = floor(b1) * 2. + 1.;
  vec4 sh = -step(h, vec4(0.));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.);
  m = m * m;
  return 42. * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Continuous curl displacement
vec2 curlish(vec2 uv, float t) {
  float eps = .03;
  float n  = snoise(vec3(uv * .6, t));
  float nx = snoise(vec3((uv + vec2(eps, 0.)) * .6, t));
  float ny = snoise(vec3((uv + vec2(0., eps)) * .6, t));
  return vec2(-(ny - n) / eps, (nx - n) / eps) * .004;
}

// Screen-space pseudo-random hash for static film grain
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 suv = vec2(uv.x * aspect, uv.y) * u_scale + u_offset;

  // Ultra-calm time progression: perfectly steady and subtle
  float t1 = u_time * 0.035;
  float t2 = u_time * 0.020;
  float t3 = u_time * 0.014;

  vec2 curl = curlish(suv, t1);
  vec2 uvD = suv + curl * 6.5;

  // Layered smooth noise with richer organic texture
  float n1 = snoise(vec3(uvD * 0.45, t1)) * 0.5 + 0.5;
  float n2 = snoise(vec3(uvD * 0.85 + 3.2, t2)) * 0.5 + 0.5;
  float n3 = snoise(vec3(uvD * 1.70 + 6.8, t3)) * 0.5 + 0.5;
  float swirl = n1 * 0.52 + n2 * 0.33 + n3 * 0.15;

  // Continuous subtle color gradients - no flash, no harsh steps
  vec3 col = mix(c_dark, c_wine, smoothstep(0.12, 0.55, swirl));
  col = mix(col, c_red, smoothstep(0.35, 0.75, swirl) * 0.60);
  col = mix(col, c_pink, smoothstep(0.55, 0.88, swirl) * 0.38);

  // Soft luminous warm white highlight on peak contours
  float whitePeak = smoothstep(0.72, 0.94, swirl);
  col = mix(col, c_white, whitePeak * 0.22);

  // Ambient glowing light source (top-right area, inspired by DeepSeek Harness)
  vec2 lightPos = mix(vec2(0.82, 0.40), u_mouse, 0.08);
  float dist = length((uv - lightPos) * vec2(aspect, 1.0));
  float coreGlow = exp(-dist * dist * 3.8) * 0.16;
  float haloGlow = exp(-dist * 1.6) * 0.22;
  col += c_white * coreGlow + c_pink * haloGlow;

  // Screen-space tactile film grain (zero temporal flicker, organic matte texture)
  float grain = (hash21(gl_FragCoord.xy) - 0.5) * 0.038;
  col += grain;

  // Soft perimeter vignette
  float vig = 1.0 - smoothstep(0.30, 0.85, length(uv - 0.5));
  col = mix(col * 0.65, col, vig);

  fragColor = vec4(col, 1.0);
}
`;

export default function HarnessBackground() {
  const canvasRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Mouse tracking with gentle smoothing
  const mouseRef = useRef({ x: 0.82, y: 0.40 });
  const targetMouseRef = useRef({ x: 0.82, y: 0.40 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const shaders = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();

    const cleanupGL = () => {
      shaders.forEach((s) => gl.deleteShader(s));
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Shader compilation error:", gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vert = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vert || !frag) {
      cleanupGL();
      setWebglSupported(false);
      return;
    }

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(program));
      cleanupGL();
      setWebglSupported(false);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let animationId = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let clock = 0;
    let lastTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const pixelWidth = window.innerWidth * dpr;
      const pixelHeight = window.innerHeight * dpr;

      // Keep resolution clean and lightweight
      const scale = Math.min(
        1,
        1200 / pixelWidth,
        Math.sqrt(8e5 / (pixelWidth * pixelHeight))
      );

      width = Math.max(1, Math.floor(pixelWidth * scale));
      height = Math.max(1, Math.floor(pixelHeight * scale));

      canvas.width = width;
      canvas.height = height;

      gl.viewport(0, 0, width, height);
      gl.uniform2f(uResolution, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (time) => {
      animationId = 0;
      if (!isVisible || document.hidden || !width || !height) return;

      const dt = lastTime ? Math.min(time - lastTime, 100) : 16;
      lastTime = time;

      // Advance clock smoothly at 1/1000s scale (ultra slow & gentle)
      clock += dt * 0.001;
      gl.uniform1f(uTime, clock);

      // Smooth mouse lerp
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.02;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.02;
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (canvas.style.opacity !== "1") {
        canvas.style.opacity = "1";
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    const handleVisibility = () => {
      if (document.hidden) {
        isVisible = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = 0;
        }
      } else {
        isVisible = true;
        lastTime = performance.now();
        if (!animationId) {
          animationId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const handleContextLost = (e) => {
      e.preventDefault();
      if (animationId) cancelAnimationFrame(animationId);
      canvas.style.opacity = "0";
      setWebglSupported(false);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      cleanupGL();
    };
  }, []);

  return (
    <div
      className="harness-bg-root"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        background: "#070406",
      }}
    >
      {/* DeepSeek Harness Inspired Ambient Radial Gradient (Red, Pink, White) */}
      <div
        className="harness-radial-layer"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 82% 38%, rgba(255, 195, 218, 0.35) 0%, rgba(243, 73, 81, 0.24) 28%, rgba(140, 18, 36, 0.14) 55%, rgba(7, 4, 6, 0.95) 85%)",
          opacity: 0.9,
        }}
      />

      {/* DeepSeek Harness Orthogonal Tech Grid Matrix */}
      <div
        className="harness-grid-layer"
        style={{
          position: "absolute",
          inset: 0,
          backgroundPosition: "-1.8px -1.8px",
          backgroundSize: "80px 80px",
          backgroundImage:
            "conic-gradient(from 90deg at 2px 2px, transparent 75%, rgba(255, 255, 255, 0.015) 0)",
          opacity: 0.85,
        }}
      />

      {/* WebGL2 Fluid Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          transition: "opacity 800ms ease",
          display: webglSupported ? "block" : "none",
        }}
      />

      {/* Subtle vignette for contrast */}
      <div
        className="harness-scrim-layer"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(7, 4, 6, 0.65) 100%)",
        }}
      />
    </div>
  );
}
