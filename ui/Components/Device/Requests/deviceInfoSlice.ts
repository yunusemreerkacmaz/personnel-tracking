import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialDeviceInformationDto } from "../Dtos/DeviceInformationDto";
import { deviceInfoStore } from "./deviceInfoStore";
import { DeviceType } from "expo-device";
import { ServiceResult } from "../../../ServiceResults/serviceResult";
import { DeviceDto, initialDeviceDto } from "../Dtos/DeviceDto";

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

// const initialDeviceState: DeviceDto[] = []; // Boş bir dizi olarak başlat
// export const deviceSlice = createSlice({
//     name: 'device',
//     initialState: initialDeviceState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(deviceStore.fulfilled, (state, action: PayloadAction<ServiceResult<DeviceDto>>) => {
//                 state = action.payload.results
//             })
//             .addCase(deviceStore.rejected, (state, action: any) => {
//                 state = initialDeviceState
//             });
//     }
// });

export default  deviceInfoSlice.reducer




