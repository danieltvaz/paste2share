"use client";

import Button from "../components/client/button";
import HomepageInfo from "@/components/server/homepage-info";
import { socket } from "../services/socket/socket";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function startNewConnection() {
    socket.connect();
    socket.on("connectionId", (id: any) => {
      router.push(`/paste/${id}`);
    });
  }

  return (
    <section className="flex grow flex-col justify-center gap-4 items-center">
      <HomepageInfo />
      <Button onClick={startNewConnection} variant="blue" style={{ width: "14rem" }}>
        New paste
      </Button>
    </section>
  );
}
