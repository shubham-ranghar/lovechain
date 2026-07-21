import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { HeartBurst } from "@/components/Particles";
import { createCouple } from "@/lib/api";
import { useCouple } from "@/contexts/CoupleContext";
import { Lock, Heart, Copy, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { couple } = useCouple();
  const navigate = useNavigate();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<string | null>(null);
  const [copied, setCopied] = useState<"public" | "edit" | null>(null);

  // If couple data exists, redirect to their home page
  if (couple) {
    return <HomeView couple={couple} />;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) {
      setError("Please enter both names");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createCouple(name1.trim(), name2.trim());
      if (result) {
        setCreatedSlug(result.couple.slug);
        setEditToken(result.editToken);
      } else {
        setError("Failed to create your love site. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "public" | "edit") => {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      }).catch(() => {
        // Fallback if clipboard API fails
        fallbackCopy(text, type);
      });
    } else {
      // Fallback for older browsers or non-HTTPS contexts
      fallbackCopy(text, type);
    }
  };

  const fallbackCopy = (text: string, type: "public" | "edit") => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Copy failed. Please manually copy the link.');
    }
    
    document.body.removeChild(textArea);
  };

  const shareOnWhatsApp = (publicUrl: string) => {
    const message = `I made something special for you 💕 ${publicUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (createdSlug && editToken) {
    const publicUrl = `${window.location.origin}/${createdSlug}`;
    const editUrl = `${window.location.origin}/edit/${editToken}`;

    return (
      <PageShell>
        <div className="flex min-h-[80vh] flex-col items-center justify-center text-center gap-8 max-w-3xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-script text-5xl sm:text-7xl text-soft-red"
          >
            Your Love Site is Ready! 💕
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full grid md:grid-cols-2 gap-6"
          >
            {/* Public Share Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-2 border-pink-200 dark:border-pink-800 rounded-2xl p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                  <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="font-semibold text-pink-700 dark:text-pink-300 text-lg">
                  💌 Link to send to your partner
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4 text-left">
                Send this to your partner so they can see your love site.
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={publicUrl}
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(publicUrl, "public")}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied === "public" ? "Copied!" : "Copy"}
                </button>
              </div>
              <button
                onClick={() => shareOnWhatsApp(publicUrl)}
                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Share on WhatsApp
              </button>
            </motion.div>

            {/* Private Edit Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="font-semibold text-amber-700 dark:text-amber-300 text-lg">
                  🔒 Your private link (for editing)
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4 text-left">
                Keep this only for yourself — anyone with this link can edit your site. Never share it with your partner.
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={editUrl}
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(editUrl, "edit")}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied === "edit" ? "Copied!" : "Copy"}
                </button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            <Link to={`/${createdSlug}`} className="text-soft-red underline hover:no-underline">
              Preview your site →
            </Link>
          </motion.div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
          className="font-script text-6xl sm:text-8xl md:text-9xl text-soft-red drop-shadow-sm"
        >
          LoveChain
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="max-w-md text-base sm:text-lg text-muted-foreground"
        >
          Create a personalized interactive love letter for your special someone
        </motion.p>

        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onSubmit={handleCreate}
          className="w-full max-w-sm space-y-4"
        >
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className="w-full rounded-full bg-card/90 border border-border px-6 py-3 text-center outline-none focus:ring-2 focus:ring-soft-red"
            />
          </div>
          <div className="text-soft-red text-2xl">&</div>
          <div>
            <input
              type="text"
              placeholder="Partner's name"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className="w-full rounded-full bg-card/90 border border-border px-6 py-3 text-center outline-none focus:ring-2 focus:ring-soft-red"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-soft-red px-10 py-4 text-primary-foreground font-medium shadow-soft animate-heartbeat hover:shadow-glow transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Your Love Site ♥"}
          </button>
        </motion.form>
      </div>
    </PageShell>
  );
}

function HomeView({ couple }: { couple: any }) {
  const content = couple.content;
  const [clicks, setClicks] = useState(0);
  const [burst, setBurst] = useState(false);

  const onNameTap = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5) {
      setBurst(true);
      setClicks(0);
      setTimeout(() => setBurst(false), 1800);
    }
  };

  const daysTogether = content.relationshipStartDate
    ? Math.floor((Date.now() - new Date(content.relationshipStartDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <PageShell>
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center gap-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-sm uppercase tracking-[0.3em] text-muted-foreground"
        >
          a little love letter for
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.2 }}
          onClick={onNameTap}
          className="font-script text-6xl sm:text-8xl md:text-9xl text-soft-red select-none cursor-pointer drop-shadow-sm"
        >
          {content.partnerName || "My Love"}
        </motion.h1>

        {daysTogether !== null && daysTogether >= 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            Together for {daysTogether} days 💕
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="max-w-md text-base sm:text-lg text-muted-foreground"
        >
          {content.welcomeMessage || "Every page here is a tiny piece of us. Take your time."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            to="/date"
            className="inline-block rounded-full bg-soft-red px-10 py-4 text-primary-foreground font-medium shadow-soft animate-heartbeat hover:shadow-glow transition-shadow"
          >
            Enter ♥
          </Link>
        </motion.div>

        <p className="mt-6 text-xs text-muted-foreground/70">
          psst — tap the name a few times ✨
        </p>
      </div>
      <HeartBurst show={burst} />
    </PageShell>
  );
}
