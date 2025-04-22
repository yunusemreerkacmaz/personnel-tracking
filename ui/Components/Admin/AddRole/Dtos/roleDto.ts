export interface RoleDto {
    id: number;
    roleName: string;
    isActive: boolean | null
}
export const initialRoleDto: RoleDto = {
    id: 0,
    roleName: "",
    isActive: null
}
export interface CheckDto {
    id: number;
    checkStatus: boolean
}
export const initialRoleCheckDto: CheckDto = {
    id: 0,
    checkStatus: false
}