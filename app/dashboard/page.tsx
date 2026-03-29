"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isAuth, setIsAuth] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);

    // Industrial Theme Colors
    const T = {
        bg: "#04060e",
        bg2: "#080c1a",
        text: "#c4d4f0",
        muted: "#3a4d70",
        bright: "#ffffff",
        accent: "#00ffe7",
        accent2: "#ff2d6b",
        border: "rgba(0,255,231,0.13)",
    };

    useEffect(() => {
        if (isAuth) {
            fetchProjects();
        }
    }, [isAuth]);

    async function fetchProjects() {
        setLoading(true);
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const techInput = formData.get('tech') as string;
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            glyph: formData.get('glyph') as string,
            badge: formData.get('badge') as string,
            badge_color: formData.get('badge_color') as string,
            tech: techInput ? techInput.split(',').map(s => s.trim()) : [],
            link: formData.get('link') as string,
        };

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                fetchProjects();
                e.currentTarget.reset();
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteProject(id: string) {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    }

    if (!isAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 font-mono" style={{ background: T.bg, color: T.text }}>
                <style>{`
          input { background: ${T.bg2}; border: 1px solid ${T.border}; color: ${T.text}; padding: 10px; outline: none; }
          button { background: ${T.accent}; color: ${T.bg}; padding: 10px 20px; border: none; cursor: pointer; font-weight: bold; }
          button:hover { filter: brightness(1.2); }
        `}</style>
                <div className="w-full max-w-md p-8 rounded-lg border" style={{ borderColor: T.border, background: T.bg2 }}>
                    <div className="text-xs tracking-[0.3em] mb-8 text-center" style={{ color: T.accent }}>ACCESS RESTRICTED // SECURE TERMINAL</div>
                    <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); if (password === "chams_admin") setIsAuth(true); else alert("INVALID CREDENTIALS"); }}>
                        <input type="password" placeholder="ENTER ACCESS KEY" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">AUTHENTICATE</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 md:p-16 font-mono" style={{ background: T.bg, color: T.text }}>
            <style>{`
        input, textarea { background: ${T.bg2}; border: 1px solid ${T.border}; color: ${T.text}; padding: 8px; outline: none; width: 100%; font-size: 12px; }
        label { font-size: 10px; color: ${T.accent}; display: block; margin-bottom: 4px; tracking: 0.1em; }
        .btn-sm { padding: 4px 8px; border-radius: 2px; font-size: 10px; cursor: pointer; border-style: solid; border-width: 1px; }
      `}</style>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-xl tracking-[0.25em]" style={{ color: T.bright }}>PROJECT <span style={{ color: T.accent }}>DASHBOARD</span></h1>
                    <button className="btn-sm" onClick={() => setIsAuth(false)} style={{ borderColor: T.border, color: T.muted }}>DISCONNECT</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-1">
                        <div className="p-6 rounded-lg border sticky top-8" style={{ borderColor: T.border, background: T.bg2 }}>
                            <div className="text-[10px] mb-6 tracking-widest uppercase">Add New Deployment</div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div><label>TITLE</label><input name="title" required /></div>
                                <div><label>DESCRIPTION</label><textarea name="description" rows={3} required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label>GLYPH (EMOJI)</label><input name="glyph" placeholder="🌱" defaultValue="🌱" /></div>
                                    <div><label>BADGE</label><input name="badge" placeholder="Award" defaultValue="Award" /></div>
                                </div>
                                <div><label>BADGE COLOR (HEX)</label><input name="badge_color" placeholder="#00ffe7" defaultValue="#00ffe7" /></div>
                                <div><label>TECH (COMMA SEPARATED)</label><input name="tech" placeholder="React, Next.js, API" /></div>
                                <div><label>LINK (OPTIONAL)</label><input name="link" placeholder="https://..." /></div>
                                <button type="submit" className="mt-4" style={{ background: T.accent, color: T.bg, padding: '12px', fontWeight: 'bold' }}>DEPLOY PROJECT</button>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2">
                        <div className="text-[10px] mb-6 tracking-widest uppercase" style={{ color: T.muted }}>Active Deployments ({projects.length})</div>
                        <div className="flex flex-col gap-4">
                            <AnimatePresence>
                                {projects.map(p => (
                                    <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                        className="p-4 rounded border flex justify-between items-start" style={{ borderColor: T.border, background: 'rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-lg">{p.glyph}</span>
                                                <span className="font-bold text-sm tracking-wider" style={{ color: T.bright }}>{p.title}</span>
                                            </div>
                                            <div className="text-xs line-clamp-1 mb-2" style={{ color: T.muted }}>{p.description}</div>
                                            <div className="flex gap-2">
                                                {p.tech.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 border" style={{ borderColor: T.border, color: T.muted }}>{t}</span>)}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="btn-sm" onClick={() => deleteProject(p.id)} style={{ borderColor: T.accent2, color: T.accent2 }}>DELETE</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
