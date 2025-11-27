import React, { useEffect, useState } from "react";
import BlogEditor from "./BlogEditor";
import BlogPostView from "./BlogPostView";

/**
 * Professional ExpertsBlog page
 * - Keeps posts in localStorage (demo persistence)
 * - Shows responsive grid of blog cards (2 columns on md+)
 * - Supports: Create, Edit, Delete, View
 */

const STORAGE_KEY = "vivid_experts_blogs_v1";

/* seed if none exists */
const seedBlogs = [
  {
    id: "b1",
    title: "AI & Fake News: A Practical Playbook",
    author: "Sachin Kushwaha",
    date: "2025-11-27",
    thumbnail:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1400&q=80&auto=format&fit=crop",
    tags: ["AI", "Media", "Fact-check"],
    content:
      "AI can help flag misinformation quickly. In this article we outline a practical flow to deploy verification pipelines in low-latency environments.\n\n1) Source collection\n2) Cross-check with trusted feeds\n3) Automated ranking of signals\n\nThis is a short example demo of blog content in the Vivid dashboard.",
    excerpt:
      "AI can help flag misinformation quickly. This article outlines a practical flow to deploy verification pipelines.",
  },
];

export default function ExpertsBlog() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null); // {mode: 'new'|'edit', data}
  const [viewing, setViewing] = useState(null); // blog object

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setBlogs(JSON.parse(raw));
        return;
      } catch {}
    }
    setBlogs(seedBlogs);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  }, [blogs]);

  const handleCreate = () => setEditing({ mode: "new", data: null });

  const handlePublish = (post) => {
    if (!post.id) post.id = `b${Date.now()}`;
    setBlogs((prev) => {
      const exists = prev.find((p) => p.id === post.id);
      if (exists) return prev.map((p) => (p.id === post.id ? post : p));
      return [post, ...prev];
    });
    setEditing(null);
  };

  const handleCancel = () => setEditing(null);

  const handleEdit = (post) => setEditing({ mode: "edit", data: post });

  const handleDelete = (id) => {
    if (!confirm("Delete this blog post permanently?")) return;
    setBlogs((prev) => prev.filter((p) => p.id !== id));
    if (viewing?.id === id) setViewing(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experts Blog</h1>
          <p className="text-gray-600 mt-1">
            Publish expert analysis, explainers and long-reads. Posts are stored locally (demo).
            Connect a backend later.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            aria-label="Write article"
          >
            ✍️ Write Article
          </button>
        </div>
      </div>

      {/* Editor (create/edit) */}
      {editing ? (
        <div>
          <BlogEditor
            initial={editing.data}
            onPublish={handlePublish}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          {/* Posts grid: 1 column mobile, 2 columns medium+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((b) => (
              <article
                key={b.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <div className="w-full h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={b.thumbnail}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1400&q=60&auto=format&fit=crop";
                    }}
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">{b.excerpt}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>👤 {b.author}</span>
                      <span aria-hidden>·</span>
                      <span>📅 {b.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewing(b)}
                        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                      >
                        Read
                      </button>

                      <button
                        onClick={() => handleEdit(b)}
                        className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(b.id)}
                        className="px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {b.tags?.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty state */}
          {blogs.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600">No posts yet — write the first one!</p>
            </div>
          )}
        </>
      )}

      {/* Viewer modal */}
      {viewing && (
        <BlogPostView
          post={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing({ mode: "edit", data: viewing });
            setViewing(null);
          }}
        />
      )}
    </div>
  );
}
