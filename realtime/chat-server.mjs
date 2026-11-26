import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 4003 });

// Send the same text to everybody who is connected
function broadcast(text) {
  for (const client of server.clients) {
    if (client.readyState === client.OPEN) client.send(text);
  }
}

// Tell everybody how many people are here
const announce = () =>
  broadcast(JSON.stringify({ type: "users", count: server.clients.size }));

server.on("connection", (socket) => {
  announce();
  socket.on("message", (data) => broadcast(data.toString()));
  socket.on("close", announce);
});

console.log("chat server on ws://localhost:4003");
