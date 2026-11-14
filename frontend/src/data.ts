export const impactStats = [
  { value: "14,000", unit: "kg", label: "Waste collected", note: "Illustrative figure" },
  { value: "300+", unit: "", label: "Sunday drives & Samvaads", note: "Illustrative figure" },
  { value: "500+", unit: "", label: "Water samples tested", note: "Illustrative figure" },
  { value: "50+", unit: "", label: "Letters & petitions", note: "Illustrative figure" },
];

export const mediaOutlets = ["NewsX", "NDTV", "India Today", "The Hindu", "ANI"];

export const videos = [
  {
    title: "Noida STP field investigation",
    facility: "Noida sewage treatment plant",
    file: "/assets/STPs Expose videos/Noida s STP_1080p.mp4",
    summary: "A field-led look at treatment infrastructure and questions for public authorities.",
  },
  {
    title: "Drain discharge documentation",
    facility: "Noida drain",
    file: "/assets/Drains Expose Videos/Noida s Drain_1080p50.mp4",
    summary: "On-location documentation of a drain outfall and the need for transparent monitoring.",
  },
];

export const researchReportVideos: { title: string; category: string; videoId: string; thumbnail: string; sourcePdf?: string }[] = [
  { title: "A small experiment on TDS", category: "Water-quality explainer", videoId: "aXy_bxROpsM", thumbnail: "/research-thumbnails/tds-experiment.jpg" },
  { title: "Testing drinking water supplied at Delhi railway stations", category: "Water-quality testing", videoId: "xonfJLNDR9U", thumbnail: "/research-thumbnails/railway-water-testing.jpg" },
  { title: "Analysis of the CAG report on Rishikesh STPs", category: "CAG report analysis", videoId: "WDrNtjUDB9k", thumbnail: "/research-thumbnails/cag-stp-report.jpg" },
  { title: "TERI report review: Saponin inconsistencies", category: "TERI report analysis", videoId: "14lef4o8738", thumbnail: "/research-thumbnails/teri-saponin-review.jpg", sourcePdf: "/teri_report_on_frothing_in_yamuna.pdf" },
  { title: "TERI report review: Gaps in ammonia analysis", category: "TERI report analysis", videoId: "zNqJ1I96-C0", thumbnail: "/research-thumbnails/teri-ammonia-review.jpg", sourcePdf: "/teri_report_on_frothing_in_yamuna.pdf" },
  { title: "TERI report review: Anionic surfactant inconsistencies", category: "TERI report analysis", videoId: "iIgUqpSAqeM", thumbnail: "/research-thumbnails/teri-surfactant-review.jpg", sourcePdf: "/teri_report_on_frothing_in_yamuna.pdf" },
  { title: "Yamuna water quality analysis — January 2026", category: "Water-quality report analysis", videoId: "LU2J01OA9c4", thumbnail: "/research-thumbnails/yamuna-january-2026.jpg" },
  { title: "Groundwater report analysis", category: "CGWB report analysis", videoId: "IS9jebfCGSs", thumbnail: "/research-thumbnails/cgwb-groundwater-report.jpg", sourcePdf: "/cgwb_report_2025.pdf" },
];

export const drives = [
  {
    date: "Upcoming — date to be confirmed",
    location: "Kalindi Kunj Ghat, Delhi",
    cleanupTime: "Sunday morning · schedule to be confirmed",
    samvaad: "Yamuna Samvaad: water, public welfare & stewardship",
    status: "Upcoming",
  },
  {
    date: "Past community gathering",
    location: "Yamuna riverbank",
    cleanupTime: "Community cleanup",
    samvaad: "Public welfare and stewardship",
    status: "Completed",
  },
];

export const letters = [
  { title: "Sample correspondence on drain monitoring", body: "DJB", date: "2025-01-15", status: "Awaiting Reply", ref: "DEMO-001" },
  { title: "Sample request for treatment-plant disclosure", body: "DPCC", date: "2025-02-02", status: "Sent", ref: "DEMO-002" },
  { title: "Sample public-interest representation", body: "I&FD", date: "2025-03-10", status: "Escalated to NGT", ref: "DEMO-003" },
];

export const parameters = [
  { key: "Turbidity", full: "Water clarity", detail: "An indicator of how cloudy water is due to suspended particles. It does not identify the particles or contaminants.", unit: "NTU", status: "current" },
  { key: "TSS", full: "Total Suspended Solids", detail: "The concentration of particles suspended in water, which can affect clarity and aquatic habitats.", unit: "mg/L", status: "current" },
  { key: "TDS", full: "Total Dissolved Solids", detail: "The concentration of dissolved salts and minerals. This measure does not identify individual substances.", unit: "mg/L", status: "current" },
  { key: "pH", full: "Acidity and alkalinity", detail: "A measure of how acidic or alkaline a water sample is.", unit: "No unit", status: "current" },
  { key: "BOD", full: "Biochemical Oxygen Demand", detail: "An estimate of oxygen used by microorganisms as they break down organic matter. This measurement is planned for a future expansion.", unit: "mg/L", status: "planned" },
];

export const campaigns = [
  { title: "Make the outfall visible", location: "Yamuna riverfront", slogan: "Measure it. Publish it. Fix it.", date: "Date to be confirmed", status: "Sample campaign entry" },
  { title: "Public accountability at pollution hotspots", location: "Delhi NCR", slogan: "Clean water needs clear answers.", date: "Date to be confirmed", status: "Sample campaign entry" },
];

export const posts = [
  { slug: "reading-water-quality", title: "A field guide to reading water-quality results", category: "Scientific Analysis", date: "2025-03-12", author: "Research team", read: "6 min read", summary: "What common water-quality parameters can and cannot tell us about a sample." },
  { slug: "public-records-and-river-health", title: "Why public records matter for river health", category: "Legal & Government Updates", date: "2025-02-22", author: "Editorial team", read: "4 min read", summary: "How clear, timely disclosure supports stronger public oversight." },
  { slug: "yamuna-samvaad", title: "Yamuna Samvaad: connecting care with action", category: "Yamuna Samvaad Insights", date: "2025-01-09", author: "Community team", read: "5 min read", summary: "A community conversation about stewardship, public welfare and the river." },
  { slug: "field-notes-from-the-ghat", title: "Field notes from a riverbank cleanup", category: "Field Dispatches", date: "2024-12-15", author: "Ground team", read: "3 min read", summary: "A sample dispatch format for documenting cleanup work and observations." },
];

export const mediaCoverage = [
  { outlet: "NewsX", title: "Yamuna cleanup and restoration coverage", kind: "TV / Video", date: "Coverage date to be verified" },
  { outlet: "Delhi News", title: "Community voices from Kalindi Kunj", kind: "Digital", date: "Coverage date to be verified" },
  { outlet: "Media partner", title: "Yamuna field operations", kind: "Print / Digital", date: "Coverage date to be verified" },
];

export const sampleGallery = [
  "/yamuna-community-action.jpg",
  "/yamuna-river-voices.jpg",
  "/yamuna-samvaad-riverbank.jpg",
  "/yamuna-river-restoration.jpg",
];

export const blogCategories = [
  "All",
  "Scientific Analysis",
  "Legal & Government Updates",
  "Field Dispatches",
  "Fact Checks",
  "Media & Press Releases",
  "Yamuna Samvaad Insights",
];
