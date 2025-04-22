import { configureStore } from "@reduxjs/toolkit";
import loginReducer from '../Components/Login/Requests/LoginSlice'
import barcodeReducer from '../Components/Barcode/Requests/barcodeSlice'
import { deviceInfoSlice } from "../Components/Device/Requests/deviceInfoSlice";
import {locationSlice} from "../Location/locationSlice";
import websocketReducer  from '../Notifications/notificationSlice'
import forgottenPasswordSlice  from '../Components/Login/forgottenPasswordSlice'


export const Store = configureStore({
    reducer: {
        login: loginReducer,
        barcode:barcodeReducer,
        deviceInfo:deviceInfoSlice.reducer,
        location:locationSlice.reducer,
        websocket: websocketReducer,
        forgottenPasswordSlice:forgottenPasswordSlice.reducer,
        // device:deviceSlice.reducer
        
    }
})
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;