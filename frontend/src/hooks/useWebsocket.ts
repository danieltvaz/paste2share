import { useCallback, useEffect, useRef, useState } from "react";

import SocketHandler from "@/services/socket/socket";

export default function useWebsocket() {
  const socketRef = useRef(new SocketHandler());
  const [inputValue, setInputValue] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const clientSocketid = socketRef.current.socketInstance?.id;
  const namespaceAdmin = connectedUsers[0];
  const [namespaceId, setNamespaceId] = useState("");
  const isHost = clientSocketid === namespaceAdmin;

  const receiveMessage = useRef((message: { message: string; from: string }) => {
    if (clientSocketid !== message.from) {
      setInputValue(message.message);
    }
  });

  const sendMessage = useCallback(() => {
    socketRef.current.socketInstance?.emit("message", { message: inputValue, namespaceId: namespaceId });
  }, [inputValue, namespaceId]);

  function disconnect() {
    socketRef.current.disconnect();
  }

  useEffect(() => {
    const namespace = window?.location.pathname.split("/")[2];
    setNamespaceId(namespace);

    socketRef.current.connect(namespace);

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

  return {
    disconnect,
    setInputValue,
    sendMessage,
    inputValue,
    connectedUsers,
    namespaceAdmin,
    clientSocketid,
  };
}
