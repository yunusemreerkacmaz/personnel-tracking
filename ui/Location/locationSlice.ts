import { createSlice } from "@reduxjs/toolkit";
import { initialLocationSliceDto } from "./Dtos/locationDto";
import { locationStore } from "./Requests/locationStore";

export const locationSlice = createSlice({
    name: 'deviceInfo',
    initialState: initialLocationSliceDto,
    reducers: {
        locationReset(){
            return {...initialLocationSliceDto}
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(locationStore.fulfilled, (state, action) => {
                const { coords, mocked, timestamp, address, areaControl } = action.payload;
                state.address = address;
                state.areaControl = areaControl;
                state.coords = coords
                state.mocked = mocked,
                state.timestamp = timestamp
            })
            .addCase(locationStore.rejected, () => {
                return { ...initialLocationSliceDto };
            });
    }
});
export default locationSlice.reducer;
