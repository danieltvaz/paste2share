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
    console.log(`Received message on dynamic event: ${body}`);
    this.namespaces[this.randomId].emit('message', {
      from: client.id,
      message: body,
    });
  }

  handleConnection(client: Socket) {
    if (!this.namespaces[this.randomId]) {
      const newNamespace = this.server.of(`/${this.randomId}`);

      this.namespaces[this.randomId] = newNamespace;

      newNamespace.on('connection', (namespaceClient: Socket) => {
        console.log('Client connected to namespace:', newNamespace.name);

        newNamespace.emit('new-user', namespaceClient.id);

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
}
