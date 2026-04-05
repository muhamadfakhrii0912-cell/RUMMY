import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Settings, Shield, User, Mail, Bell } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" /> Pengaturan Akun
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola preferensi akun, identitas, dan keamanan profil Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center text-center">
             <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-xl">
               {(session?.user?.name || "U").charAt(0).toUpperCase()}
             </div>
             <h3 className="font-bold text-white text-lg">{session?.user?.name}</h3>
             <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
             <div className="mt-4 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white inline-flex items-center gap-1">
               <Shield className="w-3 h-3 text-primary" /> 
               Level: {(session?.user as any)?.role || "CITIZEN"}
             </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-4">Informasi Pribadi</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama Lengkap</label>
                <div className="mt-1 flex items-center gap-3 bg-background border border-white/10 px-4 py-2.5 rounded-lg text-white">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {session?.user?.name}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Terdaftar</label>
                <div className="mt-1 flex items-center gap-3 bg-background border border-white/10 px-4 py-2.5 rounded-lg text-white">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-4">Verifikasi KTP (Sensor Warga)</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Belum Terverifikasi</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Untuk dapat melaporkan fakta di lapangan tanpa hambatan dan membuktikan Anda bukan bot, silakan unggah identitas KTP Anda.
                </p>
                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors">
                  Mulai Verifikasi Identitas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
