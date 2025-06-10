import { AxiosResponse } from "axios";
import { getApiUrl } from "../../../Helpers/Helper";
import { ServiceResult } from "../../../ServiceResults/serviceResult";
import { CreateShiftDto, FilterShiftPlanDto, ShiftPlanDto, TableBodyDto } from "../Dtos/shipPlanDto";
import Toast from "react-native-toast-message";
import { UserDto } from "../../Admin/AddUser/Dtos/userDto";

export const GetUserShiftPlans = async (userId: number) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<ShiftPlanDto>> = await axiosInstance.get(`ShiftPlan/GetUserShiftPlans/${userId}`);
        return response.data
    } catch (error) {
        Toast.show({
            text1: 'Sunucu Hatası',
            type: 'error',
        })
    }
}
export const GetShiftPlans = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<TableBodyDto>> = await axiosInstance.get(`ShiftPlan/GetShiftPlans`);
        return response.data
    } catch (error) {
        Toast.show({
            text1: 'Sunucu Hatası',
            type: 'error',
        })
    }
}
export const GetUsers = async (filterDto: FilterShiftPlanDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserDto>> = await axiosInstance.post(`ShiftPlan/GetUsers`, filterDto);
        return response.data
    } catch (error) {
        Toast.show({
            text1: 'Sunucu Hatası',
            type: 'error',
        })
    }
}
export const CreateShiftPlan = async (tableBodyDto: CreateShiftDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<CreateShiftDto>> = await axiosInstance.post(`ShiftPlan/CreateShiftPlan`, tableBodyDto);
        return response.data
    } catch (error) {
        Toast.show({
            text1: 'Sunucu Hatası',
            type: 'error',
        })
    }
}