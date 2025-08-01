import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../Navigator/navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Card, TextInput, Avatar, HelperText, Switch, Chip } from 'react-native-paper';
import { initialLoginDto, LoginDto } from './Dtos/LoginDto';
import { loginCheckStore, loginStore } from './Requests/loginStore';
import { useDispatch, useSelector, } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginJwtTokenEnum, RememberMeEnum } from '../../Enums/JwtTokenEnum';
import { ResponseStatus, ServiceResult } from '../../ServiceResults/serviceResult';
import { LinearGradient } from 'expo-linear-gradient';
import { initialRoleDto } from '../Admin/AddRole/Dtos/roleDto';
import { initialUserDto } from '../Admin/AddUser/Dtos/userDto';
import { loginSlice } from './Requests/LoginSlice';
import Animated, { BounceIn } from 'react-native-reanimated';

export default function Login() {
  type NavigationProps = DrawerNavigationProp<DrawerParamList, 'Profile', 'Home'>;
  const navigation = useNavigation<NavigationProps>();
  const [formHelperText, setFormHelperText] = useState({ username: false, password: false })
  const dispatch = useDispatch<AppDispatch>()
  const inputRef1 = React.useRef<any>(null);
  const inputRef2 = React.useRef<any>(null);
  const loginState = useSelector((state: RootState) => state.login)
  const [login, setLogin] = useState<LoginDto>(initialLoginDto)
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const screen = useSelector((state: RootState) => state.screenOrientationSlice)

  // const onfocus = () => {
  //   if (login.userDto.userName === "") {
  //     return inputRef1.current?.focus()
  //   }
  //   if (login.userDto.password === "") {
  //     return inputRef2.current?.focus()
  //   }
  // }


  useFocusEffect(
    React.useCallback(() => {
      if (login != loginState && isSwitchOn != loginState.rememberMe && !loginState.isLoggedIn) {
        setLogin(loginState)
        setIsSwitchOn(loginState.rememberMe ? true : false)
      }
      let flag = true
      var storeData = async () => {

        if (login.rememberMe && !login.isLoggedIn && flag) {
          const token = await AsyncStorage.getItem(LoginJwtTokenEnum.key)
          dispatch(loginCheckStore()).then(res => {
            const payload = res.payload as ServiceResult<LoginDto>;
            if (payload.responseStatus === ResponseStatus.IsSuccess) {
              const { userDto, isLoggedIn, roleDto, rememberMe } = payload.result;
              setLogin(prev => ({
                ...prev,
                userDto: rememberMe ? userDto : initialUserDto,
                roleDto: rememberMe ? roleDto : initialRoleDto,
                isLoggedIn: isLoggedIn,
                rememberMe: rememberMe,
                token: token
              }))
            }
            else {
              setFormHelperText({ password: false, username: false })
              setLogin(prev => ({
                ...prev,
                userDto: initialUserDto,
                roleDto: initialRoleDto,
                token: token,
                isLoggedIn: false,
                rememberMe: false
              }))
            }
          })
        }
        // onfocus()
      }
      storeData();
      flag = false
    }, []));

  const styles = StyleSheet.create({
    safeAreaView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    linearGradient: {
      flex: 1,
      opacity: 0.76,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    card: {
      flex: screen.isPortrait ? 2 / 4 : 1,
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.95,
      borderRadius: 30,
    },
    cardTitle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    CardContent: {
      flex: 3,
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardAction: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    input: {
      // height: 40,
      width: 300
    },
  });

  const handleChange = (text: any, textName: string) => {
    if (textName === "username") {
      //#region userName input bilgileri logine aktarılıyor
      setLogin({ ...login, userDto: { ...login.userDto, userName: text } })
      // #endregion

      // #region username inputun kırmızı görünmesi ve inputa ait HelperText kontrolü
      if (text === "") {
        setFormHelperText({ ...formHelperText, username: true })
      }
      else {
        setFormHelperText({ ...formHelperText, username: false })
      }
      //#endregion
    }
    else {
      // #region password input bilgileri logine aktarılıyor
      setLogin({ ...login, userDto: { ...login.userDto, password: text } })
      // #endregion

      //#region password inputun kırmızı görünmesi ve inputa ait HelperText kontrolü
      if (text === "") {
        setFormHelperText({ ...formHelperText, password: true })
      }
      else {
        setFormHelperText({ ...formHelperText, password: false })
      }
      //#endregion
    }
  }

  const handleSubmit = async () => {
    Keyboard.dismiss()    // Klavyenin kapanmasını sağlar
    if (isSwitchOn) {
      await AsyncStorage.setItem(RememberMeEnum.key, RememberMeEnum.value)
    }
    else {
      await AsyncStorage.removeItem(RememberMeEnum.key)
    }

    if (login.userDto.userName && login.userDto.password) {
      const rememberMeEnum = await AsyncStorage.getItem(RememberMeEnum.key)
      let loginDto: LoginDto = { ...login, rememberMe: rememberMeEnum ? true : false }
      dispatch(loginStore(loginDto)).then(response => {  // Giriş yap butonuna tıkladığında yapılacaklar
        if (response.meta.requestStatus === 'fulfilled') {
          const payload = response.payload as ServiceResult<LoginDto>;
          const { userDto, isLoggedIn, roleDto, rememberMe } = payload.result;
          if (payload.responseStatus === ResponseStatus.IsSuccess) {
            // setLogin({
            //   userDto: userDto,
            //   roleDto: roleDto,
            //   isLoggedIn: isLoggedIn,
            //   rememberMe: rememberMe
            // })
            //  setLogin(initialLoginDto)
            setFormHelperText({ ...formHelperText, password: false, username: false });
            // navigation.navigate('Profile');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Profile' }], // yönlendirmek istediğin ana ekran
              })
            );
          }
        }
      })
    }
  }

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn)
    // setLogin({ ...login, rememberMe: !isSwitchOn })
    dispatch(loginSlice.actions.rememberMe(isSwitchOn))
  };

  const memo = useMemo(() => {
    return <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView
          style={{ flexGrow: 1, width: '100%', height: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // İsteğe bağlı
        >
          <Animated.ScrollView
            entering={BounceIn.delay(300)}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <LinearGradient colors={['black', '#3F638C']} style={styles.linearGradient}>
              {screen.status && (
                <Card style={styles.card}>
                  <View style={styles.cardTitle}>
                    <Avatar.Icon size={70} icon="account" />
                  </View>
                  <Card.Content style={styles.CardContent}>
                    <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                      <TextInput
                        style={styles.input}
                        // ref={inputRef1}
                        onBlur={() => setFormHelperText({ ...formHelperText, username: login.userDto.userName === "" })}
                        mode="outlined"
                        onChangeText={(text) => handleChange(text, "username")}
                        value={login.userDto.userName}
                        label="Kullanıcı Adı"
                        error={formHelperText.username}
                      />
                      {formHelperText.username && (
                        <HelperText type="error" visible={formHelperText.username}>
                          Lütfen Kullanıcı Adı Girin
                        </HelperText>
                      )}
                      <TextInput
                        style={styles.input}
                        // ref={inputRef2}
                        onBlur={() => setFormHelperText({ ...formHelperText, password: login.userDto.password === "" })}
                        mode="outlined"
                        onChangeText={(text) => handleChange(text, "password")}
                        value={login.userDto.password}
                        label="Şifre"
                        error={formHelperText.password}
                      />
                      {formHelperText.password && (
                        <HelperText type="error" visible={formHelperText.password}>
                          Lütfen Şifre Girin
                        </HelperText>
                      )}
                    </View>
                    <View style={{ flex: 1, flexWrap: 'wrap' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Switch
                          value={isSwitchOn}
                          onValueChange={onToggleSwitch}
                          color={isSwitchOn ? 'green' : 'red'}
                          thumbColor={isSwitchOn ? 'green' : 'red'}
                        />
                        <Chip style={{ backgroundColor: isSwitchOn ? '#77A97C' : '#E46B6B', marginLeft: 10 }}>
                          {isSwitchOn ? 'Beni Hatırla' : 'Unut'}
                        </Chip>
                      </View>
                      <View>
                        <Button onPress={() => navigation.navigate('forgotPassword')}>Şifremi Unuttum</Button>
                      </View>
                    </View>

                  </Card.Content>
                  <View style={styles.cardAction}>
                    <TouchableOpacity>
                      <Button
                        loading={loginState.isLoggedIn}
                        contentStyle={{ width: 200, backgroundColor: '#533285' }}
                        disabled={login.userDto.userName === "" || login.userDto.password === ""}
                        mode="contained"
                        onPress={() => handleSubmit()}
                      >
                        Giriş yap
                      </Button>
                    </TouchableOpacity>
                  </View>
                </Card>
              )}
            </LinearGradient>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  }, [screen, loginState, login, isSwitchOn, formHelperText])

  return memo
}
