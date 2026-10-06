'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Animated violet "liquid" background: simplex-noise fBm with domain warping.
 * WebGL1, DPR capped, paused when the tab is hidden or the canvas is off-screen.
 * Falls back to a CSS gradient when WebGL is unavailable.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntensity;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p = p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 st = uv;
  st.x *= uRes.x / uRes.y;
  st *= 1.6;
  float t = uTime;

  vec2 m = (uMouse - 0.5) * 0.35;
  vec2 q = vec2(fbm(st + 0.04 * t + m), fbm(st + vec2(5.2, 1.3) - 0.04 * t - m));
  vec2 r = vec2(
    fbm(st + 4.0 * q + vec2(1.7, 9.2) + 0.126 * t),
    fbm(st + 4.0 * q + vec2(8.3, 2.8) + 0.106 * t)
  );
  float f = fbm(st + 4.0 * r);
  f = f * 0.5 + 0.5;

  vec3 c0 = vec3(0.055, 0.055, 0.055);      // #0E0E0E
  vec3 c1 = vec3(0.333, 0.188, 0.655);      // #5530A7
  vec3 c2 = vec3(0.482, 0.361, 1.0);        // #7B5CFF

  vec3 col = mix(c0, c1, clamp(f * f * 2.2, 0.0, 1.0));
  col = mix(col, c2, clamp(length(q) * 0.55, 0.0, 1.0) * smoothstep(0.35, 0.9, f));
  col = mix(col, c0, clamp(length(r.x) * 0.6, 0.0, 0.7));

  // Subtle highlight near the cursor.
  vec2 mp = uMouse;
  float md = distance(uv, mp);
  col += vec3(0.06, 0.04, 0.12) * smoothstep(0.45, 0.0, md) * step(0.0, uMouse.x);

  // Edge vignette.
  vec2 vv = uv * (1.0 - uv);
  float vig = pow(vv.x * vv.y * 16.0, 0.28);
  col *= mix(0.55, 1.0, vig);

  col *= uIntensity;
  gl_FragColor = vec4(col, 1.0);
}
`;

interface HeroShaderProps {
  className?: string;
  /** Seconds added to the clock so several shaders don't move in sync. */
  timeOffset?: number;
  /** Max device pixel ratio for the canvas. */
  dprCap?: number;
  /** Brightness multiplier. */
  intensity?: number;
  /** Follow the pointer across the window. */
  interactive?: boolean;
}

const FALLBACK = 'radial-gradient(120% 120% at 30% 20%, #7B5CFF 0%, #5530A7 35%, #1A1530 65%, #0E0E0E 100%)';

export default function HeroShader({ className = '', timeOffset = 0, dprCap = 1.25, intensity = 1, interactive = true }: HeroShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) {
      setFailed(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('[HeroShader]', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uIntensity = gl.getUniformLocation(prog, 'uIntensity');
    gl.uniform1f(uIntensity, intensity);

    const reduced = prefersReducedMotion();
    let raf = 0;
    let running = false;
    let onScreen = true;
    const mouse = { x: -1, y: -1, tx: -1, ty: -1 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || !running) draw(performance.now());
    });
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
      if (mouse.x < 0) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    if (interactive && !reduced) window.addEventListener('pointermove', onMove, { passive: true });

    const start = performance.now();
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform1f(uTime, (now - start) / 1000 + timeOffset);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      const shouldRun = !reduced && onScreen && document.visibilityState === 'visible';
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: '100px' },
    );
    io.observe(canvas);
    document.addEventListener('visibilitychange', sync);

    resize();
    draw(performance.now());
    sync();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onMove);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [timeOffset, dprCap, intensity, interactive]);

  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`} style={{ background: FALLBACK }}>
      {!failed && <canvas ref={canvasRef} className="block h-full w-full" />}
    </div>
  );
}
