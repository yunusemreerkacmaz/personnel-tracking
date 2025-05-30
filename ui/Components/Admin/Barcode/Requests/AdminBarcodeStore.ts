import { AxiosResponse } from "axios";
import { ServiceResult } from "../../../../ServiceResults/serviceResult";
import { getApiUrl } from "../../../../Helpers/Helper";
import Toast from "react-native-toast-message";
import { UserBarcodeLoginDto as UserEntryExitLoginDto } from "../Dtos/userBarcodeLogin";

export const GetEntryExitUserLogin = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserEntryExitLoginDto>> = await axiosInstance.get(`User/GetEntryExitUserLogin`);
        return response.data
    } catch (error) {
        console.log("GetUsers error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const GetEntryExitUserLogout = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserEntryExitLoginDto>> = await axiosInstance.get(`User/GetEntryExitUserLogout`);
        return response.data
    } catch (error) {
        console.log("GetUsers error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const UpdateEntryExitUser = async (userDto: UserEntryExitLoginDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserEntryExitLoginDto>> = await axiosInstance.post(`User/UpdateEntryExitUser`, userDto);
        return response.data
    } catch (error) {
        console.log("AddUser error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

// export const DeleteBarcodeUsers = async (usersDto: UserEntryExitLoginDto[]) => {
//     try {
//         const { axiosInstance } = await getApiUrl()
//         const response: AxiosResponse<ServiceResult<UserEntryExitLoginDto>> = await axiosInstance.post(`User/DeleteUsers`, usersDto);
//         return response.data
//     } catch (error) {
//         console.log("DeleteUsers error = " + error);

//         Toast.show({
//             text1: 'Role Sunucu Hatası',
//             type: 'error',
//         })
//     }
// }