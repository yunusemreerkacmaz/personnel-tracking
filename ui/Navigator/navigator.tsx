import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import LoginComponent from '../Components/Login/login';
import HomeComponent from '../Components/Home/home';
import ProfileComponent from '../Components/Profil/profil';
import { ActivityIndicator, Avatar, Badge, IconButton, MD2Colors, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Store/store';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BarcodeComponent from '../Components/Barcode/camera'
import { BarcodeReadEnum } from '../Enums/barcodeStatusEnum';
import { GenderEnum } from '../Enums/GenderEnum';
import RoleComponent from '../Components/Admin/AddRole';
import UserComponent from '../Components/Admin/index';
import ForgotPasswordComponent from '../Components/Login/forgotPassword';
import { connectWebSocket, disconnectWebSocket, listenMessages, sendMessage } from '../Notifications/Requests/notificationStore';
import { NotificationCrudStatusAndDataDto, NotificationDto, } from '../Notifications/Dtos/NotificationDto';
import NotificationComponent from '../Notifications/index';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationInfoContent from '../Notifications/notificationInfoContent';
import { NotificationTypeEnum } from '../Enums/NotificationTypeEnum';
import StoreComponent from '../Components/Stores/index';
import { getEnvironmentAndBaseUrl } from '../env';
import Index from '../Components/Device/index';
import LogoutComponent from '../Components/Login/logout';
import * as ScreenOrientation from 'expo-screen-orientation';
import { screenOrientationStore } from '../Helpers/Screen/screenStore';
import AdminBarcodeIndex from '../Components/Admin/Barcode';

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
    logout: undefined
    AdminBarcodeApproval:undefined
};
type NavigationProps = DrawerNavigationProp<DrawerParamList>;

