import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Beaker, BookOpen, CheckCircle2, ChevronRight, FileText, FlaskConical, Lock, MapPin, Play, Recycle, Scale, Send, ShieldCheck, Waves } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchApi, submitEffluentReport, submitRsvp, submitWaterRequest } from "./api";
import {
  campaigns, drives, mediaCoverage, parameters, posts, researchReportVideos, sampleGallery,
} from "./data";
import { BeforeAfterSlider, ButtonLink, Card, Eyebrow, PageHero, SectionTitle, Tag } from "./components";

type Post = (typeof posts)[number] & { content_markdown?: string };
type Drive = (typeof drives)[number];

function Hero() {
  const [activeStory, setActiveStory] = useState(0);
  const [outgoingStory, setOutgoingStory] = useState<number | null>(null);
  const imageTimeout = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const stories = [
    { image: "/yamuna-river-restoration.jpg", alt: "Community members gather beside foam-covered stretches of the Yamuna", title: ["Care for the river", "starts on its banks."], caption: "Riverbank watch · Field archive" },
    { image: "/yamuna-community-action.jpg", alt: "Volunteers gather during fieldwork beside the Yamuna", title: ["The Yamuna is", "part of everyday."], caption: "Community action · Field archive" },
    { image: "/yamuna-samvaad-riverbank.jpg", alt: "Community members sit together for a conversation on the riverbank", title: ["Together, we can", "care for the river."], caption: "Yamuna Samvaad · Field archive" },
  ];
  const story = stories[activeStory];
  const selectStory = (index: number) => {
    if (index === activeStory) return;
    if (imageTimeout.current !== null) window.clearTimeout(imageTimeout.current);
    setOutgoingStory(activeStory);
    setActiveStory(index);

    if (reduceMotion) {
      setOutgoingStory(null);
      return;
    }

    imageTimeout.current = window.setTimeout(() => {
      setOutgoingStory(null);
      imageTimeout.current = null;
    }, 650);
  };
  useEffect(() => () => {
    if (imageTimeout.current !== null) window.clearTimeout(imageTimeout.current);
  }, []);
  return (
    <section className="hero home-hero immersive-hero">
      {outgoingStory !== null && <img className="immersive-image immersive-image-outgoing" src={stories[outgoingStory].image} alt="" aria-hidden="true" />}
      <img key={story.image} className={`immersive-image${outgoingStory !== null ? " immersive-image-incoming" : ""}`} src={story.image} alt={story.alt} />
      <div className="immersive-scrim" />
      <motion.div className="container immersive-content" initial={reduceMotion ? false : "hidden"} animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.16 } } }}>
        <div className="immersive-copy">
          <motion.div className="hero-kicker" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduceMotion ? 0 : 0.4 }}><span />YAMUNA RIVER · DELHI NCR</motion.div>
          <motion.div key={activeStory} className="hero-story-copy" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35 }}>
            <h1>{story.title.map((line) => <span key={line}>{line}</span>)}</h1>
            <p>Fieldwork, water science and community voices for a healthier Yamuna.</p>
          </motion.div>
          <motion.div className="hero-actions" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>
            <ButtonLink to="/ground-work">Explore the work</ButtonLink>
            <ButtonLink to="/research" secondary>See the evidence</ButtonLink>
          </motion.div>
          <motion.div className="immersive-credit" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>EARTH WARRIORS <span>·</span> {story.caption}</motion.div>
        </div>
        <div className="hero-story-picker" aria-label="Featured field stories">
          <span className="story-picker-label">FROM THE FIELD</span>
          {stories.map((item, index) => <button key={item.image} type="button" className={index === activeStory ? "hero-story-option active" : "hero-story-option"} onClick={() => selectStory(index)} aria-pressed={index === activeStory}>
            <span className="story-option-number">0{index + 1}</span><span className="story-option-title">{item.caption.split(" · ")[0]}</span><ArrowRight size={15} />
          </button>)}
          <span className="story-picker-caption">Photographs from the Earth Warriors archive</span>
        </div>
      </motion.div>
      <span className="immersive-index" aria-hidden="true">A LIVING RIVER <i /> A SHARED RESPONSIBILITY</span>
    </section>
  );
}

