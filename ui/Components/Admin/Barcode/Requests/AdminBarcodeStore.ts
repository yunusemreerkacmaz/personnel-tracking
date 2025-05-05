import { AxiosResponse } from "axios";
import { ServiceResult } from "../../../../ServiceResults/serviceResult";
import { getApiUrl } from "../../../../Helpers/Helper";
import Toast from "react-native-toast-message";
import { UserBarcodeLoginDto } from "../Dtos/userBarcodeLogin";

export const GetBarcodeUserLoginService = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserBarcodeLoginDto>> = await axiosInstance.get(`User/GetBarcodeUserLoginService`);
        return response.data
    } catch (error) {
        console.log("GetUsers error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const GetBarcodeUserLogoutService = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserBarcodeLoginDto>> = await axiosInstance.get(`User/GetBarcodeUserLogoutService`);
        return response.data
    } catch (error) {
        console.log("GetUsers error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const UpdateBarcodeUser = async (userDto: UserBarcodeLoginDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserBarcodeLoginDto>> = await axiosInstance.post(`User/UpdateBarcodeUser`, userDto);
        return response.data
    } catch (error) {
        console.log("AddUser error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const DeleteBarcodeUsers = async (usersDto: UserBarcodeLoginDto[]) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserBarcodeLoginDto>> = await axiosInstance.post(`User/DeleteUsers`, usersDto);
        return response.data
    } catch (error) {
        console.log("DeleteUsers error = " + error);

        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}