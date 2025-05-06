import React, { useCallback, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { Button, Card, List, Searchbar } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { ToastShowParamsCustomType } from '../../../Helpers/Toast/ToastDto'
import { UserBarcodeLoginDto } from './Dtos/userBarcodeLogin'
import { GetBarcodeUserLoginService, UpdateBarcodeUser } from './Requests/AdminBarcodeStore'
import { ResponseStatus } from '../../../ServiceResults/serviceResult'
import { useFocusEffect } from '@react-navigation/native'

export default function UserLoginComponent() {
    const [users, setUsers] = useState<UserBarcodeLoginDto[]>([])
    const [searchUsers, setSearchUsers] = useState<UserBarcodeLoginDto[]>([])
    const [search, setSearch] = React.useState('');
    const [crudStatus, setCrudStatus] = useState<boolean>(false)

    useFocusEffect(
        useCallback(
            () => {
                const userBarcodeLoginAsync = async () => {
                    let getBarcodeUsers = await GetBarcodeUserLoginService()
                    if (getBarcodeUsers?.responseStatus === ResponseStatus.IsSuccess) {
                        setUsers(getBarcodeUsers.results)
                        setSearchUsers(getBarcodeUsers.results)
                    }
                    else if (getBarcodeUsers?.responseStatus === ResponseStatus.IsWarning) {
                        Toast.show({ text1: "Kullanıcı Girişi", text2: getBarcodeUsers?.responseMessage, type: 'info' })
                        setUsers([])
                        setSearchUsers([])
                    }
                    else {
                        Toast.show({ text1: "Kullanıcı Girişi", text2: getBarcodeUsers?.responseMessage })
                        setUsers([])
                        setSearchUsers([])
                    }
                }
                userBarcodeLoginAsync()
            },
            [crudStatus],
        )
    )

    const handleSearch = () => {
        let filteredUsers = users.filter(user =>
            user.userDto.firstName.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
            user.userDto.lastName.toLowerCase().trim().includes(search.toLowerCase().trim()))
        setSearchUsers(filteredUsers)
    }
    const handleClearSearch = () => { setSearchUsers(users) }

    return (
            <Card style={{ flex:1, elevation: 24, backgroundColor: '#E7C5BC',padding:15 }}>
                <Card.Title subtitleStyle={{ color: 'gray' }} titleStyle={{ fontWeight: 'bold', color: 'black' }} title="KULLANICI GİRİŞİ ONAYLAMA ALANI" subtitle="Girişinin onaylanmasını istediğiniz kişiyi seçin" />
                    {
                        searchUsers?.length === 0 ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Gösterilecek Veri yok</Text>
                            </View> :
                            <FlatList
                                ListHeaderComponent={
                                    <Searchbar
                                        placeholder="Cihaz adı ara . . ."
                                        onChangeText={setSearch}
                                        value={search}
                                        style={{ marginVertical: 10, }}
                                        onIconPress={handleSearch}
                                        onClearIconPress={handleClearSearch}
                                    />
                                }
                                data={searchUsers}
                                style={{ paddingVertical: 2,backgroundColor: '#C5D6E9', padding: 10,borderRadius:10  }}
                                renderItem={({ item, index }) => <UserLoginItem userDto={item} index={index + 1} setCrudStatus={setCrudStatus} crudStatus={crudStatus}  key={item.userDto.id}/>}
                                keyExtractor={item => item.userDto.id.toString()}
                            />
                    }
            </Card>
    )
}
type UserBarcodeLoginProps = { userDto: UserBarcodeLoginDto, index: number, crudStatus: boolean, setCrudStatus: React.Dispatch<React.SetStateAction<boolean>> }
const UserLoginItem: React.FC<UserBarcodeLoginProps> = ({ userDto, index, crudStatus, setCrudStatus }) => {
    const handleUpdate = async (value: boolean) => {
        Toast.show({
            text1: "Kullanıcı Giriş İşlemleri Onaylama Ekranı",
            text2: "Kullanıcının giriş yapmasını istediğinizden emin misiniz ?",
            text1Style: { backgroundColor: 'yellow'},
            type: 'customToast',
            autoHide: false,  // ekranda duruyor
            props: {
                okButtonText: "Onayla",
                cancelButtonText: "İptal Et",
                onCancelPress: () => {
                    Toast.hide()
                    Toast.show({ text1: "Giriş işlemi iptal edildi", type: 'error' })
                },
                onOkPress: async () => {
                    userDto = { ...userDto, isApproval: value }
                    const responseUpdateBarcodeUser = await UpdateBarcodeUser(userDto)
                    if (responseUpdateBarcodeUser?.responseStatus === ResponseStatus.IsSuccess) {
                        Toast.show({ text1: "Giriş Onayı", text2: responseUpdateBarcodeUser?.responseMessage })
                        setCrudStatus(!crudStatus)
                    }
                    else {
                        Toast.show({ text1: "Giriş Onayı", text2: responseUpdateBarcodeUser?.responseMessage, type: "error" })
                    }
                },
            }
        } as ToastShowParamsCustomType)
    }

    return <List.Item
        title={`${userDto.userDto.firstName} ${userDto.userDto.lastName}`}
        key={index}
        titleStyle={{ fontSize: 14, width: "100%", }}
        style={{ paddingRight: 0, paddingVertical: 1 }} // Yüksekliği azaltmak için
        right={(id) => (
            <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
                <Button
                    mode="text"
                    textColor='white'
                    style={{ height: 40 }}
                    buttonColor={"green"}
                    onPress={() => { handleUpdate(true) }} // giriş işleminde true gönderildi çıkış işleminde false gönderildi
                >
                    Giriş Yap
                </Button>
            </View>
        )}
    />
}
