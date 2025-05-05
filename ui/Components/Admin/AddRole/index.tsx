import React, { useCallback, useState } from 'react'
import { TouchableOpacity, View, FlatList } from 'react-native';
import { Button, Card, TextInput, Avatar, List, MD3Colors, IconButton, Checkbox, Tooltip } from 'react-native-paper';
import { AddRole, DeleteRole, GetRoles } from './Requests/roleStore';
import { initialRoleDto, CheckDto, RoleDto } from './Dtos/roleDto';
import { ResponseStatus } from '../../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

export default function RoleComponent() {
    const [role, setRole] = useState<RoleDto>(initialRoleDto);
    const [formHelperText, setFormHelperText] = useState<boolean>(false)
    const [visible, setVisible] = useState(false);
    const [checkeds, setCheckeds] = useState<CheckDto[]>([])
    const [roles, setRoles] = useState<RoleDto[]>([])
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState<RoleDto[]>([])

    const AddRoleLeftContent = (props: any) => <Avatar.Icon {...props} color='green' icon="account" />
    const DeleteRoleLeftContent = (props: any) => <Avatar.Icon {...props} color='red' icon="account" />

    const addRole = async (roleDto: RoleDto) => {
        const response = await AddRole(roleDto);
        if (response?.responseStatus === ResponseStatus.IsSuccess) {
            setRoles(response.results)
            setSearch(response.results)
            setRole(initialRoleDto)
            Toast.show({
                text1: response.responseMessage,
                type: 'success'
            })
        }
        else if (response?.responseStatus === ResponseStatus.IsWarning) {
            Toast.show({
                text1: response.responseMessage,
                type: 'info'
            })
        }
        else {
            Toast.show({
                text1: response?.responseMessage,
                type: 'error'
            })
        }
    }

    useFocusEffect(
        useCallback(
            () => {
                let temp = true
                const getRoles = async () => {
                    if (temp) {
                        const responseRoles = await GetRoles()
                        if (responseRoles?.responseStatus === ResponseStatus.IsSuccess) {
                            setRoles(responseRoles?.results)
                            setSearch(responseRoles?.results)
                            setCheckeds([])
                        }
                    }
                }
                getRoles();
                return () => {
                    temp = false
                    setVisible(false)
                }
            },
            [],
        )
    )

    type ItemProps = { role: RoleDto };
    const Item: React.FC<ItemProps> = ({ role }) => (
        <List.Item
            title={role.roleName}
            key={role.id}
            titleStyle={{ paddingBottom: 15 }}
            style={{ paddingVertical: 1 }} // Yüksekliği azaltmak için
            right={() => (
                <Tooltip
                    titleMaxFontSizeMultiplier={5}
                    enterTouchDelay={10}
                    leaveTouchDelay={2000}
                    title={role.isActive ?
                        "Yetki aktif olarak kullanıldığından silemezsiniz" :
                        "Yeki kullanılmadığından silinebilir"}
                >
                    <IconButton
                        icon="information-outline"
                        selected
                        iconColor={role.isActive ? 'red' : 'green'}
                        size={24}
                        onPress={() => {
                        }} />
                </Tooltip>
            )}
            left={() =>
                <Checkbox
                    status={checkeds.find(x => x.id == role.id)?.checkStatus ? 'checked' : 'unchecked'}
                    color={role.isActive ? 'red' : 'green'}
                    uncheckedColor='green'
                    disabled={role.isActive ?? false}
                    onPress={() => {
                        let chedkedStatus = checkeds.some(x => x.id == role.id)
                        if (!chedkedStatus) {
                            setCheckeds([...checkeds, { id: role.id, checkStatus: true }])
                        }
                        else {
                            const filteredChecked = checkeds.filter(x => x.id != role.id)
                            setCheckeds(filteredChecked)
                        }
                    }}
                />}
        />
    );

    return <View style={{ flex: 1 }}>
        <Card elevation={5} style={{ marginTop: 20, marginHorizontal: 10 }}>
            <Card.Title subtitleStyle={{ opacity: 0.5 }} titleStyle={{ fontWeight: 'bold' }} title="KULLANICI YETKİSİ EKLE" subtitle="Kullanıcı Yetki Bilgilerini Girin" left={AddRoleLeftContent} />
            <Card.Content style={{}}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        onBlur={() => { role.roleName && setFormHelperText(true) }}
                        onFocus={() => { setFormHelperText(false) }}
                        mode='outlined'
                        onChangeText={text => { setRole({ ...role, roleName: text }) }}
                        value={role.roleName}
                        label="Yetki Ekle"
                        style={{ width: '75%', height: 40 }}
                        error={formHelperText}
                    />
                </View>
            </Card.Content>
            <Card.Actions style={{ alignSelf: 'center' }}>
                <TouchableOpacity>
                    <Button
                        buttonColor='green'
                        mode='contained'
                        disabled={role.roleName == ""}
                        onPress={async () => {
                            await addRole(role)

                        }}
                    >Ekle</Button>
                </TouchableOpacity>
            </Card.Actions>
        </Card>
        <Card elevation={5} style={{ marginTop: 20, marginHorizontal: 10 }}>
            <Card.Title subtitleStyle={{ opacity: 0.5 }} titleStyle={{ fontWeight: 'bold' }} title="KULLANICI YETKİSİNİ SİL" subtitle="Silinmesini istediğiniz yetkiyi seçin" left={DeleteRoleLeftContent} />
            <Card.Content style={{ justifyContent: 'center', alignItems: 'center' }}>
                <List.Section >
                    <>
                        <List.Item
                            title="Yetki Seç"
                            style={{ backgroundColor: 'white', width: 'auto', minWidth: 300, paddingVertical: 2 }}
                            right={() => <List.Icon color={MD3Colors.tertiary70} icon="chevron-down" />}
                            onPress={() => {
                                setVisible(!visible)
                            }}
                        />
                        {visible &&
                            <View style={{ backgroundColor: '#DFDFDF', maxHeight: 350 }}>
                                <List.Item style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} title="" left={() =>
                                    <TextInput
                                        value={inputValue}
                                        placeholder='Ara'
                                        style={{ minWidth: '100%', height: 40,marginLeft:10  }}
                                        onChange={(event) => {
                                            event.persist();
                                            setInputValue(event.nativeEvent.text)
                                            if (event.nativeEvent.text != "") {
                                                setSearch(roles.filter(x => x.roleName.trim().toLowerCase().includes(inputValue.trim().toLowerCase())))
                                            }
                                            else {
                                                setSearch(roles)
                                            }
                                        }}
                                    />
                                }
                                />
                               {search.length>0 &&
                                <FlatList
                                    data={search}
                                    style={{ paddingVertical: 2 }}
                                    renderItem={({ item }) => <Item role={item} />}
                                    keyExtractor={item => item.id.toString()}
                                />}
                            </View>
                        }
                    </>
                </List.Section>
            </Card.Content>
            <Card.Actions style={{ alignSelf: 'center' }}>
                <TouchableOpacity>
                    <Button buttonColor='red' mode='contained'
                        disabled={checkeds.length === 0}
                        onPress={async () => {
                            let filteredRoles = roles.filter(x => checkeds.some(i => i.id == x.id))
                            const response = await DeleteRole(filteredRoles)
                            if (response?.responseStatus === ResponseStatus.IsSuccess) {
                                setRoles(response.results)
                                setSearch(response.results)
                                setCheckeds([])
                                Toast.show({
                                    text1: response?.responseMessage,
                                    type: 'success'
                                })
                            }
                            else {
                                let undeletedRoles = ""
                                response?.results.map(x => {
                                    undeletedRoles += x.roleName + " - "
                                })
                                Toast.show({
                                    text1: response?.responseMessage,
                                    text2: undeletedRoles,
                                    type: 'error'
                                })
                            }
                        }}>Sil</Button>
                </TouchableOpacity>
            </Card.Actions>
        </Card>
    </View >
}
