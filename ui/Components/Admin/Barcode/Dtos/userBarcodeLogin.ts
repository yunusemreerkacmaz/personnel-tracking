import { UserDto } from "../../AddUser/Dtos/userDto";

export interface UserBarcodeLoginDto{
    userDto:UserDto,
    isApproval:boolean | null
}