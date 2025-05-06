import React, { useCallback, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { Avatar, Button, Card, Checkbox, Divider, IconButton, List, Searchbar, TextInput, Tooltip } from 'react-native-paper'
import { GetUserDto } from './Dtos/userDto';
import { CheckDto } from '../AddRole/Dtos/roleDto';
import { ResponseStatus } from '../../../ServiceResults/serviceResult';
import { DeleteUsers, GetUsers } from './Requests/userStore';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

export default function DeleteUserComponent() {
    const [searchUserValue, setSearchUserValue] = useState("");
    const [searchUsers, setSearchUsers] = useState<GetUserDto[]>([])
    const [users, setUsers] = useState<GetUserDto[]>([])
    const [checkedsUser, setCheckedsUser] = useState<CheckDto[]>([])

    const DeleteRoleLeftContent = (props: any) => <Avatar.Icon {...props} color='red' icon="account" />

    useFocusEffect(
        useCallback(
            () => {
                const getUsers = async () => {
                    let temp = true
                    if (temp) {
                        const responseUsers = await GetUsers()
                        if (responseUsers?.responseStatus === ResponseStatus.IsSuccess) {
                            setUsers(responseUsers?.results)
                            setSearchUsers(responseUsers?.results)
                            setCheckedsUser([])
                        }
                    }
                    return () => {
                        temp = false
                    }
                }
                getUsers();
            },
            [],
        )
    )

    const handleSearch = async () => {
        let searchValues = users.filter(x => x.firstName.toLowerCase().trim().includes(searchUserValue.toLowerCase().trim()) || x.lastName.toLowerCase().trim().includes(searchUserValue.toLowerCase().trim()))
        setSearchUsers(searchValues)
    }

    const handleClear = async () => {
        setSearchUsers(users)
    }

    return (
        <Card elevation={5} style={{ flex: 1, margin: 10, }}>
            <Card.Title subtitleStyle={{ opacity: 0.5 }} titleStyle={{ fontWeight: 'bold' }} title="KULLANICIYI SİL" subtitle="Silinmesini istediğiniz kullanıcıyı seçin" left={DeleteRoleLeftContent} />
            <Divider />
            <FlatList
                ListHeaderComponent={
                    <Searchbar
                        placeholder="Kullanıcı Ara..."
                        placeholderTextColor={"gray"}
                        onChangeText={setSearchUserValue}
                        value={searchUserValue}
                        onIconPress={async () => { await handleSearch() }}
                        onClearIconPress={async () => { await handleClear() }}
                        style={{ margin: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#ACC8E5', marginTop: 10 }}
                        showDivider
                    />
                }
                data={searchUsers}
                renderItem={({ item, index }) => <UserItem key={item.id.toString()} userDto={item} setCheckedsUser={setCheckedsUser} checkedsUser={checkedsUser} />}
                keyExtractor={item => item.id.toString()}
            />
            <Card.Actions style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "#E0E2E4", borderRadius: 10 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity>
                        <Button buttonColor='red' mode='contained'
                            disabled={checkedsUser.length === 0}
                            onPress={async () => {
                                let filteredRoles = users.filter(x => checkedsUser.some(i => i.id == x.id))
                                const response = await DeleteUsers(filteredRoles)
                                if (response?.responseStatus === ResponseStatus.IsSuccess) {
                                    Toast.show({
                                        text1: response?.responseMessage,
                                        type: 'success'
                                    })
                                }
                                else if (response?.responseStatus === ResponseStatus.IsWarning) {
                                    Toast.show({
                                        text1: "Silme işleminde hata oluştu",
                                        text2: response?.responseMessage,
                                        type: 'info'
                                    })
                                }
                                else {
                                    Toast.show({
                                        text1: "Silme işleminde hata oluştu",
                                        text2: response?.responseMessage,
                                        type: 'error'
                                    })
                                }
                                let responseUsers = await GetUsers()
                                if (responseUsers?.responseStatus === ResponseStatus.IsSuccess) {
                                    setSearchUsers(responseUsers.results)
                                    setUsers(responseUsers.results)
                                    setCheckedsUser([])
                                }
                                else {
                                    Toast.show({
                                        text1: "Personel listelemesi hatası",
                                        text2: "Güncel personeller için ekranlar arasında geçiş yapın",
                                        type: 'error'
                                    })
                                }
                            }}>{checkedsUser.length < 2 ? "Sil" : "Seçilenleri Sil"}</Button>
                    </TouchableOpacity>
                </View>
            </Card.Actions>
        </Card>
    )
}
type UserItemProps = { userDto: GetUserDto, setCheckedsUser: React.Dispatch<React.SetStateAction<CheckDto[]>>, checkedsUser: CheckDto[] };

const UserItem: React.FC<UserItemProps> = ({ userDto, setCheckedsUser, checkedsUser }) => (
    <View style={{ minWidth: '100%', justifyContent: 'center', height: 45 }}>
        <List.Item
            title={`${userDto.firstName} ${userDto.lastName}`}
            key={userDto.id}
            titleStyle={{ justifyContent: 'center' }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} // Yüksekliği azaltmak için
            right={() => (
                <Tooltip
                    enterTouchDelay={10}
                    leaveTouchDelay={2000}
                    title={userDto.isHaveBarcode ? "Kullanıcının sistemde barkodu mevcut" : userDto.isActive ?
                        "Kullanıcı aktif, silmek için pasif hale getirin." :
                        "Kullanıcı sistemde yok, silinebilir"}>
                    <IconButton
                        icon="information-outline"
                        selected
                        iconColor={userDto.isHaveBarcode ? "#F5C04F" : userDto.isActive ? 'red' : 'green'}
                        size={24}
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                    />
                </Tooltip>
            )}
            left={() => {
                return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Checkbox
                        status={checkedsUser.find(x => x.id == userDto.id)?.checkStatus ? 'checked' : 'unchecked'}
                        color={userDto.isHaveBarcode ? "#F5C04F" : userDto.isActive ? 'red' : 'green'}
                        uncheckedColor={userDto.isHaveBarcode ? "#F5C04F" : userDto.isActive ? 'red' : 'green'}
                        disabled={userDto.isActive ?? false}
                        onPress={() => {
                            let chedkedStatus = checkedsUser.some(x => x.id == userDto.id)
                            if (!chedkedStatus) {
                                setCheckedsUser([...checkedsUser, { id: userDto.id, checkStatus: true }])
                            }
                            else {
                                const filteredChecked = checkedsUser.filter(x => x.id != userDto.id)
                                setCheckedsUser(filteredChecked)
                            }
                        }}
                    />
                </View>
            }
            }
        />
        <Divider />
    </View>

);
