import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import Toast from "react-native-toast-message";
import { ServiceResult } from "../../../ServiceResults/serviceResult";
import { getApiUrl } from "../../../Helpers/Helper";
import { EntryExitDto } from "../Dtos/EntryExitDto";

export const entryExitReadStore = createAsyncThunk(
    "EntryExit/EntryExitRead",
    async (input: EntryExitDto, thunkAPI) => {
        try {
            const { axiosInstance } = await getApiUrl()
            const response: AxiosResponse<ServiceResult<EntryExitDto>> = await axiosInstance.post(`EntryExit/EntryExitRead`, input);
            return response.data; // Backend'den gelen yanıt
        } catch (error: any) {
            Toast.show({
                text1: 'EntryExitCheck Sunucu Hatası',
                text2: "EntryExitCheck okuma hatası",
                type: 'error',
            })
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const entryExitCheckStore = createAsyncThunk(
    "EntryExit/EntryExitCheck",
    async (input: EntryExitDto, thunkAPI) => {
        try {
            const { axiosInstance } = await getApiUrl()
            const response: AxiosResponse<ServiceResult<EntryExitDto>> = await axiosInstance.post(`EntryExit/EntryExitCheck`, input);
            return response.data; // Backend'den gelen yanıt
        } catch (error: any) {
            Toast.show({
                text1: 'EntryExitCheck Sunucu Hatası',
                text2: "EntryExitCheck kontrol hatası",
                type: 'error',
            })
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);


