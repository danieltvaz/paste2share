"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import Button from "@/components/client/button";
import TextArea from "@/components/client/text-area";
import { useRouter as navigationRouter } from "next/navigation";
import { socket } from "@/services/socket/socket";

export default function Home() {
  const router = navigationRouter();
  const [connectionId, setConnectionId] = useState<string>("");
  const socketRef = useRef(socket);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    socketRef.current.connect();

    socketRef.current.on("connectionId", (id) => {
      setConnectionId(id);

      socketRef.current.on(id, (message: { from: string; message: string }) => {
        setInputValue(message.message);
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [router]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (connectionId) {
      socketRef.current.emit(connectionId, event.target.value);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(location.protocol + "//" + window.location.host + window.location.pathname);
  }

  function disconnect() {
    socketRef.current.disconnect();
    if (socketRef.current.disconnected) {
      router.replace(location.protocol + "//" + window.location.host);
    }
  }

  return (
    <section className="flex flex-col items-center gap-4">
      <TextArea onChange={handleChange} value={inputValue} />
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
