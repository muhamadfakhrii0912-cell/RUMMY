"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Search,
  BarChart3,
  Activity,
  FileText,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Zap,
  Lock,
  Globe,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/* ─── FAQ Data ─── */
interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Tentang RUUMY",
    icon: HelpCircle,
    question: "Apa itu RUUMY?",
    answer:
      "RUUMY (Democratic Accountability Engine) adalah platform Civic Technology berbasis kecerdasan buatan yang dirancang untuk menjaga transparansi demokrasi di Indonesia. Platform ini menghubungkan tiga titik penting yang sering terputus: janji kampanye politisi, proses legislasi (RUU/UU), dan dampak nyata yang dirasakan masyarakat.",
  },
  {
    category: "Tentang RUUMY",
    icon: Shield,
    question: "Mengapa RUUMY dibuat?",
    answer:
      "Demokrasi Indonesia mengalami fenomena 'Democratic Black Hole' — dimana janji politik menghilang dalam proses birokrasi. RUU tiba-tiba disahkan tanpa warga tahu dampaknya, anggaran bocor tanpa pengawasan. RUUMY hadir untuk menerangi titik-titik buta ini dengan data dan teknologi AI.",
  },
  {
    category: "Tentang RUUMY",
    icon: Globe,
    question: "Apakah RUUMY berafiliasi dengan partai politik?",
    answer:
      "Tidak. RUUMY adalah platform independen yang berpegang pada prinsip netralitas data. Kami tidak berpihak pada partai, kubu, atau ideologi manapun. Semua analisis dilakukan oleh sistem AI berdasarkan data faktual — bukan opini.",
  },
  {
    category: "Fitur & Cara Kerja",
    icon: Search,
    question: "Bagaimana cara RUUMY melacak janji politik?",
    answer:
      "RUUMY menggunakan sistem Promise Capture yang mengumpulkan janji politik dari video debat, pidato resmi, posting media sosial, dan dokumen kampanye. Sistem NLP kami mengekstrak esensi janji tersebut, lalu menyimpannya dalam database lengkap dengan konteks, deadline, dan metrik keberhasilan yang terukur.",
  },
  {
    category: "Fitur & Cara Kerja",
    icon: FileText,
    question: "Apa itu fitur RUU Watch?",
    answer:
      "RUU Watch adalah fitur pemantauan legislasi secara real-time. Fitur ini melacak progres setiap Rancangan Undang-Undang, menganalisis isi pasal, dan mendeteksi apakah RUU tersebut konsisten atau bertentangan dengan janji kampanye yang pernah diucapkan oleh politisi terkait.",
  },
  {
    category: "Fitur & Cara Kerja",
    icon: BarChart3,
    question: "Apa itu Promise Radar dan Kebenaran Index?",
    answer:
      "Promise Radar adalah dashboard visual interaktif berupa bubble chart yang memperlihatkan status janji politik: Hijau (Tercapai), Kuning (Dalam Proses), Merah (Gagal). Kebenaran Index adalah skor kredibilitas dinamis untuk setiap politisi berdasarkan rasio janji yang ditepati versus yang diingkari.",
  },
  {
    category: "Fitur & Cara Kerja",
    icon: Zap,
    question: "Bagaimana Contradiction Detector bekerja?",
    answer:
      "Contradiction Detector secara otomatis membandingkan isi RUU yang sedang dibahas dengan database janji kampanye. Jika ditemukan inkonsistensi — misalnya politisi berjanji menurunkan pajak tetapi RUU yang didukungnya justru menaikkan pajak — sistem akan menandai kontradiksi tersebut lengkap dengan bukti.",
  },
  {
    category: "Akun & Partisipasi",
    icon: Users,
    question: "Apakah harus membuat akun untuk menggunakan RUUMY?",
    answer:
      "Tidak harus! Sebagai Guest (tanpa login), kamu sudah bisa melihat dashboard publik dan Promise Radar. Dengan mendaftar sebagai Citizen (cukup email), kamu bisa bookmark janji, menggunakan simulasi dampak RUU, memberikan komentar, dan melakukan voting.",
  },
  {
    category: "Akun & Partisipasi",
    icon: Users,
    question: "Apa perbedaan Citizen biasa dan Verified Citizen?",
    answer:
      "Citizen biasa (daftar email) bisa bookmark, komentar, dan vote. Verified Citizen (setelah verifikasi KTP) mendapat akses ke fitur Crowd-Verification — yaitu kemampuan mengunggah bukti foto kondisi lapangan dengan validasi GPS/geolokasi. Bukti dari Verified Citizen memiliki bobot validitas lebih tinggi.",
  },
  {
    category: "Data & Keamanan",
    icon: Lock,
    question: "Apakah data pribadi saya aman?",
    answer:
      "Keamanan data adalah prioritas utama. Semua data akun dilindungi dengan enkripsi standar industri. Password di-hash, session menggunakan JWT Token, dan semua input divalidasi oleh Zod untuk mencegah injeksi data berbahaya. Data KTP hanya digunakan untuk proses verifikasi.",
  },
  {
    category: "Data & Keamanan",
    icon: Globe,
    question: "Dari mana sumber data yang digunakan RUUMY?",
    answer:
      "Data RUUMY berasal dari: (1) Rekaman janji dari debat, pidato, dan media sosial terverifikasi, (2) Dokumen RUU/UU resmi dari DPR RI, (3) Data statistik dari BPS, APBN, dan lembaga pemerintah, (4) Laporan warga terverifikasi melalui Crowd-Verification. Semua data melalui proses cross-check.",
  },
];

