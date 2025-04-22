import { AxiosResponse } from "axios";
import { getApiUrl } from "../../../Helpers/Helper";
import { ServiceResult } from "../../../ServiceResults/serviceResult";
import { PersonnelDto } from "../Dtos/PersonnelDto";
import Toast from "react-native-toast-message";
import { DataGridDto, PaginationDto } from "../../../Helpers/DataGrid/DataGridDto";

export const GetPersonnelIO = async (pagination: PaginationDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<DataGridDto<PersonnelDto>>> = await axiosInstance.post(`Home/GetPersonnelIO`, pagination);
        return response.data
    } catch (error) {
        Toast.show({
            text1: 'Sunucu Hatası',
            type: 'error',
        })
    }
}