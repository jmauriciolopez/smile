import { Blueprint } from "../../core/types";
import { useEditorStore } from "../../store/editor-sonrisa.store";

export interface Colaborador {
  id: string;
  nombre: string;
  color: string;
  cursor: { x: number; y: number } | null;
  dienteBloqueadoId: string | null;
}

/**
 * 🤝 COLLABORATION ENGINE (Multi-User)
 * Motor de sincronización en tiempo real vía WebSockets para permitir el diseño
 * concurrente entre la clínica (Odontólogo) y el laboratorio (Ceramista).
 */
export class CollaborationEngine {
  private socket: WebSocket | null = null;
  private casoId: string;
  private reconnectTimer: any = null;

  constructor(casoId: string) {
    this.casoId = casoId;
  }

  /**
   * Conecta al canal seguro del WebSocket para la sala quirúrgica (caso clínico).
   */
  conectar(token: string) {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
    this.socket = new WebSocket(
      `${wsUrl}/colaboracion/${this.casoId}?token=${token}`,
    );

    this.socket.onopen = () => {
      console.log(`[CollabEngine] Conectado a Sala Clínica: ${this.casoId}`);
    };

    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.procesarMensaje(msg);
    };

    this.socket.onclose = () => {
      console.warn("[CollabEngine] Desconectado. Reconectando...");
      this.reconnectTimer = setTimeout(() => this.conectar(token), 3000);
    };
  }

  desconectar() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
  }

  // --- RECEPTORES (Desde el Server) ---

  private procesarMensaje(msg: any) {
    const store = useEditorStore.getState();

    switch (msg.tipo) {
      case "PRESENCIA_ACTUALIZADA":
        // Actualizar cursores y colaboradores activos (UI Layer)
        store.setColaboradores(msg.colaboradores);
        break;

      case "DIENTE_BLOQUEADO":
        // Lock pesimista: Otro usuario tomó control de una pieza
        store.bloquearDiente(msg.dienteId, msg.usuarioId);
        break;

      case "DIENTE_DESBLOQUEADO":
        store.desbloquearDiente(msg.dienteId);
        break;

      case "BLUEPRINT_DELTA":
        // Sincronización CRDT o Delta Merge de cambios hechos por otro
        if (store.blueprint) {
          const nuevoBlueprint = this.mergeBlueprints(
            store.blueprint,
            msg.delta,
          );
          store.actualizarDesdeColaborador(nuevoBlueprint);
        }
        break;
    }
  }

  private mergeBlueprints(local: Blueprint, remoto: Blueprint): Blueprint {
    // Aquí iría la lógica de resolución de conflictos (ej. usando Yjs o un simple override de timestamp)
    return remoto;
  }

  // --- EMISORES (Hacia el Server) ---

  /**
   * Envía la posición del mouse del odontólogo para el "tele-pointer".
   */
  emitirCursor(x: number, y: number) {
    this.enviar({ tipo: "CURSOR_MOVE", x, y });
  }

  /**
   * Intenta obtener un lock exclusivo sobre una pieza (ej. al hacer click/drag).
   */
  solicitarLockDiente(dienteId: string) {
    this.enviar({ tipo: "LOCK_REQUEST", dienteId });
  }

  liberarLockDiente(dienteId: string) {
    this.enviar({ tipo: "LOCK_RELEASE", dienteId });
  }

  /**
   * Transmite un cambio estructural a la sala (ej. escalado o cambio de material).
   */
  emitirCambioBlueprint(blueprint: Blueprint) {
    this.enviar({ tipo: "BLUEPRINT_UPDATE", delta: blueprint });
  }

  private enviar(payload: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }
}
