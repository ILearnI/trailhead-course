import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-brand-500 text-white hover:bg-brand-700",
  outline: "border border-brand-500 text-brand-700 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-700/30",
  ghost: "text-brand-700 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-700/30",
};

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
};

export default function Button({ variant = "primary", size = "md", className, ...props }) {
  const classes = cn(
    "rounded-lg font-medium transition",
    variants[variant],
    sizes[size],
    props.disabled && "cursor-not-allowed opacity-50",
    className,
  );

  return <button className={classes} {...props} />;
}
