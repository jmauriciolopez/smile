import { io, Socket } from "socket.io-client";

/**
 * SERVICIO DE COLABORACIÓN REAL — Fase E
 * Cliente de WebSockets para sincronización de diseño en tiempo real.
 */
class ServicioColaboracionReal {
  private socket: Socket | null = null;
  private readonly baseUrl =
    import.meta.env.VITE_WS_URL || "http://localhost:3000/colaboracion";

  conectar(
    casoId: string,
    usuarioNombre: string,
    onUpdate: (blueprint: any) => void,
  ) {
    if (this.socket) return;

    this.socket = io(this.baseUrl);

    this.socket.on("connect", () => {
      console.log("Conectado al servidor de colaboración");
      this.socket?.emit("unirse_a_diseno", {
        caso_id: casoId,
        usuario_nombre: usuarioNombre,
      });
    });

    this.socket.on("diseno_actualizado", (blueprint: any) => {
      onUpdate(blueprint);
    });

    this.socket.on("participante_unido", (data: any) => {
      console.log(`Participante unido: ${data.nombre}`);
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado del servidor de colaboración");
    });
  }

  enviarActualizacion(casoId: string, blueprint: any) {
    this.socket?.emit("actualizar_diseno", { caso_id: casoId, blueprint });
  }

  desconectar() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const servicioColaboracionReal = new ServicioColaboracionReal();
