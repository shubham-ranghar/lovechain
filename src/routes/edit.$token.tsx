import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCoupleByEditToken, updateCoupleContent, uploadFile, compressImage } from "@/lib/api";
import type { CoupleContent } from "@/lib/supabase";
import { AlertTriangle, X } from "lucide-react";

const PHOTOS_BUCKET = import.meta.env.VITE_STORAGE_BUCKET_PHOTOS || "photos";
const AUDIO_BUCKET = import.meta.env.VITE_STORAGE_BUCKET_VOICE || "audio";

export const Route = createFileRoute("/edit/$token")({
  component: EditPage,
});

function EditPage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const [couple, setCouple] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState<CoupleContent>({} as CoupleContent);
  const [activeSection, setActiveSection] = useState("home");
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    loadCouple();
  }, [token]);

  async function loadCouple() {
    try {
      const data = await getCoupleByEditToken(token);
      if (data) {
        setCouple(data);
        setContent(data.content || {} as CoupleContent);
      } else {
        setError("Invalid edit token");
      }
    } catch (err) {
      setError("Failed to load couple data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await updateCoupleContent(couple.edit_token, content);
      alert("Saved successfully!");
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  const updateField = (field: keyof CoupleContent, value: any) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!couple) return null;

  const sections = [
    { id: "home", label: "Home" },
    { id: "date", label: "Date" },
    { id: "letter", label: "Letter" },
    { id: "reasons", label: "Reasons" },
    { id: "compliments", label: "Compliments" },
    { id: "constellation", label: "Constellation" },
    { id: "garden", label: "Garden" },
    { id: "finale", label: "Finale" },
    { id: "gallery", label: "Gallery" },
    { id: "voice", label: "Voice" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {showBanner && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border-b-2 border-amber-300 dark:border-amber-700">
          <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ This is your private edit link — don't share it with your partner. 
                Find the link to share with them below.
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-soft-red">Edit Your Love Site</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ to: `/${couple.slug}` })}
              className="px-4 py-2 rounded-lg border border-border hover:bg-blush/40"
            >
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-soft-red text-primary-foreground disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Public Share Link Card */}
        <div className="mb-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-2 border-pink-200 dark:border-pink-800 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <AlertTriangle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-pink-700 dark:text-pink-300">
              💌 Link to share with your partner
            </h3>
          </div>
          <div className="flex gap-2">
            <input
              readOnly
              value={`${window.location.origin}/${couple.slug}`}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${couple.slug}`);
                alert("Copied!");
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>}

        <div className="flex gap-6">
          <div className="w-48 shrink-0">
            <div className="sticky top-6 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-soft-red text-primary-foreground"
                      : "hover:bg-blush/40"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {activeSection === "home" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Home Page</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Partner's Name</label>
                  <input
                    type="text"
                    value={content.partnerName || ""}
                    onChange={(e) => updateField("partnerName", e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Welcome Message</label>
                  <textarea
                    value={content.welcomeMessage || ""}
                    onChange={(e) => updateField("welcomeMessage", e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2 h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Relationship Start Date</label>
                  <input
                    type="date"
                    value={content.relationshipStartDate || ""}
                    onChange={(e) => updateField("relationshipStartDate", e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2"
                  />
                </div>
              </div>
            )}

            {activeSection === "date" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Date Page</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Date Question</label>
                  <input
                    type="text"
                    value={content.dateQuestion || ""}
                    onChange={(e) => updateField("dateQuestion", e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2"
                    placeholder="Will you go on a date with me?"
                  />
                </div>
              </div>
            )}

            {activeSection === "letter" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Letter Page</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Letter Text</label>
                  <textarea
                    value={content.letterText || ""}
                    onChange={(e) => updateField("letterText", e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2 h-64"
                    placeholder="Write your heartfelt letter..."
                  />
                </div>
              </div>
            )}

            {activeSection === "reasons" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Reasons Page</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Reasons (one per line)</label>
                  <textarea
                    value={(content.reasons || []).join("\n")}
                    onChange={(e) => updateField("reasons", e.target.value.split("\n").filter(Boolean))}
                    className="w-full rounded-lg border border-border px-4 py-2 h-64"
                    placeholder="Your smile lights up every room."
                  />
                </div>
              </div>
            )}

            {activeSection === "compliments" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Compliments Page</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Compliments (one per line)</label>
                  <textarea
                    value={(content.compliments || []).join("\n")}
                    onChange={(e) => updateField("compliments", e.target.value.split("\n").filter(Boolean))}
                    className="w-full rounded-lg border border-border px-4 py-2 h-64"
                    placeholder="Your laugh is my favorite sound."
                  />
                </div>
              </div>
            )}

            {activeSection === "constellation" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Constellation Page</h2>
                <p className="text-sm text-muted-foreground">Format: x,y|Memory</p>
                <textarea
                  value={(content.constellationMemories || []).map((m: any) => 
                    `${m.x},${m.y}|${m.memory}`
                  ).join("\n")}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n").filter(Boolean);
                    const memories = lines.map((line) => {
                      const [coords, memory] = line.split("|");
                      const [x, y] = coords.split(",").map(Number);
                      return { x, y, memory };
                    });
                    updateField("constellationMemories", memories);
                  }}
                  className="w-full rounded-lg border border-border px-4 py-2 h-64"
                  placeholder="30,35|The night we first talked till sunrise"
                />
              </div>
            )}

            {activeSection === "garden" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Garden Page</h2>
                <p className="text-sm text-muted-foreground">Format: Label|Caption</p>
                <textarea
                  value={(content.gardenStages || []).map((s: any) => 
                    `${s.label}|${s.caption}`
                  ).join("\n")}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n").filter(Boolean);
                    const stages = lines.map((line) => {
                      const [label, caption] = line.split("|");
                      return { label, caption };
                    });
                    updateField("gardenStages", stages);
                  }}
                  className="w-full rounded-lg border border-border px-4 py-2 h-64"
                  placeholder="Seed|It started small — a shy hello, a nervous smile."
                />
              </div>
            )}

            {activeSection === "finale" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Finale Page</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Closing Message</label>
                  <textarea
                    value={content.finaleMessage || ""}
                    onChange={(e) => updateField("finaleMessage", e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2 h-24"
                    placeholder="Now, and every day after this one."
                  />
                </div>
              </div>
            )}

            {activeSection === "gallery" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Gallery Page</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Photos</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      const photos = content.galleryPhotos || [];
                      
                      for (const file of files) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("File too large (max 5MB)");
                          continue;
                        }
                        try {
                          const compressed = await compressImage(file);
                          const fileObj = new File([compressed], file.name, { type: 'image/jpeg' });
                          const result = await uploadFile(PHOTOS_BUCKET, `${PHOTOS_BUCKET}/${couple.slug}/${Date.now()}.jpg`, fileObj);
                          if (result.error) {
                            alert("Upload failed: " + result.error);
                          } else {
                            photos.push({ url: result.url, caption: "" });
                          }
                        } catch (err) {
                          console.error("Upload failed:", err);
                        }
                      }
                      updateField("galleryPhotos", photos);
                    }}
                    className="w-full rounded-lg border border-border px-4 py-2"
                  />
                </div>
                <div className="space-y-2">
                  {(content.galleryPhotos || []).map((photo: any, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <img src={photo.url} alt="" className="w-16 h-16 object-cover rounded" />
                      <input
                        type="text"
                        value={photo.caption || ""}
                        onChange={(e) => {
                          const updated = [...(content.galleryPhotos || [])];
                          updated[i].caption = e.target.value;
                          updateField("galleryPhotos", updated);
                        }}
                        placeholder="Caption"
                        className="flex-1 rounded-lg border border-border px-4 py-2"
                      />
                      <button
                        onClick={() => {
                          const updated = (content.galleryPhotos || []).filter((_: any, idx: number) => idx !== i);
                          updateField("galleryPhotos", updated);
                        }}
                        className="px-3 py-2 rounded-lg bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "voice" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-soft-red">Voice Page</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Voice Note (mp3/m4a/wav, max 90s)</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 10 * 1024 * 1024) {
                        alert("File too large (max 10MB)");
                        return;
                      }
                      try {
                        const result = await uploadFile(AUDIO_BUCKET, `${AUDIO_BUCKET}/${couple.slug}/${Date.now()}.${file.name.split('.').pop()}`, file);
                        if (result.error) {
                          alert("Upload failed: " + result.error);
                        } else {
                          updateField("voiceNoteUrl", result.url);
                        }
                      } catch (err) {
                        console.error("Upload failed:", err);
                        alert("Upload failed");
                      }
                    }}
                    className="w-full rounded-lg border border-border px-4 py-2"
                  />
                </div>
                {content.voiceNoteUrl && (
                  <div className="p-4 bg-blush/20 rounded-lg">
                    <audio controls src={content.voiceNoteUrl} className="w-full" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
