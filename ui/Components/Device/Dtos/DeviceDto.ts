import { initialUserDto, UserDto } from "../../Admin/AddUser/Dtos/userDto";

export interface DeviceDto {
    id: number
    deviceBrand: string;
    deviceModelName: string;
    deviceToken: string;
    tokenDeletionStatus: boolean | null;
    userDto: UserDto
    isDeleted: boolean
    distinctDeviceModelName: string // sonradan girdiği cihazın modeli
    distinctDeviceBrand: string    // sonradan girdiği cihazın markası
}
export const initialDeviceDto: DeviceDto = {
    id: 0,
    deviceBrand: "",
    deviceModelName: "",
    deviceToken: "",
    tokenDeletionStatus: null,
    userDto: initialUserDto,
    isDeleted: false,
    distinctDeviceModelName: "",
    distinctDeviceBrand: ""
}