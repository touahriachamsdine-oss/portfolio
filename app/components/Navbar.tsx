'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const NAV_ITEMS = ['About', 'Skills', 'Projects', 'Contact'];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${isScrolled ? 'glass py-3' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <motion.div
                    className="text-2xl font-orbitron font-bold text-primary tracking-tighter"
                    whileHover={{ scale: 1.05 }}
                >
                    CDE.T
                </motion.div>

                <div className="hidden md:flex gap-8 items-center">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                        >
                            {item}
                        </a>
                    ))}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                        Hire Me
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
}
