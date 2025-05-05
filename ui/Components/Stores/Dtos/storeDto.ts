import { initialTimeDto, TimeDto } from "../../../Helpers/DataGrid/CrudTimeDto"

export interface StoreDto {
    id:number
    storeName: string
    storeTime: TimeDto,
    storeLocation: StoreLocationDto
    isActive:boolean
    radius:number
}

export const initialStoreLocationDto: StoreLocationDto = {
    latitude: 40.04144575513158,
    longitude: 32.908030908625896,
    latitudeDelta: 10.00,
    longitudeDelta: 10.00
}
export const initialStoreDto: StoreDto = {
    storeName: "",
    storeTime: initialTimeDto,
    storeLocation: initialStoreLocationDto,
    isActive: false,
    id: 0,
    radius: 0
}
export interface StoreLocationDto {
    latitude: number
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number
}

export interface StoreMarkerDto {
    latitude: number 
    longitude:number,
    latitudeDelta: number,
    longitudeDelta: number
}
export const  initialStoreMarkerDto:StoreMarkerDto = {
    latitudeDelta: 0,
    longitudeDelta: 0,
    latitude: 0,
    longitude: 0
}

export interface StoreFilterDto{
    searchValue:string
}
export const initialFilterDto:StoreFilterDto={
    searchValue: ""
}

export type HelperTextStoreDto={
    storeName:boolean
    latitude:boolean
    longitude:boolean
  }