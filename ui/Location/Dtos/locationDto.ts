import { LocationGeocodedAddress, LocationObjectCoords } from "expo-location";

export interface LocationDto {
    latitude: number | null;
    longitude: number | null;
    areaControl:boolean | null
}
export const initialLocationDto:LocationDto={
    latitude: null,
    longitude: null,
    areaControl:null
}
export interface LocationSliceDto{
    areaControl:boolean               // alanın içinde olup olmadığı bilgisi
    coords: LocationObjectCoords
    mocked: boolean | undefined
    timestamp: number,
    address:LocationGeocodedAddress[]
}
export const initialLocationSliceDto:LocationSliceDto ={
    areaControl: false,
    coords: {
        latitude: 0,
        longitude: 0,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
    },
    mocked: undefined,
    timestamp: 0,
    address: []
}