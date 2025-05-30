import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialDeviceInformationDto } from "../Dtos/DeviceInformationDto";
import { deviceInfoStore } from "./deviceInfoStore";
import { DeviceType } from "expo-device";

export const deviceInfoSlice = createSlice({
    name: 'deviceInfo',
    initialState: initialDeviceInformationDto,
    reducers: {
        deviceReset(state){
            state=initialDeviceInformationDto
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(deviceInfoStore.fulfilled, (state, action) => {
                const { brand, deviceType, isDevice, manufacturer, modelName, osName, osVersion } = action.payload;
                state.brand = brand ?? null;
                state.deviceType = deviceType ?? DeviceType.UNKNOWN;
                state.isDevice = isDevice ?? false;
                state.manufacturer = manufacturer ?? null;
                state.modelName = modelName ?? null;
                state.osName = osName ?? null;
                state.osVersion = osVersion ?? null;
            })
            .addCase(deviceInfoStore.rejected, () => {
                return { ...initialDeviceInformationDto };
            });
    }
});
export default  deviceInfoSlice.reducer