function RiverContext() {
  return <section className="river-context" aria-labelledby="river-context-title">
    <svg className="river-flow-art" viewBox="0 0 1600 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="yamuna-water" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#83c9d2" />
          <stop offset=".48" stopColor="#4a9fb2" />
          <stop offset="1" stopColor="#276d89" />
        </linearGradient>
        <linearGradient id="yamuna-shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset=".45" stopColor="#ffffff" stopOpacity=".72" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="river-flow-bank" d="M-120 420C50 390 170 260 360 260S630 410 820 390s220-145 400-145 280 125 500-5" />
      <path className="river-flow-water" d="M-120 420C50 390 170 260 360 260S630 410 820 390s220-145 400-145 280 125 500-5" />
      <path className="river-flow-current river-flow-current-one" d="M-120 420C50 390 170 260 360 260S630 410 820 390s220-145 400-145 280 125 500-5" />
      <path className="river-flow-current river-flow-current-two" d="M-120 420C50 390 170 260 360 260S630 410 820 390s220-145 400-145 280 125 500-5" />
    </svg>
    <div className="container river-context-inner">
      <div className="river-context-copy">
        <span className="context-index">01 / THE RIVER</span>
        <h2 id="river-context-title">One river.<br /><em>Many lives along its course.</em></h2>
        <p>The Yamuna travels from the Himalayas through the northern plains before meeting the Ganga near Prayagraj. Its story is shaped by the people and places along the way.</p>
        <a href="https://www.britannica.com/place/Yamuna-River" target="_blank" rel="noreferrer">Read the river’s geography <ArrowRight size={15} /></a>
      </div>
      <div className="river-context-distance">
        <span className="river-line" aria-hidden="true" />
        <strong>1,376<span> km</span></strong>
        <small>Approximate course of the Yamuna</small>
        <a href="https://www.britannica.com/place/Yamuna-River" target="_blank" rel="noreferrer">Source: Encyclopaedia Britannica <ArrowRight size={13} /></a>
      </div>
    </div>
  </section>;
}

function Pillars() {
  const reduceMotion = useReducedMotion();
  const items = [
    { Icon: FlaskConical, number: "01", title: "Science & field research", text: "Independent water testing, outlet monitoring and visual documentation of treatment infrastructure.", link: "Explore research", to: "/research" },
    { Icon: Scale, number: "02", title: "Legal advocacy & campaigns", text: "Public records, government correspondence and citizen campaigns to demand accountable action.", link: "Read the evidence", to: "/research" },
    { Icon: Waves, number: "03", title: "Groundwork & Samvaad", text: "Community cleanups followed by open conversations about river stewardship and public welfare.", link: "See the groundwork", to: "/ground-work" },
  ];
  return <section className="section section-pale" id="our-approach"><div className="container"><SectionTitle eyebrow="Our approach" title="Change starts with seeing clearly." text="From field observations to shared action, every part of the work should be grounded in evidence and shaped with communities." /><motion.div className="pillar-grid" initial={reduceMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.14 } } }}>{items.map(({ Icon, ...item }) => <motion.div key={item.number} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}><Card className="pillar-card"><span className="pillar-number">{item.number}</span><Icon className="pillar-icon" size={26} /><h3>{item.title}</h3><p>{item.text}</p><Link className="text-link" to={item.to}>{item.link}<ArrowRight size={15} /></Link></Card></motion.div>)}</motion.div></div></section>;
}

