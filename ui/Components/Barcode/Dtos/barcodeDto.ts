import { initialLoginDto, LoginDto } from "../../Login/Dtos/LoginDto";
import { initialStoreDto, StoreDto } from "../../Stores/Dtos/storeDto";
import { BarcodeReadEnum } from "../../../Enums/barcodeStatusEnum";
import { initialLocationDto, LocationDto } from "../../../Location/Dtos/locationDto";

export interface BarcodeDto {
    id: number;
    barcodeReadEnum: BarcodeReadEnum | null;
    data: string
    locationDto: LocationDto;
    loginDto: LoginDto
    storeDto: StoreDto
    loading: boolean // profildeki kartın giriş durumun yüklenmesi
    deviceId: number
    qrCodeVisibleState:boolean
}

export const initialBarcodeState: BarcodeDto = {
    id: 0,
    barcodeReadEnum: BarcodeReadEnum.Default,
    locationDto: initialLocationDto,
    data: "",
    loginDto: initialLoginDto,
    storeDto: initialStoreDto,
    loading: false,
    deviceId: 0,
    qrCodeVisibleState: true
}