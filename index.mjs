import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { PrismaClient } from "@prisma/client";

const app = express();
app.use(cors()); // Use cors middleware
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
});

const prisma = new PrismaClient();
(async () => {
  // Create or update the counter when the server starts
  const data = await prisma.counter.upsert({
    where: { id: 1 },
    update: {},
    create: { count: 0 },
  });
  console.log("data ", data);
})();

io.on("connection", async (socket) => {
  const counter = await prisma.counter.findFirst();
  socket.emit("counter", counter?.count);

  socket.on("increment", async () => {
    await prisma.counter.update({
      where: { id: counter.id },
      data: { count: { increment: 1 } },
    });
    const updatedCounter = await prisma.counter.findFirst();
    io.emit("counter", updatedCounter?.count);
  });

  socket.on("decrement", async () => {
    await prisma.counter.update({
      where: { id: counter.id },
      data: { count: { decrement: 1 } },
    });
    const updatedCounter = await prisma.counter.findFirst();
    io.emit("counter", updatedCounter?.count);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
