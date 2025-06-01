import { Socket, io } from "socket.io-client";

export default class SocketHandler {
  private BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
  public socketInstance: Socket | undefined;

  constructor() {
    this.socketInstance = undefined;
    console.log(this.BASE_URL);
  }

  newConnection(callback: (...args: any) => any) {
    this.socketInstance = io(this.BASE_URL, {
      transports: ["websocket"],
    });

    this.socketInstance?.on("connectionId", (newNamespace: string) => {
      this.socketInstance?.disconnect();

      callback(newNamespace);
    });
  }

  connect(namespace: string) {
    this.socketInstance = io(this.BASE_URL + "/" + namespace, { transports: ["websocket"] });

    this.socketInstance.on("connection", () => {
      console.log(`Connected to namespace: ${namespace}`);
    });
  }

  disconnect() {
    this.socketInstance?.disconnect();
  }
}
