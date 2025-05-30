import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Device from "expo-device";
import { getApiUrl } from "../../../Helpers/Helper";
import { AxiosResponse } from "axios";
import { ServiceResult } from "../../../ServiceResults/serviceResult";
import Toast from "react-native-toast-message";
import { DeviceDto } from "../Dtos/DeviceDto";
import { UserDto } from "../../Admin/AddUser/Dtos/userDto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceTokenEnum } from "../../../Enums/JwtTokenEnum";

export const deviceInfoStore = createAsyncThunk("device/deviceInfoStore", async () => {
    const brand = Device.brand;
    const deviceType = Device.deviceType;
    const modelName = Device.modelName;
    const manufacturer = Device.manufacturer;
    const isDevice = Device.isDevice;
    const osName = Device.osName;
    const osVersion = Device.osVersion;
    return { brand, deviceType, modelName, manufacturer, isDevice, osName, osVersion };
});

export const getDistinctDevices = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<DeviceDto>> = await axiosInstance.get(`Device/GetDistinctDevices`);
        return response.data
    } catch (error) {
        console.log("Cihaz Hatası(GetDistinctDevices) =" + error);
        Toast.show({
            text1: 'Cihaz Hatası(GetDistinctDevices)',
            type: 'error',
        })
    }
}

export const getDevices = async () => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserDto>> = await axiosInstance.get(`Device/GetDevices`);
        return response.data
    } catch (error) {
        console.log("Cihaz Hatası(getDevices) =" + error);
        Toast.show({
            text1: 'Cihaz Hatası(getDevices)',
            type: 'error',
        })
    }
}
export const UpdateDevice = async (deviceDto: DeviceDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<DeviceDto>> = await axiosInstance.post(`Device/UpdateDevice`, deviceDto);
        return response.data
    } catch (error) {
        console.log("Cihaz Hatası(UpdateDevice) = " + error);
        Toast.show({
            text1: 'Cihaz Hatası(UpdateDevice)',
            type: 'error',
        })
    }
}
export const DeleteDevice = async (userId: number) => {
    try {
        const { axiosInstance } = await getApiUrl()
        const response: AxiosResponse<ServiceResult<UserDto>> = await axiosInstance.delete(`Device/DeleteDevice/${userId}`);
        return response.data
    } catch (error) {
        console.log("Cihaz Hatası(DeleteDevice) = " + error);
        Toast.show({
            text1: 'Cihaz Hatası(DeleteDevice)',
            type: 'error',
        })
    }
}

export const CheckDevice = async (deviceDto: DeviceDto) => {
    try {
        const { axiosInstance } = await getApiUrl()
        let deviceToken = await AsyncStorage.getItem(DeviceTokenEnum.key)
        const response: AxiosResponse<ServiceResult<DeviceDto>> = await axiosInstance.post(`Device/CheckDevice`,deviceDto,{
            headers:{[DeviceTokenEnum.key]:deviceToken,
                'Content-Type': 'application/json'
            }
        });

       if (response.headers["device-token"] ) {
         await AsyncStorage.setItem(DeviceTokenEnum.key,response.headers["device-token"])
       }
        
        return response.data
    } catch (error) {
        console.log("Cihaz Hatası(checkDevice) = " + error);
        Toast.show({
            text1: 'Cihaz Hatası(checkDevice)',
            type: 'error',
        })
    }
}