import emailjs from '@emailjs/browser';
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Menu, X, ArrowRight, Code2, Palette, Brush, ChevronDown,
  Zap, Shield, Star, DollarSign, Twitter, Linkedin, Github,
  Instagram, MessageCircle, Mail, ExternalLink, CheckCircle, AlertCircle,
} from "lucide-react";

// ─── Image Imports ────────────────────────────────────────────────────────────
import sebastianImg from '../assets/sebastian.jpg';
import jamesImg from '../assets/james.jpg';
import ifeanyiImg from '../assets/ifeanyi.jpg';
import nnabuikeImg from '../assets/nnabuike.jpg';
import michaelImg from '../assets/michael.jpg';
import techflowImg from '../assets/techflow.jpg';
import nexusImg from '../assets/nexus.png';
import novaImg from '../assets/nova.jpg';

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Services", "Portfolio", "About", "Team", "Contact"];

const SERVICES = [
  {
    title: "Website Creation & Management",
    description:
      "Modern websites, booking systems, landing pages, and scalable digital platforms optimized for speed and performance.",
    icon: Code2,
  },
  {
    title: "UI/UX & Brand Identity",
    description:
      "User-focused interfaces and memorable brand systems designed for engagement, conversion, and growth.",
    icon: Palette,
  },
  {
    title: "Graphics Designing",
    description:
      "Creative visuals, social media assets, flyers, and modern brand graphics tailored for digital businesses.",
    icon: Brush,
  },
];

const PORTFOLIO_ITEMS: Record<string, { title: string; tag: string; gradient: string; image?: string }[]> = {
  "Web Development": [
    { title: "TechFlow SaaS Platform", tag: "Web Development", gradient: "from-cyan-500 via-sky-500 to-blue-600", image: techflowImg },
    { title: "Nexus E-Commerce Hub", tag: "Web Development", gradient: "from-violet-500 via-purple-500 to-indigo-600", image: nexusImg },
  ],
  "UI/UX Design": [
    { title: "FinTrack Dashboard", tag: "UI/UX Design", gradient: "from-emerald-400 via-teal-500 to-cyan-600" },
    { title: "Pulse Health App", tag: "UI/UX Design", gradient: "from-rose-400 via-pink-500 to-fuchsia-600" },
  ],
  "Graphics Design": [
    { title: "Aura Brand System", tag: "Graphics Design", gradient: "from-amber-400 via-orange-500 to-red-500" },
    { title: "Nova Social Kit", tag: "Graphics Design", gradient: "from-lime-400 via-green-500 to-emerald-600", image: novaImg },
  ],
};

const MISSION_CARDS = [
  { title: "Speed & Performance", icon: Zap, desc: "Blazing-fast load times and optimised code across every device." },
  { title: "Perfect UI/UX", icon: Star, desc: "Pixel-perfect interfaces engineered for seamless user journeys." },
  { title: "Security & Reliability", icon: Shield, desc: "Enterprise-grade security embedded into every product we ship." },
  { title: "Affordable Solutions", icon: DollarSign, desc: "Premium digital products at competitive, transparent pricing." },
];

const TEAM = [
  {
    name: "Okoye Sebastian Chidubem",
    role: "Web Developer & Project Manager",
    initials: "SO",
    image: sebastianImg,
    gradient: "from-[#00FFB2] to-emerald-500"
  },
  {
    name: "Ejike James",
    role: "Asst. Web Developer",
    initials: "EJ",
    image: jamesImg,
    gradient: "from-violet-400 to-purple-600"
  },
  {
    name: "Iruefo Ifeanyichukwu Felix",
    role: "Lead Designer",
    initials: "IF",
    image: ifeanyiImg,
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    name: "Nnabuike Emmanuel Onyemelukwe",
    role: "Sales Manager",
    initials: "NE",
    image: nnabuikeImg,
    gradient: "from-rose-400 to-pink-600"
  },
  {
    name: "Mbaomah Michael",
    role: "Social Manager",
    initials: "MM",
    image: michaelImg,
    gradient: "from-amber-400 to-orange-600"
  },
];

