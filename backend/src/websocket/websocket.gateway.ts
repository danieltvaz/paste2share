import { Namespace, Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { generateRandomId } from 'src/utils';

interface INewMessageBody {
  message: string;
  namespaceId: string;
}

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
  constructor() {}

  @WebSocketServer()
  server: Server;

  private onNewMessage(payload: INewMessageBody, client: Socket) {
    const namespace = this.server.of(`/${payload.namespaceId}`);

    console.log(payload);

    namespace.emit('message', {
      from: client.id,
      message: payload.message,
    });
  }

  handleConnection(client: Socket) {
    const newRandomId = generateRandomId();

    const newNamespace = this.server.of(`/${newRandomId}`);

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

    // Envie o ID de conexão para o cliente
    client.emit('connectionId', newRandomId);
  }

  private async updateClientsList(namespace: Namespace) {
    const sockets = await namespace.fetchSockets();
    const clients = sockets.map((socket) => socket.id);
    namespace.emit('new-user', clients);
  }
}
