import React from 'react'
import { Avatar, Card, Chip, Divider, IconButton } from 'react-native-paper'
import { GetUserDto } from '../Admin/AddUser/Dtos/userDto'
import { Modal, ScrollView, View } from 'react-native'

type IProps = {
    selectedUserItem: GetUserDto,
    handleCloseModal: () => void,
    visible: boolean,
}

export default function UserInfoModal(props: IProps) {
    const { handleCloseModal, selectedUserItem, visible } = props
    const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} style={{marginTop:20}} color='#5a189a' icon="account" />
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleCloseModal}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    margin: 10,
                    borderRadius: 10,
                }}
                >
                    <ScrollView>
                        <Card elevation={5} style={{ flex: 1 }}>
                            <Card.Title subtitleStyle={{ opacity: 0.5, color: "#fe7f2d",fontFamily: 'fantasy',fontWeight:'bold' }} titleStyle={{ fontWeight: 'bold', color: "#9d4edd",marginTop:20 }} title="KULLANICI BİLGİLERİ" subtitle={`${selectedUserItem.firstName} ${selectedUserItem.lastName} `} left={UpdateUserLeftContent} right={() => {
                                return <View style={{ alignItems: 'flex-end' }}>
                                    <IconButton
                                        icon="close"
                                        selected
                                        iconColor={'red'}
                                        style={{ marginHorizontal: 10, position: 'static' }}
                                        size={30}
                                        onPress={() => {
                                            handleCloseModal()
                                            // setSelectedUser(selectedUserItem)
                                        }} />
                                </View>
                            }} />
                            <Divider />
                            <Card.Content style={{ flex: 1, minWidth: '100%' }}>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Kullanıc Id</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'> {selectedUserItem.id} </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Kullanıcı Adı</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'>{selectedUserItem.userName}</Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Adı</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'>{selectedUserItem.firstName}</Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Soyadı</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'> {selectedUserItem.lastName} </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Yetkisi</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'> {selectedUserItem.roleDto.roleName} </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Telefon</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'> {selectedUserItem.phoneNumber} </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Email</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'> {selectedUserItem.email} </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Cinsiyet</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'> {selectedUserItem.gender} </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                                    <Chip style={{ width: '35%' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12 }} mode='flat'>Aktiflik</Chip>
                                    <Chip style={{ width: '60%' }} mode='flat'> {selectedUserItem.isActive ? "Aktif" : "Pasif"} </Chip>
                                </View>
                            </Card.Content>
                        </Card>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}
