import { cn } from "@/lib/cn";

// A labelled text field, with an optional error
export default function Input({ label, error, className, ...props }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        className={cn(
          "mt-1 block w-full rounded-lg border bg-surface px-3 py-2",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
