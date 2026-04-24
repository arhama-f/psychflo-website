"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Nav from "../../components/Nav";
import { getPost, posts } from "../posts";

const gold = "#c9a84c";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = useParams();
  const post = getPost(slug);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!post) return;
    import("marked").then(({ marked }) => {
      marked.setOptions({ breaks: true, gfm: true });
      setHtml(marked.parse(post.content));
    });
  }, [post]);

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <Nav />
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <h1 style={{ color: "#f8fafc", fontSize: "28px", fontWeight: "700" }}>Post not found</h1>
          <button onClick={() => router.push("/blog")} style={{ marginTop: "24px", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const related = posts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <button onClick={() => router.push("/blog")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "32px", display: "flex", alignItems: "center", gap: "6px" }}>
          ← Back to Blog
        </button>

        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", color: gold, padding: "3px 10px", borderRadius: "999px" }}>{post.category}</span>
            {post.hot && (
              <span style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>TRENDING</span>
            )}
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>{post.readTime} read</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)" }}>·</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>{post.date}</span>
          </div>
          <h1 style={{ fontSize: "34px", fontWeight: "800", color: "#f8fafc", margin: "0 0 16px", lineHeight: "1.2", letterSpacing: "-0.02em" }}>{post.title}</h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "1.7" }}>{post.desc}</p>
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "40px" }} />

        <style>{`
          .blog-content h2 {
            font-size: 22px;
            font-weight: 700;
            color: #f8fafc;
            margin: 44px 0 16px;
            letter-spacing: -0.01em;
            line-height: 1.3;
          }
          .blog-content h3 {
            font-size: 18px;
            font-weight: 700;
            color: #f8fafc;
            margin: 32px 0 12px;
          }
          .blog-content p {
            font-size: 16px;
            color: rgba(255,255,255,0.72);
            margin: 0 0 20px;
            line-height: 1.85;
          }
          .blog-content strong {
            color: #f8fafc;
            font-weight: 700;
          }
          .blog-content em {
            font-style: italic;
            color: rgba(255,255,255,0.65);
          }
          .blog-content ul, .blog-content ol {
            margin: 0 0 20px;
            padding: 0;
            list-style: none;
          }
          .blog-content li {
            font-size: 16px;
            color: rgba(255,255,255,0.72);
            line-height: 1.75;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
          }
          .blog-content ul li::before {
            content: '–';
            color: ${gold};
            position: absolute;
            left: 0;
          }
          .blog-content ol {
            counter-reset: item;
          }
          .blog-content ol li::before {
            counter-increment: item;
            content: counter(item) '.';
            color: ${gold};
            position: absolute;
            left: 0;
            font-weight: 700;
          }
          .blog-content blockquote {
            border-left: 3px solid ${gold};
            padding: 4px 0 4px 18px;
            margin: 24px 0;
            color: rgba(255,255,255,0.55);
            font-style: italic;
          }
          .blog-content a { color: ${gold}; text-decoration: underline; }
          .blog-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 32px 0; }
          .blog-content code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-size: 14px; color: ${gold}; }
        `}</style>

        {html ? (
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[100, 80, 95, 70, 100, 60, 85].map((w, i) => (
              <div key={i} style={{ height: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", width: `${w}%` }} />
            ))}
          </div>
        )}

        <div style={{ marginTop: "56px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: gold, fontWeight: "700", margin: "0 0 8px", letterSpacing: "0.05em" }}>PSYCHFLO</p>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>Check your policy compliance in 60 seconds</h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 20px" }}>Upload one HR policy page and get readability scores, tribunal risk flags, and a plain-language rewrite. Free.</p>
          <button onClick={() => router.push("/tools/policy")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            Try 1 page free
          </button>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: "56px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "16px", letterSpacing: "0.08em" }}>MORE IN {post.category.toUpperCase()}</h3>
            <div style={{ display: "grid", gridTemplateColumns: related.length === 1 ? "1fr" : "1fr 1fr", gap: "12px" }}>
              {related.map((r) => (
                <div key={r.slug} onClick={() => router.push(`/blog/${r.slug}`)}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "18px", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                  <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", margin: "0 0 8px", lineHeight: "1.4" }}>{r.title}</h4>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 10px", lineHeight: "1.5" }}>{r.desc}</p>
                  <span style={{ fontSize: "11px", color: gold, fontWeight: "600" }}>Read → {r.readTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
