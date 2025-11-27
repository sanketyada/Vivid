import React, { useEffect } from "react";

/**
 * Modal viewer for full blog post.
 * - locks body scroll while open
 * - closes on ESC
 */

export default function BlogPostView({ post, onClose = () => {}, onEdit = () => {} }) {
  useEffect(() => {
    if (!post) return;
    // lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-start justify-center p-6"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="w-full h-56 bg-gray-100 overflow-hidden rounded-t-xl">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1400&q=60&auto=format&fit=crop";
            }}
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
              <div className="mt-2 text-sm text-gray-500">
                <span>👤 {post.author}</span> · <span>📅 {post.date}</span>
              </div>
              <div className="mt-3 flex gap-2">
                {post.tags?.map((t) => (
                  <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => onEdit(post)} className="px-3 py-1 rounded-md bg-blue-50 text-blue-700">
                Edit
              </button>

              <button onClick={onClose} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
                Close
              </button>
            </div>
          </div>

          <hr className="my-4" />

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: post.content
                .split(/\n\s*\n/)
                .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
                .join(""),
            }}
          />
        </div>
      </div>
    </div>
  );
}
