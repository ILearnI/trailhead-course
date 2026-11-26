export default function Callout({ children }) {
  return (
    <div className="mt-6 rounded-xl border border-brand-500 bg-brand-100 dark:bg-brand-700/30 p-6 text-lg font-medium text-brand-700 dark:text-brand-100 shadow-sm transition hover:shadow-md">
      {children}
    </div>
  );
}
