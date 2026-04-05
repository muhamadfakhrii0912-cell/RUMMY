"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat pendaftaran");
      }

      // Automatically sign in after successful registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        // If login silently fails, redirect to login page
        router.push("/login?registered=true");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Gagal membuat akun");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12">
      {/* Background Ambient Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full mix-blend-screen filter blur-[100px] bg-primary opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full mix-blend-screen filter blur-[100px] bg-cyan-600 opacity-20 animate-blob" style={{ animationDelay: "2s" }}></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMFYweiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwaDQwdjQwSDBWMHptMjAgMjBoMjB2MjBIMjBWMjB6TTAgMjBoMjB2MjBIMFYyMHpNMjAgMGgyMHYyMEgyMFYwek0wIDBoMjB2MjBIMFYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] opacity-10"></div>

      {/* Main Form Content */}
      <div className="w-full max-w-md p-4 relative z-10 animate-fade-up">
        {/* Glassmorphism Card */}
        <Card className="glass-card-hover border-white/5 bg-background/40 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 backdrop-blur-md">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 shadow-md"></div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center tracking-tight text-white">
                Buat Akun
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Bergabung untuk mulai mengawasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg text-center backdrop-blur-sm animate-fade-up">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground/80 ml-1">Nama Lengkap</label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Nama Anda" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/50 border-white/10 hover:border-white/20 focus-visible:border-primary/50 focus-visible:ring-primary/20 text-white placeholder:text-muted-foreground/40 transition-all duration-300 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground/80 ml-1">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="warga@contoh.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 border-white/10 hover:border-white/20 focus-visible:border-primary/50 focus-visible:ring-primary/20 text-white placeholder:text-muted-foreground/40 transition-all duration-300 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground/80 ml-1">Password</label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Minimal 8 karakter"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-white/10 hover:border-white/20 focus-visible:border-primary/50 focus-visible:ring-primary/20 text-white transition-all duration-300 h-12"
                    minLength={8}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 rounded-xl relative overflow-hidden group shadow-[0_0_20px_-5px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_-5px_rgba(45,212,191,0.5)] transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Mendaftar
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-2 pb-6">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-medium tracking-wider">
                  <span className="bg-background/40 px-3 py-1 rounded-full text-muted-foreground backdrop-blur-md border border-white/5">Atau daftar dengan</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <Button variant="outline" type="button" className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white h-11 transition-all">
                  Google
                </Button>
                <Button variant="outline" type="button" className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white h-11 transition-all">
                  GitHub
                </Button>
              </div>
              <p className="text-sm text-center text-muted-foreground mt-4">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors drop-shadow-[0_0_10px_rgba(45,212,191,0.3)]">
                  Masuk di sini
                </Link>
              </p>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
