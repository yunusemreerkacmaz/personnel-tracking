export interface ScreenOrientationDto{
isPortrait:boolean 
status:'idle' | 'loading' | 'succeeded' | 'failed';
}
export const initialScreenOrientationDto:ScreenOrientationDto={
    isPortrait: false,
    status: "idle"
}