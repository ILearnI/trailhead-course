export default function DashboardLayout({ children, stats, activity }) {
  return (
    <div className="mx-auto w-full max-w-4xl p-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <section className="rounded-xl border p-4">{stats}</section>
        <section className="rounded-xl border p-4">{activity}</section>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
