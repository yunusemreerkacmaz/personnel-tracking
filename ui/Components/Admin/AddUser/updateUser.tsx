import React, { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Avatar, Button, Card, Divider, HelperText, IconButton, List, MD3Colors, RadioButton, Searchbar, TextInput, Switch, Chip } from 'react-native-paper';
import { GetUserDto, HelperTextDto, initialHelperTextDto } from './Dtos/userDto';
import { ResponseStatus } from '../../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { GenderEnum } from '../../../Enums/GenderEnum';
import { useFocusEffect } from '@react-navigation/native';
import { initialRoleDto, RoleDto } from '../AddRole/Dtos/roleDto';
import { GetUsers, UpdateUser } from './Requests/userStore';
import { GetRoles } from '../AddRole/Requests/roleStore';
import { GetStores } from '../../Stores/Requests/storeRequest';
import { initialFilterDto, initialStoreDto, StoreDto, StoreFilterDto, } from '../../Stores/Dtos/storeDto';
import TimePickerRangeModal from '../../Stores/timePickerRangeModal';
import { HelperTextTimeDto, initialHelperTextTimeDto, TimeDto } from '../../../Helpers/DataGrid/CrudTimeDto';
import { ToastShowParamsCustomType } from '../../../Helpers/Toast/ToastDto';

export default function UpdateUserComponent() {
    const [searchUserValue, setSearchUserValue] = useState("");
    const [searchUser, setSearchUser] = useState<GetUserDto[]>([])
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

    const handleClear = async () => {
        setSearchUser(users)
    }
    
    const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} color='yellow' icon="account" />

    return (
        <Card elevation={5} style={{ minWidth: '95%', marginTop: 20, marginHorizontal: 10, height: '90%' }}>
            <Card.Title subtitleStyle={{ opacity: 0.5 }} titleStyle={{ fontWeight: 'bold' }} title="KULLANICIYI GÜNCELLE" subtitle="Güncellenmesini istediğiniz kullanıcıyı arayın" left={UpdateUserLeftContent} />
            <Divider />
            <Card.Content style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, flex: 1 }}>
                <Searchbar
                    placeholder="Kullanıcı Ara..."
                    placeholderTextColor={"gray"}
                    onChangeText={setSearchUserValue}
                    value={searchUserValue}
                    onIconPress={async () => { await handleSearch() }}
                    onClearIconPress={async () => { await handleClear() }}
                    style={{ marginBottom: 10, width: '95%', justifyContent: 'center', borderWidth: 1, borderColor: '#ACC8E5' }}
                    showDivider
                />
                <FlatList
                    data={searchUser ?? users}
                    renderItem={({ item, index }) => <UserItem key={index} selectedUserItem={item} />}
                    keyExtractor={item => item.id.toString()}
                />

            </Card.Content>
        </Card>
    )
}

type UserItemProps = { selectedUserItem: GetUserDto };

const UserItem: React.FC<UserItemProps> = React.memo(({ selectedUserItem }) => {                // Kişi listesi
    const [visible, setVisible] = useState<boolean>(false)
    const handleOpenModal = () => setVisible(true)
    const handleCloseModal = () => setVisible(false)
    const [selectedUser, setSelectedUser] = useState<GetUserDto>(selectedUserItem)
    return <>
        <View style={{ minWidth: '100%', justifyContent: 'center', height: 45 }}>
            <List.Item
                title={`${selectedUserItem.firstName} ${selectedUserItem.lastName}`}
                key={selectedUserItem.id}
                titleStyle={{ justifyContent: 'center' }}
                style={{ flex: 1, justifyContent: 'center' }} // Yüksekliği azaltmak için
                right={() => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <IconButton
                            icon="account-edit"
                            selected
                            iconColor={selectedUserItem.isActive ? 'green' : 'red'}
                            size={24}
                            onPress={handleOpenModal} />
                    </View>
                )}
            />
            <Divider />
        </View>
        {visible && selectedUserItem.id > 0 && <UpdateUserModal handleCloseModal={handleCloseModal} visible={visible} selectedUser={selectedUser} setSelectedUser={setSelectedUser} selectedUserItem={selectedUserItem} />}
    </>
});

