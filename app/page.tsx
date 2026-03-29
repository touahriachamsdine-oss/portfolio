"use client";

// TOUAHRIA Chams Eddine — Portfolio
// Stack: React + Tailwind CDN + Framer Motion + Custom Canvas Particle System

import { useState, useEffect, useRef, useCallback, ReactNode, FormEvent } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

// ── THEME ────────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#04060e",
  bg2: "#080c1a",
  surface: "rgba(8,12,24,0.7)",
  text: "#c4d4f0",
  muted: "#3a4d70",
  bright: "#ffffff",
  accent: "#00ffe7",
  accent2: "#ff2d6b",
  accent3: "#7c3aed",
  border: "rgba(0,255,231,0.13)",
  shadow: "rgba(0,0,0,0.5)",
};
const LIGHT = {
  bg: "#f0f4ff",
  bg2: "#e2eaff",
  surface: "rgba(225,234,255,0.85)",
  text: "#1a2540",
  muted: "#7a90bb",
  bright: "#050c28",
  accent: "#0080ff",
  accent2: "#e6003a",
  accent3: "#6d28d9",
  border: "rgba(0,80,200,0.15)",
  shadow: "rgba(0,0,0,0.1)",
};

interface Project {
  id: string;
  title: string;
  description: string;
  glyph: string;
  badge: string;
  badge_color: string;
  tech: string[];
  link?: string;
  image_url?: string;
}

// ── DATA ─────────────────────────────────────────────────────────────────────
const NAV = ["About", "Skills", "Projects", "Resume", "Contact"];
const SKILLS = [
  {
    icon: "⚒", title: "Mining & Mineral Valorization", color: "#00ffe7",
    tags: ["Mineral Processing", "Recycling Technologies", "Resource Recovery", "Characterization", "Industrial Valorization"],
    bars: [["Processing & Separation", 88], ["Resource Recovery", 82], ["Process Optimization", 85]]
  },
  {
    icon: "⚡", title: "Automation & Systems", color: "#ff2d6b",
    tags: ["Embedded Systems", "Sensors & Control", "Mechatronics", "Prototype Development", "Automation Scripts"],
    bars: [["System Design", 84], ["Mechatronic Integration", 79], ["Functional Prototyping", 82]]
  },
  {
    icon: "◈", title: "Software & Programming", color: "#7c3aed",
    tags: ["Python", "JavaScript / TS", "Next.js", "REST APIs", "Data Processing", "System Integration"],
    bars: [["Python (Engineering)", 86], ["Next.js / React", 78], ["Data Handling", 80]]
  },
];
// Projects are now fetched dynamically from the database.
const TIMELINE = [
  {
    year: "2023 — 2025", role: "Master's — Mineral Resources Valorization", place: "University of Tébessa — Algeria",
    desc: "Advanced studies in mineral processing, recycling, and resource recovery. Graduation project on real-world engineering applications."
  },
  {
    year: "2020 — 2023", role: "Bachelor's — Mining Engineering", place: "University of Tébessa — Algeria",
    desc: "Training in geology, mining operations, mineral processing, and materials characterization. Focus on mineral resources."
  },
  {
    year: "2020", role: "Baccalaureate — Biology", place: "Algeria",
    desc: "Foundational scientific studies in biology and natural sciences."
  },
  {
    year: "2023 — Now", role: "Startup & Applied Engineering", place: "Independent/Startup",
    desc: "Applied engineering projects including award-winning TreeLamp. Building functional prototypes and automation-oriented solutions."
  },
  {
    year: "Past — Now", role: "Competitive Sports", place: "Algeria",
    desc: "Competitive athletic background demonstrating discipline, consistency, and a high-performance mindset."
  },
];

