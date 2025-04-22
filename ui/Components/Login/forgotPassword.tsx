import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native';
import { TextInput, Text, Button, Chip, HelperText, ActivityIndicator, MD2Colors } from 'react-native-paper';
import { ForgottenPasswordDto, initialForgottenPasswordDto } from '../Admin/AddUser/Dtos/userDto';

import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { ForgottenPassword } from './Requests/loginStore';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/store';
import forgottenPasswordSlice from '../Login/forgottenPasswordSlice'
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordComponent() {
    const [forgottenPassword, setForgottenPassword] = useState<ForgottenPasswordDto>(initialForgottenPasswordDto)
    const [passwordAgain, setPasswordAgain] = useState<string>("")
    const [loadingStatus, setLoadingStatus] = useState<boolean>(true)

    const visibleState = useSelector((state: RootState) => state.forgottenPasswordSlice)
    const dispatch = useDispatch<AppDispatch>()
    const navigation = useNavigation<any>();

    const Loading = () => {
        return <ActivityIndicator animating={true} color={MD2Colors.greenA700} size={50} />
    }

    const handleDisapled = () => {
        if (visibleState.visible === "Email" && !(forgottenPassword.email)) {
            return true
        }
        else if (visibleState.visible === 'EmailConfirm' && !(forgottenPassword.emailConfirmNumber)) {
            return true
        }
        else if (visibleState.visible === "NewRegister" && !(forgottenPassword.userName && forgottenPassword.password && passwordAgain)) {
            return true
        }
        else {
            return false
        }
    }

    const handlePress = async () => {
        if (visibleState.visible === 'Email') {
            setLoadingStatus(false)
            const responseEmail = await ForgottenPassword(forgottenPassword)
            if (responseEmail?.responseStatus === ResponseStatus.IsSuccess) {
                setForgottenPassword(responseEmail.result)
                // setVisibleEmail('EmailConfirm')
                dispatch(forgottenPasswordSlice.actions.setVisiblePage({
                    ...visibleState,
                    visible: 'EmailConfirm',
                    email: responseEmail.result.email,
                    emailConfirmNumber: responseEmail.result.emailConfirmNumber,
                    password: responseEmail.result.password,
                    userName: responseEmail.result.userName
                }))
                Toast.show({ type: "success", text2: responseEmail.responseMessage })
                setLoadingStatus(true)
            }
            else if (responseEmail?.responseStatus === ResponseStatus.IsError) {
                Toast.show({ type: "error", text2: responseEmail?.responseMessage })
                setLoadingStatus(true)
            }
            else {
                Toast.show({ type: "error", text2: "Bilinmeyen bir hata oluştu" })
            }
        }
        else if (visibleState.visible === 'EmailConfirm') {

            
            let visibleStateDto:ForgottenPasswordDto = {...visibleState,emailConfirmNumber:forgottenPassword.emailConfirmNumber}
            setLoadingStatus(false)
            // visibleState.emailConfirmNumber = forgottenPassword.emailConfirmNumber
            const responseConfirmPassword = await ForgottenPassword(visibleStateDto)
            if (responseConfirmPassword?.responseStatus === ResponseStatus.IsSuccess) {
                // setVisibleEmail('NewRegister')
                dispatch(forgottenPasswordSlice.actions.setVisiblePage({
                    ...visibleState,
                    visible: 'NewRegister',
                    email: responseConfirmPassword.result.email,
                    emailConfirmNumber: responseConfirmPassword.result.emailConfirmNumber,
                    password: responseConfirmPassword.result.password,
                    userName: responseConfirmPassword.result.userName
                }))

                setForgottenPassword(responseConfirmPassword.result)
                setLoadingStatus(true)
            }
            else if (responseConfirmPassword?.responseStatus === ResponseStatus.IsError) {
                Toast.show({ type: "error", text2: responseConfirmPassword?.responseMessage })
                setLoadingStatus(true)
            }
            else {
                Toast.show({ type: "error", text2: "Bilinmeyen bir hata oluştu" })
            }
        }
        else if (visibleState.visible === 'NewRegister') {
            if (passwordAgain === forgottenPassword.password) {
                let visibleStateDto:ForgottenPasswordDto={...visibleState,userName:forgottenPassword.userName,password:forgottenPassword.password,email:visibleState.email,emailConfirmNumber:visibleState.emailConfirmNumber}
                setLoadingStatus(false)
                const responseNewRegister = await ForgottenPassword(visibleStateDto)
                if (responseNewRegister?.responseStatus === ResponseStatus.IsSuccess) {
                    setForgottenPassword(initialForgottenPasswordDto)
                    dispatch(forgottenPasswordSlice.actions.pageReset())
                    setPasswordAgain("")
                    Toast.show({ text1: 'Güncelleme Başarılı', text2: responseNewRegister.responseMessage })
                    setLoadingStatus(true)
                    setTimeout(() => {
                        // setVisibleEmail('Email')
                        dispatch(forgottenPasswordSlice.actions.setVisiblePage({ ...visibleState, visible: 'Email' }))
                        navigation.navigate('Login')
                    }, 1500);
                }
                else if (responseNewRegister?.responseStatus === ResponseStatus.IsError) {
                    Toast.show({ type: "error", text2: responseNewRegister?.responseMessage })
                    setLoadingStatus(true)
                }
                else {
                    Toast.show({ type: "error", text2: "Bilinmeyen bir hata oluştu" })
                }
            }
            else {
                Toast.show({ type: "error", text2: "Şifreler uyuşmuyor" })
            }
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#CDDCEC' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CDDCEC', }}>
                {!loadingStatus &&
                    <Loading />
                }
                {loadingStatus &&
                    <LinearGradient
                        colors={['red', 'blue']}
                        style={{ borderRadius: 30, opacity: 0.85, height: visibleState.visible === 'NewRegister' ? 450 : 350, marginBottom: 20 }}
                    >
                        <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Chip style={{ backgroundColor: '#E6DCAC', margin: 20 }}  ><Text style={{ fontWeight: 'bold' }} variant="titleLarge">Şifremi Unuttum</Text></Chip>

                            {visibleState.visible === 'Email' && <TextInput
                                label="Email"
                                inputMode='email'
                                textContentType='emailAddress'
                                value={forgottenPassword.email}
                                style={{ width: 300, marginBottom: 20, margin: 20 }}
                                onChangeText={text => setForgottenPassword(prev => ({ ...prev, email: text }))}
                            />
                            }
                            {visibleState.visible === 'EmailConfirm' &&
                                <TextInput
                                    label="6 haneli kodu gir"
                                    inputMode='email'
                                    textContentType='oneTimeCode'
                                    value={forgottenPassword.emailConfirmNumber}
                                    style={{ width: 300, marginBottom: 20, margin: 20 }}
                                    onChangeText={text => setForgottenPassword(prev => ({ ...prev, emailConfirmNumber: text }))}
                                />
                            }
                            {visibleState.visible === 'NewRegister' &&
                                <View>
                                    <TextInput
                                        label="Kullanıcı Adı"
                                        inputMode='text'
                                        textContentType='username'
                                        value={forgottenPassword.userName}
                                        style={{ width: 300, marginBottom: 20, margin: 20 }}
                                        onChangeText={text => setForgottenPassword(prev => ({ ...prev, userName: text }))}
                                    />
                                    <TextInput
                                        label="Şifre"
                                        inputMode='text'
                                        textContentType='password'
                                        value={forgottenPassword.password}
                                        style={{ width: 300, marginBottom: 20, margin: 20 }}
                                        onChangeText={text => setForgottenPassword(prev => ({ ...prev, password: text }))}
                                    />
                                    <TextInput
                                        label="Şifre Tekrarı"
                                        inputMode='text'
                                        textContentType='password'
                                        value={passwordAgain}
                                        style={{ width: 300, margin: 20 }}
                                        onChangeText={text => setPasswordAgain(text)}
                                        error={passwordAgain !== forgottenPassword.password}
                                    />
                                    <HelperText type="error" style={{ marginLeft: 5, marginBottom: 5 }}
                                        visible={passwordAgain !== forgottenPassword.password}
                                    >
                                        Şifre Hatalı Girildi
                                    </HelperText>
                                </View>
                            }
                            <Button
                                mode='contained'
                                style={{ backgroundColor: '#ACC8E5', marginBottom: 20 }}
                                onPress={handlePress}
                                disabled={handleDisapled()}
                            >Gönder
                            </Button>
                        </View>
                    </LinearGradient>}
            </View>
        </View>
    )
}


