import { DeviceType } from "expo-device";

// import { DeviceType } from "expo-device/build/Device.types";

export interface DeviceInformationDto {
    brand: string | null;
    deviceType: DeviceType;
    isDevice: boolean;
    manufacturer: string | null;
    modelName: string | null;
    osName: string | null;
    osVersion: string | null;
}

export const initialDeviceInformationDto: DeviceInformationDto = {
    brand: null,
    modelName: "",
    osName: "",
    osVersion: "",
    manufacturer: "",
    deviceType: DeviceType.UNKNOWN,
    isDevice: false
}