// ── CANVAS PARTICLE SYSTEM ────────────────────────────────────────────────────
function ParticleCanvas({ theme }: { theme: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W: number, H: number, particles: any[] = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const N = Math.min(120, Math.floor(window.innerWidth / 14));
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.4,
        base: Math.random(),
      });
    }

    const accent = theme === "dark" ? "#00ffe7" : "#0060cc";
    const CONN = 120;
    const REPEL = 100;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.current.x, my = mouse.current.y;

      for (const p of particles) {
        // repel from cursor
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL) {
          const f = (REPEL - dist) / REPEL * 0.6;
          p.vx += dx / dist * f;
          p.vy += dy / dist * f;
        }
        // dampen
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        // wrap
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        // draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent + (theme === "dark" ? "99" : "55");
        ctx.fill();
      }

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONN) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - d / CONN) * (theme === "dark" ? 0.22 : 0.12);
            ctx.strokeStyle = accent + Math.round(alpha * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [theme]);

  return (
    <canvas ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.9 }} />
  );
}

// ── GLITCH TEXT ───────────────────────────────────────────────────────────────
function Glitch({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="glitch-base">{text}</span>
      <span className="glitch-a" aria-hidden>{text}</span>
      <span className="glitch-b" aria-hidden>{text}</span>
    </span>
  );
}

// ── MAGNETIC BUTTON ───────────────────────────────────────────────────────────
function MagBtn({ children, href = "#", className = "", onClick, style }: { children: ReactNode; href?: string; className?: string; onClick?: () => void; style?: any }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a ref={ref} href={href} onClick={onClick}
      style={{ ...style, x, y }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      className={`magnetic ${className}`}
      whileTap={{ scale: 0.94 }}>
      {children}
    </motion.a>
  );
}

// ── REVEAL ON SCROLL ──────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, y = 40, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) => (
  <motion.div className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
);

// ── SKILL BAR ─────────────────────────────────────────────────────────────────
function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });
  const width = useTransform(scrollYProgress, [0, 0.8], ["0%", pct + "%"]);
  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between text-xs font-mono mb-1" style={{ color: "var(--muted)" }}>
        <span>{label}</span><span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-[2px] rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-full rounded-full" style={{ width, background: `linear-gradient(90deg,${color},${color}44)`, boxShadow: `0 0 8px ${color}88` }} />
      </div>
    </div>
  );
}

// ── CURSOR ────────────────────────────────────────────────────────────────────
function Cursor({ theme }: { theme: string }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const rpos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const hov = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const enter = () => { hov.current = true; };
    const leave = () => { hov.current = false; };

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,.magnetic").forEach(el => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    const tick = () => {
      if (!dot.current || !ring.current) return;
      dot.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.12;
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.12;
      const s = hov.current ? 2.4 : 1;
      ring.current.style.transform =
        `translate(${rpos.current.x - 18}px,${rpos.current.y - 18}px) scale(${s})`;
      ring.current.style.opacity = hov.current ? "0.6" : "1";
      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", move);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const accent = theme === "dark" ? "#00ffe7" : "#0060cc";
  return (
    <>
      <div ref={dot} className="cursor-dot" style={{ background: accent }} />
      <div ref={ring} className="cursor-ring" style={{ borderColor: accent }} />
    </>
  );
}

