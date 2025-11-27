import React, { useEffect, useState } from "react";

const DRAFT_KEY = "vivid_blog_draft_v1";

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderContentToHtml(raw) {
  const paragraphs = raw
    .split(/\n\s*\n/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`);
  return paragraphs.join("");
}

export default function BlogEditor({ initial = null, onPublish, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail || "");
  const [tags, setTags] = useState((initial?.tags || []).join(", ") || "");
  const [author, setAuthor] = useState(initial?.author || "Expert User");
  const [content, setContent] = useState(initial?.content || "");
  const [savingDraft, setSavingDraft] = useState(false);

  // load draft if available and not editing existing post
  useEffect(() => {
    if (!initial) {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        try {
          const d = JSON.parse(raw);
          setTitle(d.title || "");
          setThumbnail(d.thumbnail || "");
          setTags(d.tags || "");
          setAuthor(d.author || "Expert User");
          setContent(d.content || "");
        } catch {}
      }
    }
  }, [initial]);

  // autosave draft
  useEffect(() => {
    if (initial) return; // don't autosave when editing published post
    setSavingDraft(true);
    const t = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, thumbnail, tags, author, content })
      );
      setSavingDraft(false);
    }, 700);
    return () => clearTimeout(t);
  }, [title, thumbnail, tags, author, content, initial]);

  const handlePublish = () => {
    if (!title.trim()) return alert("Please add a title.");
    if (!content.trim()) return alert("Please add content for the post.");

    const post = {
      id: initial?.id || `b${Date.now()}`,
      title: title.trim(),
      thumbnail:
        thumbnail.trim() ||
        "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1400&q=60&auto=format&fit=crop",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author: author.trim() || "Expert User",
      date: new Date().toISOString().split("T")[0],
      content: content.trim(),
      excerpt:
        content.trim().slice(0, 160).replace(/\n/g, " ") +
        (content.trim().length > 160 ? "…" : ""),
    };

    // clear draft after publish
    localStorage.removeItem(DRAFT_KEY);
    onPublish(post);
  };

  const handleClearDraft = () => {
    if (!confirm("Clear draft? This cannot be undone.")) return;
    localStorage.removeItem(DRAFT_KEY);
    setTitle("");
    setThumbnail("");
    setTags("");
    setContent("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{initial ? "Edit Article" : "Write Article"}</h2>

        <div className="text-sm text-gray-500">{savingDraft ? "Saving draft…" : "Draft autosaved"}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <label className="font-semibold text-gray-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Article title..."
          />

          <label className="font-semibold text-gray-700 mt-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-56"
            placeholder={"Write your article... (plain text ok; preview will show formatting)"}
          />
        </div>

        <aside className="space-y-3">
          <div>
            <label className="font-semibold text-gray-700">Thumbnail URL</label>
            <input
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="https://..."
            />
            <div className="mt-2">
              <img
                src={
                  thumbnail ||
                  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&q=60&auto=format&fit=crop"
                }
                alt="thumbnail preview"
                className="w-full h-28 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&q=60&auto=format&fit=crop";
                }}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="AI, Fact-check, Politics"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 6)
                .map((t) => (
                  <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    #{t}
                  </span>
                ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
            >
              {initial ? "Save Changes" : "Publish Article"}
            </button>

            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              Cancel
            </button>

            {!initial && (
              <button onClick={handleClearDraft} className="px-4 py-2 text-sm text-red-600 rounded hover:underline">
                Clear Draft
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Live preview */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Live Preview</h4>
        <div
          className="prose max-w-none bg-gray-50 p-4 rounded"
          dangerouslySetInnerHTML={{ __html: renderContentToHtml(content) }}
        />
      </div>
    </div>
  );
}
