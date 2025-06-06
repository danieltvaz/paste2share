"use client";

import Button from "../components/client/button";
import HomepageInfo from "@/components/server/homepage-info";
import SocketHandler from "../services/socket/socket";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function startNewConnection() {
    const newSocket = new SocketHandler();
    newSocket.newConnection((namespace) => {
      router.push(`/paste/${namespace}`);
    });
  }

  return (
    <section className="flex grow flex-col justify-center gap-4 items-center">
      <HomepageInfo />
      <Button onClick={startNewConnection} variant="blue" width="14rem">
        New paste
      </Button>
    </section>
  );
}
