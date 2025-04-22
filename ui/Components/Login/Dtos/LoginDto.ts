import { initialRoleDto, RoleDto } from "../../Admin/AddRole/Dtos/roleDto";
import { initialUserDto, UserDto } from "../../Admin/AddUser/Dtos/userDto";

export interface LoginDto {
    userDto:UserDto 
    roleDto: RoleDto;
    isLoggedIn?: boolean ;
    rememberMe?:boolean 
}
export const initialLoginDto:LoginDto={
    userDto:initialUserDto,
    roleDto: initialRoleDto,
    isLoggedIn: false,
    rememberMe: false,
}
