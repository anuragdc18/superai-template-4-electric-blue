import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  Headphones,
  IndianRupee,
  Instagram,
  MapPin,
  Palette,
  PenTool,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { ALL_SERVICE_NAMES, CATEGORIES, POPULAR, SLIDES, serviceUrl, waLink, type Category } from "../lib/site";
import { asset } from "../lib/demo";
import { useSite } from "../queries/site";
import { LeadForm } from "../components/lead-form";
import { WaIcon } from "../components/header";

/* ───────────────────────── shared bits ───────────────────────── */

const CAT_ICON: Record<string, typeof FileText> = {
  registration: FileText,
  branding: PenTool,
  design: Palette,
  "social-media": Instagram,
  website: Globe2,
  "ai-tools": Bot,
  "microsoft-certifications": GraduationCap,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-cyan">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-glow" /> {children}
    </span>
  );
}

function SectionHead({ eyebrow, title, text, center = true }: { eyebrow: string; title: React.ReactNode; text?: string; center?: boolean }) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-[40px]">{title}</h2>
      {text && <p className="mt-3 text-[16px]">{text}</p>}
    </div>
  );
}

/** Runs once when the element scrolls into view. */
function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") return setSeen(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return { ref, seen };
}

/* ───────────────────────── 1. hero with 3 tabs ───────────────────────── */

const slide = (link: string) => SLIDES.find((s) => s.link === link)!;

const HERO = [
  {
    tab: "Microsoft Certification",
    icon: GraduationCap,
    image: asset("/images/hero-certification.jpg"),
    s: slide("/services/microsoft-certifications"),
    cta: "Explore Exams",
    chips: [
      { big: "7", small: "Fundamentals exams" },
      { big: "Live", small: "Online classes" },
    ],
  },
  {
    tab: "Business Registration",
    icon: FileText,
    image: asset("/images/hero-registration.jpg"),
    s: slide("/services/registration"),
    cta: "Get Free Consultation",
    chips: [
      { big: "3–7 days", small: "GST registration" },
      { big: "100%", small: "Online process" },
    ],
  },
  {
    tab: "Website & Social",
    icon: Globe2,
    image: asset("/images/hero-website.jpg"),
    s: slide("/services/website"),
    cta: "Build My Website",
    chips: [
      { big: "2–3 weeks", small: "Business website" },
      { big: "Monthly", small: "Social media plans" },
    ],
  },
];

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % HERO.length), 7000);
    return () => clearTimeout(t);
  }, [i, paused]);
  const h = HERO[i];

  return (
    <section className="relative isolate overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-electric/25 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-cyan/15 blur-[130px]" />

      <div className="container-x grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] [&>*]:min-w-0 lg:pb-24 lg:pt-14">
        <div>
          {/* tab switcher */}
          <div role="tablist" aria-label="Choose a topic" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {HERO.map((t, idx) => (
              <button
                key={t.tab}
                role="tab"
                aria-selected={idx === i}
                onClick={() => setI(idx)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold transition ${
                  idx === i
                    ? "bg-electric text-white shadow-[0_8px_30px_-8px_rgba(47,107,255,0.9)]"
                    : "border border-line bg-white/[0.03] text-slate-300 hover:text-white"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.tab}
              </button>
            ))}
          </div>

          <div key={i}>
            <p className="rise mt-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-cyan">{h.s.tag}</p>
            <h1 className="rise mt-3 text-[40px] font-extrabold leading-[1.08] sm:text-[52px] lg:text-[58px]" style={{ animationDelay: "60ms" }}>
              {h.s.title.split(" ").slice(0, -2).join(" ")} <span className="glow-text">{h.s.title.split(" ").slice(-2).join(" ")}</span>
            </h1>
            <p className="rise mt-5 max-w-xl text-[17px] leading-relaxed text-slate-300" style={{ animationDelay: "120ms" }}>
              {h.s.text}
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "180ms" }}>
              <Link to={h.s.link} className="btn-brand">
                {h.cta} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#enquiry" className="btn-ghost">
                <Headphones className="h-4 w-4" /> Free Expert Call
              </a>
            </div>
          </div>

          <div className="mt-9 flex items-center gap-2" aria-hidden>
            {HERO.map((_, idx) => (
              <span key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === i ? "w-10 bg-cyan" : "w-4 bg-white/20"}`} />
            ))}
          </div>
        </div>

        {/* photo + floating chips */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -inset-4 -z-10 rounded-[36px] bg-gradient-to-br from-electric/40 via-cyan/10 to-transparent blur-2xl" />
          <div className="photo-tint glow-ring aspect-[4/3.6] rounded-[28px]">
            {HERO.map((t, idx) => (
              <img
                key={t.image}
                src={t.image}
                alt=""
                className={`transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"} object-[70%_center]`}
              />
            ))}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          </div>
          <div key={`a${i}`} className="glass rise absolute -left-3 -bottom-6 z-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl sm:-left-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric/25 text-cyan">
              <Clock className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-[18px] font-bold text-white">{h.chips[0].big}</span>
              <span className="block text-[12px] text-slate-400">{h.chips[0].small}</span>
            </span>
          </div>
          <div key={`b${i}`} className="glass rise absolute -right-2 -top-6 z-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl sm:-right-6" style={{ animationDelay: "120ms" }}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-wa/20 text-wa">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-[18px] font-bold text-white">{h.chips[1].big}</span>
              <span className="block text-[12px] text-slate-400">{h.chips[1].small}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 2. glass stats with count-up ───────────────────────── */

