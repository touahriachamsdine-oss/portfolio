'use client';

import { motion } from 'framer-motion';

interface Project {
    id: string;
    title: string;
    description: string;
    badge: string;
    badge_color: string;
    tech: string[];
}

export default function Projects({ projects }: { projects: Project[] }) {
    return (
        <section id="projects" className="py-24 px-6 bg-secondary/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <h2 className="text-sm font-mono text-primary uppercase tracking-[0.4em] mb-4">03 // Portfolio</h2>
                        <h3 className="text-4xl md:text-5xl font-orbitron font-bold">LATEST <span className="text-gradient">WORK</span></h3>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-widest text-primary hover:text-emerald-400 transition-colors">
                        View All Archives →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative h-[400px] rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all"
                        >
                            {/* Decorative grid background for cards */}
                            <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />

                            <div className="absolute inset-x-0 bottom-0 z-10 p-8 glass m-4 rounded-2xl translate-y-2 group-hover:translate-y-0 transition-transform">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-2xl font-orbitron font-bold">{project.title}</h4>
                                    <span
                                        className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border"
                                        style={{ borderColor: `${project.badge_color}50`, color: project.badge_color }}
                                    >
                                        {project.badge}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 font-light">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map(t => (
                                        <span key={t} className="text-[9px] font-mono text-muted-foreground">#{t}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
