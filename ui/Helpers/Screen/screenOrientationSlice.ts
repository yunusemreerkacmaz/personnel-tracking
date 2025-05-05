import { createSlice } from "@reduxjs/toolkit";
import { initialScreenOrientationDto } from "./screenOrientationDto";
import { screenOrientationStore } from "./screenStore";

const screenOrientationSlice = createSlice({
    name: "screenOrientation",
    initialState: initialScreenOrientationDto,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(screenOrientationStore.pending, (state) => {
                state.status = "loading"
            })
            .addCase(screenOrientationStore.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.isPortrait = action.payload
            })
            .addCase(screenOrientationStore.rejected, (state) => {
                state.status = "failed"
            })
    }
})
export default screenOrientationSlice.reducer