function CountUp({ to, decimals = 0, suffix = "", run }: { to: number; decimals?: number; suffix?: string; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1400, 1);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return (
    <>
      {v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </>
  );
}

function Stats() {
  const { ref, seen } = useInView<HTMLDivElement>(0.4);
  const items = [
    { icon: Star, big: <CountUp to={4.8} decimals={1} run={seen} />, small: "Google Rating" },
    { icon: Users, big: <CountUp to={1000} suffix="+" run={seen} />, small: "Happy Clients" },
    { icon: MapPin, big: "Pan-India", small: "Service" },
    { icon: ShieldCheck, big: <CountUp to={100} suffix="%" run={seen} />, small: "Online Process" },
  ];
  return (
    <section className="relative z-10 -mt-6 pb-6">
      <div className="container-x">
        <div ref={ref} className="glass glow-ring grid grid-cols-2 gap-y-6 rounded-3xl px-4 py-6 md:grid-cols-4 md:py-7">
          {items.map((t, idx) => (
            <div key={t.small} className={`flex items-center justify-center gap-3 ${idx > 0 ? "md:border-l md:border-line" : ""}`}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-electric/40 to-cyan/20 text-cyan ring-1 ring-cyan/20">
                <t.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[22px] font-bold leading-tight text-white">{t.big}</span>
                <span className="block text-[13px]">{t.small}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 3. services explorer ───────────────────────── */

function ServicesExplorer() {
  const [active, setActive] = useState(CATEGORIES[0].slug);
  const cat = CATEGORIES.find((c) => c.slug === active) as Category;
  const site = useSite();
  const Icon = CAT_ICON[cat.slug];
  const isCert = cat.slug === "microsoft-certifications";

  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHead eyebrow="Services Explorer" title={<>What Do You Need <span className="glow-text">Help With?</span></>} text="Pick a category. Each one has a clear list of services." />

        <div className="grid gap-6 lg:grid-cols-[300px_1fr] [&>*]:min-w-0">
          {/* tabs */}
          <div role="tablist" aria-label="Service categories" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {CATEGORIES.map((c) => {
              const I = CAT_ICON[c.slug];
              const on = c.slug === active;
              return (
                <button
                  key={c.slug}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(c.slug)}
                  className={`group flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition lg:w-full ${
                    on ? "border-electric/60 bg-electric/15 shadow-[0_0_30px_-10px_rgba(47,107,255,0.9)]" : "border-line bg-white/[0.02] hover:border-electric/40"
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${on ? "bg-electric text-white" : "bg-electric/10 text-[#7aa2ff]"}`}>
                    <I className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className={`block whitespace-nowrap text-[15px] font-semibold ${on ? "text-white" : "text-slate-200"}`}>{c.title}</span>
                    <span className="hidden text-[12.5px] text-slate-500 lg:block">
                      {c.services.length} {c.slug === "microsoft-certifications" ? "exams" : "services"}
                    </span>
                  </span>
                  <ChevronRight className={`ml-auto hidden h-4 w-4 transition lg:block ${on ? "text-cyan" : "text-slate-600 group-hover:translate-x-0.5"}`} />
                </button>
              );
            })}
          </div>

          {/* panel */}
          <div key={cat.slug} className="glass glow-ring overflow-hidden rounded-3xl">
            <div className="photo-tint h-48 sm:h-56">
              <img src={cat.image} alt="" loading="lazy" className="object-[50%_35%]" />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0b1a3f] via-[#0b1a3f]/40 to-transparent" />
              <div className="absolute bottom-5 left-6 z-[3] flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-electric text-white shadow-[0_10px_30px_-8px_rgba(47,107,255,0.9)]">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-[24px] font-bold leading-tight">{cat.title}</h3>
                  <p className="text-[13.5px] text-slate-300">{cat.short}</p>
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-7">
              <p className="max-w-2xl text-[15.5px] leading-relaxed">{cat.intro}</p>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {cat.services.map((s) => (
                  <Link
                    key={s.name}
                    to={serviceUrl(cat.slug, s.name)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3 transition hover:border-electric/50 hover:bg-electric/10"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[14.5px] font-medium text-slate-100">{s.name}</span>
                      {s.days && <span className="block text-[12.5px] text-slate-500">{s.days}</span>}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#7aa2ff] transition group-hover:translate-x-1 group-hover:text-cyan" />
                  </Link>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={`/services/${cat.slug}`} className="btn-brand">
                  {isCert ? "See All Certifications" : `See All ${cat.title}`} <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={waLink(site.whatsapp, `Hi, I need help with ${cat.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-wa/40 px-5 py-3 font-semibold text-wa transition hover:bg-wa hover:text-[#052e16]"
                >
                  <WaIcon /> Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 4. Microsoft exams showcase ───────────────────────── */

function ExamShowcase() {
  const cat = CATEGORIES.find((c) => c.slug === "microsoft-certifications") as Category;
  const track = useRef<HTMLDivElement>(null);
  const move = (d: number) => track.current?.scrollBy({ left: d * 290, behavior: "smooth" });

  return (
    <section className="relative overflow-hidden border-y border-line bg-ink/60 py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-electric/20 blur-[110px]" />
      <div className="container-x grid gap-8 lg:grid-cols-[400px_1fr] lg:items-stretch [&>*]:min-w-0">
        <div className="photo-tint glow-ring relative min-h-[420px] rounded-3xl">
          <img src={cat.image} alt="" loading="lazy" className="object-[50%_30%]" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-navy via-navy/70 to-navy/10" />
          <div className="absolute inset-x-0 bottom-0 z-[3] p-7">
            <Eyebrow>Microsoft Certifications</Eyebrow>
            <h2 className="mt-4 text-[30px] font-bold leading-tight">Get Microsoft Certified</h2>
            <p className="mt-2 text-[15px] text-slate-300">{cat.intro}</p>
            <ul className="mt-4 space-y-1.5 text-[14px] text-slate-200">
              {cat.includes.slice(0, 3).map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" /> {x}
                </li>
              ))}
            </ul>
            <Link to={`/services/${cat.slug}`} className="btn-brand mt-6">
              Browse All Exams <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold sm:text-[28px]">Pick your exam</h3>
              <p className="mt-1 text-[15px]">{cat.short}</p>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button onClick={() => move(-1)} aria-label="Previous exams" className="grid h-11 w-11 place-items-center rounded-full border border-line text-slate-300 hover:border-electric hover:text-white">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => move(1)} aria-label="Next exams" className="grid h-11 w-11 place-items-center rounded-full bg-electric text-white hover:brightness-110">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div ref={track} className="no-scrollbar -mx-4 flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {cat.services.map((s) => {
              const [code, ...rest] = s.name.split(":");
              return (
                <Link
                  key={s.name}
                  to={serviceUrl(cat.slug, s.name)}
                  className="glass group flex w-[270px] shrink-0 snap-start flex-col rounded-3xl p-6 transition hover:-translate-y-1 hover:border-electric/60"
                >
                  <span className="font-display text-[34px] font-extrabold leading-none glow-text">{code}</span>
                  <span className="mt-4 text-[16px] font-semibold leading-snug text-white">{rest.join(":").trim()}</span>
                  <span className="mt-2 line-clamp-4 text-[14px] leading-relaxed">{s.text}</span>
                  <span className="mt-auto flex items-center gap-1.5 pt-5 text-[14px] font-semibold text-cyan group-hover:gap-2.5">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 5. find your service (live search) ───────────────────────── */

const ALL = CATEGORIES.flatMap((c) => c.services.map((s) => ({ ...s, cat: c })));

function ServiceFinder() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return POPULAR.map((p) => ALL.find((a) => a.name === p.name && a.cat.slug === p.cat)!).filter(Boolean);
    const words = t.split(/\s+/);
    return ALL.filter((a) => {
      const hay = `${a.name} ${a.cat.title} ${a.cat.menu} ${a.text}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    }).slice(0, 12);
  }, [q]);
  const days = (name: string, d?: string) => POPULAR.find((p) => p.name === name)?.days ?? d;

  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHead eyebrow="Find Your Service" title={<>Search <span className="glow-text">{ALL_SERVICE_NAMES.length}+ services</span></>} text="Type what you need — GST, logo, website, AZ-900… Most popular ones are shown below." />
        <label className="glass glow-ring mx-auto flex max-w-2xl items-center gap-3 rounded-2xl px-5">
          <Search className="h-5 w-5 shrink-0 text-cyan" />
          <span className="sr-only">Search services</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services, e.g. trademark"
            className="h-14 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-slate-500"
          />
          {q && (
            <button onClick={() => setQ("")} className="text-[13px] font-semibold text-slate-400 hover:text-white">
              Clear
            </button>
          )}
        </label>
        <p className="mt-6 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {q.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Most popular services"}
        </p>
        {results.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {results.map((r) => {
              const I = CAT_ICON[r.cat.slug];
              return (
                <Link
                  key={r.cat.slug + r.name}
                  to={serviceUrl(r.cat.slug, r.name)}
                  className="glass group flex flex-col rounded-2xl p-4 transition hover:-translate-y-1 hover:border-electric/60 hover:shadow-[0_20px_50px_-25px_rgba(47,107,255,0.9)] sm:p-5"
                >
                  <span className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric/15 text-[#7aa2ff] transition group-hover:bg-electric group-hover:text-white">
                      <I className="h-4 w-4" />
                    </span>
                    {r.cat.menu}
                  </span>
                  <span className="mt-4 text-[16px] font-semibold leading-snug text-white">{r.name}</span>
                  {days(r.name, r.days) && (
                    <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-slate-400">
                      <Clock className="h-3.5 w-3.5" /> {days(r.name, r.days)}
                    </span>
                  )}
                  <span className="mt-auto flex items-center gap-1 pt-4 text-[14px] font-semibold text-brand group-hover:gap-2">
                    Know More <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="glass mx-auto mt-6 max-w-xl rounded-2xl p-6 text-center">
            <p className="font-semibold text-white">No exact match for “{q}”.</p>
            <p className="mt-1 text-[14.5px]">Our expert can still help — tell us what you need.</p>
            <Link to="/contact" className="btn-brand mt-4">
              Ask an Expert <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── 6. glowing timeline ───────────────────────── */

const STEPS = [
  { icon: ClipboardList, title: "Tell Us What You Need", text: "Fill the form or call us. It takes 1 minute." },
  { icon: Upload, title: "Share Your Documents", text: "Send them on WhatsApp or email. No office visit." },
  { icon: BadgeCheck, title: "We Get It Done", text: "You get updates at every step until it's complete." },
];

function Timeline() {
  const { ref, seen } = useInView<HTMLDivElement>(0.35);
  return (
    <section className="relative overflow-hidden border-y border-line bg-ink/60 py-16 sm:py-24">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
      <div className="container-x relative">
        <SectionHead eyebrow="How It Works" title="Simple 3-Step Process" text="No office visits. No confusing forms." />
        <div ref={ref} className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {/* line */}
          <div className="absolute left-[27px] top-2 h-[calc(100%-1rem)] w-[2px] bg-white/10 md:left-[16.66%] md:right-[16.66%] md:top-[27px] md:h-[2px] md:w-auto">
            <div
              className={`h-full w-full origin-top bg-gradient-to-b from-electric via-cyan to-electric shadow-[0_0_18px_rgba(34,211,238,0.9)] transition-transform duration-[1600ms] md:origin-left md:bg-gradient-to-r ${
                seen ? "scale-100" : "scale-0"
              }`}
            />
          </div>
          {STEPS.map((s, idx) => (
            <div key={s.title} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
              <span
                className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-cyan/40 bg-navy text-cyan transition duration-700 ${
                  seen ? "shadow-[0_0_0_6px_rgba(47,107,255,0.15),0_0_30px_rgba(34,211,238,0.6)]" : ""
                }`}
                style={{ transitionDelay: `${idx * 450}ms` }}
              >
                <s.icon className="h-6 w-6" />
              </span>
              <div className="md:mt-6">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#7aa2ff]">Step {idx + 1}</p>
                <h3 className="mt-1.5 text-[20px] font-semibold">{s.title}</h3>
                <p className="mt-1.5 max-w-xs text-[15px] md:mx-auto">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 7. trust + testimonial slider ───────────────────────── */

const WHY = [
  { icon: Sparkles, title: "One place for everything", text: "Registration, branding, website and marketing — no running around." },
  { icon: IndianRupee, title: "Clear pricing", text: "You know the full cost before we start. No hidden charges." },
  { icon: Smartphone, title: "Fully online", text: "Do everything from your phone, from anywhere in India." },
  { icon: Headphones, title: "Real experts", text: "CA, CS and design experts guide you at every step." },
];

const REVIEWS = [
  { name: "Ravi K.", city: "Hyderabad", text: "My GST and company registration were done in a week. Very smooth, and they explained everything simply." },
  { name: "Priya S.", city: "Bengaluru", text: "They designed our logo and website together. Looks very professional and customers notice it." },
  { name: "Arjun M.", city: "Pune", text: "Our Instagram enquiries doubled in 2 months. The team posts on time every week." },
];

function TrustAndReviews() {
  const site = useSite();
  const [r, setR] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold) return;
    const t = setTimeout(() => setR((v) => (v + 1) % REVIEWS.length), 6000);
    return () => clearTimeout(t);
  }, [r, hold]);
  const rev = REVIEWS[r];

  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHead eyebrow={`Why ${site.siteName}`} title={<>Why Businesses <span className="glow-text">Trust Us</span></>} />
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w) => (
              <div key={w.title} className="glass group rounded-3xl p-6 transition hover:border-electric/50 hover:shadow-[0_0_40px_-12px_rgba(47,107,255,0.8)]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-electric to-cyan text-white shadow-[0_10px_30px_-10px_rgba(34,211,238,0.8)]">
                  <w.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-[18px] font-semibold">{w.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>

          <div
            className="glass glow-ring relative flex flex-col overflow-hidden rounded-3xl p-7 sm:p-9"
            onMouseEnter={() => setHold(true)}
            onMouseLeave={() => setHold(false)}
          >
            <span className="pointer-events-none absolute -right-4 -top-8 font-display text-[180px] leading-none text-electric/15">”</span>
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-semibold">What Our Clients Say</h3>
              <span className="flex items-center gap-1.5 text-[13px] text-slate-300">
                <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" /> 4.8 on Google
              </span>
            </div>
            <div key={r} className="rise mt-8 flex-1">
              <div className="flex gap-0.5 text-[#fbbf24]">
                {[0, 1, 2, 3, 4].map((k) => (
                  <Star key={k} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-[21px] font-medium leading-relaxed text-white sm:text-[23px]">“{rev.text}”</blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-electric to-cyan font-display text-[17px] font-bold text-white">
                  {rev.name[0]}
                </span>
                <span>
                  <span className="block font-semibold text-white">{rev.name}</span>
                  <span className="text-[13px]">{rev.city}</span>
                </span>
              </figcaption>
            </div>
            <div className="mt-8 flex items-center gap-2">
              {REVIEWS.map((x, idx) => (
                <button
                  key={x.name}
                  onClick={() => setR(idx)}
                  aria-label={`Show review ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${idx === r ? "w-8 bg-cyan" : "w-2 bg-white/25 hover:bg-white/50"}`}
                />
              ))}
              <span className="ml-auto flex gap-2">
                <button onClick={() => setR((r - 1 + REVIEWS.length) % REVIEWS.length)} aria-label="Previous review" className="grid h-9 w-9 place-items-center rounded-full border border-line text-slate-300 hover:text-white">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setR((r + 1) % REVIEWS.length)} aria-label="Next review" className="grid h-9 w-9 place-items-center rounded-full border border-line text-slate-300 hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 8. FAQ by topic ───────────────────────── */

const FAQ_GROUPS = [
  {
    tab: "General",
    items: [
      { q: "Do I need to visit your office?", a: "No. Everything is done online. You can share documents on WhatsApp or email." },
      { q: "I'm not sure which registration I need. Can you help?", a: "Yes — that's what the free consultation is for. Our expert will suggest the right option for you." },
    ],
  },
  {
    tab: "Registration",
    items: [
      { q: "How long does GST registration take?", a: "Usually 3 to 7 working days, once we have all your documents." },
      { q: "Can you do registration and the website together?", a: "Yes. Many clients start with registration and logo, then add a website. We offer combo prices." },
    ],
  },
  {
    tab: "Payments",
    items: [{ q: "How do I pay?", a: "You can pay by UPI, debit/credit card or bank transfer. You get a proper GST invoice." }],
  },
];

function FaqTabs() {
  const [g, setG] = useState(0);
  const [open, setOpen] = useState(0);
  const group = FAQ_GROUPS[g];
  return (
    <section className="pb-16 pt-4 sm:pb-24">
      <div className="container-x grid gap-10 lg:grid-cols-[360px_1fr] [&>*]:min-w-0">
        <div>
          <SectionHead center={false} eyebrow="FAQ" title="Common Questions" text="Still unsure? Ask our chat assistant or call us — the first consultation is free." />
          <div role="tablist" aria-label="Question topics" className="no-scrollbar -mt-2 flex gap-2 overflow-x-auto lg:flex-col">
            {FAQ_GROUPS.map((x, idx) => (
              <button
                key={x.tab}
                role="tab"
                aria-selected={idx === g}
                onClick={() => {
                  setG(idx);
                  setOpen(0);
                }}
                className={`flex shrink-0 items-center justify-between gap-6 rounded-xl px-4 py-3 text-left text-[15px] font-semibold transition lg:w-full ${
                  idx === g ? "bg-electric text-white" : "border border-line text-slate-300 hover:text-white"
                }`}
              >
                {x.tab}
                <span className={`rounded-full px-2 py-0.5 text-[12px] ${idx === g ? "bg-white/20" : "bg-white/5"}`}>{x.items.length}</span>
              </button>
            ))}
          </div>
        </div>
        <div key={g} className="space-y-3 lg:pt-2">
          {group.items.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <div key={f.q} className={`glass rounded-2xl transition ${isOpen ? "border-electric/50 shadow-[0_0_40px_-15px_rgba(47,107,255,0.9)]" : ""}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[16px] font-semibold text-white"
                >
                  {f.q}
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${isOpen ? "rotate-180 bg-electric text-white" : "bg-white/5 text-cyan"}`}>
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[15px] leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 9. CTA with lead form ───────────────────────── */

function CtaWithForm() {
  const site = useSite();
  return (
    <section id="enquiry" className="scroll-mt-24 pb-20 pt-4">
      <div className="container-x">
        <div className="photo-tint glow-ring relative overflow-hidden rounded-[32px]">
          <img src={asset("/images/cta-background.jpg")} alt="" loading="lazy" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-navy via-navy/90 to-navy/60" />
          <div className="relative z-[3] grid gap-10 p-7 sm:p-12 lg:grid-cols-[1fr_440px] lg:items-center">
            <div>
              <Eyebrow>Free Consultation</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-[44px]">
                Ready to Grow <span className="glow-text">Your Business?</span>
              </h2>
              <p className="mt-4 max-w-md text-[17px] text-slate-300">Talk to our expert today. The first consultation is free.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="btn-ghost">
                  <Zap className="h-4 w-4" /> Call {site.phone}
                </a>
                <a
                  href={waLink(site.whatsapp, site.bot.whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-wa px-6 py-3 font-semibold text-[#052e16] transition hover:brightness-110"
                >
                  <WaIcon /> WhatsApp Us
                </a>
              </div>
            </div>
            <div className="glass rounded-3xl p-6 sm:p-7">
              <h3 className="text-[20px] font-bold">Get a free call from our expert</h3>
              <p className="mt-1 text-[14px]">Tell us what you need — we call back within 30 minutes.</p>
              <div className="mt-5">
                <LeadForm layout="stack" source="home" cta="Get Free Call" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Slim call-to-action used at the bottom of category and service pages. */
export function CtaBand() {
  const site = useSite();
  return (
    <section className="py-16">
      <div className="container-x">
        <div className="glass glow-ring relative overflow-hidden rounded-[28px] px-6 py-12 text-center sm:px-12">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-electric/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-cyan/20 blur-3xl" />
          <h2 className="relative text-3xl font-bold sm:text-4xl">
            Ready to Grow <span className="glow-text">Your Business?</span>
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-[17px] text-slate-300">Talk to our expert today. The first consultation is free.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-brand">
              Get Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={waLink(site.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-wa px-6 py-3 font-semibold text-[#052e16] transition hover:brightness-110"
            >
              <WaIcon /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesExplorer />
      <ExamShowcase />
      <ServiceFinder />
      <Timeline />
      <TrustAndReviews />
      <FaqTabs />
      <CtaWithForm />
    </>
  );
}
