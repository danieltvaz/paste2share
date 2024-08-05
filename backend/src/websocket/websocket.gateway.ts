import { Namespace, Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
  private randomId: string;
  private namespaces: Record<string, Namespace> = {};

  constructor() {
    this.randomId = Math.random().toString(36).substring(7);
  }

  @WebSocketServer()
  server: Server;

  private onNewMessage(body: any, client: Socket) {
    this.namespaces[this.randomId].emit('message', {
      from: client.id,
      message: body,
    });
  }

  handleConnection(client: Socket) {
    if (!this.namespaces[this.randomId]) {
      const newNamespace = this.server.of(`/${this.randomId}`);

      this.namespaces[this.randomId] = newNamespace;

      newNamespace.on('connection', async (namespaceClient: Socket) => {
        console.log('Client connected to namespace:', newNamespace.name);

        await this.updateClientsList(newNamespace);

        namespaceClient.on('message', (body: any) => {
          this.onNewMessage(body, namespaceClient);
        });

        namespaceClient.on('disconnect', () => {
          console.log('Client disconnected from namespace:', newNamespace.name);
        });
      });
    }

    // Envie o ID de conexão para o cliente
    client.emit('connectionId', this.randomId);
  }

  private async updateClientsList(namespace: Namespace) {
    const sockets = await namespace.fetchSockets();
    const clients = sockets.map((socket) => socket.id);
    namespace.emit('new-user', clients);
  }
}
