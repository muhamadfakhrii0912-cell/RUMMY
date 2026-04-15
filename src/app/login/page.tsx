"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password tidak valid");
      } else {
        router.push("/dashboard"); // Adjust as necessary
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Ambient Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full mix-blend-screen filter blur-[100px] bg-primary opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full mix-blend-screen filter blur-[100px] bg-slate-600 opacity-20 animate-blob" style={{ animationDelay: "2s" }}></div>
      <div className="absolute inset-0 bg-grid-white opacity-5"></div>

      {/* Main Form Content */}
      <div className="w-full max-w-md p-4 relative z-10 animate-fade-up">
        {/* Glassmorphism Card */}
        <Card className="glass-card-hover border-white/5 bg-background/40 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-slate-500/5 z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 backdrop-blur-md">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-slate-500 shadow-md"></div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center tracking-tight text-white">
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Masuk ke akun RUUMY Anda
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
                  <div className="flex items-center justify-between ml-1">
                    <label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Lupa password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-white/10 hover:border-white/20 focus-visible:border-primary/50 focus-visible:ring-primary/20 text-white transition-all duration-300 h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 rounded-xl relative overflow-hidden group shadow-[0_0_20px_-5px_rgba(100,116,139,0.3)] hover:shadow-[0_0_25px_-5px_rgba(100,116,139,0.5)] transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Masuk
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
                  <span className="bg-background/40 px-3 py-1 rounded-full text-muted-foreground backdrop-blur-md border border-white/5">Atau lanjut dengan</span>
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
                Belum punya akun?{" "}
                <Link href="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors drop-shadow-[0_0_10px_rgba(100,116,139,0.3)]">
                  Daftar sekarang
                </Link>
              </p>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
