import VisitedAt from "@/components/VisitedAt";
import Counter from "@/components/Counter";

export default function TrailsTemplate({ children }) {
  return (
    <div className="page-enter">
      <aside aria-label="Page details">
        <Counter label="Template" />
        <VisitedAt />
      </aside>
      {children}
    </div>
  );
}
