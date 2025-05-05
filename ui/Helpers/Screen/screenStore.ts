import { createAsyncThunk } from "@reduxjs/toolkit";
import * as ScreenOrientation from 'expo-screen-orientation';

export const screenOrientationStore = createAsyncThunk("ScreenOrientation/ScreenOrientationAsync",
    async () => {
        try {
            const orientation = await ScreenOrientation.getOrientationAsync(); // true ise ekran dikey değilse yatay
            const isPortrait =
                orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
                orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;
            return isPortrait
        } catch (error) {
            console.log("Ekran Yönü belirleme hatası Oluştu");
            return false;
        }
    }
)