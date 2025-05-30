import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { EntryExitDto, initialEntryExitDto } from "../Dtos/EntryExitDto"
import { entryExitCheckStore, entryExitReadStore } from "./entryExitStore"

export const iconVisibleStatus = createAction<EntryExitDto>("icon/iconVisibleStatus")
export const logoutEntryExit = createAction<EntryExitDto>("logout/EntryExit")

export const entryExitSlice = createSlice({
    name: "entryExit",
    initialState: initialEntryExitDto,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(entryExitReadStore.pending, (state) => {
                state.status = "loading"
            })
            .addCase(entryExitCheckStore.pending, (state) => {
                state.status = "loading"
            })
            .addCase(entryExitReadStore.fulfilled, (state, action) => {
                if (action.payload.result) {
                    state.id = action.payload.result.id
                    state.userId = action.payload.result.userId
                    state.roleId = action.payload.result.roleId
                    state.locationDto.latitude = action.payload.result.locationDto?.latitude
                    state.locationDto.longitude = action.payload.result.locationDto?.longitude
                    state.biometricEnum = action.payload.result.biometricEnum
                    state.barcodeReadEnum = action.payload.result.barcodeReadEnum
                    state.adminApproveEnum = action.payload.result.adminApproveEnum
                }
                state.status = "succeeded"
            })
            .addCase(entryExitCheckStore.fulfilled, (state, action) => {
                if (action.payload.result) {
                    state.id = action.payload.result.id
                    state.userId = action.payload.result.userId
                    state.roleId = action.payload.result.roleId
                    state.locationDto.latitude = action.payload.result.locationDto?.latitude
                    state.locationDto.longitude = action.payload.result.locationDto?.longitude
                    state.biometricEnum = action.payload.result.biometricEnum
                    state.barcodeReadEnum = action.payload.result.barcodeReadEnum
                    state.adminApproveEnum = action.payload.result.adminApproveEnum
                }
                state.status = "succeeded"
            })
            .addCase(entryExitReadStore.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(entryExitCheckStore.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(iconVisibleStatus, (state, action: PayloadAction<EntryExitDto>) => {
                state.qrCodeIconVisible = action.payload.qrCodeIconVisible
                state.biometricIconVisible = action.payload.biometricIconVisible
            })
            .addCase(logoutEntryExit, (state) => {
                state = initialEntryExitDto
            })
    }
})
export default entryExitSlice.reducer