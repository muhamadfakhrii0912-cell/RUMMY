"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, TrendingUp, Users, Search, BarChart3, Upload, Activity, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMFYweiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwaDQwdjQwSDBWMHptMjAgMjBoMjB2MjBIMjBWMjB6TTAgMjBoMjB2MjBIMFYyMHpNMjAgMGgyMHYyMEgyMFYwek0wIDBoMjB2MjBIMFYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] opacity-30" />
        <div className="blob-bg bg-primary/20 w-[600px] h-[600px] top-[-200px] left-[-100px]" />
        <div className="blob-bg bg-blue-500/10 w-[800px] h-[800px] bottom-[-300px] right-[-200px]" style={{ animationDelay: '2s' }} />
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
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
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative after:absolute after:bottom-[-24px] after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden md:flex text-muted-foreground hover:text-white">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(45,212,191,0.5)]">
                Daftar <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
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
                  <Button size="lg" className="h-14 px-8 text-lg bg-white text-background hover:bg-neutral-200">
                    Mulai Analisis <Search className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5">
                    Bergabung
                  </Button>
                </Link>
              </div>
              
              {/* Stats Mockup */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-10">
                {[
                  { label: "Janji Dilacak", value: "12,403", p: "+124 hari ini" },
                  { label: "RUU Dianalisis", value: "342", p: "Real-time" },
                  { label: "Politisi Aktif", value: "580+", p: "Nasional & Daerah" },
                  { label: "Akurasi AI", value: "94.2%", p: "Model NLP" },
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={stat.label} 
                    className="text-left p-4"
                  >
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-primary">{stat.p}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
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
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500">
                        <item.icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 border-t border-primary/10" />
          <div className="blob-bg bg-primary/30 w-[500px] h-[500px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] opacity-50 mix-blend-screen" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto glass-panel p-12 md:p-16 rounded-[2.5rem] border border-white/10"
            >
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
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

      <footer className="border-t border-white/10 bg-background/80 backdrop-blur-md pt-16 pb-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold text-white">RUUMY<span className="text-primary">.</span></span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Democratic Accountability Engine. Menjadikan transparansi bukan sekadar janji, tapi data yang bisa diverifikasi.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/ruu-watch" className="text-muted-foreground hover:text-primary transition-colors">RUU Watch</Link></li>
                <li><Link href="/database" className="text-muted-foreground hover:text-primary transition-colors">Database Janji</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard Warga</Link></li>
                <li><Link href="/dashboard/report" className="text-muted-foreground hover:text-primary transition-colors">Lapor Fakta</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Organisasi</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Tentang Kami</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Laporan Transparansi</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">API & Data</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Kontak</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} RUUMY. All rights reserved. Built for Democracy.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
