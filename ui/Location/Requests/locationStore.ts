import { createAsyncThunk } from "@reduxjs/toolkit";
import { LocationSliceDto } from "../Dtos/locationDto";

export const locationStore = createAsyncThunk("location/locationStore", async (input: LocationSliceDto) => {
    const coords = input.coords
    const mocked = input.mocked
    const timestamp = input.timestamp
    const areaControl = input.areaControl
    const address = input.address

    return { coords, mocked, timestamp, areaControl, address };
});


