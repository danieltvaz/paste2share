"use client";

import Button from "../components/client/button";
import { socket } from "../services/socket";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function startNewConnection() {
    socket.connect();
    socket.on("connectionId", (message: any) => {
      router.push(`/paste/${message}`);
    });
  }

  return (
    <section>
      <Button onClick={startNewConnection} variant="blue">
        New paste
      </Button>
    </section>
  );
}
