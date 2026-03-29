'use client';

import { motion } from 'framer-motion';

const SKILLS = [
    {
        category: "Mining & Mineral",
        color: "#10b981",
        items: ["Mineral Processing", "Resource Recovery", "Characterization", "Industrial Valorization"]
    },
    {
        category: "Automation & Systems",
        color: "#3b82f6",
        items: ["Embedded Systems", "Control Logic", "Mechatronics", "Prototype Dev"]
    },
    {
        category: "Software Engineering",
        color: "#8b5cf6",
        items: ["Python", "Next.js / React", "REST APIs", "System Integration"]
    }
];

export default function Skills() {
    return (
        <section id="skills" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                <div>
                    <h2 className="text-sm font-mono text-primary uppercase tracking-[0.4em] mb-4">02 // Expertise</h2>
                    <h3 className="text-4xl md:text-5xl font-orbitron font-bold">CORE <span className="text-gradient">CAPABILITIES</span></h3>
                </div>
                <p className="max-w-md text-muted-foreground text-sm leading-relaxed text-right font-light">
                    A unique intersection of mining engineering and modern technology, enabling the development of smarter industrial tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SKILLS.map((skill, i) => (
                    <motion.div
                        key={skill.category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 glass rounded-2xl group hover:border-primary/50 transition-colors"
                    >
                        <div
                            className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center"
                            style={{ background: `${skill.color}20`, color: skill.color }}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ background: skill.color }} />
                        </div>

                        <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                            {skill.category}
                        </h4>

                        <ul className="space-y-4">
                            {skill.items.map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
