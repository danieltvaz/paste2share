"use client";

import { ChangeEvent, useEffect } from "react";

import Button from "@/components/client/button";
import React from "react";
import TextArea from "@/components/client/text-area";
import { useRouter as navigationRouter } from "next/navigation";
import useWebsocket from "@/hooks/useWebsocket";

export default function Home() {
  const router = navigationRouter();
  const {
    setInputValue,
    disconnect: disconnectWebsocket,
    sendMessage,
    connectedUsers,
    inputValue,
    namespaceAdmin,
    clientSocketid,
  } = useWebsocket();

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.protocol + "//" + window.location.host + window.location.pathname);
  }

  function disconnect() {
    disconnectWebsocket();
    router.replace(window.location.protocol + "//" + window.location.host);
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    };
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [inputValue]);

  return (
    <>
      <section className="flex flex-col items-center gap-4 ">
        <TextArea onChange={handleChange} value={inputValue} />
        <Button onClick={sendMessage} variant="blue" width="12rem">
          Send
        </Button>
        <span className="text-sm text-gray-500">
          Press <span className="font-bold">Enter</span> to send message,{" "}
          <span className="font-bold">Shift + Enter</span> to add a new line
        </span>
        <div className="flex flex-col text-center">
          <p className="font-bold">Connected users</p>
          {connectedUsers?.map((userId, index) => (
            <React.Fragment key={index}>
              <p>
                {`${userId} - 
            ${userId === namespaceAdmin ? "(Host)" : "(Client)"} 
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
    </>
  );
}
