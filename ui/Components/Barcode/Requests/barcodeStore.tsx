import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import Toast from "react-native-toast-message";
import { BarcodeDto } from "../Dtos/barcodeDto";
import { ServiceResult } from "../../../ServiceResults/serviceResult";
import { getApiUrl } from "../../../Helpers/Helper";

export const barcodeReadStore = createAsyncThunk(
    "Barcode/BarcodeReadAsync",
    async (input: BarcodeDto, thunkAPI) => {
        try {
            const { axiosInstance } = await getApiUrl()
            const response: AxiosResponse<ServiceResult<BarcodeDto>> = await axiosInstance.post(`Barcode/BarcodeReadAsync`, input);
            return response.data; // Backend'den gelen yanıt
        } catch (error: any) {
            Toast.show({
                text1: 'barcodeReadStore Sunucu Hatası',
                text2: "barcode okuma hatası",
                type: 'error',
            })
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const barcodeCheckStore = createAsyncThunk(
    "Barcode/BarcodeCheckAsync",
    async (input: BarcodeDto, thunkAPI) => {
        try {
            const { axiosInstance } = await getApiUrl()
            const response: AxiosResponse<ServiceResult<BarcodeDto>> = await axiosInstance.post(`Barcode/BarcodeCheckAsync`, input);
            return response.data; // Backend'den gelen yanıt
        } catch (error: any) {
            Toast.show({
                text1: 'BarcodeCheckAsync Sunucu Hatası',
                text2: "barcode kontrol hatası",
                type: 'error',
            })
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);


