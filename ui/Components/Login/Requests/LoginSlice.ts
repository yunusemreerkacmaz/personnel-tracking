import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialLoginDto, LoginDto } from "../Dtos/LoginDto";
import { loginCheckStore, loginStore } from "./loginStore";
import { ResponseStatus, ServiceResult } from "../../../ServiceResults/serviceResult";
import { initialUserDto } from "../../Admin/AddUser/Dtos/userDto";
import { initialRoleDto } from "../../Admin/AddRole/Dtos/roleDto";

export const loginSlice = createSlice({
    name: 'login',
    initialState: initialLoginDto,
    reducers: {
        loginReset(state) {
            state.userDto = initialUserDto
            state.roleDto = initialRoleDto
            state.isLoggedIn = false
            state.rememberMe = false
        },
        logout(state){
            state.isLoggedIn = false
        },
        rememberMe(state,action:PayloadAction<boolean>){
            state.rememberMe = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginStore.fulfilled, (state, action: PayloadAction<ServiceResult<LoginDto>>) => {
                const { userDto, isLoggedIn, roleDto, rememberMe } = action.payload.result
                if (action.payload.responseStatus===ResponseStatus.IsSuccess) {
                    state.userDto = userDto
                    state.roleDto = roleDto
                    state.isLoggedIn = isLoggedIn
                    state.rememberMe = rememberMe 
                }
            })
            .addCase(loginStore.rejected, (state, action: any) => {
                state.userDto = initialUserDto
                state.roleDto = initialRoleDto
                state.isLoggedIn = false
                state.rememberMe = false
            })
            .addCase(loginCheckStore.fulfilled, (state, action: PayloadAction<ServiceResult<LoginDto>>) => {
                const { userDto, isLoggedIn, roleDto, rememberMe } = action.payload.result
                state.userDto = userDto
                state.roleDto = roleDto
                state.isLoggedIn = isLoggedIn
                state.rememberMe = true
            })
            .addCase(loginCheckStore.rejected, (state, action: any) => {
                state.userDto = initialUserDto
                state.roleDto = initialRoleDto
                state.isLoggedIn = false
                state.rememberMe = false
            })
    }
})
export default loginSlice.reducer