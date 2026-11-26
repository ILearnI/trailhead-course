const members = ["Ana", "Marco", "Priya"];

export default function Team() {
  return (
    <ul className="mt-4 list-disc pl-6">
      {members.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
