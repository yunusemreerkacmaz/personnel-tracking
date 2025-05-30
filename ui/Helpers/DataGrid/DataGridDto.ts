import { initialLoginDto, LoginDto } from "../../Components/Login/Dtos/LoginDto"
import { EntranceOrExitTypeEnum } from "../../Enums/EntranceTypeEnum"
import { EntryExitEnum } from "../../Enums/EntryExitEnum"
import { DateRangeDto, TimeDto } from "./CrudTimeDto"

export interface PaginationDto{
    page:number
    pageSize:number
    loginDto:LoginDto
    total:number
    from:number,
    to:number
    filterDto:FilterDto | null
}
   export interface FilterDto {
    dateRangeDto: DateRangeDto;
    timeDto: TimeDto
    entryTypeEnum: EntranceOrExitTypeEnum;
    exitTypeEnum: EntranceOrExitTypeEnum;
}
export const initialPaginationDto:PaginationDto={
    page: 0,
    pageSize: 4,
    loginDto: initialLoginDto,
    total: 0,
    from: 0,
    to: 0,
    filterDto: null
}
export interface DataGridDto<T> {
    inputs: T[]
    pagination: PaginationDto
}

export const initialDataGridDto: DataGridDto<any> = {
    inputs: [],
    pagination: initialPaginationDto,
}