type UpdateUserModalProps = {
    handleCloseModal: () => void,
    visible: boolean,
    selectedUser: GetUserDto
    setSelectedUser: React.Dispatch<React.SetStateAction<GetUserDto>>
    selectedUserItem: GetUserDto
};

const UpdateUserModal: React.FC<UpdateUserModalProps> = React.memo(({ handleCloseModal, visible, selectedUser, setSelectedUser, selectedUserItem }) => {
    const [searchRoles, setSearchRoles] = useState<RoleDto[]>([])
    const [formHelperText, setFormHelperText] = useState<HelperTextDto>(initialHelperTextDto)
    const [helperTextTimeDto, setHelperTextTimeDto] = useState<HelperTextTimeDto>(initialHelperTextTimeDto)
    const [searchRoleValue, setSearchRoleValue] = useState("");
    const [roles, setRoles] = useState<RoleDto[]>([])
    const [stores, setStores] = useState<StoreDto[]>([])
    const [searchStores, setSearchStores] = useState<StoreDto[]>([])
    const [filter, setfilter] = useState<StoreFilterDto>(initialFilterDto)
    const [userExpandListAction, setuserExpandListAction] = useState<boolean>(false)
    const [storeExpandListAction, setStoreExpandListAction] = useState<boolean>(false)
    const [isActive, setIsActive] = React.useState(selectedUser.isActive);
    const [infoMessage, setInfoMessage] = useState<boolean>(false)
    const [shiftTime, setShiftTime] = useState<TimeDto>(selectedUser.shiftTime)
    const [reset, setReset] = useState<boolean>(false)

    var isAdmin = false
    var isStoreAdmin = false

    if (selectedUser.roleDto.id === 1) {
        isAdmin = true
    }
    if (selectedUser.roleDto.id === 2) {
        isStoreAdmin = true
    }

    const handleUserExpand = () => setuserExpandListAction(!userExpandListAction)
    const handleStoreExpand = () => setStoreExpandListAction(!storeExpandListAction)
    const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} color='yellow' icon="account" />

    const handleUpdateButtonDisabled = () => {
        if (selectedUser.firstName === "" ||
            selectedUser.lastName === "" ||
            selectedUser.userName === "" ||
            selectedUser.password === "" ||
            selectedUser.roleDto === initialRoleDto ||
            selectedUser.storeDto === initialStoreDto ||
            (selectedUserItem.shiftTime.startDate === shiftTime.startDate &&
                selectedUserItem.shiftTime.endDate === shiftTime.endDate &&
                selectedUserItem.firstName === selectedUser.firstName &&
                selectedUserItem.lastName === selectedUser.lastName &&
                selectedUserItem.userName === selectedUser.userName &&
                selectedUserItem.password === selectedUser.password &&
                selectedUserItem.storeDto.id === selectedUser.storeDto.id &&
                selectedUserItem.email === selectedUser.email &&
                selectedUserItem.phoneNumber === selectedUser.phoneNumber &&
                selectedUserItem.roleDto.id == selectedUser.roleDto.id &&
                selectedUserItem.isActive === selectedUser.isActive &&
                selectedUserItem.gender === selectedUser.gender
            )) {
            return true
        }
        else {
            return false
        }
    }

    if (infoMessage) {
        setTimeout(() => {
            setInfoMessage(false)
        }, 3000);
    }

    const onToggleSwitch = () => {
        setIsActive(!isActive);
        setSelectedUser(prev => ({ ...prev, isActive: !isActive }))
    };

    if (formHelperText.storeDto) {  // Cisniyet bilgileri Kurum seç içinde olduğunda kurum seçilmediğinde kurum seç açık kalsın ve formtext içinde gözüksün
        if (!storeExpandListAction) {
            handleStoreExpand()
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
                            setSearchRoles(responseRoles?.results)
                        }
                    }
                }

                let getStoreAsync = async () => {
                    if (temp) {
                        const response = await GetStores();
                        if (response?.responseStatus === ResponseStatus.IsSuccess) {
                            setStores(response?.results)
                            setSearchStores(response?.results)
                        }
                        else {
                            Toast.show({ text1: response?.responseMessage, type: "error" })
                        }
                    }
                }
                getStoreAsync()
                getRoles();
                return () => {
                    temp = false
                }
            },
            [],
        )
    )

    const handleAddUser = async (userDto: GetUserDto) => {
        handleCloseModal()
        Toast.show({
            text1: "Güncelleme İşlemi Onaylama Ekranı",
            text2: "Personeli güncellemek istediğinizden emin misiniz ?",
            text1Style: { backgroundColor: 'yellow' },
            type: 'customToast',
            autoHide: false,  // ekranda duruyor
            props: {
                okButtonText: "Onayla",
                cancelButtonText: "İptal Et",
                onCancelPress: () => {
                    Toast.hide()
                    Toast.show({ text1: "Güncelleme işlemi iptal edildi", type: 'error' })
                },
                onOkPress: async () => {
                    let dto: GetUserDto = {
                        ...userDto, shiftTime: shiftTime,
                    }
                    const response = await UpdateUser(dto)
                    if (response?.responseStatus === ResponseStatus.IsSuccess) {
                        Toast.show({ text1: "İşlem Başarılı", text2: response.responseMessage, type: 'success' });
                        setSelectedUser(dto)
                    }
                    else {
                        Toast.show({ text1: "İşlem Başarısız", text2: response?.responseMessage, type: 'error' });
                    }
                    handleCloseModal()
                },
            }
        } as ToastShowParamsCustomType)
    }

    const handleChange = useCallback((value: any, textName: 'userName' | 'password' | 'firstName' | 'lastName' | 'gender' | 'email' | 'storeDto' | 'roleDto' | 'phoneNumber') => {
        if (typeof value === "string") {
            if (value === "") {
                setFormHelperText({ ...formHelperText, [textName]: true })
            }
            else if (textName === "phoneNumber") {
                const regex = /^(?:\+90|0)?\s?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;                         // +90 532 123 45 67  ,  0543 321 12 00    ,  543 321 12 00  bu tipte olanları kabul eder
                let isValidPhoneNumber = value.match(regex)                                             // numara geçerliyse false değilse true
                setFormHelperText({ ...formHelperText, [textName]: !isValidPhoneNumber })
            }
            else {
                setFormHelperText({ ...formHelperText, [textName]: false })
            }
        }
        else {
            if (value.id === 0) {
                setFormHelperText({ ...formHelperText, [textName]: true })
            }
            else {
                setFormHelperText({ ...formHelperText, [textName]: false })
            }
        }

        switch (textName) {
            case 'userName':
                setSelectedUser(prev => ({ ...prev, userName: value }))
                break;

            case 'password':
                setSelectedUser(prev => ({ ...prev, password: value }))
                break;

            case 'firstName':
                setSelectedUser(prev => ({ ...prev, firstName: value }))
                break;

            case 'lastName':
                setSelectedUser(prev => ({ ...prev, lastName: value }))
                break;

            case 'gender':
                setSelectedUser(prev => ({ ...prev, gender: value }))
                break;

            case 'email':
                setSelectedUser(prev => ({ ...prev, email: value }))
                break;

            case 'phoneNumber':
                setSelectedUser(prev => ({ ...prev, phoneNumber: value }))
                break;

            case 'storeDto':
                setSelectedUser(prev => ({ ...prev, storeDto: value }))
                break;

            case 'roleDto':
                setSelectedUser(prev => ({ ...prev, roleDto: value }))
                break;
            default:
                break;
        }
    }, [])

    return <Modal
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
            }}
            >
                <Card elevation={5} style={{ marginBottom: 10 }}>
                    <View style={{ alignItems: 'flex-end', width: '100%', height: '5%' }}>
                        <IconButton
                            icon="close"
                            selected
                            iconColor={'red'}
                            style={{ marginHorizontal: 10, position: 'static' }}
                            size={24}
                            onPress={() => {
                                handleCloseModal()
                                setSelectedUser(selectedUserItem)
                            }} />
                    </View>
                    <Card.Title subtitleStyle={{ opacity: 0.5 }} titleStyle={{ fontWeight: 'bold' }} title="KULLANICI BİLGİLERİNİ GÜNCELLE" subtitle="Kullanıcı Bilgilerini Girin" left={UpdateUserLeftContent} />
                    <Card.Content style={{ flex: 1 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                onBlur={() => { selectedUser.userName && setFormHelperText({ ...formHelperText, userName: selectedUser.userName === "" ? true : false }) }}
                                mode='outlined'
                                onChangeText={text => { handleChange(text, "userName") }}
                                value={selectedUser.userName}
                                label="Kullanıcı Adı girin . . ."
                                style={{ width: 350, minWidth: '75%', height: 40 }}
                                error={formHelperText.userName}
                            />
                            {formHelperText.userName && <HelperText type="error" visible={formHelperText.userName}>Lütfen Kullanıcı Adı Girin</HelperText>}
                            <TextInput
                                onBlur={() => { selectedUser.password && setFormHelperText({ ...formHelperText, password: selectedUser.password === "" ? true : false }) }}
                                mode='outlined'
                                onChangeText={text => { handleChange(text, 'password') }}
                                value={selectedUser.password}
                                label="Şifre girin . . ."
                                style={{ width: 350, minWidth: '75%', height: 40 }}
                                error={formHelperText.password}
                            />
                            {formHelperText.password && <HelperText type="error" visible={formHelperText.password}>Lütfen Şifre Girin</HelperText>}
                            <TextInput
                                onBlur={() => { selectedUser.firstName && setFormHelperText({ ...formHelperText, firstName: selectedUser.firstName === "" ? true : false }) }}
                                mode='outlined'
                                onChangeText={text => { handleChange(text, 'firstName') }}
                                value={selectedUser.firstName}
                                label="Adı girin . . ."
                                style={{ width: 350, minWidth: '75%', height: 40 }}
                                error={formHelperText.firstName}
                            />
                            {formHelperText.firstName && <HelperText type="error" visible={formHelperText.firstName}>Lütfen Adınızı Girin</HelperText>}
                            <TextInput
                                onBlur={() => { selectedUser.lastName && setFormHelperText({ ...formHelperText, lastName: selectedUser.lastName === "" ? true : false }) }}
                                mode='outlined'
                                onChangeText={text => { handleChange(text, 'lastName') }}
                                value={selectedUser.lastName}
                                label="Soyadı girin . . ."
                                style={{ width: 350, minWidth: '75%', height: 40 }}
                                error={formHelperText.lastName}
                            />
                            {formHelperText.lastName && <HelperText type="error" visible={formHelperText.lastName}>Lütfen Soyadınızı Girin</HelperText>}
                            <TextInput
                                onBlur={() => { selectedUser.email && setFormHelperText({ ...formHelperText, email: selectedUser.email === "" ? true : false }) }}
                                mode='outlined'
                                onChangeText={text => { handleChange(text, 'email') }}
                                value={selectedUser.email}
                                label="Email girin . . ."
                                style={{ width: 350, minWidth: '75%', height: 40 }}
                                error={formHelperText.email}
                            />
                            {formHelperText.email && <HelperText type="error" visible={formHelperText.email}>Lütfen Emailinizi Girin</HelperText>}
                            <TextInput
                                onBlur={() => { selectedUser.phoneNumber && setFormHelperText({ ...formHelperText, phoneNumber: selectedUser.phoneNumber === "" ? true : false }) }}
                                mode='outlined'
                                onChangeText={text => { handleChange(text, 'phoneNumber') }}
                                value={selectedUser.phoneNumber}
                                label="Telefon Numarası Girin . . ."
                                style={{ width: 350, minWidth: '75%', height: 40 }}
                                error={formHelperText.phoneNumber}
                            />
                            {formHelperText.phoneNumber && <HelperText type="error" visible={formHelperText.phoneNumber}>Lütfen Geçerli bir Telfon Numarası Girin</HelperText>}
                            <List.Section style={{ width: 350, minWidth: '75%', maxWidth: '100%', display: 'flex', alignItems: 'flex-start' }}>
                                <List.Accordion
                                    expanded={userExpandListAction}
                                    onPress={handleUserExpand}
                                    style={{
                                        width: 350,
                                        minWidth: '100%',
                                        height: 40, // Yüksekliği sınırla
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingVertical: 0, // Varsayılan iç boşluğu kaldır
                                    }}
                                    title={selectedUser.roleDto.id > 0 ? selectedUser.roleDto.roleName : "Yetki Seç . . ."}
                                    titleStyle={{
                                        fontSize: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        lineHeight: 30, // Yüksekliğe uygun satır yüksekliği
                                    }}
                                >
                                    <List.Item style={{ minWidth: '100%', maxWidth: '75%', justifyContent: 'center' }} title=""
                                        left={() =>
                                            <TextInput
                                                value={searchRoleValue}
                                                placeholder='Ara'
                                                label={"Ara"}
                                                style={{ width: 350, height: 40, minWidth: '70%' }}
                                                onChangeText={(text) => {
                                                    if (text != "") {
                                                        setSearchRoles(roles.filter(x => x.roleName.trim().toLowerCase().includes(text.trim().toLowerCase())))
                                                    }
                                                    else {
                                                        setSearchRoles(roles)
                                                    }
                                                    setSearchRoleValue(text)
                                                }}
                                            />
                                        }
                                    />
                                    <List.Item
                                        title=""
                                        style={{ minWidth: '100%', maxWidth: '75%', backgroundColor: '#D8D8D8', height: 300 }}
                                        left={() => (

                                            <FlatList
                                                data={searchRoles}
                                                renderItem={({ item, index }) => <RoleItem key={item.id.toString()} roleDto={item} handleChange={handleChange} handleUserExpand={handleUserExpand} user={selectedUser} />}
                                                keyExtractor={item => item.id.toString()}
                                                // scrollEnabled={false}
                                                nestedScrollEnabled={true}
                                            />
                                        )} />
                                </List.Accordion>
                            </List.Section>
                            {formHelperText.roleDto && <HelperText type="error" visible={formHelperText.roleDto}>Lütfen Yetkiyi Seçin</HelperText>}
                            <List.Section style={{ width: 350, minWidth: '75%', maxWidth: '100%', display: 'flex', alignItems: 'flex-start', marginTop: 1 }}>
                                <List.Accordion
                                    expanded={storeExpandListAction}
                                    onPress={handleStoreExpand}
                                    style={{
                                        width: 270,
                                        minWidth: '100%',
                                        height: 40, // Yüksekliği sınırlaf
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingVertical: 0, // Varsayılan iç boşluğu kaldır
                                    }}
                                    title={selectedUser.storeDto.storeName && selectedUser.storeDto.storeTime.startDate && selectedUser.storeDto.storeTime.endDate ? `${selectedUser.storeDto.storeName} (${selectedUser.storeDto.storeTime.startDate.substring(0, 5)} - ${selectedUser.storeDto.storeTime.endDate.substring(0, 5)}) ` : "Kurum Seç . . ."}
                                    titleStyle={{
                                        fontSize: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        lineHeight: 30, // Yüksekliğe uygun satır yüksekliği
                                    }}
                                >
                                    {formHelperText.storeDto && <HelperText type="error" visible={formHelperText.storeDto}>Lütfen Kurumu Seçin</HelperText>}
                                    <List.Item style={{ minWidth: '100%', maxWidth: '75%' }} title=""
                                        left={() =>
                                            <TextInput
                                                value={filter.searchValue}
                                                placeholder='Ara'
                                                style={{ width: 350, height: 40, minWidth: '70%' }}
                                                onChangeText={(text) => {
                                                    if (text != "") {
                                                        setSearchStores(stores.filter(x => x.storeName.trim().toLowerCase().includes(text.trim().toLowerCase())))
                                                    }
                                                    else {
                                                        setSearchStores(stores)
                                                    }
                                                    setfilter(prev => ({ ...prev, searchValue: text }))
                                                }}
                                            />
                                        }
                                    />
                                    <List.Item
                                        title=""
                                        style={{ minWidth: '100%', maxWidth: '75%', backgroundColor: '#D8D8D8', height: 'auto' }}
                                        left={() => (
                                            <FlatList
                                                data={searchStores}
                                                renderItem={({ item, index }) => <StoreItem key={item.id.toString()} storeDto={item} handleChange={handleChange} handleStoreExpand={handleStoreExpand} user={selectedUser} setShiftTime={setShiftTime} />}
                                                keyExtractor={item => item.id.toString()}
                                                nestedScrollEnabled={true}
                                            // scrollEnabled={false}
                                            />

                                        )} />
                                </List.Accordion>
                                <List.Item
                                    title=""
                                    style={{ minWidth: '100%', maxWidth: '75%', height: 120 }}
                                    left={() =>
                                        <View style={{ width: '55%' }}>
                                            <TimePickerRangeModal setStoreTime={setShiftTime} storeTime={shiftTime} reset={reset} helperTextTimeDto={helperTextTimeDto} setHelperTextTimeDto={setHelperTextTimeDto} />
                                        </View>
                                    }
                                    right={() =>
                                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '45%' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '20%', marginVertical: 20 }}>
                                                <RadioButton
                                                    value={selectedUser.gender}
                                                    uncheckedColor={formHelperText.gender ? 'red' : ""}
                                                    color={MD3Colors.primary70}
                                                    status={selectedUser.gender === GenderEnum.Man ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        handleChange(GenderEnum.Man, 'gender')
                                                    }}
                                                />
                                                <List.Icon color={MD3Colors.primary70} icon="human-male" />
                                                <Text style={selectedUser.gender === GenderEnum.Man ? { fontWeight: 'bold', fontSize: 18 } : ""}>Erkek</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '20%' }}>
                                                <RadioButton
                                                    value={selectedUser.gender}
                                                    color={MD3Colors.tertiary70}
                                                    uncheckedColor={formHelperText.gender ? 'red' : ""}
                                                    status={selectedUser.gender === GenderEnum.Woman ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        handleChange(GenderEnum.Woman, 'gender')
                                                    }}
                                                />
                                                <List.Icon color={MD3Colors.tertiary70} icon="human-female" />
                                                <Text style={selectedUser.gender === GenderEnum.Woman ? { fontWeight: 'bold', fontSize: 18 } : ""}>Kadın</Text>
                                            </View>
                                            {formHelperText.gender && <HelperText type="error" visible={formHelperText.gender}>Lütfen Cinsiyet Girin</HelperText>}
                                        </View>
                                    }
                                />
                                <List.Item
                                    title={
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 2 }}>
                                            <Text style={[{ fontWeight: 'bold', fontSize: 18 }, selectedUser.roleDto.id === 2 ? { color: "gray" } : isActive ? { color: 'green' } : { color: 'red' }]}>{isActive ? "Aktif" : "Pasif"}</Text>
                                            <IconButton
                                                icon="information-outline"
                                                selected
                                                iconColor={!isActive ? 'red' : 'green'}
                                                style={{ margin: 0, padding: 0 }}
                                                size={24}
                                                onPress={() => {
                                                    setInfoMessage(true)
                                                }}
                                            />
                                        </View>
                                    }
                                    titleStyle={[{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }, isActive ? { color: 'green' } : { color: 'red' }]}
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                    left={() => <>
                                        <Switch value={isActive} trackColor={{ true: "#79AB54", false: "#D5819A" }} thumbColor={(isAdmin || isStoreAdmin) ? "gray" : isActive ? "green" : "red"} color={(isStoreAdmin || isAdmin) ? "gray" : isActive ? "green" : "red"} onValueChange={onToggleSwitch} disabled={isStoreAdmin || isAdmin} />
                                    </>}
                                    right={() =>
                                        <TouchableOpacity>
                                            <Button
                                                buttonColor='#CEC96F'
                                                mode='contained'
                                                textColor='black'
                                                disabled={handleUpdateButtonDisabled()}
                                                onPress={async () => {
                                                    await handleAddUser(selectedUser)
                                                }}
                                            >Güncelle
                                            </Button>
                                        </TouchableOpacity>
                                    }
                                />
                                {formHelperText.gender && <HelperText type="error" visible={formHelperText.gender}>Lütfen Cinsiyet Girin</HelperText>}
                                {infoMessage && <Chip style={{ backgroundColor: '#ACC8E5', marginTop: 5, maxWidth: '100%', gap: 5 }} textStyle={{ textAlign: 'left', flexWrap: 'wrap' }} icon="information" >{isActive ? "Personelin Çalışma Durumu aktif" : "Personelin Çalışma Durumu pasif"}</Chip>}
                                {infoMessage && selectedUser.roleDto.id === 2 && <Chip style={{ backgroundColor: '#ACC8E5', marginTop: 5, maxWidth: '100%' }} textStyle={{ textAlign: 'left', flexWrap: 'wrap' }} icon="information" >{"Mağaza Yöneticileri Pasif yada Aktif yapamaz"}</Chip>}
                            </List.Section>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </View>
    </Modal>
})
type StoreItemProps = {
    storeDto: StoreDto,
    user: GetUserDto,
    handleStoreExpand: () => void,
    handleChange: (value: any, textName: "userName" | "password" | "firstName" | "lastName" | "gender" | "email" | "storeDto" | "roleDto") => void
    setShiftTime: React.Dispatch<React.SetStateAction<TimeDto>>
}
const StoreItem: React.FC<StoreItemProps> = ({ storeDto, user, handleChange, handleStoreExpand, setShiftTime }) => (
    <List.Item
        title={storeDto.storeName}
        key={storeDto.id}
        titleStyle={storeDto.id === user.storeDto.id ?
            { justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'green' } :
            { justifyContent: 'center', alignItems: 'center' }}
        style={{ paddingVertical: 1, justifyContent: 'center', alignItems: 'center', minWidth: '100%' }} // Yüksekliği azaltmak için
        right={(id) => (
            <Button
                icon={user.storeDto.id === storeDto.id ? 'check' : ""}
                mode="contained"
                buttonColor={user.storeDto.id === storeDto.id ? "green" : "gray"}
                onPress={() => {
                    if (user.storeDto.id == storeDto.id) {
                        handleChange(initialStoreDto, 'storeDto')
                    }
                    else {
                        handleChange(storeDto, 'storeDto')
                        handleStoreExpand()
                        setShiftTime(prev => ({
                            ...prev,
                            startDate: storeDto.storeTime.startDate,
                            endDate: storeDto.storeTime.endDate,
                        }))
                    }
                }}>
                {user.storeDto.id === storeDto.id ? "Seçildi" : "Seç"}
            </Button>
        )}
    />
)
type RoleItemProps = {
    roleDto: RoleDto, user: GetUserDto,
    handleChange: (value: any, textName: "userName" | "password" | "firstName" | "lastName" | "gender" | "email" | "storeDto" | "roleDto") => void,
    handleUserExpand: () => void
};
const RoleItem: React.FC<RoleItemProps> = ({ roleDto, handleChange, user, handleUserExpand }) => (
    <List.Item
        title={roleDto.roleName}
        key={roleDto.id}
        titleStyle={roleDto.id === user.roleDto.id ?
            { justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'green' } :
            { justifyContent: 'center', alignItems: 'center' }}
        style={{ paddingVertical: 1, justifyContent: 'center', alignItems: 'center', minWidth: '100%' }} // Yüksekliği azaltmak için
        right={(id) => (
            <Button
                icon={user.roleDto.id === roleDto.id ? 'check' : ""}
                mode="contained"
                buttonColor={user.roleDto.id === roleDto.id ? "green" : "gray"}
                onPress={() => {
                    if (user.roleDto.id === roleDto.id) {
                        handleChange(initialRoleDto, 'roleDto')
                    }
                    else {
                        handleChange(roleDto, 'roleDto')

                        handleUserExpand()
                    }
                }}>
                {user.roleDto.id === roleDto.id ? "Seçildi" : "Seç"}
            </Button>
        )}
    />
);