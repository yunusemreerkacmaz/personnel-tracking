import { AxiosResponse } from "axios";
import { getApiUrl } from "../../../Helpers/Helper";
import { StoreDto, StoreFilterDto } from "../Dtos/storeDto";
import { ServiceResult } from "../../../ServiceResults/serviceResult";
import Toast from "react-native-toast-message";

export const AddNewStore = async (input: StoreDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<StoreDto>> = await axiosInstance.post(`Store/AddStore`, input);
        return response.data
    } catch (error) {
        console.log("AddNewStore error = " + error);
        Toast.show({
            text1: 'Sunucu Hatası',
            text2: "Mağaza Ekleme",
            type: 'error',
        })
    }
}

export const UpdateStore = async (input: StoreDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<StoreDto>> = await axiosInstance.put(`Store/UpdateStore`, input);
        return response.data
    } catch (error) {
        console.log("UpdateStore error = " + error);
        Toast.show({
            text1: 'Sunucu Hatası',
            text2: "Mağaza Güncelleme",
            type: 'error',
        })
    }
}

export const GetStores = async (input: StoreFilterDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<StoreDto>> = await axiosInstance.post(`Store/GetStores`, input);
        return response.data
    } catch (error) {
        console.log("GetStores error = " + error);
        Toast.show({
            text1: 'Sunucu Hatası',
            text2: "Mağaza Verileri getirilemedi",
            type: 'error',
        })
    }
}

export const DeleteStores = async (input: StoreDto[]) => {
    try {
        const { axiosInstance } = await getApiUrl()

        const response: AxiosResponse<ServiceResult<StoreDto>> = await axiosInstance.delete(`Store/DeleteStore`, { data: input });
        return response.data
    } catch (error) {
        console.log("DeleteStores error = " + error);
        Toast.show({
            text1: 'Sunucu Hatası',
            text2: "Mağaza Silme",
            type: 'error',
        })
    }
}