import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'colaboracion',
})
export class ColaboracionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ColaboracionGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  /**
   * Unirse a una sala de diseño (caso_clinico_id)
   */
  @SubscribeMessage('unirse_a_diseno')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { caso_id: string; usuario_nombre: string }) {
    client.join(data.caso_id);
    this.logger.log(`Usuario ${data.usuario_nombre} se unió al caso: ${data.caso_id}`);

    // Notificar a otros en la sala
    client.to(data.caso_id).emit('participante_unido', {
      id: client.id,
      nombre: data.usuario_nombre,
    });
  }

  /**
   * Sincronizar cambios en el diseño (Blueprint)
   */
  @SubscribeMessage('actualizar_diseno')
  handleUpdateDesign(@ConnectedSocket() client: Socket, @MessageBody() data: { caso_id: string; blueprint: any }) {
    // Emitir el nuevo estado a todos los demás participantes en la sala
    client.to(data.caso_id).emit('diseno_actualizado', data.blueprint);
  }

  /**
   * Sincronizar posición del cursor para ver qué está editando el otro
   */
  @SubscribeMessage('mover_cursor')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { caso_id: string; x: number; y: number; usuario_nombre: string },
  ) {
    client.to(data.caso_id).emit('cursor_movido', {
      id: client.id,
      nombre: data.usuario_nombre,
      x: data.x,
      y: data.y,
    });
  }
}