function FieldworkGallery() {
  const stories = [
    { image: sampleGallery[0], alt: "Volunteers gather during fieldwork beside the Yamuna", label: "Community action", note: "Showing up on the ground" },
    { image: sampleGallery[1], alt: "Community members share their concerns beside the Yamuna", label: "Community voices", note: "Listening along the river" },
    { image: sampleGallery[2], alt: "Community members sit together for a conversation by the river", label: "Yamuna Samvaad", note: "Making space for dialogue" },
  ];
  return <section className="section fieldwork-section" aria-labelledby="fieldwork-heading">
    <div className="container">
      <div className="fieldwork-intro">
        <Eyebrow>From the field archive</Eyebrow>
        <h2 id="fieldwork-heading">The river is not an abstraction.</h2>
        <p>These moments from the supplied photo archive bring the people, places and work behind the evidence into view.</p>
        <Link className="text-link" to="/ground-work">Explore community work<ArrowRight size={15} /></Link>
      </div>
      <div className="fieldwork-gallery">
        {stories.map((story, index) => <figure className={`fieldwork-photo fieldwork-photo-${index + 1}`} key={story.image}>
          <img src={story.image} alt={story.alt} loading="lazy" />
          <figcaption><span>{story.label}</span><strong>{story.note}</strong></figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}

function WaysToTakePart() {
  const reduceMotion = useReducedMotion();
  const actions = [
    { number: "01", Icon: FileText, title: "Explore the evidence", text: "Browse field investigations, water-testing explainers and public correspondence.", link: "Go to research", to: "/research" },
    { number: "02", Icon: Beaker, title: "Ask about a water test", text: "Request a free water test for a water source in the Delhi NCR area.", link: "Request a test", to: "/ground-work#water-test" },
    { number: "03", Icon: Waves, title: "Meet us by the river", text: "See the community calendar and register interest in a cleanup and Yamuna Samvaad.", link: "Find a gathering", to: "/ground-work#drive" },
  ];
  return <section className="section take-part-section">
    <div className="container">
      <div className="take-part-heading">
        <Eyebrow light>Start where you are</Eyebrow>
        <h2>There’s more than one way<br />to stand for a river.</h2>
        <p>Learn, ask a question or join a community gathering. Choose a first step that feels right to you.</p>
      </div>
      <motion.div className="take-part-grid" initial={reduceMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } } }}>
        {actions.map(({ number, Icon, title, text, link, to }) => (
          <motion.div key={number} variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <Link className="take-part-card" to={to}>
              <span className="take-part-number">{number}</span>
              <span className="take-part-icon"><Icon size={22} strokeWidth={1.8} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="take-part-link">{link}<ArrowRight size={16} /></span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>;
}

function UpcomingCard() {
  const [drive] = drives.filter((item) => item.status === "Upcoming") as [Drive];
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const formElement = event.currentTarget;
      await submitRsvp({
        name: String(form.get("name")),
        email: String(form.get("email")),
        drive_date: drive.date,
      });
      setMessage("Thanks — your interest has been recorded.");
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit RSVP. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return <section className="section section-green" id="drive"><div className="container drive-layout"><div><Eyebrow light>Next community gathering</Eyebrow><h2>Clean the river.<br /><em>Continue the conversation.</em></h2><p>Join a Sunday cleanup and stay for Yamuna Samvaad: an open-air circle for thoughtful conversation and community action.</p><button className="button button-white" onClick={() => setFormOpen(!formOpen)}>I'm interested <ArrowRight size={16} /></button></div><div className="drive-card"><div className="drive-card-top"><Tag tone="amber">Upcoming · date to be confirmed</Tag><MapPin size={20} /></div><h3>{drive.location}</h3><div className="drive-detail"><span>Cleanup</span><strong>{drive.cleanupTime}</strong></div><div className="drive-detail"><span>Yamuna Samvaad</span><strong>{drive.samvaad}</strong></div>{formOpen && <form className="rsvp-form" onSubmit={handleSubmit}><label>Your name<input name="name" required maxLength={120} /></label><label>Email address<input name="email" type="email" required /></label><button className="button button-green" disabled={busy}>{busy ? "Sending…" : "Register interest"}<Send size={15} /></button></form>}{message && <p className="form-message" role="status">{message}</p>}<small>Schedule will be confirmed by the team. RSVP is an expression of interest, not a confirmed booking.</small></div></div></section>;
}

export function HomePage() {
  return <>
    <Hero />
    <RiverContext />
    <Pillars />
    <FieldworkGallery />
    <WaysToTakePart />
    <UpcomingCard />
    <section className="section section-pale"><div className="container"><div className="closing-banner">
      <div><Eyebrow>Explore the evidence</Eyebrow><h2>Curiosity is a good place to start.</h2><p>Browse field investigations, research notes and community dispatches.</p></div>
      <ButtonLink to="/blogs">Read our latest</ButtonLink>
    </div></div></section>
  </>;
}

function ReportAnalysisVideos() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const totalVideos = researchReportVideos.length;
  return <section className="section research-report-section"><div className="container">
    <div className="research-report-heading">
      <div>
        <Eyebrow>Public reports, independently reviewed</Eyebrow>
        <h2>How we analyse government reports</h2>
        <p>These video explainers examine selected public reports and water-quality data, calling attention to reported findings, methods and questions for further scrutiny.</p>
      </div>
      <div className="research-report-count"><strong>0{totalVideos}</strong><span>VIDEO<br />NOTES</span></div>
    </div>
    <div id="research-report-videos" className={`research-video-grid${showAllMobile ? " research-video-grid-expanded" : ""}`}>{researchReportVideos.map((video, index) => (
      <article className="research-video-card" key={video.videoId}>
        <div className="research-video-frame">{activeVideoId === video.videoId
          ? <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1`}
              title={video.title}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          : <button className="research-video-poster" type="button" onClick={() => setActiveVideoId(video.videoId)} aria-label={`Play ${video.title}`}>
              <img src={video.thumbnail} alt="" loading="lazy" />
              <span className="research-play-button"><Play size={18} fill="currentColor" /></span>
              <span className="research-video-poster-label">PLAY VIDEO</span>
            </button>}
        </div>
        <div className="research-video-copy">
          <div className="research-video-meta"><Tag>{video.category}</Tag><span>{String(index + 1).padStart(2, "0")} / {String(totalVideos).padStart(2, "0")}</span></div>
          <h3>{video.title}</h3>
          <div className="research-video-actions">
            <a href={`https://youtu.be/${video.videoId}`} target="_blank" rel="noreferrer">Watch video <ArrowRight size={14} /></a>
            {video.sourcePdf && <a className="research-source-link" href={video.sourcePdf} target="_blank" rel="noreferrer"><FileText size={13} /> Source report</a>}
          </div>
        </div>
      </article>
    ))}
    </div>
    <button className="research-video-more" type="button" onClick={() => setShowAllMobile(!showAllMobile)} aria-expanded={showAllMobile} aria-controls="research-report-videos">
      {showAllMobile ? "Show fewer videos" : `Show all ${totalVideos} videos`} <ArrowRight size={15} />
    </button>
    <p className="research-method-note">These are independent explainers, not official findings or endorsements. Refer to the original reports for source data and context.</p>
  </div></section>;
}

function ScienceCenter() {
  const bisLimits = [
    { number: "i", characteristic: "Colour", unit: "Hazen units, max", acceptable: "5", permissible: "15", method: "IS 3025 Part 4", remarks: "15 is permissible only when toxic substances are not suspected and no alternate source is available." },
    { number: "ii", characteristic: "Odour", unit: "", acceptable: "Agreeable", permissible: "Agreeable", method: "IS 3025 Part 5", remarks: "Test cold and when heated; test at several dilutions." },
    { number: "iii", characteristic: "pH value", unit: "", acceptable: "6.5–8.5", permissible: "No relaxation", method: "IS 3025 Part 11", remarks: "—" },
    { number: "iv", characteristic: "Taste", unit: "", acceptable: "Agreeable", permissible: "Agreeable", method: "IS 3025 Parts 7 and 8", remarks: "Test only after safety has been established." },
    { number: "v", characteristic: "Turbidity", unit: "NTU, max", acceptable: "1", permissible: "5", method: "IS 3025 Part 10", remarks: "—" },
    { number: "vi", characteristic: "Total dissolved solids", unit: "mg/L, max", acceptable: "500", permissible: "2,000", method: "IS 3025 Part 16", remarks: "—" },
  ];
  return <section className="section section-pale research-lab-section"><div className="container">
    <div className="research-lab-heading">
      <div>
        <Eyebrow>Water science</Eyebrow>
        <h2>What we measure in our lab</h2>
        <p>Our current testing covers four core indicators. BOD testing is planned as the lab expands its capabilities.</p>
      </div>
    </div>
    <div className="research-lab-dashboard">
      <a className="research-reference" href="/BIS_Drinking_Water_Specification.pdf" target="_blank" rel="noreferrer">
        <FileText size={22} />
        <span><strong>Detailed BIS Drinking Water Specifications</strong><small>Open the supplied reference PDF</small></span>
        <ArrowRight size={16} />
      </a>
      <div className="parameter-grid">{parameters.map((parameter) => <article className={`parameter-card${parameter.status === "planned" ? " parameter-card-planned" : ""}`} key={parameter.key}>
        <div className="parameter-status"><span aria-hidden="true" />{parameter.status === "current" ? "Currently measured" : "Planned"}</div>
        <span className="parameter-key">{parameter.key}</span>
        <h3>{parameter.full}</h3><p>{parameter.detail}</p><small>Commonly reported unit: {parameter.unit}</small>
      </article>)}</div>
      <div className="bis-limits">
      <div className="bis-limits-heading">
        <div><Eyebrow>BIS drinking-water reference</Eyebrow><h3>Table 1 · Organoleptic and physical parameters</h3></div>
        <span>Foreword and Clause 4</span>
      </div>
      <p className="bis-limits-scroll-hint">Scroll the table horizontally to see all columns.</p>
      <div className="bis-limits-scroll" role="region" aria-label="BIS Table 1 drinking-water limits" tabIndex={0}>
        <table className="bis-limits-table">
          <caption>BIS Table 1. Organoleptic and physical parameters (Foreword and Clause 4)</caption>
          <thead><tr><th scope="col">No.</th><th scope="col">Characteristic</th><th scope="col">Acceptable limit</th><th scope="col">Permissible limit without alternate source</th><th scope="col">Method of test</th><th scope="col">Remarks</th></tr></thead>
          <tbody>{bisLimits.map((item) => <tr key={item.number}>
            <td>{item.number}</td>
            <th scope="row"><strong>{item.characteristic}</strong>{item.unit && <small>{item.unit}</small>}</th>
            <td>{item.acceptable}</td><td>{item.permissible}</td><td>{item.method}</td><td>{item.remarks}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className="bis-limits-note"><strong>Note:</strong> BIS recommends implementing the acceptable limit. Water above that limit is considered unsuitable, though it may be tolerated where no alternate source exists, up to the permissible limit. Beyond the permissible limit, the source is to be rejected.</p>
      </div>
    </div>
  </div></section>;
}

function FactChecks() {
  return <section className="section"><div className="container"><SectionTitle eyebrow="Evidence before claims" title="Discrepancy ledger" text="A responsible fact-check links every claim to a dated source and independently verifiable evidence." /><div className="discrepancy-card">
    <div className="discrepancy-card-preview" aria-hidden="true">
      <div><Tag tone="amber">Sample structure</Tag><h3>Official claim</h3><p>No verified claim has been added to this demonstration page.</p></div>
      <ChevronRight className="discrepancy-arrow" />
      <div><Tag tone="green">Evidence needed</Tag><h3>Independent evidence</h3><p>Attach the source document, sampling method, lab report and publication date before drawing conclusions.</p></div>
    </div>
    <div className="discrepancy-lock" role="status"><span><Lock size={16} /> COMING SOON</span><p>The evidence ledger is being prepared.</p></div>
  </div></div></section>;
}

export function ResearchPage() {
  return <div className="research-page">
    <section className="research-masthead">
      <div className="container research-masthead-inner">
        <div className="research-masthead-rail"><span>INDEPENDENT RESEARCH DESK</span><span>FIELD NOTES&nbsp; / &nbsp;2026</span></div>
        <div className="research-masthead-main">
          <div className="research-masthead-title">
            <Eyebrow>Research &amp; evidence</Eyebrow>
            <h1>Evidence,<br /><em>not assumption.</em></h1>
          </div>
          <div className="research-masthead-brief">
            <span className="research-masthead-index">01 <i /> THE APPROACH</span>
            <p>We examine public reports, water-quality data and field observations—then make the sources and questions visible.</p>
            <a href="#research-report-videos">Browse report analyses <ArrowRight size={15} /></a>
          </div>
        </div>
        <div className="research-masthead-topics" aria-label="Research topics">
          <span><b>01</b> Public reports</span>
          <span><b>02</b> Water quality</span>
          <span><b>03</b> Field observations</span>
        </div>
      </div>
    </section>
    <ReportAnalysisVideos /><ScienceCenter /><FactChecks />
  </div>;
}

function WaterTestForm() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setResult("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const request = await submitWaterRequest({
        applicant_name: String(form.get("applicant_name")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        address_noida: String(form.get("address_noida")),
        water_source_type: String(form.get("water_source_type")),
      });
      setResult(`Request received. Your tracking ID is ${request.ticket_id}.`);
      formElement.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to submit. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return <form className="form-card" onSubmit={onSubmit}><div className="form-card-title"><span><Beaker /></span><div><h3>Request a free water test</h3><p>Submit your details to request a callback from the lab team.</p></div></div>  <div className="form-grid"><label>Full name<input name="applicant_name" required maxLength={120} autoComplete="name" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Phone<input name="phone" type="tel" required maxLength={24} autoComplete="tel" /></label><label>Water source<select name="water_source_type" required defaultValue=""><option value="" disabled>Select a source</option><option>Groundwater</option><option>Tap Water</option><option>Other</option></select></label><label className="full-field">Noida / Delhi NCR address<textarea name="address_noida" rows={3} required maxLength={500} autoComplete="street-address" /></label></div><button className="button button-green" disabled={busy}>{busy ? "Submitting…" : "Submit test request"}<ArrowRight size={16} /></button>{result && <p className="success-message" role="status"><CheckCircle2 size={17} />{result}</p>}{error && <p className="error-message" role="alert">{error}</p>}<small>Submitting records your request; it does not guarantee sample collection or a test appointment.</small></form>;
}

function EffluentForm() {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setFeedback("");
    const formElement = event.currentTarget;
    try {
      const result = await submitEffluentReport(new FormData(formElement));
      setFeedback(`Report submitted for review. Reference #${result.id}.`);
      formElement.reset();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not submit report.");
    } finally { setBusy(false); }
  }
  return <form className="form-card" onSubmit={onSubmit} encType="multipart/form-data"><div className="form-card-title"><span><ShieldCheck /></span><div><h3>Report a suspected discharge</h3><p>Share what you observed. Reports are reviewed before verification or escalation.</p></div></div><label>Location / drain<input name="location_drain" required maxLength={240} placeholder="Area, landmark or drain name" /></label><label>Description<textarea name="description" rows={4} required maxLength={3000} placeholder="What did you observe, and when?" /></label><label>Photo or video (optional)<input name="evidence" type="file" accept="image/*,video/mp4,video/webm" /></label><label className="check-label"><input name="anonymous" type="checkbox" value="true" /> Submit without a name</label><label>Your name (optional)<input name="reporter_name" maxLength={120} /></label><button className="button button-green" disabled={busy}>{busy ? "Submitting…" : "Submit report"}<Send size={15} /></button>{feedback && <p className="form-message" role="status">{feedback}</p>}</form>;
}

type DriveRecord = { location_ghat: string; drive_date: string | null; status: "Upcoming" | "Completed"; samvaad_topic: string };
const fallbackDriveRecords: DriveRecord[] = drives.map((drive) => ({
  location_ghat: drive.location,
  drive_date: drive.status === "Upcoming" ? null : "2025-01-12",
  status: drive.status as DriveRecord["status"],
  samvaad_topic: drive.samvaad,
}));

function DriveAndSamvaad() {
  const [items, setItems] = useState(drives);
  useEffect(() => {
    void fetchApi<DriveRecord[] | { results?: DriveRecord[] }>("/groundwork-drives/", fallbackDriveRecords).then(({ data }) => {
      const records = Array.isArray(data) ? data : data.results ?? [];
      setItems(records.map((drive) => ({
        date: drive.drive_date ?? "Upcoming — date to be confirmed",
        location: drive.location_ghat,
        cleanupTime: "Sunday morning · schedule to be confirmed",
        samvaad: drive.samvaad_topic || "Topic to be confirmed",
        status: drive.status,
      })));
    });
  }, []);
  return <section className="section section-pale" id="drive"><div className="container"><SectionTitle eyebrow="Community calendar" title="Sunday cleanup & Yamuna Samvaad" text="The date and times shown are not yet confirmed. Check back for an organizer-confirmed schedule." /><div className="drive-list">{items.map((drive, index) => <article className="drive-row" key={`${drive.status}-${drive.location}-${index}`}><span className="drive-date">{drive.date}</span><div><Tag tone={drive.status === "Upcoming" ? "amber" : "green"}>{drive.status}</Tag><h3>{drive.location}</h3><p>{drive.cleanupTime}</p><p><strong>Samvaad:</strong> {drive.samvaad}</p></div>{drive.status === "Upcoming" ? <span className="muted">Schedule to be confirmed</span> : <span className="muted">Community archive</span>}</article>)}</div><div className="gallery-grid">{sampleGallery.map((image, index) => <figure key={image}><img src={image} alt={`Community fieldwork image ${index + 1}`} loading="lazy" /><figcaption>Fieldwork archive · sample image</figcaption></figure>)}</div><div className="compare-section"><h3>Interactive image comparison</h3><BeforeAfterSlider before={sampleGallery[0]} after={sampleGallery[1]} /></div></div></section>;
}

type CampaignRecord = { campaign_title: string; hotspot_location: string; placard_slogan: string; date: string | null; impact_summary: string };

function Campaigns() {
  const [items, setItems] = useState(campaigns);
  useEffect(() => {
    const fallback: CampaignRecord[] = campaigns.map((item) => ({
      campaign_title: item.title,
      hotspot_location: item.location,
      placard_slogan: item.slogan,
      date: null,
      impact_summary: item.status,
    }));
    void fetchApi<CampaignRecord[] | { results?: CampaignRecord[] }>("/campaigns/", fallback).then(({ data }) => {
      const records = Array.isArray(data) ? data : data.results ?? [];
      setItems(records.map((item) => ({
        title: item.campaign_title,
        location: item.hotspot_location,
        slogan: item.placard_slogan,
        date: item.date ?? "Date to be confirmed",
        status: item.impact_summary || "Sample campaign entry",
      })));
    });
  }, []);
  return <section className="section"><div className="container"><SectionTitle eyebrow="Active campaigns" title="Public attention can move a conversation." text="Campaign entries are samples. Specific dates, slogans and outcomes require confirmation." /><div className="campaign-grid">{items.map((campaign, index) => <article className="campaign-card" key={campaign.title}><div className="campaign-photo" style={{ backgroundImage: `linear-gradient(180deg,#172b3b0a,#172b3bd9),url("${sampleGallery[index % sampleGallery.length]}")` }}><Tag tone="amber">{campaign.status}</Tag><span>{campaign.date}</span></div><div><h3>{campaign.title}</h3><p><MapPin size={15} />{campaign.location}</p><blockquote>“{campaign.slogan}”</blockquote></div></article>)}</div></div></section>;
}

function UpcomingAnalytics() {
  return <section className="section section-pale"><div className="container"><div className="upcoming-box"><div><Tag tone="amber">Upcoming</Tag><h2>Drive tonnage &amp; waste analytics</h2><p>Data visualizations for waste composition and tonnage over time will be added when verified drive records are available.</p></div><Recycle size={46} /></div></div></section>;
}

function GroundWorkHero() {
  return <section className="groundwork-hero">
    <div className="container groundwork-hero-inner">
      <div className="groundwork-hero-copy">
        <Eyebrow light>Community &amp; fieldwork</Eyebrow>
        <h1>Show up.<br /><span>Make a difference.</span></h1>
        <p>Join a river cleanup, request a water test, or help document what’s happening at the water’s edge.</p>
        <div className="groundwork-hero-actions">
          <a className="groundwork-primary-link" href="#water-test">Get involved <ArrowRight size={16} /></a>
          <a className="groundwork-secondary-link" href="#citizen-report">Share an observation</a>
        </div>
        <div className="groundwork-hero-note"><span>01</span><i /> Community action starts on the riverbank</div>
      </div>
      <figure className="groundwork-hero-photo">
        <img src="/yamuna-cleanup-fieldwork.jpg" alt="Volunteers collecting waste from a Yamuna riverbank" />
        <figcaption><span>FIELDWORK / DELHI NCR</span><strong>Observe. Participate. Follow through.</strong></figcaption>
      </figure>
    </div>
  </section>;
}

export function GroundWorkPage() {
  return <><GroundWorkHero /><section className="section"><div className="container service-grid" id="water-test"><div className="service-intro"><Eyebrow>Independent water testing</Eyebrow><h2>Better questions start with better data.</h2><p>The plan describes free groundwater testing in Noida. This demo form accepts a request for the team to review; actual availability and eligibility need confirmation.</p><div className="service-fact"><FlaskConical /><span>Testing availability, parameters and turnaround time must be confirmed with the lab.</span></div></div><WaterTestForm /></div></section><section className="section section-pale" id="citizen-report"><div className="container service-grid"><div className="service-intro"><Eyebrow>Citizen reporting</Eyebrow><h2>Help document what’s happening at the water’s edge.</h2><p>Use this form to share a possible discharge location and supporting details. Submissions are unverified until reviewed by the team.</p><div className="service-fact"><ShieldCheck /><span>Do not trespass or put yourself at risk to collect evidence.</span></div></div><EffluentForm /></div></section><DriveAndSamvaad /><Campaigns /><UpcomingAnalytics /></>;
}

type ApiPost = { title: string; slug: string; category: string; published_at: string; author_name?: string; content_markdown?: string; summary?: string };

function normalizePosts(payload: ApiPost[] | { results?: ApiPost[] }): Post[] {
  const list = Array.isArray(payload) ? payload : payload.results ?? [];
  return list.map((item) => ({
    slug: item.slug, title: item.title, category: item.category,
    date: item.published_at?.slice(0, 10) ?? "Date to be confirmed",
    author: item.author_name ?? "Earth Warriors", read: "5 min read",
    summary: item.summary ?? item.content_markdown?.slice(0, 180) ?? "Read this update from Earth Warriors.",
    content_markdown: item.content_markdown,
  }));
}

function BlogsHero() {
  return <section className="blogs-masthead">
    <div className="container blogs-masthead-inner">
      <div className="blogs-masthead-heading">
        <div className="blogs-masthead-index"><span>FIELD JOURNAL</span><i /><span>REPORTS · DISPATCHES · CONVERSATIONS</span></div>
        <h1>Stories from the <em>river.</em></h1>
        <div className="blogs-masthead-intro">
          <p>Research explainers, field dispatches and community perspectives on the Yamuna—grounded in evidence and care.</p>
          <a href="#blog-list">Explore the journal <ArrowRight size={16} /></a>
        </div>
      </div>
      <figure className="blogs-masthead-photo">
        <img src="/yamuna-samvaad.jpg" alt="Community members gather beneath trees beside a river" />
        <figcaption><span>FIELD NOTES · YAMUNA</span><strong>Listening is part of the work.</strong></figcaption>
      </figure>
    </div>
  </section>;
}

export function BlogsPage() {
  return <div className="blogs-page"><BlogsHero /><section className="section" id="blog-list"><div className="container"><p className="blogs-empty-notice">No blogs found. Our experts are working on it, blogs will be published shortly.</p></div></section></div>;
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Post | undefined>(() => posts.find((post) => post.slug === slug));
  useEffect(() => {
    const preview = posts.find((post) => post.slug === slug);
    if (!slug) {
      setArticle(undefined);
      return;
    }
    const fallback: ApiPost | null = preview ? {
      title: preview.title,
      slug: preview.slug,
      category: preview.category,
      published_at: preview.date,
      author_name: preview.author,
      summary: preview.summary,
      content_markdown: preview.summary,
    } : null;
    void fetchApi<ApiPost | null>(`/blogs/${encodeURIComponent(slug)}/`, fallback).then(({ data }) => {
      setArticle(data ? normalizePosts([data])[0] : undefined);
    });
  }, [slug]);
  if (!article) return <div className="blogs-page"><PageHero eyebrow="Article" title="This story isn’t available." description="It may have moved or not yet been published." /></div>;
  return <div className="blogs-page"><section className="article-hero"><div className="container"><Link className="back-link" to="/blogs">← Back to stories</Link><Tag>{article.category}</Tag><h1>{article.title}</h1><p>{article.summary}</p><div className="article-meta">{article.author} <span>·</span> {article.date} <span>·</span> {article.read}</div></div></section><article className="article-body"><p className="article-lede">{article.summary}</p><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => href && /\.(mp4|webm)(\?.*)?$/i.test(href) ? <video controls preload="metadata"><source src={href} /></video> : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> }}>{article.content_markdown || "This article is a publishing template. Replace it with a reviewed, sourced report before publication."}</ReactMarkdown><aside><FileText /><span>Use source reports, correspondence, data tables and parameter callouts to support published findings.</span></aside><Link className="text-link" to="/research">Explore research resources <ArrowRight size={14} /></Link></article></div>;
}

