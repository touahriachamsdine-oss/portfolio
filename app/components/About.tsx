'use client';

import { motion } from 'framer-motion';

export default function About() {
    return (
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative h-[500px] rounded-3xl overflow-hidden glass p-1"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    <div className="relative h-full w-full rounded-[20px] overflow-hidden bg-secondary flex items-center justify-center">
                        <span className="text-primary/20 font-orbitron font-black text-9xl rotate-90 select-none">CDE</span>
                    </div>
                </motion.div>

                <div>
                    <h2 className="text-sm font-mono text-primary uppercase tracking-[0.4em] mb-4">01 // Profile</h2>
                    <h3 className="text-4xl md:text-5xl font-orbitron font-bold mb-8">BRIDGING <br /><span className="text-gradient">ENGINEERING & CODE</span></h3>

                    <div className="space-y-6 text-muted-foreground leading-relaxed font-light">
                        <p>
                            I am <span className="text-foreground font-medium text-emerald-400 font-mono">Chamseddine Touahria</span>, a Mining Engineer pursuing a Master's in Mineral Resources Valorization (Class of 2025) at the University of Tébessa.
                        </p>
                        <p>
                            My work exists at the intersection of heavy industry and high-tech automation. I specialize in developing systems that optimize mineral processing, utilizing everything from low-level embedded sensors to high-level cloud dashboards.
                        </p>
                        <p>
                            Whether it's recycling technologies or resource recovery, I believe the future of engineering is programmable.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-12">
                        {[
                            { label: "Location", value: "Algeria (DZ)" },
                            { label: "Education", value: "MSc Mineral Resources" },
                            { label: "Focus", value: "Industrial Automation" },
                            { label: "Availability", value: "Open for Projects" },
                        ].map((stat, i) => (
                            <div key={stat.label} className="border-l-2 border-primary/20 pl-4 py-2">
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</div>
                                <div className="text-sm font-bold font-orbitron">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
