// The top of a page: title, text and actions
export default function PageHeader({ title, description, children }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-4">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      <div className="flex gap-2">{children}</div>
    </header>
  );
}
