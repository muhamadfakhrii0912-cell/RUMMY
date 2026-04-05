"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

export function CommentSection({ promiseId, existingComments, session }: any) {
  const [comments, setComments] = useState(existingComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVote = async (commentId: string, type: 'up' | 'down') => {
    if (!session) return;
    
    // Optimistic update
    setComments(comments.map((c: any) => {
      if (c.id === commentId) {
        return {
          ...c,
          voteUp: type === 'up' ? (c.voteUp || 0) + 1 : c.voteUp,
          voteDown: type === 'down' ? (c.voteDown || 0) + 1 : c.voteDown,
        };
      }
      return c;
    }));

    try {
      await fetch('/api/comments/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, type })
      });
      router.refresh();
    } catch (err) {
      console.error(err);
      // Revert optimistic update in a real production app
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;
    setLoading(true);

    try {
      // In a real app, you would hit an API route. Since we don't have it explicitly created in this snippet,
      // you could create `/api/comments` or hit it here and append to local state immediately
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promiseId, content })
      });
      
      const newComment = await res.json();
      if (res.ok) {
        setComments([{ ...newComment, user: { name: session.user.name, image: session.user.image } }, ...comments]);
        setContent("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" /> Ruang Diskusi ({comments.length})
      </h3>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            required
            disabled={loading}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:border-primary transition-colors mb-2"
            placeholder="Tulis opini, analisis, atau bukti tambahan Anda tentang janji ini..."
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Kirim Komentar
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center mb-8">
          <p className="text-muted-foreground mb-3">Login untuk ikut berdiskusi dan memberikan analisis Anda.</p>
          <a href="/login" className="inline-block bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Masuk / Daftar
          </a>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {(comment.user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">{comment.user?.name || "Warga"}</span>
                  <span className="text-xs text-muted-foreground">
                    • {new Date(comment.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed mb-3">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <button 
                    onClick={() => handleVote(comment.id, 'up')}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> {comment.voteUp || 0}
                  </button>
                  <button 
                    onClick={() => handleVote(comment.id, 'down')}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" /> {comment.voteDown || 0}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Belum ada diskusi untuk janji ini. Jadilah yang pertama memberikan review!
          </div>
        )}
      </div>
    </div>
  );
}
