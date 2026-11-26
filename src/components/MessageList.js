export default async function MessageList() {
  const response = await fetch("http://localhost:4002/messages");
  const messages = await response.json();

  return (
    <ul className="mt-4 space-y-1 text-sm">
      {messages.map((message, index) => (
        <li key={index}>{`[${message.topic}] ${message.name}: ${message.text}${message.updates ? " *" : ""}`}</li>
      ))}
    </ul>
  );
}
