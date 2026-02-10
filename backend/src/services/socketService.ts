import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface UserSocket {
  userId: string;
  socketId: string;
}

class SocketService {
  private io: SocketIOServer | null = null;

  // Un utilisateur peut avoir plusieurs sockets (mobile + web)
  private userSockets: Map<string, Set<string>> = new Map();

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connecté: ${socket.id}`);

      // Authentification du socket
      socket.on('authenticate', (userId: string) => {
        if (!userId) return;

        // Ajouter le socket à la liste de l'utilisateur
        if (!this.userSockets.has(userId)) {
          this.userSockets.set(userId, new Set());
        }

        this.userSockets.get(userId)!.add(socket.id);

        // Joindre la room dédiée
        socket.join(`user-${userId}`);

        console.log(`Utilisateur ${userId} authentifié avec socket ${socket.id}`);
      });

      // Déconnexion
      socket.on('disconnect', () => {
        console.log(`Client déconnecté: ${socket.id}`);

        // Retirer le socket de l'utilisateur
        for (const [userId, sockets] of this.userSockets.entries()) {
          if (sockets.has(socket.id)) {
            sockets.delete(socket.id);

            // Si plus aucun socket → supprimer l'utilisateur
            if (sockets.size === 0) {
              this.userSockets.delete(userId);
            }

            break;
          }
        }
      });
    });
  }

  // Notifier un utilisateur
  notifyUser(userId: string, event: string, data: any) {
    if (!this.io) return;

    this.io.to(`user-${userId}`).emit(event, {
      ...data,
      timestamp: new Date(),
    });
  }

  // Notifier tous les clients
  notifyAll(event: string, data: any) {
    if (!this.io) return;

    this.io.emit(event, {
      ...data,
      timestamp: new Date(),
    });
  }

  // Mise à jour de commande
  notifyOrderUpdate(userId: string, orderId: string, status: string) {
    this.notifyUser(userId, 'order-updated', {
      orderId,
      status,
    });
  }

  // Nouvelle commande (admin)
  notifyNewOrder(orderId: string, orderData: any) {
    this.notifyAll('new-order', {
      orderId,
      ...orderData,
    });
  }

  // Notification générale
  notifyNotification(userId: string, title: string, message: string) {
    this.notifyUser(userId, 'notification', {
      title,
      message,
    });
  }

  getIO() {
    return this.io;
  }
}

export default new SocketService();