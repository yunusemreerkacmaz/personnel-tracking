import { AxiosResponse } from "axios";
import { getApiUrl } from "../../../../Helpers/Helper";
import { ServiceResult } from "../../../../ServiceResults/serviceResult";
import { AddUserDto, DeleteUsersDto, GetUserDto, UserDto } from "../Dtos/userDto";
import Toast from "react-native-toast-message";

export const AddUser = async (userDto: AddUserDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<AddUserDto>> = await axiosInstance.post(`User/AddUser`, userDto);
        return response.data
    } catch (error) {
        console.log("AddUser error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const UpdateUser = async (userDto: AddUserDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<AddUserDto>> = await axiosInstance.post(`User/UpdateUser`, userDto);
        return response.data
    } catch (error) {
        console.log("AddUser error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const DeleteUsers = async (usersDto: DeleteUsersDto[]) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<DeleteUsersDto>> = await axiosInstance.post(`User/DeleteUsers`, usersDto);
        return response.data
    } catch (error) {
        console.log("DeleteUsers error = " + error);

        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}
export const GetUsers = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<GetUserDto>> = await axiosInstance.get(`User/GetUsers`);
        return response.data
    } catch (error) {
        console.log("GetUsers error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}