// ── GRID BACKGROUND ───────────────────────────────────────────────────────────
function GridBg({ theme }: { theme: string }) {
  const c = theme === "dark" ? "rgba(0,255,231,0.03)" : "rgba(0,80,200,0.04)";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px)`,
      backgroundSize: "60px 60px",
    }} />
  );
}

// ── SCANLINES ─────────────────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none",
      backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)",
    }} />
  );
}

// ── NOISE ─────────────────────────────────────────────────────────────────────
function Noise() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.032,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "200px",
    }} />
  );
}

// ── FLOATING SHAPES ───────────────────────────────────────────────────────────
function FloatingShapes({ theme }: { theme: string }) {
  const accent = theme === "dark" ? "#00ffe7" : "#0060cc";
  const shapes = [
    { size: 320, x: "8%", y: "15%", dur: 18, delay: 0, opacity: 0.04 },
    { size: 200, x: "78%", y: "8%", dur: 22, delay: 3, opacity: 0.05 },
    { size: 260, x: "60%", y: "55%", dur: 16, delay: 6, opacity: 0.03 },
    { size: 140, x: "20%", y: "70%", dur: 24, delay: 1.5, opacity: 0.06 },
    { size: 180, x: "88%", y: "78%", dur: 20, delay: 4, opacity: 0.04 },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {shapes.map((s, i) => (
        <motion.div key={i}
          style={{
            position: "absolute", left: s.x, top: s.y,
            width: s.size, height: s.size, borderRadius: "50%",
            border: `1px solid ${accent}`,
            opacity: s.opacity,
          }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360], opacity: [s.opacity, s.opacity * 1.8, s.opacity] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "linear" }} />
      ))}
      {/* diagonal lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div key={"l" + i}
          style={{
            position: "absolute",
            left: `${10 + i * 20}%`, top: 0, bottom: 0,
            width: "1px",
            background: `linear-gradient(transparent,${accent}18,transparent)`,
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 4 + i, delay: i * 1.2, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

// ── TERMINAL CARD ─────────────────────────────────────────────────────────────
function Terminal({ theme }: { theme: string }) {
  const lines = [
    { p: true, txt: "whoami" },
    { p: false, txt: "chams_eddine_touahria", col: "#7ee787" },
    { p: true, txt: "cat expertise.json" },
    { p: false, txt: '{ "mining": true, "valorization": true,', col: "var(--text)" },
    { p: false, txt: '  "automation": true, "web": true }', col: "var(--text)" },
    { p: true, txt: "echo $STATUS" },
    { p: false, txt: "INNOVATING 🚀", col: "#00ffe7" },
    { p: true, txt: "_", blink: true },
  ];
  const [vis, setVis] = useState(0);
  useEffect(() => {
    if (vis >= lines.length) return;
    const t = setTimeout(() => setVis(v => v + 1), 280);
    return () => clearTimeout(t);
  }, [vis]);

  const accent = theme === "dark" ? "#00ffe7" : "#0060cc";
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: theme === "dark" ? "rgba(5,10,22,0.92)" : "rgba(225,234,255,0.92)",
        border: `1px solid ${accent}22`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 60px ${accent}18, inset 0 0 40px ${accent}04`,
      }}
      className="rounded-lg p-5 w-72 font-mono text-xs select-none">
      {/* window buttons */}
      <div className="flex gap-1.5 mb-4">
        {["#ff5f56", "#ffbd2e", "#27c93f"].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
      </div>
      {lines.slice(0, vis).map((l, i) => (
        <div key={i} className="leading-6">
          {l.p
            ? <><span style={{ color: accent }}>~/dmc $ </span><span style={{ color: "var(--text)" }}>{l.blink ? <><span className="blink-cursor" style={{ background: accent }} /></> : l.txt}</span></>
            : <span style={{ color: l.col }}>{l.txt}</span>}
        </div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function Portfolio() {
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const T = theme === "dark" ? DARK : LIGHT;

  const css = `
    :root {
      --bg:${T.bg};--bg2:${T.bg2};--surface:${T.surface};
      --text:${T.text};--muted:${T.muted};--bright:${T.bright};
      --accent:${T.accent};--accent2:${T.accent2};--accent3:${T.accent3};
      --border:${T.border};--shadow:${T.shadow};
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    html{scroll-behavior:smooth;}
    body{
      background:var(--bg);color:var(--text);
      font-family:'Syne',sans-serif;
      transition:background 0.5s,color 0.5s;
      cursor:none;
      overflow-x:hidden;
    }
    /* Custom scrollbar */
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-track{background:var(--bg);}
    ::-webkit-scrollbar-thumb{background:var(--accent);border-radius:2px;}
    /* Cursor */
    .cursor-dot{position:fixed;width:8px;height:8px;border-radius:50%;top:0;left:0;pointer-events:none;z-index:9999;transition:none;}
    .cursor-ring{position:fixed;width:36px;height:36px;border-radius:50%;border:1.5px solid;top:0;left:0;pointer-events:none;z-index:9999;transition:border-color 0.3s,opacity 0.3s;transition-property:border-color,opacity;}
    /* Glitch */
    .glitch-base{position:relative;}
    .glitch-a,.glitch-b{position:absolute;top:0;left:0;width:100%;height:100%;}
    .glitch-a{color:var(--accent2);animation:ga 3.5s infinite linear;clip-path:inset(0 0 90% 0);}
    .glitch-b{color:var(--accent);animation:gb 2.8s infinite linear 0.4s;clip-path:inset(70% 0 0 0);}
    @keyframes ga{0%{clip-path:inset(0 0 95% 0);transform:translate(-2px,0)}20%{clip-path:inset(30% 0 60% 0);transform:translate(2px,0)}40%{clip-path:inset(60% 0 30% 0);transform:translate(-1px,0)}60%{clip-path:inset(80% 0 10% 0);transform:translate(1px,0)}80%{clip-path:inset(10% 0 80% 0);transform:translate(-2px,0)}100%{clip-path:inset(0 0 95% 0);transform:translate(0,0)}}
    @keyframes gb{0%{clip-path:inset(85% 0 0 0);transform:translate(2px,0)}25%{clip-path:inset(50% 0 40% 0);transform:translate(-2px,0)}50%{clip-path:inset(70% 0 20% 0);transform:translate(1px,0)}75%{clip-path:inset(90% 0 5% 0);transform:translate(-1px,0)}100%{clip-path:inset(85% 0 0 0);transform:translate(0,0)}}
    /* Blink */
    .blink-cursor{display:inline-block;width:8px;height:13px;vertical-align:middle;animation:bl 1s step-end infinite;}
    @keyframes bl{0%,100%{opacity:1}50%{opacity:0}}
    /* Magnetic */
    .magnetic{display:inline-block;cursor:none;}
    /* Clip angled */
    .clip-btn{clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);}
    /* Section fade lines */
    .line-fade{width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);}
    /* Hover card */
    .hover-card{transition:transform 0.35s ease,box-shadow 0.35s ease,border-color 0.35s ease;}
    .hover-card:hover{transform:translateY(-6px);box-shadow:0 24px 60px var(--shadow);}
    /* Tag pill */
    .tag-pill{font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:0.07em;padding:3px 10px;border-radius:2px;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);transition:all 0.2s;}
    /* Progress bar container */
    .bar-track{height:2px;border-radius:9px;background:rgba(255,255,255,0.05);overflow:hidden;}
    /* Timeline dot */
    .tl-dot{position:absolute;left:-4px;top:8px;width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 12px var(--accent);}
    /* Contact card */
    .cc{clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));transition:all 0.3s;}
    .cc:hover{transform:translateY(-5px);}
    /* Gradient text */
    .grad-text{background:linear-gradient(135deg,var(--accent),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    /* Orb glow */
    .orb{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;transition:background 0.5s;}
    /* Nav blur */
    .nav-blur{backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);}
    /* Mobile menu */
    @media(max-width:768px){body{cursor:auto;}.cursor-dot,.cursor-ring{display:none;}}
  `;

  return (
    <>
      <style>{css}</style>

      {/* ── BACKGROUNDS ── */}
      <GridBg theme={theme} />
      <Noise />
      <Scanlines />
      <ParticleCanvas theme={theme} />
      <FloatingShapes theme={theme} />

      {/* orb glows */}
      <div className="orb" style={{ width: 500, height: 500, top: -180, left: -180, background: theme === "dark" ? "rgba(0,255,231,0.05)" : "rgba(0,100,255,0.04)" }} />
      <div className="orb" style={{ width: 600, height: 600, bottom: -220, right: -180, background: theme === "dark" ? "rgba(124,58,237,0.05)" : "rgba(100,0,200,0.04)" }} />

      {/* ── CURSOR ── */}
      <Cursor theme={theme} />

      {/* ── SCROLL PROGRESS ── */}
      <motion.div style={{
        scaleX, transformOrigin: "left",
        position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9997,
        background: `linear-gradient(90deg,${T.accent},${T.accent3})`,
        boxShadow: `0 0 12px ${T.accent}`,
      }} />

      {/* ══════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="nav-blur fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: theme === "dark" ? "rgba(4,6,14,0.88)" : "rgba(230,238,255,0.88)", borderBottom: `1px solid ${T.border}` }}>

        <motion.span
          className="font-['Orbitron'] font-black text-sm tracking-[0.25em] cursor-none"
          style={{ color: T.accent, textShadow: `0 0 20px ${T.accent}66` }}
          whileHover={{ textShadow: `0 0 30px ${T.accent}` }}>
          T.CDE
        </motion.span>

        {/* desktop links */}
        <div className="hidden md:flex gap-8">
          {NAV.map(n => (
            <motion.a key={n} href={`#${n.toLowerCase()}`}
              className="font-mono text-xs tracking-[0.15em] cursor-none transition-colors"
              style={{ color: T.muted, textDecoration: "none" }}
              whileHover={{ color: T.accent }}
              transition={{ duration: 0.2 }}>
              {n.toUpperCase()}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* theme toggle */}
          <motion.button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            className="font-mono text-xs tracking-widest px-4 py-1.5 rounded cursor-none transition-all"
            style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.muted }}
            whileHover={{ borderColor: T.accent, color: T.accent }}
            whileTap={{ scale: 0.93 }}>
            {theme === "dark" ? "☀ LIGHT" : "◑ DARK"}
          </motion.button>

          <MagBtn href="#contact"
            className="font-mono text-xs tracking-[0.15em] px-5 py-2 clip-btn"
            style={{ background: T.accent, color: T.bg, textDecoration: "none", fontFamily: "'Share Tech Mono'" }}>
            HIRE ME
          </MagBtn>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-16 px-8 md:px-16 z-10">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 36, height: 1, background: T.accent2, boxShadow: `0 0 8px ${T.accent2}` }} />
                <span className="font-mono text-xs tracking-[0.3em]" style={{ color: T.accent2 }}>
                  MINING ENGINEER / MINERAL VALORIZATION
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-['Orbitron'] font-black leading-none mb-2 select-none"
                style={{ fontSize: "clamp(2.6rem,6vw,5.5rem)", color: T.bright }}>
                <Glitch text="TOUAHRIA" />
              </h1>
              <h1 className="font-['Orbitron'] font-black leading-none mb-6 select-none"
                style={{ fontSize: "clamp(2.6rem,6vw,5.5rem)" }}>
                <span className="grad-text">CHAMS EDDINE</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="font-mono text-sm tracking-[0.25em] mb-6 uppercase"
                style={{ color: T.muted }}>
                Mineral Resources · Automation · Software
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-base leading-8 mb-10 max-w-lg" style={{ color: T.text }}>
                I build industrial-grade systems that bridge mineral processing with automation —
                from resource recovery prototypes to full-stack engineering dashboards.
                Based in <span style={{ color: T.accent }}>Algeria</span>.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <MagBtn href="#projects"
                  className="px-8 py-3 clip-btn font-mono text-sm tracking-[0.15em]"
                  style={{
                    background: T.accent, color: T.bg, textDecoration: "none",
                    boxShadow: `0 0 30px ${T.accent}44`
                  }}>
                  VIEW PROJECTS
                </MagBtn>
                <MagBtn href="#contact"
                  className="px-8 py-3 clip-btn font-mono text-sm tracking-[0.15em]"
                  style={{
                    background: "transparent", border: `1px solid ${T.border}`,
                    color: T.text, textDecoration: "none"
                  }}>
                  GET IN TOUCH
                </MagBtn>
              </div>
            </Reveal>
          </div>

          {/* Terminal */}
          <div className="hidden lg:flex justify-center">
            <Terminal theme={theme} />
          </div>
        </div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
          <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: T.muted }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(${T.accent},transparent)` }} />
        </motion.div>
      </section>

      <div className="line-fade mx-8 z-10 relative" />

      {/* ══════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════ */}
      <section id="about" className="relative z-10 py-28 px-8 md:px-16 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono text-xs tracking-[0.35em]" style={{ color: T.accent }}>01 // ABOUT</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${T.border},transparent)` }} />
          </div>
          <h2 className="font-['Orbitron'] font-bold mb-10" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: T.bright }}>
            WHO <span className="grad-text">AM I</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-8" style={{ color: T.text }}>
              <p>I'm <span style={{ color: T.accent, fontWeight: 600 }}>Chamseddine Touahria</span> — a Mining Engineer specialized in mineral resources valorization, with a deep focus on industrial automation and resource recovery.</p>
              <p>My expertise combines <span style={{ color: T.accent }}>mineral processing</span> and <span style={{ color: T.accent }}>recycling technologies</span> with modern software tools like <span style={{ color: T.accent3 }}>Python</span> and <span style={{ color: T.accent3 }}>Next.js</span>. Fluent in Arabic and English.</p>
              <p>With an MSc in Mineral Resources Valorization (2025), I aim to optimize industrial processes through smart system design and functional prototyping.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4">
            {([["3rd", "Year Engineering Student"], ["DZ", "Based in Algeria"], ["∞", "Curiosity Level"], ["24/7", "Available to Build"]] as const).map(([n, d], i) => (
              <Reveal key={n} delay={0.15 + i * 0.08}>
                <motion.div
                  className="hover-card p-5 rounded-lg"
                  style={{
                    background: T.bg2, border: `1px solid ${T.border}`,
                    position: "relative", overflow: "hidden"
                  }}
                  whileHover={{ borderColor: T.accent + "55" }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg,${T.accent},transparent)`
                  }} />
                  <div className="font-['Orbitron'] font-bold mb-1" style={{ fontSize: "2rem", color: T.accent }}>{n}</div>
                  <div className="font-mono text-xs tracking-wide" style={{ color: T.muted }}>{d}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="line-fade mx-8 z-10 relative" />

      {/* ══════════════════════════════════════════════════
          SKILLS
      ══════════════════════════════════════════════════ */}
      <section id="skills" className="relative z-10 py-28 px-8 md:px-16 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono text-xs tracking-[0.35em]" style={{ color: T.accent }}>02 // SKILLS</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${T.border},transparent)` }} />
          </div>
          <h2 className="font-['Orbitron'] font-bold mb-10" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: T.bright }}>
            WHAT I <span className="grad-text">DO</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SKILLS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <motion.div className="hover-card p-6 rounded-lg h-full"
                style={{ background: T.bg2, border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}
                whileHover={{ borderColor: s.color + "55" }}>
                {/* corner glow */}
                <div style={{
                  position: "absolute", top: 0, right: 0, width: 80, height: 80,
                  background: `radial-gradient(circle at top right,${s.color}12,transparent 70%)`
                }} />
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg,${s.color},transparent)`
                }} />

                <div className="text-3xl mb-4" style={{ color: s.color, textShadow: `0 0 20px ${s.color}88` }}>{s.icon}</div>
                <div className="font-['Syne'] font-bold text-base tracking-wider uppercase mb-4" style={{ color: T.bright }}>{s.title}</div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {s.tags.map(t => (
                    <span key={t} className="tag-pill" style={{ border: `1px solid ${s.color}33`, color: s.color + "cc", background: s.color + "0d" }}>{t}</span>
                  ))}
                </div>

                {s.bars.map(([label, pct]) => (
                  <SkillBar key={label as string} label={label as string} pct={pct as number} color={s.color} />
                ))}
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="line-fade mx-8 z-10 relative" />

      {/* ══════════════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════════════ */}
      <section id="projects" className="relative z-10 py-28 px-8 md:px-16 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono text-xs tracking-[0.35em]" style={{ color: T.accent }}>03 // PROJECTS</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${T.border},transparent)` }} />
          </div>
          <h2 className="font-['Orbitron'] font-bold mb-10" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: T.bright }}>
            WHAT I'VE <span className="grad-text">BUILT</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full h-64 flex items-center justify-center font-mono text-xs tracking-widest" style={{ color: T.muted }}>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                INITIALIZING DATA STREAM...
              </motion.div>
            </div>
          ) : projects.map((p, i) => (
            <Reveal key={p.id || p.title} delay={i * 0.1}>
              <motion.div className="hover-card rounded-lg overflow-hidden flex flex-col"
                style={{ background: T.bg2, border: `1px solid ${T.border}` }}
                whileHover={{ borderColor: (p.badge_color || "#00ffe7") + "55" }}>
                {/* banner */}
                <div className="relative flex items-center justify-center" style={{ height: 160, overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `linear-gradient(${p.badge_color || "#00ffe7"}08 1px,transparent 1px),linear-gradient(90deg,${p.badge_color || "#00ffe7"}08 1px,transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }} />
                  <motion.div
                    animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ position: "absolute", width: 140, height: 140, border: `1px solid ${p.badge_color || "#00ffe7"}22`, borderRadius: "50%" }} />
                  <motion.div
                    animate={{ rotate: [360, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    style={{ position: "absolute", width: 90, height: 90, border: `1px solid ${p.badge_color || "#00ffe7"}33`, borderRadius: "50%" }} />
                  <span style={{ fontSize: "2.5rem", textShadow: `0 0 30px ${p.badge_color || "#00ffe7"}`, position: "relative", zIndex: 1 }}>{p.glyph}</span>
                  {/* badge */}
                  <span className="tag-pill absolute top-3 right-3"
                    style={{ border: `1px solid ${p.badge_color || "#00ffe7"}`, color: p.badge_color || "#00ffe7", background: (p.badge_color || "#00ffe7") + "15", zIndex: 2 }}>
                    {p.badge}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="font-['Syne'] font-bold text-base tracking-wider uppercase mb-3" style={{ color: T.bright }}>{p.title}</div>
                  <div className="text-sm leading-7 mb-4 flex-1" style={{ color: T.muted }}>{p.description}</div>
                  <div className="flex flex-wrap gap-2">
                    {(p.tech || []).map(t => (
                      <span key={t} className="tag-pill"
                        style={{ border: `1px solid ${T.accent3}33`, color: T.accent3 + "cc", background: T.accent3 + "0d" }}>{t}</span>
                    ))}
                  </div>
                  {p.link && (
                    <motion.a href={p.link} target="_blank" rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors"
                      style={{ color: T.accent }}
                      whileHover={{ x: 5 }}>
                      VIEW PROJECT ↗
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </Reveal>
          ))}
          {!loading && projects.length === 0 && (
            <div className="col-span-full h-64 flex items-center justify-center font-mono text-xs tracking-widest uppercase" style={{ color: T.muted }}>
              NO ACTIVE DEPLOYMENTS FOUND.
            </div>
          )}
        </div>
      </section>

      <div className="line-fade mx-8 z-10 relative" />

      {/* ══════════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════════ */}
      <section id="resume" className="relative z-10 py-28 px-8 md:px-16 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono text-xs tracking-[0.35em]" style={{ color: T.accent }}>04 // RESUME</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${T.border},transparent)` }} />
          </div>
          <h2 className="font-['Orbitron'] font-bold mb-14" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: T.bright }}>
            ACADEMIC <span className="grad-text">& CAREER</span>
          </h2>
        </Reveal>

        <div className="relative border-l border-[rgba(255,255,255,0.05)] ml-2 space-y-12">
          {TIMELINE.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="pl-10 relative">
                <div className="tl-dot" />
                <div className="font-mono text-[10px] tracking-[0.2em] mb-2" style={{ color: T.accent }}>{item.year}</div>
                <div className="font-['Syne'] font-bold text-lg mb-1" style={{ color: T.bright }}>{item.role}</div>
                <div className="font-mono text-xs tracking-wide mb-4" style={{ color: T.muted }}>{item.place}</div>
                <p className="text-sm leading-7 max-w-2xl" style={{ color: T.text }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="line-fade mx-8 z-10 relative" />

      {/* ══════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════ */}
      <section id="contact" className="relative z-10 py-28 px-8 md:px-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-4 mb-2">
                <span className="font-mono text-xs tracking-[0.35em]" style={{ color: T.accent }}>05 // CONTACT</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${T.border},transparent)` }} />
              </div>
              <h2 className="font-['Orbitron'] font-bold mb-8" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: T.bright }}>
                INITIATE <span className="grad-text">CONTACT</span>
              </h2>
              <p className="text-base leading-8 mb-12" style={{ color: T.text }}>
                I'm always open to discussing new projects, industrial challenges, or academic collaborations.
                Reach out via any of the channels below.
              </p>
            </Reveal>

            <div className="space-y-4">
              {[
                ["EMAIL", "touahriachamsdine@gmail.com", "mailto:touahriachamsdine@gmail.com"],
                ["PHONE", "+213 654 196 725", "tel:+213654196725"],
                ["INSTAGRAM", "@realchams.exe", "https://instagram.com/realchams.exe"]
              ].map(([lab, val, link], i) => (
                <Reveal key={lab} delay={0.1 + i * 0.1}>
                  <motion.a href={link} target="_blank" rel="noopener noreferrer"
                    className="cc block p-6 rounded-lg border group no-underline"
                    style={{ background: T.bg2, border: `1px solid ${T.border}` }}
                    whileHover={{ borderColor: T.accent + "44" }}>
                    <div className="font-mono text-[10px] tracking-[0.3em] mb-1 transition-colors group-hover:text-[#00ffe7]" style={{ color: T.muted }}>{lab}</div>
                    <div className="font-['Syne'] font-bold text-base transition-colors group-hover:text-white" style={{ color: T.bright }}>{val}</div>
                  </motion.a>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.3}>
            <div className="p-8 md:p-12 rounded-lg border h-full flex flex-col justify-center relative overflow-hidden"
              style={{ background: T.bg2, border: `1px solid ${T.border}` }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${T.accent},${T.accent3},transparent)` }} />
              <div className="text-center">
                <div className="text-5xl mb-6">🚀</div>
                <h3 className="font-['Orbitron'] font-bold mb-4" style={{ fontSize: "1.5rem", color: T.bright }}>READY TO BUILD</h3>
                <p className="text-sm leading-7 mb-10" style={{ color: T.muted }}>Available for freelance projects, industrial consultancy, and prototype development.</p>
                <MagBtn href="mailto:touahriachamsdine@gmail.com"
                  className="inline-block px-10 py-4 clip-btn font-mono text-sm tracking-[0.2em] no-underline"
                  style={{ background: T.accent, color: T.bg, fontWeight: 700 }}>
                  SEND MESSAGE
                </MagBtn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="relative z-10 py-12 px-8 border-t" style={{ borderColor: T.border, background: T.bg }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-['Orbitron'] font-black text-xs tracking-widest" style={{ color: T.accent }}>T.CDE // 2025</div>
          <div className="flex gap-8">
            {["INSTAGRAM", "LINKEDIN", "GITHUB"].map(l => (
              <a key={l} href="#" className="font-mono text-[9px] tracking-[0.25em] no-underline transition-colors hover:text-white text-[#3a4d70]">{l}</a>
            ))}
          </div>
          <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: T.muted }}>
            System Status: <span style={{ color: "#7ee787" }}>OPTIMAL</span>
          </div>
        </div>
      </footer>
    </>
  );
}
