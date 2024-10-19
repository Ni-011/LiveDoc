import mongoose, { ConnectOptions } from "mongoose";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import Document from "./Document";

mongoose.connect(
  "mongodb+srv://nitinrana01125532553:bvIPtpJpzlZY4lS3@cluster0.hrxfg.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  } as ConnectOptions
);

const defaultData = "";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());

io.on("connection", (Socket) => {
  // get the doc to display to user
  Socket.on("get-doc", async (documentId) => {
    const doc: any = await findOrCreateDocument(documentId); // finds or creates a document
    Socket.join(documentId); // join the room of the specific doc
    Socket.emit("open-doc", doc.data); // load the document to the user
    Socket.on("send-change", (delta) => {
      // real time changes between different devices having same doc
      Socket.broadcast.to(documentId).emit("recieve-change", delta); // sends the data it recieves back to all devices
    });
    Socket.on("save-dc", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });

  console.log("connected");
});

http.listen(8000, () => {
  console.log("Server is running on port 8000");
});

// find or create the doc in db
const findOrCreateDocument = async (id: string) => {
  if (!id) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({ id: id, data: defaultData });
};
