import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { Order } from '@/types/Order';

// Events serveur -> client
interface ServerToClientEvents {
  'order-updated': (data: { orderId: string; status: string }) => void;
  'notification': (data: { title: string; message: string }) => void;
  'new-order': (data: Order) => void;
}

// Events client -> serveur
interface ClientToServerEvents {
  'authenticate': (userId: string) => void;
}

export function useSocket() {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) return;

    const API_URL =
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

    socketRef.current = io(API_URL, {
      auth: { token },
    }) as Socket<ServerToClientEvents, ClientToServerEvents>;

    socketRef.current.on('connect', () => {
      console.log('Connecté au serveur Socket.io');
      socketRef.current?.emit('authenticate', user.id);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Déconnecté du serveur Socket.io');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, user]);

  // On délègue directement à socket.io sans réintroduire des génériques conflictuels
  const on = useCallback(
    (...args: Parameters<Socket<ServerToClientEvents, ClientToServerEvents>['on']>) => {
      socketRef.current?.on(...args);
    },
    [],
  );

  const off = useCallback(
    (...args: Parameters<Socket<ServerToClientEvents, ClientToServerEvents>['off']>) => {
      socketRef.current?.off(...args);
    },
    [],
  );

  const emit = useCallback(
    (...args: Parameters<Socket<ServerToClientEvents, ClientToServerEvents>['emit']>) => {
      socketRef.current?.emit(...args);
    },
    [],
  );

  const getSocket = () => socketRef.current;
  const isConnected = () => socketRef.current?.connected ?? false;

  return {
    socket: getSocket(),
    on,
    off,
    emit,
    isConnected: isConnected(),
  };
}
