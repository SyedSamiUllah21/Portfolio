'use client';

import { useEffect, useRef, useState } from 'react';
import { isFinePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * Full-viewport clear-water ripple: a WebGL2 wave-equation heightfield that
 * follows the cursor. Desktop fine pointer only.
 */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const SIM_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uAspect;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uStrength;

float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec4 s = texture(uState, vUv);
  float l = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float r = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float b = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float t = texture(uState, vUv + vec2(0.0, uTexel.y)).r;

  float h = (l + r + b + t) * 0.5 - s.g;
  h *= 0.982;

  float edgeDist = min(min(vUv.x, vUv.y), min(1.0 - vUv.x, 1.0 - vUv.y));
  h *= mix(0.9, 1.0, smoothstep(0.0, 0.06, edgeDist));

  if (uStrength > 0.0) {
    vec2 asp = vec2(uAspect, 1.0);
    float d = segDist(vUv * asp, uFrom * asp, uTo * asp);
    float f = 1.0 - smoothstep(0.0, uRadius, d);
    h += f * uStrength;
  }

  outColor = vec4(h, s.r, 0.0, 1.0);
}`;

const RENDER_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uState;
uniform vec2 uTexel;

void main() {
  float l = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float r = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float b = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float t = texture(uState, vUv + vec2(0.0, uTexel.y)).r;

  vec2 grad = vec2(r - l, t - b) * 2.2;
  vec3 n = normalize(vec3(-grad, 1.0));
  vec3 L = normalize(vec3(-0.4, 0.55, 0.73));
  float lit = dot(n, L) - L.z;
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, H), 0.0), 60.0);

  float highlight = clamp(lit * 1.6, 0.0, 1.0) * 0.16 + spec * 0.22;
  float shadow = clamp(-lit * 1.6, 0.0, 1.0) * 0.16;
  float presence = smoothstep(0.015, 0.08, length(grad));

  float hl = highlight * presence;
  float a = min((highlight + shadow) * presence, 0.3);
  hl = min(hl, a);
  outColor = vec4(vec3(hl), a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[LiquidRipple] shader error', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function program(gl: WebGL2RenderingContext, frag: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.bindAttribLocation(p, 0, 'aPos');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn('[LiquidRipple] link error', gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

export default function LiquidRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isFinePointer() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false, depth: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) {
      canvas.style.display = 'none';
      return;
    }

    const simProg = program(gl, SIM_FRAG);
    const renderProg = program(gl, RENDER_FRAG);
    if (!simProg || !renderProg) {
      canvas.style.display = 'none';
      return;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const simU = {
      state: u(simProg, 'uState'), texel: u(simProg, 'uTexel'), aspect: u(simProg, 'uAspect'),
      from: u(simProg, 'uFrom'), to: u(simProg, 'uTo'), radius: u(simProg, 'uRadius'), strength: u(simProg, 'uStrength'),
    };
    const renU = { state: u(renderProg, 'uState'), texel: u(renderProg, 'uTexel') };

    let simW = 0;
    let simH = 0;
    let textures: WebGLTexture[] = [];
    let fbos: WebGLFramebuffer[] = [];
    let read = 0;

    const createTargets = () => {
      textures.forEach((t) => gl.deleteTexture(t));
      fbos.forEach((f) => gl.deleteFramebuffer(f));
      textures = [];
      fbos = [];
      for (let i = 0; i < 2; i++) {
        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, simW, simH, 0, gl.RGBA, gl.HALF_FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const fbo = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        textures.push(tex);
        fbos.push(fbo);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      read = 0;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * 0.5));
      canvas.height = Math.max(1, Math.round(h * 0.5));
      simW = Math.max(8, Math.ceil(w / 6));
      simH = Math.max(8, Math.ceil(h / 6));
      createTargets();
    };
    resize();
    window.addEventListener('resize', resize);

    // Pointer state in uv space (origin bottom-left).
    const mouse = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, inside: false, moved: false };
    let framesSinceLeave = Infinity;
    let restFrames = 0;
    let running = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      if (!mouse.inside) {
        mouse.px = x;
        mouse.py = y;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.inside = true;
      mouse.moved = true;
      framesSinceLeave = 0;
      start();
    };
    const onLeave = () => {
      mouse.inside = false;
    };

    const step = (from: [number, number], to: [number, number], radius: number, strength: number) => {
      const write = 1 - read;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[write]);
      gl.viewport(0, 0, simW, simH);
      gl.useProgram(simProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[read]);
      gl.uniform1i(simU.state, 0);
      gl.uniform2f(simU.texel, 1 / simW, 1 / simH);
      gl.uniform1f(simU.aspect, simW / simH);
      gl.uniform2f(simU.from, from[0], from[1]);
      gl.uniform2f(simU.to, to[0], to[1]);
      gl.uniform1f(simU.radius, radius);
      gl.uniform1f(simU.strength, strength);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      read = write;
    };

    const render = () => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(renderProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[read]);
      gl.uniform1i(renU.state, 0);
      gl.uniform2f(renU.texel, 1 / simW, 1 / simH);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const frame = () => {
      if (!mouse.inside) framesSinceLeave += 1;
      if (framesSinceLeave > 180) {
        running = false;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        createTargets();
        return;
      }

      const from: [number, number] = [mouse.px, mouse.py];
      const to: [number, number] = [mouse.x, mouse.y];

      if (mouse.moved && mouse.inside) {
        const dx = (mouse.x - mouse.px) * (simW / simH);
        const dy = mouse.y - mouse.py;
        const speed = Math.hypot(dx, dy);
        const strength = Math.min(speed * 7, 0.5);
        const mid: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
        step(from, mid, 0.06, strength);
        step(mid, to, 0.06, strength);
        restFrames = 0;
      } else {
        restFrames += 1;
        if (mouse.inside && restFrames % 140 === 0) step(to, to, 0.032, 1.8);
        else step(to, to, 0, 0);
      }

      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.moved = false;
      render();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      textures.forEach((t) => gl.deleteTexture(t));
      fbos.forEach((f) => gl.deleteFramebuffer(f));
      gl.deleteProgram(simProg);
      gl.deleteProgram(renderProg);
      gl.deleteBuffer(quad);
      gl.deleteVertexArray(vao);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9980] h-full w-full"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
