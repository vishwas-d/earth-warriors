import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowRight, Droplets, Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const links = [
    ["/", "Home"],
    ["/research", "Research"],
    ["/ground-work", "Ground Work"],
    ["/blogs", "Blogs"],
  ];
  return (
    <header className={`site-header site-header-overlay${pathname === "/" ? "" : " site-header-subpage"}${pathname === "/research" || pathname === "/about" || pathname.startsWith("/blogs") ? " site-header-blue" : ""}${pathname.startsWith("/blogs") ? " site-header-blogs" : ""}`}>
      <div className="nav-wrap">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <img className="brand-logo" src="/earth-warriors-logo.png" alt="Earth Warriors — Yamuna Action Network" />
          <span className="brand-caption">Protecting Nature,<br />Securing Tomorrow</span>
        </Link>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="primary-navigation">
          {open ? <X /> : <Menu />}
        </button>
        <nav id="primary-navigation" className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <Link className="button button-small button-green nav-cta" to="/ground-work" onClick={() => setOpen(false)}>
            Get involved <ArrowRight size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <Link className="brand brand-light" to="/">
            <img className="brand-logo" src="/earth-warriors-logo.png" alt="Earth Warriors — Yamuna Action Network" />
          </Link>
          <p>Evidence, accountability and community action for a healthier Yamuna.</p>
        </div>
        <div><h4>Explore</h4><Link to="/research">Research</Link><Link to="/ground-work">Ground Work</Link><Link to="/blogs">Blogs & news</Link></div>
        <div><h4>Connect</h4><span>Delhi NCR · India</span><span>Contact details to be verified</span></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Earth Warriors</span><span>Demo content requires verification. Information is not legal or scientific advice.</span></div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <><div className="site-top"><Header /></div><main key={pathname}>{children}</main><Footer /></>;
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={light ? "eyebrow eyebrow-light" : "eyebrow"}><span />{children}</div>;
}

export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className="section-title" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</motion.div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ui-card ${className}`}>{children}</div>;
}

export function ButtonLink({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) {
  return <Link className={secondary ? "button button-outline" : "button button-green"} to={to}>{children}<ArrowRight size={16} /></Link>;
}

export function StatRibbon({ stats }: { stats: { value: string; unit: string; label: string; note: string }[] }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className="stat-ribbon" initial={reduceMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.45 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.09 } } }}>{stats.map((stat) => (
    <motion.div className="stat-item" key={stat.label} variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}><div className="stat-value">{stat.value}<small>{stat.unit}</small></div><div className="stat-label">{stat.label}</div><div className="stat-note">{stat.note}</div></motion.div>
  ))}</motion.div>;
}

export function MediaStrip({ outlets }: { outlets: string[] }) {
  return <div className="media-strip"><span>IN THE NEWS</span><div>{outlets.map((outlet) => <strong key={outlet}>{outlet}</strong>)}</div></div>;
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2, margin: "-30px" }} transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function Tag({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "neutral" }) {
  return <span className={`tag tag-${tone}`}><Leaf size={12} />{children}</span>;
}

export function PageHero({ eyebrow, title, description, image, imageAlt }: { eyebrow: string; title: string; description: string; image?: string; imageAlt?: string }) {
  const reduceMotion = useReducedMotion();
  return <section className={`page-hero${image ? " page-hero-imaged" : ""}`}>
    {image && <img className="page-hero-image" src={image} alt={imageAlt ?? ""} />}
    <div className="container page-hero-copy">
      <Eyebrow light>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    {!image && <motion.div className="page-hero-art" aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, scale: 0.82, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.18, ease: "easeOut" }}><ArrowDownRight className="page-hero-icon" size={190} strokeWidth={0.7} /></motion.div>}
  </section>;
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><Droplets /><strong>{title}</strong><p>{text}</p></div>;
}

export function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const style = { "--compare-position": `${position}%` } as CSSProperties;
  return <div className="compare-card">
    <div className="compare-frame" style={style}>
      <img src={before} alt="Sample fieldwork image one" />
      <div className="compare-after"><img src={after} alt="Sample fieldwork image two" /></div>
      <span className="compare-label compare-label-before">Image A</span>
      <span className="compare-label compare-label-after">Image B</span>
      <span className="compare-divider" aria-hidden="true" />
    </div>
    <label className="compare-control">Compare images<input type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Adjust the image comparison slider" /></label>
    <p>Interactive preview only — these photos are not a verified before-and-after pair.</p>
  </div>;
}
