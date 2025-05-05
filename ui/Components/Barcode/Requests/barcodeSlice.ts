import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BarcodeDto, initialBarcodeState } from "../Dtos/barcodeDto";
import { ResponseStatus, ServiceResult } from "../../../ServiceResults/serviceResult";
import { BarcodeReadEnum } from "../../../Enums/barcodeStatusEnum";
import { initialLoginDto } from "../../Login/Dtos/LoginDto";
import { initialStoreDto } from "../../Stores/Dtos/storeDto";
import { barcodeCheckStore, barcodeReadStore } from "./barcodeStore";

export const barcodeSlice = createSlice({
    name: 'barcode',
    initialState: initialBarcodeState,
    reducers: {
        readbarcode(state, action: PayloadAction<BarcodeDto>) {
            state = action.payload
        },
        barcodeReset(state) {
            state = initialBarcodeState
            return state
        },
        barcodeVisible(state, action: PayloadAction<BarcodeDto>) {
            state.qrCodeVisibleState = action.payload.qrCodeVisibleState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(barcodeReadStore.fulfilled, (state, action: PayloadAction<ServiceResult<BarcodeDto>>) => {
                try {
                    if (action.payload.result) {                        
                        const { data, id, locationDto, barcodeReadEnum, loginDto, storeDto } = action.payload.result
                        state.barcodeReadEnum = barcodeReadEnum
                        state.id = id
                        state.locationDto.latitude = locationDto.latitude
                        state.locationDto.longitude = locationDto.longitude
                        state.locationDto.areaControl = locationDto.areaControl
                        state.data = data
                        state.loading = true
                        // state.deviceBrand = deviceBrand
                        // state.deviceModelName = deviceModelName
                        // state.deviceToken = deviceToken
                        // state.loginDto = loginDto
                        // state.storeDto = storeDto
                        state.loginDto.isLoggedIn = loginDto.isLoggedIn
                        state.loginDto.rememberMe = loginDto.rememberMe,
                            state.loginDto.roleDto.id = loginDto.roleDto.id
                        state.loginDto.roleDto.isActive = loginDto.roleDto.isActive
                        state.loginDto.roleDto.roleName = loginDto.roleDto.roleName
                        state.loginDto.userDto.id = loginDto.userDto.id
                        state.loginDto.userDto.createTime = loginDto.userDto.createTime
                        state.loginDto.userDto.deleteTime = loginDto.userDto.deleteTime
                        state.loginDto.userDto.email = loginDto.userDto.email
                        state.loginDto.userDto.firstName = loginDto.userDto.firstName
                        state.loginDto.userDto.lastName = loginDto.userDto.lastName
                        state.loginDto.userDto.password = loginDto.userDto.password
                        state.loginDto.userDto.updateTime = loginDto.userDto.updateTime
                        state.loginDto.userDto.userName = loginDto.userDto.userName
                        state.loginDto.userDto.phoneNumber = loginDto.userDto.phoneNumber
                        state.storeDto.id = storeDto.id
                        state.storeDto.isActive = storeDto.isActive
                        state.storeDto.radius = storeDto.radius
                        state.storeDto.storeLocation.latitude = storeDto.storeLocation.latitude
                        state.storeDto.storeLocation.longitude = storeDto.storeLocation.longitude
                        state.storeDto.storeLocation.latitudeDelta = storeDto.storeLocation.latitudeDelta
                        state.storeDto.storeLocation.longitudeDelta = storeDto.storeLocation.longitudeDelta
                        state.storeDto.storeName = storeDto.storeName
                        state.storeDto.storeTime.endDate = storeDto.storeTime.endDate
                        state.storeDto.storeTime.startDate = storeDto.storeTime.startDate
                    }
                } catch (error) {
                    console.log("BarcodeReadStore Slice Hatası", error);
                }
            })
            .addCase(barcodeReadStore.rejected, (state, action: any) => {
                state.barcodeReadEnum = BarcodeReadEnum.Default
                state.id = 0
                state.locationDto.latitude = null
                state.locationDto.longitude = null
                state.locationDto.areaControl = null
                state.data = ""
                state.loading = true
                // state.deviceBrand = null
                // state.deviceModelName = ""
                // state.deviceToken = null
                // state.loginDto = initialLoginDto
                // state.storeDto = initialStoreDto
                state.loginDto.isLoggedIn = initialLoginDto.isLoggedIn
                state.loginDto.rememberMe = initialLoginDto.rememberMe,
                    state.loginDto.roleDto.id = initialLoginDto.roleDto.id
                state.loginDto.roleDto.isActive = initialLoginDto.roleDto.isActive
                state.loginDto.roleDto.roleName = initialLoginDto.roleDto.roleName
                state.loginDto.userDto.id = initialLoginDto.userDto.id
                state.loginDto.userDto.createTime = initialLoginDto.userDto.createTime
                state.loginDto.userDto.deleteTime = initialLoginDto.userDto.deleteTime
                state.loginDto.userDto.email = initialLoginDto.userDto.email
                state.loginDto.userDto.firstName = initialLoginDto.userDto.firstName
                state.loginDto.userDto.lastName = initialLoginDto.userDto.lastName
                state.loginDto.userDto.password = initialLoginDto.userDto.password
                state.loginDto.userDto.updateTime = initialLoginDto.userDto.updateTime
                state.loginDto.userDto.userName = initialLoginDto.userDto.userName
                state.loginDto.userDto.phoneNumber = initialLoginDto.userDto.phoneNumber

                state.storeDto.id = initialStoreDto.id
                state.storeDto.isActive = initialStoreDto.isActive
                state.storeDto.radius = initialStoreDto.radius
                state.storeDto.storeLocation.latitude = initialStoreDto.storeLocation.latitude
                state.storeDto.storeLocation.longitude = initialStoreDto.storeLocation.longitude
                state.storeDto.storeLocation.latitudeDelta = initialStoreDto.storeLocation.latitudeDelta
                state.storeDto.storeLocation.longitudeDelta = initialStoreDto.storeLocation.longitudeDelta
                state.storeDto.storeName = initialStoreDto.storeName
                state.storeDto.storeTime.endDate = initialStoreDto.storeTime.endDate
                state.storeDto.storeTime.startDate = initialStoreDto.storeTime.startDate
            })
            .addCase(barcodeCheckStore.fulfilled, (state, action: PayloadAction<ServiceResult<BarcodeDto>>) => {
                try {
                    if (action.payload.responseStatus === ResponseStatus.IsSuccess && action.payload.result) {
                        const { data, id, locationDto, barcodeReadEnum, loginDto, storeDto } = action.payload.result
                        state.barcodeReadEnum = barcodeReadEnum
                        state.id = id
                        state.locationDto.latitude = locationDto.latitude
                        state.locationDto.longitude = locationDto.longitude
                        state.locationDto.areaControl = locationDto.areaControl
                        state.data = data
                        // state.deviceBrand = deviceBrand
                        // state.deviceModelName = deviceModelName
                        // state.deviceToken = deviceToken
                        state.loading = true
                        // state.loginDto = loginDto
                        // state.storeDto = storeDto
                        state.loginDto.isLoggedIn = loginDto.isLoggedIn
                        state.loginDto.rememberMe = loginDto.rememberMe,
                            state.loginDto.roleDto.id = loginDto.roleDto.id
                        state.loginDto.roleDto.isActive = loginDto.roleDto.isActive
                        state.loginDto.roleDto.roleName = loginDto.roleDto.roleName
                        state.loginDto.userDto.id = loginDto.userDto.id
                        state.loginDto.userDto.createTime = loginDto.userDto.createTime
                        state.loginDto.userDto.deleteTime = loginDto.userDto.deleteTime
                        state.loginDto.userDto.email = loginDto.userDto.email
                        state.loginDto.userDto.firstName = loginDto.userDto.firstName
                        state.loginDto.userDto.lastName = loginDto.userDto.lastName
                        state.loginDto.userDto.password = loginDto.userDto.password
                        state.loginDto.userDto.updateTime = loginDto.userDto.updateTime
                        state.loginDto.userDto.userName = loginDto.userDto.userName
                        state.loginDto.userDto.phoneNumber = loginDto.userDto.phoneNumber

                        state.storeDto.id = storeDto.id
                        state.storeDto.isActive = storeDto.isActive
                        state.storeDto.radius = storeDto.radius
                        state.storeDto.storeLocation.latitude = storeDto.storeLocation.latitude
                        state.storeDto.storeLocation.longitude = storeDto.storeLocation.longitude
                        state.storeDto.storeLocation.latitudeDelta = storeDto.storeLocation.latitudeDelta
                        state.storeDto.storeLocation.longitudeDelta = storeDto.storeLocation.longitudeDelta
                        state.storeDto.storeName = storeDto.storeName
                        state.storeDto.storeTime.endDate = storeDto.storeTime.endDate
                        state.storeDto.storeTime.startDate = storeDto.storeTime.startDate
                    }
                    else if (action.payload.responseStatus === ResponseStatus.IsWarning && action.payload.result) {
                        const { data, id, locationDto, barcodeReadEnum, loginDto, storeDto } = action.payload.result
                        state.barcodeReadEnum = barcodeReadEnum
                        state.id = id
                        state.locationDto.latitude = locationDto.latitude
                        state.locationDto.longitude = locationDto.longitude
                        state.locationDto.areaControl = locationDto.areaControl
                        state.data = data
                        // state.deviceBrand = deviceBrand
                        // state.deviceModelName = deviceModelName
                        // state.deviceToken = deviceToken
                        state.loading = true
                        // state.loginDto = loginDto
                        // state.storeDto = storeDto
                        state.loginDto.isLoggedIn = loginDto.isLoggedIn
                        state.loginDto.rememberMe = loginDto.rememberMe,
                            state.loginDto.roleDto.id = loginDto.roleDto.id
                        state.loginDto.roleDto.isActive = loginDto.roleDto.isActive
                        state.loginDto.roleDto.roleName = loginDto.roleDto.roleName
                        state.loginDto.userDto.id = loginDto.userDto.id
                        state.loginDto.userDto.createTime = loginDto.userDto.createTime
                        state.loginDto.userDto.deleteTime = loginDto.userDto.deleteTime
                        state.loginDto.userDto.email = loginDto.userDto.email
                        state.loginDto.userDto.firstName = loginDto.userDto.firstName
                        state.loginDto.userDto.lastName = loginDto.userDto.lastName
                        state.loginDto.userDto.password = loginDto.userDto.password
                        state.loginDto.userDto.updateTime = loginDto.userDto.updateTime
                        state.loginDto.userDto.userName = loginDto.userDto.userName
                        state.loginDto.userDto.phoneNumber = loginDto.userDto.phoneNumber

                        state.storeDto.id = storeDto.id
                        state.storeDto.isActive = storeDto.isActive
                        state.storeDto.radius = storeDto.radius
                        state.storeDto.storeLocation.latitude = storeDto.storeLocation.latitude
                        state.storeDto.storeLocation.longitude = storeDto.storeLocation.longitude
                        state.storeDto.storeLocation.latitudeDelta = storeDto.storeLocation.latitudeDelta
                        state.storeDto.storeLocation.longitudeDelta = storeDto.storeLocation.longitudeDelta
                        state.storeDto.storeName = storeDto.storeName
                        state.storeDto.storeTime.endDate = storeDto.storeTime.endDate
                        state.storeDto.storeTime.startDate = storeDto.storeTime.startDate
                    }
                    else {
                        state.barcodeReadEnum = BarcodeReadEnum.Default
                        state.id = 0
                        state.locationDto.latitude = null
                        state.locationDto.longitude = null
                        state.locationDto.areaControl = null
                        state.data = ""
                        // state.deviceBrand = null
                        // state.deviceModelName = ""
                        // state.deviceToken = null
                        state.loading = true
                        // state.loginDto = initialLoginDto
                        // state.storeDto = initialStoreDto
                        state.loginDto.isLoggedIn = initialLoginDto.isLoggedIn
                        state.loginDto.rememberMe = initialLoginDto.rememberMe,
                            state.loginDto.roleDto.id = initialLoginDto.roleDto.id
                        state.loginDto.roleDto.isActive = initialLoginDto.roleDto.isActive
                        state.loginDto.roleDto.roleName = initialLoginDto.roleDto.roleName
                        state.loginDto.userDto.id = initialLoginDto.userDto.id
                        state.loginDto.userDto.createTime = initialLoginDto.userDto.createTime
                        state.loginDto.userDto.deleteTime = initialLoginDto.userDto.deleteTime
                        state.loginDto.userDto.email = initialLoginDto.userDto.email
                        state.loginDto.userDto.firstName = initialLoginDto.userDto.firstName
                        state.loginDto.userDto.lastName = initialLoginDto.userDto.lastName
                        state.loginDto.userDto.password = initialLoginDto.userDto.password
                        state.loginDto.userDto.updateTime = initialLoginDto.userDto.updateTime
                        state.loginDto.userDto.userName = initialLoginDto.userDto.userName
                        state.loginDto.userDto.phoneNumber = initialLoginDto.userDto.phoneNumber

                        state.storeDto.id = initialStoreDto.id
                        state.storeDto.isActive = initialStoreDto.isActive
                        state.storeDto.radius = initialStoreDto.radius
                        state.storeDto.storeLocation.latitude = initialStoreDto.storeLocation.latitude
                        state.storeDto.storeLocation.longitude = initialStoreDto.storeLocation.longitude
                        state.storeDto.storeLocation.latitudeDelta = initialStoreDto.storeLocation.latitudeDelta
                        state.storeDto.storeLocation.longitudeDelta = initialStoreDto.storeLocation.longitudeDelta
                        state.storeDto.storeName = initialStoreDto.storeName
                        state.storeDto.storeTime.endDate = initialStoreDto.storeTime.endDate
                        state.storeDto.storeTime.startDate = initialStoreDto.storeTime.startDate
                    }
                } catch (error) {
                    console.log("barcodeCheckStore Slice Hatası", error);
                }
            })
            .addCase(barcodeCheckStore.rejected, (state, action: any) => {
                state.barcodeReadEnum = BarcodeReadEnum.Default
                state.id = 0
                state.locationDto.latitude = null
                state.locationDto.longitude = null
                state.locationDto.areaControl = null
                state.data = ""
                state.loading=true
                // state.deviceBrand = null
                // state.deviceModelName = ""
                // state.deviceToken = null

                // state.loginDto = initialLoginDto,
                // state.storeDto = initialStoreDto
                state.loginDto.isLoggedIn = initialLoginDto.isLoggedIn
                state.loginDto.rememberMe = initialLoginDto.rememberMe,
                    state.loginDto.roleDto.id = initialLoginDto.roleDto.id
                state.loginDto.roleDto.isActive = initialLoginDto.roleDto.isActive
                state.loginDto.roleDto.roleName = initialLoginDto.roleDto.roleName
                state.loginDto.userDto.id = initialLoginDto.userDto.id
                state.loginDto.userDto.createTime = initialLoginDto.userDto.createTime
                state.loginDto.userDto.deleteTime = initialLoginDto.userDto.deleteTime
                state.loginDto.userDto.email = initialLoginDto.userDto.email
                state.loginDto.userDto.firstName = initialLoginDto.userDto.firstName
                state.loginDto.userDto.lastName = initialLoginDto.userDto.lastName
                state.loginDto.userDto.password = initialLoginDto.userDto.password
                state.loginDto.userDto.updateTime = initialLoginDto.userDto.updateTime
                state.loginDto.userDto.userName = initialLoginDto.userDto.userName
                state.loginDto.userDto.phoneNumber = initialLoginDto.userDto.phoneNumber

                state.storeDto.id = initialStoreDto.id
                state.storeDto.isActive = initialStoreDto.isActive
                state.storeDto.radius = initialStoreDto.radius
                state.storeDto.storeLocation.latitude = initialStoreDto.storeLocation.latitude
                state.storeDto.storeLocation.longitude = initialStoreDto.storeLocation.longitude
                state.storeDto.storeLocation.latitudeDelta = initialStoreDto.storeLocation.latitudeDelta
                state.storeDto.storeLocation.longitudeDelta = initialStoreDto.storeLocation.longitudeDelta
                state.storeDto.storeName = initialStoreDto.storeName
                state.storeDto.storeTime.endDate = initialStoreDto.storeTime.endDate
                state.storeDto.storeTime.startDate = initialStoreDto.storeTime.startDate
            })
    }
})
export default barcodeSlice.reducer