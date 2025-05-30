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
export const initialTableHeaderDto:TableHeaderDto={
    mondayDate: null,
    tuesdayDate: null,
    wednesdayDate: null,
    thursdayDate: null,
    fridayDate: null,
    saturdayDate: null,
    sundayDate: null
}
export const initialTableBodyDto:TableBodyDto={
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
    lastName: null
}
export const initialShiftPlanDto:ShiftPlanDto={
    tableHeader: initialTableHeaderDto,
    tableBody: []
}
