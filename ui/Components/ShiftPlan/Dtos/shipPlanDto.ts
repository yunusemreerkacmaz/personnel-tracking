import { CrudTimeDto } from "../../../Helpers/DataGrid/CrudTimeDto";

export interface ShiftPlanDto {
    tableHeader: TableHeaderDto;
    tableBody: TableBodyDto[];
}
export interface TableBodyDto extends CrudTimeDto {
    id: number;
    userId: number;
    monday: string | null;
    tuesday: string | null;
    wednesday: string | null;
    thursday: string | null;
    friday: string | null;
    saturday: string | null;
    sunday: string | null;
    isDeleted: boolean;
    totalTime: string | null;
    firstName: string | null;
    lastName: string | null;
    shiftPlanName: string | null
}
export interface TableHeaderDto {
    mondayDate: string | null;
    tuesdayDate: string | null;
    wednesdayDate: string | null;
    thursdayDate: string | null;
    fridayDate: string | null;
    saturdayDate: string | null;
    sundayDate: string | null;
}
export const initialTableHeaderDto: TableHeaderDto = {
    mondayDate: null,
    tuesdayDate: null,
    wednesdayDate: null,
    thursdayDate: null,
    fridayDate: null,
    saturdayDate: null,
    sundayDate: null
}


export const initialTableBodyDto: TableBodyDto = {
    id: 0,
    userId: 0,
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
    isDeleted: false,
    totalTime: null,
    firstName: null,
    lastName: null,
    shiftPlanName: null
}
export interface TableBodyHelperTextDto {
    monday?: boolean | null
    tuesday?: boolean | null
    wednesday?: boolean | null
    thursday?: boolean | null
    friday?: boolean | null
    saturday?: boolean | null
    sunday?: boolean | null
    shiftPlanName?: boolean | null
}
export const initialTableBodyHelperTextDto: TableBodyHelperTextDto = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
    shiftPlanName: null
}
export const initialShiftPlanDto: ShiftPlanDto = {
    tableHeader: initialTableHeaderDto,
    tableBody: []
}
export interface FilterShiftPlanDto {
    Searchtext: string | null
}
export const initialFilterShiftPlanDto: FilterShiftPlanDto = {
    Searchtext: null
}

export interface PermissionsDto {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
}
export const initialData:PermissionsDto={
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: ""
}
export interface CreateShiftDto {
    permissions: PermissionsDto
    shiftPlanName: string
}
export const initialCreateShiftDto: CreateShiftDto = {
    permissions: initialData,
    shiftPlanName: ""
}
