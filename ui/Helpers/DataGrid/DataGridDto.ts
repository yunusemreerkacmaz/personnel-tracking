import { initialLoginDto, LoginDto } from "../../Components/Login/Dtos/LoginDto"

export interface PaginationDto{
    page:number
    pageSize:number
    loginDto:LoginDto
    total:number
}
export const initialPaginationDto:PaginationDto={
    page: 0,
    pageSize: 4,
    loginDto:initialLoginDto,
    total:0
}
export interface DataGridDto<T> {
    inputs: T[]
    pagination: PaginationDto
}

export const initialDataGridDto: DataGridDto<any> = {
    inputs: [],
    pagination: initialPaginationDto,
}