const faqCategories = [
  { name: "Semua", icon: HelpCircle },
  { name: "Tentang RUUMY", icon: Globe },
  { name: "Fitur & Cara Kerja", icon: Zap },
  { name: "Akun & Partisipasi", icon: Users },
  { name: "Data & Keamanan", icon: Lock },
];

/* ─── Accordion Item Component ─── */
function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div
        className={`group glass-panel rounded-2xl overflow-hidden transition-all duration-500 ${
          isOpen
            ? "border-primary/30 shadow-[0_0_40px_-10px_rgba(45,212,191,0.15)]"
            : "hover:border-border hover:bg-secondary/30"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer"
          id={`faq-q-${index}`}
          aria-expanded={isOpen}
          aria-controls={`faq-a-${index}`}
        >
          <div
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
              isOpen
                ? "bg-primary/20 border border-primary/40"
                : "bg-secondary/50 border border-border group-hover:bg-primary/10 group-hover:border-primary/20"
            }`}
          >
            <Icon
              className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 ${
                isOpen ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              }`}
            />
          </div>
          <span
            className={`flex-1 font-semibold text-base md:text-lg transition-colors duration-300 ${
              isOpen ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
            }`}
          >
            {item.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0"
          >
            <ChevronDown
              className={`w-5 h-5 transition-colors duration-300 ${
                isOpen ? "text-primary" : "text-muted-foreground/50"
              }`}
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`faq-a-${index}`}
              role="region"
              aria-labelledby={`faq-q-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 md:px-6 md:pb-6 pl-[4.25rem] md:pl-[5.5rem]">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/60 via-primary/20 to-transparent rounded-full" />
                  <p className="text-muted-foreground leading-relaxed pl-5 text-sm md:text-[15px]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Main Page Component ─── */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set([0]));
  const [faqCategory, setFaqCategory] = useState("Semua");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    promises: 12403,
    legislations: 342,
    politicians: 580,
    accuracy: 94.2
  });

  useEffect(() => {
    setMounted(true);
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        if(!data.error) {
          setStats({
            promises: data.promises,
            legislations: data.legislations,
            politicians: data.politicians,
            accuracy: 94.2 // AI accuracy stays static or can be calculated
          });
        }
      })
      .catch(console.error);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  const filteredFAQs =
    faqCategory === "Semua"
      ? faqData
      : faqData.filter((item) => item.category === faqCategory);

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMFYweiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwaDQwdjQwSDBWMHptMjAgMjBoMjB2MjBIMjBWMjB6TTAgMjBoMjB2MjBIMFYyMHpNMjAgMGgyMHYyMEgyMFYwek0wIDBoMjB2MjBIMFYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] opacity-30" />
        <div className="blob-bg bg-primary/20 w-[600px] h-[600px] top-[-200px] left-[-100px]" />
        <div className="blob-bg bg-blue-500/10 w-[800px] h-[800px] bottom-[-300px] right-[-200px]" style={{ animationDelay: '2s' }} />
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              RUUMY<span className="text-primary">.</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "RUU Watch", href: "/ruu-watch" },
              { label: "Database Janji", href: "/database" },
              { label: "Politisi", href: "/politicians" },
              { label: "Promise Radar", href: "/promise-radar" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "FAQ", href: "#faq" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-24px] after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Link href="/login">
              <Button variant="ghost" className="hidden md:flex text-muted-foreground hover:text-foreground">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(45,212,191,0.5)] h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
                Daftar <ArrowRight className="ml-1 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4" />
              </Button>
            </Link>
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 flex items-center justify-center text-foreground/80 hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg border border-border transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-3xl border-b border-border shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-2">
                {[
                  { label: "RUU Watch", href: "/ruu-watch" },
                  { label: "Database Janji", href: "/database" },
                  { label: "Politisi", href: "/politicians" },
                  { label: "Promise Radar", href: "/promise-radar" },
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "FAQ", href: "#faq" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors py-3 px-4 rounded-lg"
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="h-px bg-border my-4 mx-2" />
                
                <div className="flex justify-center mb-4">
                  <ThemeToggle />
                </div>
                
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="mx-2">
                  <Button variant="outline" className="w-full justify-center border-border bg-secondary/50 hover:bg-secondary text-foreground hover:text-foreground">
                    Masuk Akun
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10">
        {/* ═══════════════════ Hero Section ═══════════════════ */}
        <section className="pt-40 pb-32 px-4">
          <div className="container mx-auto text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Sistem Pengawasan Terbuka 2.0 Live
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
                Democratic <br />
                <span className="text-gradient">Accountability</span> Engine.
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Setiap janji punya jejak. Setiap RUU punya dampak. 
                Platform analitik pertama untuk mengukur integritas politik secara real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90">
                    Mulai Analisis <Search className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border hover:bg-secondary/50">
                    Bergabung
                  </Button>
                </Link>
              </div>
              
              {/* Stats Mockup */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border pt-10">
                {[
                  { label: "Janji Dilacak", value: stats.promises.toLocaleString(), p: "Real-time DB" },
                  { label: "RUU Dianalisis", value: stats.legislations.toLocaleString(), p: "Real-time DB" },
                  { label: "Politisi Aktif", value: stats.politicians.toLocaleString(), p: "Nasional & Daerah" },
                  { label: "Akurasi AI", value: `${stats.accuracy}%`, p: "Model NLP" },
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={stat.label} 
                    className="text-left p-4"
                  >
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-primary">{stat.p}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ Feature Grid ═══════════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="mb-16 md:flex justify-between items-end">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Arsitektur <span className="text-gradient">Transparansi</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Dari panggung kampanye hingga palu sidang, kami mengawal setiap kata menggunakan sistem pelacakan berbasis data.
                </p>
              </div>
              <Button variant="ghost" className="mt-4 md:mt-0 text-primary hover:text-primary hover:bg-primary/10">
                Lihat Semua Metodologi <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Search,
                  title: "Promise Capture API",
                  desc: "Mengekstrak dan mengarsipkan janji-janji politik dari video debat, pidato resmi, dan jejak digital.",
                  highlight: "NLP Extraction"
                },
                {
                  icon: FileText,
                  title: "Legislative Tracker",
                  desc: "Pemantauan progres RUU secara live. Mendeteksi pasal siluman dan menganalisis dampaknya ke masyarakat.",
                  highlight: "Live Sync"
                },
                {
                  icon: Shield,
                  title: "Verification Engine",
                  desc: "Sistem cross-check otomatis klaim pemerintah dengan dataset resmi (BPS, APBN, Bank Dunia).",
                  highlight: "Data Backed"
                },
                {
                  icon: TrendingUp,
                  title: "Contradiction Radar",
                  desc: "AI mendeteksi anomali antara janji awal dengan keputusan/UU yang sedang dirancang.",
                  highlight: "AI Powered"
                },
                {
                  icon: BarChart3,
                  title: "Kebenaran Index",
                  desc: "Skor kredibilitas dinamis untuk setiap politisi berdasarkan rasio janji ditepati vs diingkari.",
                  highlight: "Dynamic Scoring"
                },
                {
                  icon: Users,
                  title: "Crowd-Verification",
                  desc: "Sistem desentralisasi dimana warga dapat mengunggah bukti lapangan dengan validasi geolokasi.",
                  highlight: "Citizen GPS"
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="glass-card-hover h-full border-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                        {item.highlight}
                      </span>
                    </div>
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500">
                        <item.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ FAQ Section ═══════════════════ */}
        <section id="faq" className="py-24 relative scroll-mt-24">
          {/* Subtle section divider glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="container mx-auto px-4 max-w-4xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-6">
                <HelpCircle className="w-4 h-4" />
                Pusat Bantuan
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-5">
                Pertanyaan yang <span className="text-gradient">Sering Ditanyakan</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Punya pertanyaan tentang RUUMY? Temukan jawaban lengkap tentang cara kerja platform, fitur-fitur utama, dan bagaimana kamu bisa berkontribusi.
              </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap justify-center gap-2.5 mb-10"
            >
              {faqCategories.map((cat) => {
                const CatIcon = cat.icon;
                const isActive = faqCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setFaqCategory(cat.name);
                      setOpenFAQs(new Set());
                    }}
                    id={`faq-cat-${cat.name.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_-5px_rgba(45,212,191,0.3)]"
                        : "bg-secondary text-muted-foreground border border-border hover:bg-secondary/80 hover:text-foreground"
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </motion.div>

            {/* FAQ Items */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={faqCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {filteredFAQs.map((item, index) => {
                    const globalIndex = faqData.indexOf(item);
                    return (
                      <FAQAccordionItem
                        key={`${faqCategory}-${globalIndex}`}
                        item={item}
                        isOpen={openFAQs.has(globalIndex)}
                        onToggle={() => toggleFAQ(globalIndex)}
                        index={index}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA Section ═══════════════════ */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 border-t border-primary/10" />
          <div className="blob-bg bg-primary/30 w-[500px] h-[500px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] opacity-50 mix-blend-screen" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto glass-panel p-12 md:p-16 rounded-[2.5rem] border border-border"
            >
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Ambil Alih <span className="text-gradient">Kendali.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10">
                Demokrasi bukan hanya mencoblos setiap 5 tahun. Ini tentang pengawasan setiap hari. Bergabung sekarang.
              </p>
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg bg-primary text-background hover:bg-primary/90 w-full md:w-auto shadow-[0_0_30px_-5px_rgba(45,212,191,0.4)]">
                  Buat Akun Pengawas <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background/80 backdrop-blur-md pt-16 pb-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold text-foreground">RUUMY<span className="text-primary">.</span></span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Democratic Accountability Engine. Menjadikan transparansi bukan sekadar janji, tapi data yang bisa diverifikasi.
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/ruu-watch" className="text-muted-foreground hover:text-primary transition-colors">RUU Watch</Link></li>
                <li><Link href="/database" className="text-muted-foreground hover:text-primary transition-colors">Database Janji</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard Warga</Link></li>
                <li><Link href="/dashboard/report" className="text-muted-foreground hover:text-primary transition-colors">Lapor Fakta</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Organisasi</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Tentang Kami</Link></li>
                <li><Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">API & Data</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Kontak</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} RUUMY. All rights reserved. Built for Democracy.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
