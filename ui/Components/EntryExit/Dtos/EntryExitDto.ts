
import { EntryExitEnum } from "../../../Enums/EntryExitEnum";
import { initialLocationDto, LocationDto } from "../../../Location/Dtos/locationDto";

export interface EntryExitDto {
    id: number;
    locationDto: LocationDto;
    barcodeReadEnum: EntryExitEnum | null;
    biometricEnum: EntryExitEnum | null;
    adminApproveEnum:EntryExitEnum | null;
    userId: number;
    roleId: number;
    deviceId: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    biometricIconVisible: boolean
    qrCodeIconVisible: boolean
    isUserCompleteShift:boolean
}
export const initialEntryExitDto: EntryExitDto = {
    id: 0,
    locationDto: initialLocationDto,
    barcodeReadEnum: null,
    biometricEnum: null,
    userId: 0,
    roleId: 0,
    deviceId: 0,
    status: "idle",
    biometricIconVisible: true,
    qrCodeIconVisible: true,
    isUserCompleteShift: false,
    adminApproveEnum: null
}