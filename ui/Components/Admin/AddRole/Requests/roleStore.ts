import { AxiosResponse } from "axios";
import { ServiceResult } from "../../../../ServiceResults/serviceResult";
import { getApiUrl } from "../../../../Helpers/Helper";
import { RoleDto } from "../Dtos/roleDto";
import Toast from "react-native-toast-message";

export const AddRole = async (roleDto: RoleDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<RoleDto>> = await axiosInstance.post(`Role/AddRole`, roleDto);
        return response.data
    } catch (error) {
        console.log("AddRole error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const GetRoles = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<RoleDto>> = await axiosInstance.get(`Role/GetRoles`);
        return response.data
    } catch (error) {
        console.log("GetRoles error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

export const DeleteRole = async (rolesDto: RoleDto[]) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<RoleDto>> = await axiosInstance.post(`Role/DeleteRole`, rolesDto);
        return response.data
    } catch (error) {
        console.log("DeleteRole error = " + error);
        Toast.show({
            text1: 'Role Sunucu Hatası',
            type: 'error',
        })
    }
}

