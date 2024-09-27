import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

// Ensure the URL matches your backend server
const SOCKET_URL = 'http://localhost:5000';

const SocketComponent = () => {
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true, // Include credentials if needed
      transports: ['websocket', 'polling'] // Use appropriate transport methods
    });

    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Socket.IO Client Connected</div>;
};

export default SocketComponent;
