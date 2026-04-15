"use client";

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { useState } from "react";

export function PromiseRadarChart({ promises }: { promises: any[] }) {
  const [activeNode, setActiveNode] = useState<any>(null);

  // Categories mapping to Y-axis
  const categories = Array.from(new Set(promises.map(p => p.category)));
  
  const chartData = promises.map((p) => {
    return {
      id: p.id,
      title: p.title,
      politician: p.politician.name,
      category: p.category,
      categoryIndex: categories.indexOf(p.category),
      status: p.status,
      // Scatter size based on bookmarks (min size 60)
      size: Math.max(p._count.bookmarks * 20 + 80, 80), 
      // X-axis: mapping date to a numeric value
      date: new Date(p.createdAt).getTime(),
      color: 
        p.status === 'FULFILLED' ? '#22c55e' : 
        (p.status === 'PENDING' || p.status === 'ON_TRACK') ? '#eab308' : 
        '#ef4444'
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-4 rounded-xl border border-border bg-card/90 backdrop-blur-xl w-64 shadow-md">
           <div className={`text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block ${data.status === 'FULFILLED' ? 'bg-green-500/20 text-green-400' : data.status.includes('PENDING') ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
             {data.status}
           </div>
           <p className="text-sm font-bold text-foreground mb-1">{data.title}</p>
           <p className="text-xs text-muted-foreground mb-2">Oleh: {data.politician}</p>
           <div className="text-[10px] text-muted-foreground border-t border-border pt-2">
             Kategori: {data.category} | Popularitas: {data.size}
           </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[600px] bg-card border border-border rounded-2xl p-6 relative shadow-sm">
      {!promises.length ? (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
           Belum ada data untuk dipetakan.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
            <XAxis 
              type="number" 
              dataKey="date" 
              name="Waktu" 
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString("id-ID", { month: 'short', year: 'numeric' })}
              stroke="currentColor" className="opacity-20"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="categoryIndex" 
              name="Kategori" 
              tickFormatter={(val) => categories[val] || ""}
              stroke="currentColor" className="opacity-20"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              width={100}
            />
            <ZAxis type="number" dataKey="size" range={[80, 500]} name="Popularity" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'currentColor', opacity: 0.1 }} />
            
            <Scatter name="Promises" data={chartData} onMouseEnter={(e) => setActiveNode(e)} onMouseLeave={() => setActiveNode(null)}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  fillOpacity={activeNode?.id === entry.id ? 1 : 0.6}
                  stroke={entry.color}
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
