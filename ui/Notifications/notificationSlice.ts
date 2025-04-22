import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { NotificationDto } from "./Dtos/NotificationDto"
import { connectWebSocket, disconnectWebSocket, sendMessage } from "./Requests/notificationStore";

interface WebSocketState {
  connected: boolean;
  messages: NotificationDto[];
  status: 'idle' | 'loading' | 'failed';
}
const initialState: WebSocketState = {
  connected: false,
  messages: [],
  status: 'idle',
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState: initialState,
  reducers: {
    messageReceived: (state, action: PayloadAction<NotificationDto[]>) => {
      state.messages = action.payload;
    },
    notificationStateUpdate: (state, action: PayloadAction<NotificationDto>) => {
      const notificationDto = state.messages.find(x => x.id == action.payload.id)
      if (notificationDto && notificationDto.id > 0) {
        notificationDto.readStatus = !action.payload.readStatus
        notificationDto.updateStatus = !action.payload.updateStatus
      }
    },
    notificationReset: (state) => {
      state.messages = initialState.messages
      state.connected = initialState.connected
      state.status = initialState.status
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWebSocket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(connectWebSocket.fulfilled, (state) => {
        state.connected = true;
        state.status = 'idle';
      })
      .addCase(connectWebSocket.rejected, (state) => {
        state.connected = false;
        state.status = 'failed';
      })
      .addCase(disconnectWebSocket.fulfilled, (state) => {
        state.connected = false;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.connected=false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.status = 'failed';
      });
      // .addCase(messageReceived.fulfilled, (state, action: PayloadAction<NotificationDto[]>) => {
      //   state.messages = action.payload;
      // })
      // .addCase(messageReceived.rejected, (state) => {
      //   state.status = 'failed';
      // });
  },
});
export const {  messageReceived,notificationStateUpdate, notificationReset } = websocketSlice.actions;
export default websocketSlice.reducer;