import { CrudTimeDto, initialTimeDto, TimeDto } from "../../../../Helpers/DataGrid/CrudTimeDto";
import { initialStoreDto, StoreDto, } from "../../../Stores/Dtos/storeDto";
import { initialRoleDto, RoleDto } from "../../AddRole/Dtos/roleDto";

export interface UserDto extends CrudTimeDto {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string
    phoneNumber: string
}

export interface AddUserDto extends UserDto {
    roleDto: RoleDto;
    isActive: boolean;
    storeDto: StoreDto
    shiftTime: TimeDto
}

export interface DeleteUsersDto extends AddUserDto { }

export interface GetUserDto extends AddUserDto { }

export const initialUserDto: UserDto = {
    id: 0,
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    createTime: null,
    deleteTime: null,
    updateTime: null,
    email: "",
    phoneNumber: ""
}
export const initialAddUserDto: AddUserDto = {
    roleDto: initialRoleDto,
    isActive: true,
    id: 0,
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    storeDto: initialStoreDto,
    shiftTime: initialTimeDto,
    phoneNumber: ""
}
export interface ForgottenPasswordDto {
    email: string;
    emailConfirmNumber: string;
    userName: string;
    password: string;
}
export const initialForgottenPasswordDto: ForgottenPasswordDto = {
    email: "",
    emailConfirmNumber: "",
    userName: "",
    password: ""
}

export interface HelperTextDto {
    userName?: boolean,
    password?: boolean,
    firstName?: boolean,
    lastName?: boolean,
    gender?: boolean,
    email?: boolean,
    phoneNumber?: boolean,
    roleDto?: boolean,
    storeDto?: boolean,
    startDate?: boolean,
    endDate?: boolean,
}
export const initialHelperTextDto: HelperTextDto = {
    userName: false,
    password: false,
    firstName: false,
    lastName: false,
    gender: false,
    email: false,
    phoneNumber: false,
    roleDto: false,
    storeDto: false,
    startDate: false,
    endDate: false
}
