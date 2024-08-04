import { Socket, io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object

export default class SocketHandler {
  private BASE_URL = "http://192.168.68.108:3001";
  public socketInstance: Socket | undefined;

  newConnection(callback: (...args: any) => any) {
    this.socketInstance = io(this.BASE_URL, {
      transports: ["websocket"],
    });

    this.socketInstance?.on("connectionId", (newNamespace: string) => {
      this.socketInstance = io(this.BASE_URL + "/" + newNamespace, {
        transports: ["websocket"],
      });
      callback(newNamespace);
      this.socketInstance.disconnect();
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
