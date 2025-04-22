import { CrudTimeDto, DateRangeDto } from "../../../Helpers/DataGrid/CrudTimeDto";
import { LoginDto } from "../../Login/Dtos/LoginDto";

export interface PersonnelDto {
    id: number;                     // barkod id
    entrance: boolean | null;
    exit: boolean | null;
    loginDto:LoginDto
    dateRangeDto:DateRangeDto
}

