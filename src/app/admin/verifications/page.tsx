"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, AlertTriangle, User, FileText } from "lucide-react";

type Verification = {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user: { name: string; email: string };
  createdAt: string;
};

export default function KanbanVerifications() {
  const [items, setItems] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/verifications");
      const data = await res.json();
      if(Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");

    // Optimistic UI update
    setItems((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    // Call API
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Gagal update");
    } catch (err) {
      console.error(err);
      fetchData(); // Rollback on failure
    }
  };

  const columns = [
    {
      id: "PENDING",
      title: "Menunggu Review",
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      color: "border-yellow-500/30 bg-yellow-500/5",
      headerColor: "text-yellow-500 bg-yellow-500/10",
    },
    {
      id: "APPROVED",
      title: "Diterima / Valid",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      color: "border-green-500/30 bg-green-500/5",
      headerColor: "text-green-500 bg-green-500/10",
    },
    {
      id: "REJECTED",
      title: "Ditolak / Hoaks",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      color: "border-red-500/30 bg-red-500/5",
      headerColor: "text-red-500 bg-red-500/10",
    },
  ];

  if (loading) return <div className="p-8 text-center text-foreground animate-pulse">Memuat data Kanban...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-primary" /> Moderasi Laporan Warga
          </h2>
          <p className="text-muted-foreground mt-1">
            Seret dan lepas (Drag & Drop) kartu pelaporan ke kolom verifikasi yang sesuai.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
        {columns.map((col) => (
          <div 
            key={col.id} 
            className={`flex flex-col rounded-2xl border ${col.color} overflow-hidden`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id as any)}
          >
            <div className={`p-4 flex items-center justify-between border-b border-border ${col.headerColor}`}>
              <div className="flex items-center gap-2 font-bold">
                {col.icon}
                {col.title}
              </div>
              <div className="px-2 py-0.5 rounded-full bg-background/50 text-xs font-bold">
                {items.filter(i => i.status === col.id).length}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
               {items.filter(i => i.status === col.id).length === 0 ? (
                 <div className="h-full flex items-center justify-center text-sm text-muted-foreground/50 border-2 border-dashed border-border rounded-xl">
                   Tarik kartu ke sini
                 </div>
               ) : (
                items.filter(i => i.status === col.id).map((item) => (
                  <Card 
                    key={item.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragEnd={handleDragEnd}
                    className="glass-card-hover border-border bg-card cursor-grab hover:border-primary/50 transition-all select-none active:cursor-grabbing shadow-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2">{item.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-3 bg-secondary p-2 rounded-lg border border-border">
                        {item.description}
                      </p>
                      <div className="flex flex-col gap-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="w-3 h-3 text-primary" /> {item.user.name}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground/70">
                          <span>{new Date(item.createdAt).toLocaleDateString("id-ID")}</span>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary border border-border">ID: {item.id.slice(-4)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