const SERVICE_OPTIONS = ["Website Development", "UI/UX Design", "Graphics Design", "Brand Identity"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-[#00FFB2] text-xs font-semibold tracking-[0.18em] uppercase mb-3">
      <span className="w-5 h-px bg-[#00FFB2]" />
      {text}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioCat, setPortfolioCat] = useState("Web Development");
  const [filterOpen, setFilterOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", whatsapp: "", email: "", service: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.toLowerCase());
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActiveSection(id.charAt(0).toUpperCase() + id.slice(1));
          }
        });
      },
      { threshold: 0.35 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (label: string) => {
    document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.whatsapp.trim()) errors.whatsapp = "WhatsApp number is required";
    if (!formData.email.trim()) errors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Enter a valid email";
    if (!formData.service) errors.service = "Please select a service";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState("loading");

    try {
      const botToken = "8969762709:AAFKX3_iWk2B0hvfHqsGFrXAMhjJw6E4m4E";
      const chatId = "-1003921976011";

      const telegramMessage = `
<b>🚀 New Lead Received!</b>\n
<b>👤 Name:</b> ${formData.name || "N/A"}\n
<b>📱 WhatsApp:</b> ${formData.whatsapp || "N/A"}\n
<b>📧 Email:</b> ${formData.email || "N/A"}\n
<b>💼 Service:</b> ${formData.service || "N/A"}
`;

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "HTML",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Telegram API Detailed Error:", errorData);
        throw new Error("Failed to send message");
      }

      const compiledMessage = `
Requested Service: ${formData.service || "Digital Consultation"}
WhatsApp Contact: ${formData.whatsapp || "Not Provided"}
`;

      const templateParams = {
        user_name: formData.name,
        user_message: compiledMessage,
        user_email: formData.email,
      };

      try {
        await emailjs.send(
          'service_qdrgpve',
          'template_fyemo5d',
          templateParams,
          'A46AEOFVJ-lNZ-ee5'
        );
        console.log("EmailJS client confirmation email sent!");
      } catch (emailErr) {
        console.error("EmailJS Failed to send:", emailErr);
      }

      setFormState("success");
      setFormData({ name: "", whatsapp: "", email: "", service: "" });
    } catch (err) {
      console.error("Catch Block Error:", err);
      setFormState("error");
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 rounded-xl border text-sm bg-[#F5F7FA] text-[#0F172A] placeholder-[#0F172A]/30 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(0,255,178,0.15)] ${
      formErrors[field] ? "border-red-400 focus:border-red-400" : "border-black/10 focus:border-[#00FFB2]"
    }`;

  return (
    <div
      className="min-h-screen bg-white text-[#0F172A] overflow-x-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-2xl bg-white/85 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between">
          <button
            onClick={() => scrollTo("home")}
            className="text-[#0F172A] font-extrabold text-xl tracking-tight hover:text-[#0F172A] transition-colors"
          >
            Code<span className="text-[#00FFB2]">Crest</span>
          </button>

          <ul className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <button
                  onClick={() => scrollTo(link)}
                  className={`relative text-sm font-medium transition-colors group ${
                    activeSection === link ? "text-[#00FFB2]" : "text-[#0F172A]/60 hover:text-[#0F172A]"
                  }`}
                >
                  {link}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#00FFB2] transition-all duration-300 ${
                      activeSection === link ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => scrollTo("contact")}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FFB2] text-[#0F172A] text-sm font-semibold rounded-full hover:shadow-[0_0_24px_rgba(0,255,178,0.55)] hover:scale-105 transition-all duration-300"
          >
            Book Now
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#0F172A] hover:text-[#00FFB2] transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 px-6 pb-6 pt-4 space-y-1"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className={`block w-full text-left py-2.5 text-sm font-medium transition-colors ${
                  activeSection === link ? "text-[#00FFB2]" : "text-[#0F172A]/60 hover:text-[#0F172A]"
                }`}
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="mt-3 w-full py-3 bg-[#00FFB2] text-[#0F172A] text-sm font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,255,178,0.4)] transition-all"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F7FA]/60 via-white to-white" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0F172A 1px,transparent 1px),linear-gradient(90deg,#0F172A 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#00FFB2]/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00FFB2]/5 blur-[100px] pointer-events-none" />

        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#00FFB2]"
            style={{
              left: `${8 + i * 6.5}%`,
              top: `${15 + ((i * 17) % 70)}%`,
              opacity: 0.25 + (i % 3) * 0.15,
            }}
            animate={{ y: [-14, 14, -14], opacity: [0.2, 0.55, 0.2] }}
            transition={{
              duration: 3.2 + i * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.18,
            }}
          />
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(64px,14vw,144px)] font-extrabold leading-none tracking-tight mb-6"
          >
            <span className="text-[#0F172A]">Code</span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #00FFB2 0%, #00D4A0 60%, #00B085 100%)" }}
            >
              Crest
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-[#0F172A]/50 font-light max-w-lg mx-auto leading-relaxed mb-10"
          >
            Modern websites, UI/UX systems, and digital experiences crafted for brands worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button
              onClick={() => scrollTo("contact")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="px-9 py-4 bg-[#00FFB2] text-[#0F172A] font-semibold rounded-full text-base shadow-[0_0_36px_rgba(0,255,178,0.45)] hover:shadow-[0_0_56px_rgba(0,255,178,0.65)] transition-shadow duration-300"
            >
              Book Now
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#0F172A]/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────── */}
      <section id="services" className="py-28 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <SectionLabel text="What We Do" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">What We Build</h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <FadeIn key={svc.title} delay={i * 0.1}>
                <div className="group relative h-full p-8 rounded-2xl bg-white border border-black/5 hover:border-[#00FFB2]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(0,255,178,0.09)]">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00FFB2]/0 to-[#00FFB2]/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-[#00FFB2]/10 flex items-center justify-center mb-6 group-hover:bg-[#00FFB2]/20 transition-colors duration-300">
                      <svc.icon size={20} className="text-[#00FFB2]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-3 leading-snug">{svc.title}</h3>
                    <p className="text-[#0F172A]/55 text-sm leading-relaxed mb-7">{svc.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ──────────────────────────────────────────────── */}
      <section id="portfolio" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <SectionLabel text="Our Work" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">Selected Projects</h2>
          </FadeIn>

          <FadeIn className="flex justify-center mb-12">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-3 px-6 py-3 bg-[#F5F7FA] border border-black/10 rounded-full text-sm font-medium text-[#0F172A] hover:border-[#00FFB2]/40 transition-all"
              >
                {portfolioCat}
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
                />
              </button>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full mt-2 left-0 right-0 min-w-[180px] bg-white border border-black/8 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                  {Object.keys(PORTFOLIO_ITEMS).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setPortfolioCat(cat);
                        setFilterOpen(false);
                      }}
                      className={`w-full px-5 py-3 text-sm text-left transition-colors hover:bg-[#00FFB2]/8 ${
                        portfolioCat === cat
                          ? "text-[#00FFB2] font-semibold bg-[#00FFB2]/5"
                          : "text-[#0F172A]/70"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </FadeIn>

          <motion.div
            key={portfolioCat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid md:grid-cols-2 gap-6"
          >
            {PORTFOLIO_ITEMS[portfolioCat].map((proj) => (
              <div
                key={proj.title}
                className="group relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: "16/9" }}
              >
                {proj.image ? (
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${proj.gradient} transition-transform duration-700 group-hover:scale-105`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-end justify-between p-7">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/50 text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">
                      {proj.tag}
                    </p>
                    <h3 className="text-white font-bold text-xl">{proj.title}</h3>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <ExternalLink size={14} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────── */}
      <section id="about" className="py-28 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#00FFB2]/6 blur-[140px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#00FFB2]/4 blur-[80px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-20">
            <FadeIn>
              <SectionLabel text="About Us" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Redefining Digital Experiences
              </h2>
              <p className="text-[#00FFB2]/70 text-sm font-medium mb-5">Founded May 9th, 2026</p>
              <p className="text-white/55 text-base leading-relaxed">
                CodeCrest combines modern development, premium UI/UX, and strong visual branding to help
                businesses build digital products that feel modern, fast, secure, and unforgettable.
              </p>
            </FadeIn>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MISSION_CARDS.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.1}>
                <div className="group h-full p-6 rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm hover:border-[#00FFB2]/25 hover:bg-white/7 transition-all duration-500 hover:shadow-[0_0_48px_rgba(0,255,178,0.06)]">
                  <div className="w-10 h-10 rounded-xl bg-[#00FFB2]/10 flex items-center justify-center mb-5 group-hover:bg-[#00FFB2]/20 transition-colors">
                    <card.icon size={19} className="text-[#00FFB2]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">{card.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ───────────────────────────────────────────────────── */}
      <section id="team" className="py-28 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <SectionLabel text="The People" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">Meet The Team</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <div className="h-full flex flex-col group text-center p-7 rounded-2xl bg-white border border-black/5 hover:border-[#00FFB2]/25 hover:shadow-[0_24px_64px_rgba(0,255,178,0.08)] hover:-translate-y-2 transition-all duration-500">
                  <div className="relative inline-block mb-5">
                    <div
                      className={`w-[72px] h-[72px] rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-[0_0_32px_rgba(0,255,178,0.35)] transition-shadow duration-500 overflow-hidden`}
                    >
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold text-base">{member.initials}</span>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-[#00FFB2]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] text-sm mb-1">{member.name}</h3>
                  <p className="text-[#0F172A]/45 text-xs mb-4">{member.role}</p>
                  <div className="flex justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[Twitter, Linkedin].map((Icon, j) => (
                      <a
                        key={j}
                        href="#"
                        className="w-7 h-7 rounded-full bg-[#00FFB2]/10 flex items-center justify-center hover:bg-[#00FFB2]/25 transition-colors"
                      >
                        <Icon size={11} className="text-[#00FFB2]" />
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / BOOKING ──────────────────────────────────────── */}
      <section id="contact" className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#00FFB2]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#00FFB2]/4 blur-[80px] pointer-events-none" />

        <div className="relative max-w-xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <SectionLabel text="Get In Touch" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">Start Your Project</h2>
            <p className="text-[#0F172A]/45 text-sm mt-4">
              Fill in the form and we will reach out via WhatsApp.
            </p>
          </FadeIn>

          {formState === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-8 rounded-2xl bg-[#00FFB2]/5 border border-[#00FFB2]/20"
            >
              <CheckCircle size={52} className="text-[#00FFB2] mx-auto mb-5" />
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Submission Received!</h3>
              <p className="text-[#0F172A]/55 text-sm leading-relaxed">
                Form submitted successfully. You will be contacted shortly on WhatsApp.
              </p>
              <button
                onClick={() => setFormState("idle")}
                className="mt-7 px-7 py-3 bg-[#00FFB2] text-[#0F172A] text-sm font-semibold rounded-full hover:shadow-[0_0_24px_rgba(0,255,178,0.45)] transition-all"
              >
                Submit Another
              </button>
            </motion.div>
          ) : (
            <FadeIn>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Sebastian Okoye"
                    className={inputClass("name")}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
                    placeholder="+234 800 000 0000"
                    className={inputClass("whatsapp")}
                  />
                  {formErrors.whatsapp && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> {formErrors.whatsapp}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@email.com"
                    className={inputClass("email")}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Service</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setServiceOpen(!serviceOpen)}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm bg-[#F5F7FA] flex items-center justify-between outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(0,255,178,0.15)] ${
                        formErrors.service ? "border-red-400" : "border-black/10 focus:border-[#00FFB2]"
                      } ${formData.service ? "text-[#0F172A]" : "text-[#0F172A]/30"}`}
                    >
                      {formData.service || "Select a service"}
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 text-[#0F172A]/40 ${serviceOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {serviceOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-black/8 rounded-2xl shadow-2xl overflow-hidden z-10"
                      >
                        {SERVICE_OPTIONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setFormData((p) => ({ ...p, service: s }));
                              setServiceOpen(false);
                            }}
                            className="w-full px-5 py-3.5 text-sm text-left transition-colors hover:bg-[#00FFB2]/8 text-[#0F172A]/70 hover:text-[#0F172A]"
                          >
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  {formErrors.service && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> {formErrors.service}
                    </p>
                  )}
                </div>

                {formState === "error" && (
                  <div className="flex items-center gap-2.5 text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                    <AlertCircle size={16} className="shrink-0" />
                    Something went wrong. Please try again.
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={formState === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 bg-[#00FFB2] text-[#0F172A] font-semibold rounded-xl text-sm hover:shadow-[0_0_32px_rgba(0,255,178,0.45)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-[#0F172A]/30 border-t-[#0F172A] animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    "Book Consultation"
                  )}
                </motion.button>
              </form>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] pt-16 pb-10 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-[#00FFB2]/5 blur-[80px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 pb-12 border-b border-white/8">
            <div>
              <div className="text-2xl font-extrabold text-white mb-3 tracking-tight">
                Code<span className="text-[#00FFB2]">Crest</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Premium digital experiences for forward-thinking brands.
              </p>
              <a
                href="https://wa.me/"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00FFB2]/10 border border-[#00FFB2]/20 text-[#00FFB2] text-sm font-medium rounded-full hover:bg-[#00FFB2]/20 transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp Us
              </a>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm tracking-wide mb-5">Quick Links</h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollTo(link)}
                      className="text-white/40 text-sm hover:text-[#00FFB2] transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm tracking-wide mb-5">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-white/40 text-sm">
                  <Mail size={13} className="text-[#00FFB2] shrink-0" />
                  hello@codecrest.io
                </li>
                <li className="flex items-center gap-2.5 text-white/40 text-sm">
                  <MessageCircle size={13} className="text-[#00FFB2] shrink-0" />
                  WhatsApp Available 24/7
                </li>
              </ul>
              <div className="flex gap-3 mt-6">
                {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/4 flex items-center justify-center hover:border-[#00FFB2]/40 hover:bg-[#00FFB2]/10 transition-all duration-300"
                  >
                    <Icon size={13} className="text-white/40 group-hover:text-[#00FFB2]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/25 text-xs">© 2026 CodeCrest. All rights reserved.</p>
            <p className="text-white/20 text-xs">Founded May 9th, 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
