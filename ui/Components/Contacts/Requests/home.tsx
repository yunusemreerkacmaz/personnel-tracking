import { useCallback, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Avatar, Card, Divider, IconButton, List, Searchbar } from "react-native-paper";
import React from "react";
import { GetUserDto } from "../../Admin/AddUser/Dtos/userDto";
import { GetUsers } from "../../Admin/AddUser/Requests/userStore";
import { ResponseStatus } from "../../../ServiceResults/serviceResult";
import UserInfoModal from "../userInfo";

export default function HomeScreen({
    renderItem,
}: {
    renderItem: (selectedUserItem: GetUserDto) => React.ReactNode
}) {
    const [searchUser, setSearchUser] = useState<GetUserDto[]>([])
    const [searchUserValue, setSearchUserValue] = useState("");
    const [users, setUsers] = useState<GetUserDto[]>([])

    useFocusEffect(
        useCallback(
            () => {
                const getUsers = async () => {
                    let temp = true
                    if (temp) {
                        const responseUsers = await GetUsers()
                        if (responseUsers?.responseStatus === ResponseStatus.IsSuccess) {
                            setUsers(responseUsers?.results)
                            setSearchUser(responseUsers?.results)
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
        setSearchUser(searchValues)
    }
    const handleClear = async () => { setSearchUser(users) }
    const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} color='#5a189a' icon="account" />

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                users.length>0 ? 
                 <Card elevation={5} style={{ flex: 1, marginTop: 10, margin: 10, }}>
                <Card.Title subtitleStyle={{ opacity: 0.5 }} titleStyle={{ fontWeight: 'bold' }} title="İLETİŞİM BİLGİLERİ" subtitle="İletişime geçmek için kullanıcıyı seç" left={UpdateUserLeftContent} />
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
                                style={{ margin: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#ACC8E5' }}
                                showDivider
                            />
                        }
                        data={searchUser ?? users}
                        style={{ width: '100%' }}
                        renderItem={({ item, index }) => <UserItem key={index} selectedUserItem={item} renderItem={renderItem} />}
                        keyExtractor={item => item.id.toString()}
                    /> 
                
            </Card>:
            <Text>Gösterilecek Veri Yok</Text>
            }
           
        </View>
    );
}

type UserItemProps = { selectedUserItem: GetUserDto, renderItem: any };

const UserItem: React.FC<UserItemProps> = React.memo(({ selectedUserItem, renderItem }) => {                // Kişi listesi
    const [visible, setVisible] = useState<boolean>(false)
    const handleOpenModal = () => setVisible(true)
    const handleCloseModal = () => setVisible(false)

    return <>
        <View style={{ minWidth: '100%', justifyContent: 'center', height: 45 }}>
            <List.Item
                title={`${selectedUserItem.firstName} ${selectedUserItem.lastName}`}
                key={selectedUserItem.id}
                titleStyle={{ justifyContent: 'center' }}
                style={{ flex: 1, justifyContent: 'center' }} // Yüksekliği azaltmak için
                right={() => (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {renderItem(selectedUserItem)}
                        <IconButton
                            icon="information"
                            selected
                            iconColor={"#fb8500"}
                            size={24}
                            onPress={() => {
                                handleOpenModal()
                            }} />
                    </View>
                )}
            />
            <Divider style={{ backgroundColor: '#34a0a4' }} />
            {visible && <UserInfoModal selectedUserItem={selectedUserItem} visible={visible} handleCloseModal={handleCloseModal} />}
        </View>
    </>
});