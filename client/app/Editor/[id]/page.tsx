"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import io from "socket.io-client";
import { Socket } from "dgram";

const ToolBarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "block-quote", "code-block"],
  ["cleans"],
];

const Editor = () => {
  const [socket, setSocket] = useState<any>();
  const [quill, setQuill] = useState<any>();

  useEffect(() => {
    const socketConnection = io("http://localhost:8000"); // connecting to server
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect(); // diconnecting to server
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    console.log("socket working");
    // sending changes to server
    const sendChanges = (delta: any, oldDelta: any, source: any) => {
      if (source != "user") return; // only user changes will be sent
      socket.emit("send-change", delta);
    };

    quill.on("text-change", sendChanges);
    console.log("sending data failed");

    // closing the socket
    return () => {
      quill.off("text-change", sendChanges);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const updateChanges = (delta: any) => {
      quill.updateContents(delta);
    };

    socket.on("recieve-change", updateChanges);

    return () => {
      socket.off("recieve-change", updateChanges);
    };
  }, []);

  const quillRef = useCallback((quill: any) => {
    if (!quill) return; // if no container found, return
    quill.innerHTML = ""; // clearing the container
    const editor = document.createElement("div"); // an empty div
    quill.append(editor); // adding the empty div to the container div
    const quillEditor = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: ToolBarOptions,
      },
    }); // creating new quill container inside the div
    setQuill(quillEditor);
  }, []);

  return <div className="container" ref={quillRef}></div>; // container div reffering to quillref
};

export default Editor;
