export default function ServerInfo() {
  return (
    <p className="mt-4 text-sm text-zinc-500">
      Rendered on the server, with Node <code>{process.version}</code>.
    </p>
  );
}
