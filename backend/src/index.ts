import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { Socket } from "dgram";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());

io.on("connection", (Socket) => {
  Socket.on("send-change", (delta) => {
    Socket.broadcast.emit("recieve-change", delta); // sends the data it recieves back to all devices
  });
  console.log("connected");
});

http.listen(8000, () => {
  console.log("Server is running on port 8000");
});
