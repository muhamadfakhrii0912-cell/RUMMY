import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

export default async function DiscussionsPage() {
  const session = await getServerSession(authOptions);
  
  const comments = await prisma.comment.findMany({
    where: { userId: (session?.user as any)?.id },
    include: {
      promise: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-primary" /> Diskusi & Opini Saya
        </h1>
        <p className="text-muted-foreground mt-2">
          Riwayat opini, komentar, dan analisis yang telah Anda berikan pada berbagai janji politik.
        </p>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-md">
             <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
             <h3 className="text-lg font-bold text-foreground mb-2">Ruang diskusi masih kosong</h3>
             <p className="text-muted-foreground">Anda belum memberikan komentar apapun di platform ini.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
              {comment.promise && (
                <div className="mb-3 pb-3 border-b border-border">
                  <p className="text-xs text-muted-foreground">Mengomentari Janji:</p>
                  <p className="text-sm font-bold text-foreground truncate">{comment.promise.title}</p>
                </div>
              )}
              <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
              
              <div className="mt-4 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
                  <ThumbsUp className="w-4 h-4" /> {comment.voteUp}
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
                  <ThumbsDown className="w-4 h-4" /> {comment.voteDown}
                </div>
                <div className="ml-auto">
                  {comment.createdAt.toLocaleDateString("id-ID", { dateStyle: "medium" })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
