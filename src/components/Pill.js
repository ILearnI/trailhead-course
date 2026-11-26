"use client";

export default function Pill({ children }) {
  return (
    <span className="pill">
      {children}
      <style jsx>{`
        .pill {
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          background: #ccfbf1;
        }
      `}</style>
    </span>
  );
}
