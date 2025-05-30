import { AxiosResponse } from "axios";
import { getApiUrl } from "../../../Helpers/Helper";
import { ServiceResult } from "../../../ServiceResults/serviceResult";
import { ShiftPlanDto } from "../Dtos/shipPlanDto";
import Toast from "react-native-toast-message";

export const GetShiftPlans = async (userId:number) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<ShiftPlanDto>> = await axiosInstance.get(`ShiftPlan/GetShiftPlans/${userId}`);
        return response.data
    } catch (error) {
        Toast.show({
            text1: 'Sunucu Hatası',
            type: 'error',
        })
    }
}