export function AboutPage() {
  const [coverage, setCoverage] = useState<{ outlet: string; title: string; kind: string; date: string; url?: string }[]>(mediaCoverage);
  useEffect(() => {
    type ApiCoverage = { outlet_name: string; headline: string; media_type: string; published_date: string | null; article_url: string };
    const fallback: ApiCoverage[] = mediaCoverage.map((item) => ({
      outlet_name: item.outlet,
      headline: item.title,
      media_type: item.kind,
      published_date: null,
      article_url: "",
    }));
    void fetchApi<ApiCoverage[] | { results?: ApiCoverage[] }>("/media-coverage/", fallback).then(({ data }) => {
      const entries = Array.isArray(data) ? data : data.results ?? [];
      setCoverage(entries.map((item) => ({
        outlet: item.outlet_name,
        title: item.headline,
        kind: item.media_type,
        date: item.published_date ?? "Coverage date to be verified",
        url: item.article_url,
      })));
    });
  }, []);
  return <div className="about-page">
    <section className="about-masthead">
      <div className="container about-masthead-inner">
        <div className="about-masthead-copy">
          <Eyebrow light>About Earth Warriors</Eyebrow>
          <h1>Care for the river.<br /><span>Respect the evidence.</span></h1>
          <p>An environmental action concept rooted in scientific inquiry, public accountability and community participation.</p>
          <a href="#about-mission">What guides the work <ArrowRight size={16} /></a>
        </div>
        <figure className="about-masthead-photo">
          <img src="/yamuna-community-voices.jpg" alt="Community members raise awareness for the Yamuna" />
          <figcaption><span>OUR FOCUS</span><strong>Research · accountability · community</strong></figcaption>
        </figure>
      </div>
    </section>
    <section className="section" id="about-mission">
      <div className="container mission-layout">
        <div>
          <Eyebrow>Our mission</Eyebrow>
          <h2>Restore trust through transparent work.</h2>
          <p>Earth Warriors’ stated focus is the restoration and protection of the Yamuna through independent research, field action and public engagement. This page presents the intended direction; organizational history and leadership details require verification.</p>
        </div>
        <div className="mission-quote">“Environmental action is strongest when evidence is accessible and communities have a seat at the table.”<small>Editorial principle · demonstration</small></div>
      </div>
    </section>
    <section className="section section-pale">
      <div className="container">
        <SectionTitle eyebrow="Press & media" title="Coverage and conversations" text="Use this directory to connect to verified coverage. Dates and links are intentionally omitted until confirmed." />
        <div className="coverage-grid">
          {coverage.map((item) => (
            <article className="coverage-card" key={item.title}>
              <span className="coverage-outlet">{item.outlet}</span>
              <Tag>{item.kind}</Tag>
              <h3>{item.title}</h3>
              <p>{item.date}</p>
              {item.url ? <a className="text-link" href={item.url} target="_blank" rel="noopener noreferrer">Read coverage <ArrowRight size={14} /></a> : <span className="muted">Source link to be added</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="People behind the work" title="Team & scientific advisory" text="Profiles will be published after names, roles and consent are confirmed." />
        <div className="team-placeholder">
          <div><BookOpen /><h3>Research & water analysis</h3><p>Profile details to be confirmed</p></div>
          <div><Scale /><h3>Legal & public accountability</h3><p>Profile details to be confirmed</p></div>
          <div><Waves /><h3>Community & field operations</h3><p>Profile details to be confirmed</p></div>
        </div>
      </div>
    </section>
    <section className="section section-pale">
      <div className="container about-contact">
        <div>
          <Eyebrow>Visit & connect</Eyebrow>
          <h2>Noida lab and contact</h2>
          <p>Lab address, contact channels and visit information need confirmation before publication.</p>
          <p className="contact-note"><MapPin size={17} />Noida, Uttar Pradesh · exact address to be confirmed</p>
        </div>
        <div className="press-kit-card">
          <FileText size={28} />
          <h3>Earth Warriors identity</h3>
          <img className="organization-logo" src="/earth-warriors-logo.png" alt="Earth Warriors NGO logo" />
          <p>The supplied Earth Warriors logo is now in use. A press brief and media contact will be added once confirmed.</p>
        </div>
      </div>
    </section>
  </div>;
}
