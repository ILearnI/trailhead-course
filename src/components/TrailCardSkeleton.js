import { cardShell, pulse } from "@/components/card-styles";

export default function TrailCardSkeleton() {
  return (
    <li className={cardShell}>
      <div className={`aspect-[16/10] rounded-lg ${pulse}`} />
      <div className="flex items-center gap-3">
        <div className={`size-12 rounded-xl ${pulse}`} />
        <div className={`h-10 flex-1 rounded ${pulse}`} />
      </div>
      <div className={`h-5 rounded ${pulse}`} />
    </li>
  );
}
