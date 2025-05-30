import { configureStore } from "@reduxjs/toolkit";
import loginReducer from '../Components/Login/Requests/LoginSlice'
import deviceReducer from "../Components/Device/Requests/deviceInfoSlice";
import { locationSlice } from "../Location/locationSlice";
import websocketReducer from '../Notifications/notificationSlice'
import forgottenPasswordSlice from '../Components/Login/forgottenPasswordSlice'
import screenOrientationSlice from "../Helpers/Screen/screenOrientationSlice";
import entryExitSlice from "../Components/EntryExit/Requests/entryExitSlice";

export const Store = configureStore({
    reducer: {
        login: loginReducer,
        deviceInfo: deviceReducer,
        location: locationSlice.reducer,
        websocket: websocketReducer,
        forgottenPasswordSlice: forgottenPasswordSlice.reducer,
        screenOrientationSlice: screenOrientationSlice,
        entryExit:entryExitSlice
    }
})
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;