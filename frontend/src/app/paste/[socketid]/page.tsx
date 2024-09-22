"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import AdsenseBanner from "@/components/client/adsense-banner";
import Button from "@/components/client/button";
import React from "react";
import SocketHandler from "@/services/socket/socket";
import TextArea from "@/components/client/text-area";
import { debounce } from "@/helpers/debounce";
import { useRouter as navigationRouter } from "next/navigation";

export default function Home() {
  const router = navigationRouter();
  const socketRef = useRef(new SocketHandler());
  const [inputValue, setInputValue] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const clientSocketid = socketRef.current.socketInstance?.id;
  const namespaceAdmin = connectedUsers[0];
  const [namespaceId, setNamespaceId] = useState("");

  const sendMessage = debounce(() => {
    socketRef.current.socketInstance?.emit("message", { message: inputValue, namespaceId: namespaceId });
  }, 1000);

  const receiveMessage = useRef(
    debounce((message: { message: string; from: string }) => {
      if (clientSocketid !== message.from) {
        setInputValue(message.message);
      }
    }, 1000)
  );

  useEffect(() => {
    const url = window?.location.pathname.split("/")[2];
    setNamespaceId(url);

    socketRef.current.connect(url);

    socketRef.current.socketInstance?.on("message", (message: { message: string; from: string }) => {
      receiveMessage.current(message);
    });

    socketRef.current.socketInstance?.on("new-user", (userId: string[]) => {
      setConnectedUsers(() => {
        const uniqueUsersIds = new Set([...userId]);
        return [...uniqueUsersIds];
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    sendMessage();
  }, [inputValue]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.protocol + "//" + window.location.host + window.location.pathname);
  }

  function disconnect() {
    socketRef.current.disconnect();
    router.replace(window.location.protocol + "//" + window.location.host);
  }

  return (
    <>
      <section className="flex flex-col items-center gap-4 ">
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
            Quit
          </Button>
        </div>
      </section>
      <AdsenseBanner
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        data-ad-slot="4203866364"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
