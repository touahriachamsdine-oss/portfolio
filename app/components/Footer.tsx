'use client';

export default function Footer() {
    return (
        <footer id="contact" className="py-20 px-6 border-t border-border/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                <div>
                    <div className="text-2xl font-orbitron font-bold text-primary mb-4 tracking-tighter">CDE.T</div>
                    <p className="text-sm text-muted-foreground font-light max-w-xs">
                        Pioneering the next wave of industrial valorization through digital precision.
                    </p>
                </div>

                <div className="flex gap-12">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[.3em] font-bold mb-6 text-primary">Links</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#projects" className="hover:text-primary transition-colors">Projects</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[.3em] font-bold mb-6 text-primary">Contact</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="mailto:contact@example.com" className="hover:text-primary transition-colors">Mail</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-border/20 flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>© 2026 Chams Eddine Touahria. All Rights Reserved.</span>
                <span>Built with Precision & Code.</span>
            </div>
        </footer>
    );
}
