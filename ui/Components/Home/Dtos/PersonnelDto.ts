import { EntranceOrExitTypeEnum } from "../../../Enums/EntranceTypeEnum";
import { DateRangeDto } from "../../../Helpers/DataGrid/CrudTimeDto";
import { LoginDto } from "../../Login/Dtos/LoginDto";

export interface PersonnelDto {
    id: number;                     // barkod id
    entrance: boolean | null;
    exit: boolean | null;
    loginDto: LoginDto
    dateRangeDto: DateRangeDto
    entranceTypeEnum: EntranceOrExitTypeEnum
    exitTypeEnum: EntranceOrExitTypeEnum
}
export interface EntryExitTypeDto {
    entryTypeEnum: EntranceOrExitTypeEnum
    exitTypeEnum: EntranceOrExitTypeEnum
}
export const initialEntryExitTypeDto: EntryExitTypeDto = {
    entryTypeEnum: EntranceOrExitTypeEnum.Default,
    exitTypeEnum: EntranceOrExitTypeEnum.Default
}
export interface EntryExitExpandDto {
    accordionEntryType: boolean
    accordionExitType: boolean
}
export const initialEntryExitExpandDto: EntryExitExpandDto = {
    accordionEntryType: false,
    accordionExitType: false,
}
