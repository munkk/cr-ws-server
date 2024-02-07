import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export enum WebSocketMessageType {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

const SocketClientIdToUserId = {};

@WebSocketGateway(3060, {
  cors: {
    origin: '*',
    allowedHeaders: ['jwt-token', 'cookie', 'Access-Control-Allow-Origin'],
    credentials: true,
    cookie: true,
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(WebSocketMessageType.CHAT_MESSAGE)
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message,
  ): Promise<void> {
    // сохраняем в бд
    // сохраненное сообщение отправляем обратно клиенту
    this.server.emit(WebSocketMessageType.CHAT_MESSAGE, message);
  }

  afterInit(server: Server) {
    //console.log(process.env);
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      //console.log(client);
      const cookies = client.handshake.headers.cookie;
    } catch (err) {
      // console.log(err.message)
    }
  }

  handleDisconnect(client: Socket) {
    delete SocketClientIdToUserId[client.id];
  }
}
