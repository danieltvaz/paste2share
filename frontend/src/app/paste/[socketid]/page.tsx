"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import Button from "@/components/client/button";
import TextArea from "@/components/client/text-area";
import { socket } from "@/services/socket";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [connectionId, setConnectionId] = useState<string>("");
  const socketRef = useRef(socket);

  useEffect(() => {
    socketRef.current.connect();

    socketRef.current.on("connectionId", (id) => {
      setConnectionId(id);

      socketRef.current.on(id, (message: any) => {
        console.log("mensagem recebida:", message);
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

  return (
    <section className="flex flex-col items-center gap-4">
      <TextArea onChange={handleChange} />
      <div className="flex gap-2">
        <Button variant="blue">Copy link to clipboard</Button>
        <Button variant="red">Close this share</Button>
      </div>
    </section>
  );
}
