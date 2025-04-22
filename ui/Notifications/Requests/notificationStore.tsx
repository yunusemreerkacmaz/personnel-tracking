
import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateToCamelCase } from "../../Helpers/Helper";
import { NotificationDto } from "../Dtos/NotificationDto";

let socket: WebSocket | null = null;

export const connectWebSocket = createAsyncThunk('websocket/connect',
  async (url: string, { rejectWithValue }) => {
    try {
      return new Promise<string>((resolve, reject) => {
        socket = new WebSocket(url);
        console.log("WebSocket Açıldı");
        socket.onopen = () => resolve('Connected');
        socket.onerror = (error) => reject(error);
      });
    } catch (error) {
      return rejectWithValue('WebSocket connection failed');
    }
  }
);

export const disconnectWebSocket = createAsyncThunk('websocket/disconnect', async () => {
  if (socket) {
    socket.close();
    socket = null;
    console.log("WebSocket Kapatıldı");
  }
  return 'Disconnected';
});

export const sendMessage = createAsyncThunk('websocket/sendMessage',
  async (message: any, { rejectWithValue }) => {
    console.log("message-----------",message);
    
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Mesaj Gönderiliyor");
      socket.send(JSON.stringify(message));
      return 'Message sent';
    } else {
      return rejectWithValue('WebSocket is not connected');
    }
  }
);

export const listenMessages = createAsyncThunk('websocket/listenMessages',
  async (_, { dispatch }) => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Mesaj Dinleniyor");
        dispatch({ type: 'websocket/messageReceived', payload: privateToCamelCase(data) });
      };
    }
  }
);


// export const messageReceived = createAsyncThunk(
//   "websocket/messageReceived",
//   async (state: NotificationDto[], thunkAPI) => {
//     debugger
//     console.log("------state",state);
    
//       if (state.length>0) {
//         return state
//       }
//       else{
//         console.log("---messageReceived Store Hata oluştu---");
//         return []
        
//       }
//   }
// );