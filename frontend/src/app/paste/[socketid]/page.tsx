"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import Button from "@/components/client/button";
import SocketHandler from "@/services/socket/socket";
import TextArea from "@/components/client/text-area";
import { useRouter as navigationRouter } from "next/navigation";

export default function Home() {
  const router = navigationRouter();
  const socketRef = useRef(new SocketHandler());
  const [inputValue, setInputValue] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<{ id: string; connectionTime: string }[] | null>(null);

  useEffect(() => {
    const path = window.location.pathname.split("/")[2];

    socketRef.current.connect(path);

    socketRef.current.socketInstance?.on("message", (message: { message: string; from: string }) => {
      setInputValue(message.message);
    });

    socketRef.current.socketInstance?.on("new-user", (userId: string) => {
      setConnectedUsers((prev) => prev && [...prev, { id: userId, connectionTime: new Date().toLocaleDateString() }]);
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
    router.replace(window.location.protocol + "//" + window.location.host);
  }

  function sendMessageToSync() {}

  useEffect(() => {
    console.log(connectedUsers);
  }, [connectedUsers]);

  return (
    <section className="flex flex-col items-center gap-4">
      <TextArea onChange={handleChange} value={inputValue} />
      <div className="flex flex-col" style={{ border: "1px solid red" }}>
        {connectedUsers?.map((user) => (
          <>
            <p>{user.id}</p>
            <p>{user.connectionTime}</p>
          </>
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