export default function Navigator() {
    const Drawer = createDrawerNavigator<DrawerParamList>();
    const navigationCamera = useNavigation<NavigationProps>();
    const loginState = useSelector((state: RootState) => state.login)
    const barcodeState = useSelector((state: RootState) => state.barcode)
    const dispatch = useDispatch<AppDispatch>()
    const [visible, setvisible] = useState(true)
    const [visibleNotification, setVisibleNotification] = React.useState(false);
    const websocket = useSelector((state: RootState) => state.websocket)
    const Stack = createStackNavigator();
    const [loadingNotification, setLoadingNotification] = useState<boolean>(true)
    const [tempMessages, setTempMessages] = useState<NotificationDto[]>([])
    const screenOrientation = useSelector((state: RootState) => state.screenOrientationSlice)

    var isAdmin = false
    var isStoreAdmin = false

    if (loginState.roleDto.id) {            // Admin kontrolü
        if (loginState.roleDto.id === 1) {
            isAdmin = true
        }
        else if (loginState.roleDto.id === 2) {
            isStoreAdmin = true
        }
    }

    useEffect(() => {
        // İlk yüklemede yönü çek
        dispatch(screenOrientationStore());

        // Dinleyici ekle
        const subscription = ScreenOrientation.addOrientationChangeListener(() => {
            dispatch(screenOrientationStore());
        });

        // Temizleme
        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);

        };
    }, []);

    useEffect(() => {
        if (websocket.messages.length >= 0 && loginState.userDto.id == 1) {
            setLoadingNotification(false)
        }
        return () => {
            setLoadingNotification(true)
        }
    }, [websocket.messages])

    const Loading = () => {
        return <ActivityIndicator style={{ position: 'absolute', top: 12, left: 36, zIndex: 9999 }} animating={true} color={MD2Colors.red800} size={20} />
    }

    useEffect(() => {
        if (visibleNotification === false) {
            if (tempMessages.length > 0) {
                let updatedDatas = tempMessages.filter(x => x.updateStatus === true)
                if (updatedDatas.length > 0) {
                    let dto: NotificationCrudStatusAndDataDto = {
                        crudStatus: NotificationTypeEnum.UpdateNotifies,
                        notifications: updatedDatas
                    }
                    dispatch(sendMessage(JSON.stringify(dto)))
                }
            }
        }
        else {
            dispatch(sendMessage(NotificationTypeEnum.GetNotifies)).then(() => {
                setTempMessages(websocket.messages)
            })
        }
    }, [visibleNotification])

    function ForgottenPasswordStack() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginComponent}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="forgotPassword"
                    component={ForgotPasswordComponent}
                    // initialParams={{setVisibleEmail,visibleEmail}}
                    options={{
                        title: 'Login Ekranına Dön',
                        headerStyle: { backgroundColor: '#CDDCEC' }
                    }}
                />
            </Stack.Navigator>
        );
    }

    function LogoutStack() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="LogoutComponent"
                    component={LogoutComponent}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        );
    }

    function NavigationStack({ route }: any) {
        const { updatedNotify }: any = route.params || {}; // Bildirimlerin olduğu yerden  (index)
        const [dto, setDto] = useState<NotificationDto>(updatedNotify);
        useEffect(() => {
            if (updatedNotify) {
                setDto(updatedNotify);
            }
        }, [updatedNotify]);

        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="NotificationInfoContent"
                    options={{
                        title: 'Anasayfaya Dön',
                        headerStyle: { backgroundColor: '#CDDCEC' },
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigationCamera.goBack()}>
                                <Text style={{ marginHorizontal: 10, fontSize: 28 }}>⬅️</Text>
                            </TouchableOpacity>
                        ),
                    }}
                >
                    {props => <NotificationInfoContent {...props} dto={dto} />}
                </Stack.Screen>
                <Stack.Screen
                    name="ProfileComponent"
                    component={ProfileComponent}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        );
    }

    useEffect(() => {
        let handleWebsocket = async () => {
            if (loginState.userDto.id === 1) {
                // WebSocket bağlantısını başlat
                let { env, url } = await getEnvironmentAndBaseUrl()
                let baseUrl = url.replace("http://", "").replace("https://", "")  //   önünden http yada https varsa kaldır (192.168.1.203:5023)
                dispatch(connectWebSocket(`ws://${baseUrl}/ws`)).then(() => {     //   ws://192.168.1.203:5023/ws
                    dispatch(listenMessages()).then(() => {
                        dispatch(sendMessage(NotificationTypeEnum.GetNotifies))
                    });
                });
                return () => {
                    // Bağlantıyı kapat ve notification değerini temizle
                    dispatch(disconnectWebSocket());
                };
            }
        }
        handleWebsocket()
    }, [dispatch, loginState.userDto.id]);

    const openNotificationList = useCallback(() => { setVisibleNotification(true) }, [visibleNotification])
    const closeNotificationList = useCallback(async () => { setVisibleNotification(false) }, [visibleNotification])

    const headerRightMemo = useMemo(() => {
        return <View style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexWrap: 'wrap',
        }}>
            {isAdmin &&
                <View style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    <View style={{ width: '100%' }}>
                        {loadingNotification ? <Loading /> : <Badge style={{ position: 'absolute', top: 12, left: 36, zIndex: 9999 }}>{websocket.messages.filter(x => !x.readStatus).length}</Badge>}
                        <IconButton
                            icon={"cellphone-message"}    // Notification ikonu 
                            size={36}
                            mode='contained'
                            containerColor='white'
                            onPress={() => {
                                openNotificationList()
                            }}
                        />
                    </View>
                </View>}
            <View style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <IconButton
                    icon="qrcode-scan"
                    iconColor={barcodeState.barcodeReadEnum && barcodeState.barcodeReadEnum === BarcodeReadEnum.Entreance ? "red" : "green"}
                    size={36}
                    disabled={barcodeState.qrCodeVisibleState}
                    // style={{ marginRight: 10 }}
                    mode='contained'
                    containerColor='white'
                    onPress={() => {
                        navigationCamera.navigate('Barkod')
                        setvisible(false)
                    }}
                />
            </View>
        </View>
    }, [barcodeState, navigationCamera, websocket.messages, visibleNotification, loginState.userDto.id, loadingNotification])

    const Content = (props: any) => {
        const navigation = props.navigation as DrawerNavigationProp<DrawerParamList>;
        return <View style={{ flex: 1, width: '100%', }}>
            <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#dcdcdc', flexWrap: 'wrap',paddingTop:10 }}>
                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', width: '100%',height:'100%'}}>
                    <Image source={loginState.userDto.gender === GenderEnum.Man ? require('../assets/user_man_icon.png') : loginState.userDto.gender === GenderEnum.Woman ? require('../assets/user_woman_icon.png') : ""}
                        style={{
                            width: screenOrientation.isPortrait ? 150 : 90,
                            height: screenOrientation.isPortrait ? 150 : 90,
                            marginVertical: 10,
                            borderRadius: 80,
                        }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: 'black' }}>{`${loginState.userDto.firstName} ${loginState.userDto.lastName} `}</Text>
                </View>
            </View>
            <View style={{ flex: 7 }}>
                <DrawerContentScrollView>
                    <DrawerItem
                        label={"AnaSayfa"}
                        style={{ backgroundColor: '#D7EBD3', marginBottom: 10 }}
                        icon={() => <Avatar.Icon size={27} icon="home" />}
                        onPress={() => {
                            navigation.navigate('Home')
                        }}
                    >
                    </DrawerItem>
                    <DrawerItem
                        label={"Profilim"}
                        style={{ backgroundColor: '#D7EBD3', marginBottom: 10 }}
                        icon={() => <Avatar.Icon size={27} icon="card-account-details-outline" />}
                        onPress={() => navigation.navigate('Profile')}
                    >
                    </DrawerItem>
                    {isAdmin &&
                        <>
                            <DrawerItem
                                label={"Yetki Ekle"}
                                style={{ backgroundColor: '#D7EBD3', marginBottom: 10 }}
                                icon={() => <Avatar.Icon size={27} icon="account-supervisor-circle-outline" />}
                                onPress={() => navigation.navigate('Role')}
                            >
                            </DrawerItem>

                            <DrawerItem
                                label={"Kurum İşlemleri"}
                                style={{ backgroundColor: '#D7EBD3', marginBottom: 10 }}
                                icon={() => <Avatar.Icon size={27} icon="store-marker" />}
                                onPress={() => navigation.navigate('Location')}
                            >
                            </DrawerItem>
                        </>
                    }
                    {(isAdmin || isStoreAdmin) &&
                        <>
                            <DrawerItem
                                label={"Kullanıcı İşlemleri"}
                                style={{ backgroundColor: '#D7EBD3', marginBottom: 10 }}
                                icon={() => <Avatar.Icon size={27} icon="account-plus" />}
                                onPress={() => navigation.navigate('User')}
                            >
                            </DrawerItem>
                            <DrawerItem
                                label={"Cihaz İşlemleri"}
                                style={{ backgroundColor: '#D7EBD3', marginBottom: 10 }}
                                icon={() => <Avatar.Icon size={27} icon="devices" />}
                                onPress={() => navigation.navigate('Device')}
                            >
                            </DrawerItem>

                            <DrawerItem
                                label={"Giriş Çıkış İşlemleri"}
                                style={{ backgroundColor: '#D7EBD3', marginBottom: 10 }}
                                icon={() => <Avatar.Icon size={27} icon="devices" />}
                                onPress={() => navigation.navigate('AdminBarcodeApproval')}
                            >
                            </DrawerItem>
                        </>
                    }
                    {loginState.isLoggedIn &&
                        <DrawerItem
                            label={"Çıkış"}
                            style={{ backgroundColor: '#D7EBD3', marginBottom: 10, }}
                            icon={() => <Avatar.Icon size={27} icon="account-remove" />}
                            // onPress={async () => { await exitFromApp(navigation) }}
                            onPress={async () => { navigation.navigate('logout') }}

                        >
                        </DrawerItem>
                    }
                </DrawerContentScrollView>
            </View>
        </View>
    }
    return (<View style={{ flex: 1 }}>
        <Drawer.Navigator initialRouteName='login'
            drawerContent={(props) => loginState.isLoggedIn && <Content {...props} />}
            screenOptions={{
                headerShown: loginState.isLoggedIn,                                        // Drawer içindeki itemların Görünürlük Durumu
                headerRight: () => headerRightMemo,
                swipeEnabled: loginState.isLoggedIn,
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeComponent}
                options={{ drawerStyle: { width: 250, }, title: 'Anasayfa' }}
            />
            <Drawer.Screen
                name="Profile"
                component={ProfileComponent}
                options={{ drawerStyle: { width: 250 }, title: 'Profilim' }}
            />
            <Drawer.Screen
                name="login"
                component={ForgottenPasswordStack}
                options={{ drawerStyle: { width: 250 } }}
            />
            <Drawer.Screen
                name="Barkod"
                component={BarcodeComponent}
                options={{
                    drawerStyle: { width: 250 },
                    headerShown: visible
                }}
            />
            <Drawer.Screen
                name="Role"
                component={RoleComponent}
                options={{
                    drawerStyle: { width: 250 },
                    headerShown: true,
                    title: 'Yetki İşlemleri'
                }}
            />
            <Drawer.Screen
                name="User"
                component={UserComponent}
                options={{
                    drawerStyle: { width: 250 },
                    headerShown: screenOrientation.isPortrait,
                    title: "Kullanıcı İşlemleri"
                }}
            />
            <Drawer.Screen
                name="NavigationStack"
                component={NavigationStack}
                options={{
                    drawerStyle: { width: 250 },
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="Location"
                component={StoreComponent}
                options={{
                    drawerStyle: { width: 250 },
                    headerShown: true,
                    title: 'Kurum İşlemleri'
                }}
            />
            <Drawer.Screen
                name="Device"
                component={Index}
                options={{
                    drawerStyle: { width: 250 },
                    headerShown: screenOrientation.isPortrait,
                    title: 'Cihaz İşlemleri'
                }}
            />
              <Drawer.Screen
                name="AdminBarcodeApproval"
                component={AdminBarcodeIndex}
                options={{
                    drawerStyle: { width: 250 },
                    headerShown: screenOrientation.isPortrait,
                    title:"Giriş Çıkış İşlemleri"
                }}
            />
            <Drawer.Screen
                name="logout"
                component={LogoutStack}
                options={{
                    drawerStyle: { width: 250 },
                    headerShown: false
                }}
            />
        </Drawer.Navigator>
        {visibleNotification && <NotificationComponent closeNotificationList={closeNotificationList} visibleNotification={visibleNotification} tempMessages={tempMessages} setTempMessages={setTempMessages} />}
    </View>
    )
}




