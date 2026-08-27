import React from 'react';
import { Heart, Code2, Dumbbell, ShieldCheck, Database, Server, Atom, Palette, Cpu } from 'lucide-react';
import './Footer.scss';

const techStack = [
    { name: 'React', icon: Atom, color: '#06B6D4' },
    { name: 'Node.js', icon: Server, color: '#10B981' },
    { name: 'Express', icon: Cpu, color: '#CBD5E1' },
    { name: 'MongoDB', icon: Database, color: '#34D399' },
    { name: 'SCSS', icon: Palette, color: '#EC4899' },
    { name: 'JWT', icon: ShieldCheck, color: '#F59E0B' },
];

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                {/* Brand / Motivation Quote */}
                <div className="footer-brand-section">
                    <div className="footer-motto">
                        <Dumbbell size={18} className="motto-icon" />
                        <span>"LIGHT WEIGHT BABY! YEAH BUDDY!" — HARDCORE FITNESS TRACKER</span>
                    </div>
                </div>

                {/* Developer Credit & Signature */}
                <div className="footer-creator">
                    <p className="creator-text">
                        Developed with <Heart size={15} className="heart-icon" /> by{' '}
                        <span className="creator-name">Gokul Krishna</span>
                    </p>
                    <span className="platform-tag">FitTrack Pro v2.0 • Ultra Dark Edition</span>
                </div>

                {/* Tech Stack Pills */}
                <div className="footer-tech-stack">
                    <span className="stack-label">
                        <Code2 size={14} /> TECH STACK:
                    </span>
                    <div className="tech-pills-list">
                        {techStack.map((tech) => {
                            const IconComponent = tech.icon;
                            return (
                                <span key={tech.name} className="tech-pill" style={{ '--tech-color': tech.color }}>
                                    <IconComponent size={13} className="tech-icon" />
                                    {tech.name}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
