"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import Button from "@/components/client/button";
import React from "react";
import SocketHandler from "@/services/socket/socket";
import TextArea from "@/components/client/text-area";
import { useRouter as navigationRouter } from "next/navigation";

export default function Home() {
  const router = navigationRouter();
  const socketRef = useRef(new SocketHandler());
  const [inputValue, setInputValue] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const clientSocketid = socketRef.current.socketInstance?.id;
  const namespaceAdmin = connectedUsers[0];

  useEffect(() => {
    const path = window.location.pathname.split("/")[2];

    socketRef.current.connect(path);

    socketRef.current.socketInstance?.on("message", (message: { message: string; from: string }) => {
      setInputValue(message.message);
    });

    socketRef.current.socketInstance?.on("new-user", (userId: string[]) => {
      setConnectedUsers(() => {
        const uniqueUsersIds = new Set([...userId]);
        return [...uniqueUsersIds];
      });

      sendMessageToSync();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    socketRef.current.socketInstance?.emit("message", event.target.value);
    setInputValue(event.target.value);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.protocol + "//" + window.location.host + window.location.pathname);
  }

  function disconnect() {
    socketRef.current.disconnect();
    router.replace(window.location.protocol + "//" + window.location.host);
  }

  function sendMessageToSync() {
    console.log(socketRef.current.socketInstance?.id);
    if (connectedUsers[0] === socketRef.current.socketInstance?.id) {
      socketRef.current.socketInstance?.emit("message", inputValue);
    }
  }

  return (
    <section className="flex flex-col items-center gap-4">
      <TextArea onChange={handleChange} value={inputValue} />
      <div className="flex flex-col text-center">
        <p className="font-bold">Connected users</p>
        {connectedUsers?.map((userId, index) => (
          <React.Fragment key={index}>
            <p>
              {`${userId} - 
            ${userId === namespaceAdmin ? "(Admin)" : "(Guest)"} 
            ${clientSocketid === userId ? "- You" : ""}`}
            </p>
          </React.Fragment>
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="blue" onClick={copyToClipboard}>
          Copy link to clipboard
        </Button>
        <Button variant="red" onClick={disconnect}>
          Close this share (forever)
        </Button>
      </div>
    </section>
  );
}
