import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
  private randomId: string;

  constructor() {
    this.randomId = Math.random().toString(36).substring(7);
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('connectionId', this.randomId);

    client.on(this.randomId, (body: any) => {
      this.onNewMessage(body, client);
    });
  }

  private onNewMessage(body: any, client: Socket) {
    console.log(`Received message on dynamic event: ${body}`);
    this.server.emit(this.randomId, {
      from: client.id,
      message: body,
    });
  }
}
