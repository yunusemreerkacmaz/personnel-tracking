import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/store';
import { LoginJwtTokenEnum, RememberMeEnum } from '../../Enums/JwtTokenEnum';
import { loginSlice } from './Requests/LoginSlice';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { deviceInfoSlice } from '../Device/Requests/deviceInfoSlice';
import { logoutEntryExit } from '../EntryExit/Requests/entryExitSlice';
import { initialEntryExitDto } from '../EntryExit/Dtos/EntryExitDto';

export type DrawerParamList = {
    Profile: undefined;
    login: undefined;
    Barkod: undefined;
    Home: undefined
    ForgottenPasswordStack: undefined
    Role: undefined
    User: undefined
    forgotPassword: undefined
    NavigationStack: undefined
    Location: undefined
    Device: undefined
};
type NavigationProps = DrawerNavigationProp<DrawerParamList>;
export default function LogoutComponent() {
    const loginState = useSelector((state: RootState) => state.login)
    const dispatch = useDispatch<AppDispatch>()
    const navigation = useNavigation<NavigationProps>();

    useFocusEffect(
        useCallback(
            () => {
                const handlegetStorage = async () => {
                    if (!loginState.rememberMe) { // Beni Hatırlama seçiliyse hepsini sil                        
                        const allKeys = await AsyncStorage.getAllKeys();
                        // Tüm tokenları sil
                        const authKeys = allKeys.filter(key => key.startsWith(LoginJwtTokenEnum.key));
                        await AsyncStorage.multiRemove(authKeys);
                        await AsyncStorage.removeItem(RememberMeEnum.key)
                        dispatch(loginSlice.actions.loginReset())
                    }
                    dispatch(loginSlice.actions.logout())
                    // dispatch(barcodeSlice.actions.barcodeReset())
                    dispatch(logoutEntryExit(initialEntryExitDto))
                    dispatch(deviceInfoSlice.actions.deviceReset())
                    navigation.navigate('login')
                }
                handlegetStorage()
            },
            [],
        )
    )
    return null
}
