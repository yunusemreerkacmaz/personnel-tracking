import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginDto } from "../Dtos/LoginDto";
import { getApiUrl } from "../../../Helpers/Helper";
import { LoginJwtTokenEnum } from "../../../Enums/JwtTokenEnum";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from "axios";
import { ResponseStatus, ServiceResult } from "../../../ServiceResults/serviceResult";
import Toast from "react-native-toast-message";
import { ForgottenPasswordDto } from "../../Admin/AddUser/Dtos/userDto";

// let token = ""
// let header = { Authorization: `Bearer ${token}` }
// const token = axiosInstance.defaults.headers["Authorization"];

export const loginStore = createAsyncThunk<ServiceResult<LoginDto>, LoginDto>(
    "Login/LoginAsync",
    async (input: LoginDto, thunkAPI) => {
        try {
            const { axiosInstance } = await getApiUrl()
            const response: AxiosResponse<ServiceResult<LoginDto>> = await axiosInstance.post(`Login/LoginAsync`, input);
            let token = response.headers['authorization'];
            if (token) {
                // if (input.rememberMe) {
                    try {
                        //#region Birden fazla autorization key varsa sil 
                        const allKeys = await AsyncStorage.getAllKeys();
                        const authKeys = allKeys.filter(key => key.startsWith(LoginJwtTokenEnum.key));
                        await AsyncStorage.multiRemove(authKeys);
                        //#endregion
                        await AsyncStorage.setItem(LoginJwtTokenEnum.key, token); // Belleğe token kaydetme
                    } catch (e) {
                        console.log("Token AsyncStorage'a eklenemedi");
                    }
                // }
                // else {
                //     await AsyncStorage.removeItem(LoginJwtTokenEnum.key); // Belleğe token kaydetme
                // }
            }
            if (response.data.responseStatus === ResponseStatus.IsError) {
                Toast.show({
                    text1: "Giriş Hatası", type: 'error', text1Style: { fontSize: 18, color: 'red' },
                    text2: response.data.responseMessage, text2Style: { fontSize: 15 }
                })
            }
            else if (response.data.responseStatus===ResponseStatus.IsWarning) {
                Toast.show({
                    text1: "Giriş Hatası", type: 'info', text1Style: { fontSize: 18, color: 'red' },
                    text2: response.data.responseMessage, text2Style: { fontSize: 15 }
                })
            }
            return response.data; // Backend'den gelen yanıt
        } catch (error: any) {
            console.log("catch");
            Toast.show({
                text1: 'LoginAsync Hatası',
                text2: "LoginAsync Sunucu hatası",
                type: 'error',
            })
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const loginCheckStore = createAsyncThunk(
    "Login/LoginCheckAsync",
    async (_, thunkAPI) => {
        const { axiosInstance } = await getApiUrl()

        try {
            var token = await AsyncStorage.getItem(LoginJwtTokenEnum.key); // Belleğe token kaydetme
            if (!token) {
                const allKeys = await AsyncStorage.getAllKeys();
                const authKeys = allKeys.filter(key => key.startsWith(LoginJwtTokenEnum.key));
                await AsyncStorage.multiRemove(authKeys);
            }
            const response: AxiosResponse<ServiceResult<LoginDto>> = await axiosInstance.get(`Login/LoginCheckAsync`);
            return response.data; // Backend'den gelen yanıt
        } catch (error: any) {
            Toast.show({
                text1: 'LoginCheckAsync Hatası',
                text2: "LoginCheckAsync Sunucu hatası",
                type: 'error',
            })
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const ForgottenPassword = async (forgottenPasswordDto: ForgottenPasswordDto) => {
    const { axiosInstance } = await getApiUrl()
    try {
        const response: AxiosResponse<ServiceResult<ForgottenPasswordDto>> = await axiosInstance.post(`Login/ForgottenPassword`, forgottenPasswordDto);
        return response.data
    } catch (error) {
        console.log("ForgottenPassword error = " + error);
        Toast.show({
            text1: 'ForgottenPassword Hatası',
            text2: "Şifremi unuttum Sunucu Hatası",
            type: 'error',
        })
    }
}


