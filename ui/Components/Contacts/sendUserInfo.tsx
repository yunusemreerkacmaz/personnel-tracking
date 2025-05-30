import { Avatar, Button, Card, Divider, IconButton } from "react-native-paper"
import { Linking, Modal, View } from 'react-native'
import { GetUserDto } from "../Admin/AddUser/Dtos/userDto"
import Toast from "react-native-toast-message"
import { ContactTypeEnum } from "../../Enums/ContactTypeEnum"

type IProps = {
    selectedUserItem: GetUserDto
    handleCloseModal: () => void,
    visible: boolean,
    contactTypeEnum: ContactTypeEnum
}

export default function SendUserInfoModal(props: IProps) {
    const { handleCloseModal, visible, selectedUserItem, contactTypeEnum } = props
    const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} style={{ marginTop: 20 }} color='#5a189a' icon="account" />
    const handlePrivateMessage = async (selectedUserItem: GetUserDto) => {

        if (contactTypeEnum === ContactTypeEnum.Whatsapp) {
            let phoneNumber = selectedUserItem.phoneNumber.startsWith("9") && selectedUserItem.phoneNumber[3] !== "0" ? selectedUserItem.phoneNumber : "90" + selectedUserItem.phoneNumber
            let message = `Merhaba ${selectedUserItem?.firstName} ${selectedUserItem?.lastName} ${selectedUserItem?.gender === "Erkek" ? "Bey" : selectedUserItem?.gender === "Kadın" ? "Hanım" : ""}`;
            let appUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
            const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            try {
                const supported = await Linking.canOpenURL(appUrl);
                await Linking.openURL(supported ? appUrl : webUrl);
            } catch (err) {
                Toast.show({ text1: "Whatsapp Açılamadı", type: 'error' })
            }

            //   const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            // Linking.canOpenURL(url)
            //     .then((supported) => {
            //         if (supported) {
            //             return Linking.openURL(url);
            //         } else {
            //             alert("WhatsApp yüklü değil.");
            //         }
            //     })
            //     .catch((err) => console.error("Hata:", err));   
        }
        else if (contactTypeEnum === ContactTypeEnum.Message) {
            let phoneNumber = selectedUserItem.phoneNumber.startsWith("0") ? selectedUserItem.phoneNumber : "0" + selectedUserItem.phoneNumber
            let message = `Merhaba ${selectedUserItem?.firstName} ${selectedUserItem?.lastName} ${selectedUserItem?.gender === "Erkek" ? "Bey" : selectedUserItem?.gender === "Kadın" ? "Hanım" : ""}`;
            phoneNumber = `sms:${phoneNumber}?body=${encodeURIComponent(message)} `; // 0 ile başlarsa da çalışır
            Linking.openURL(phoneNumber).catch(err => {
                console.error("Arama yapılamadı", err);
            });
        }
        else if (contactTypeEnum === ContactTypeEnum.Email) {
            const ishaveEmail = selectedUserItem.email.includes("@")
            if (ishaveEmail) {
                let subject = "Kullanıcı Bilgilendirme"  // Başlık
                let body = `Merhaba ${selectedUserItem?.firstName} ${selectedUserItem?.lastName} ${selectedUserItem?.gender === "Erkek" ? "Bey" : selectedUserItem?.gender === "Kadın" ? "Hanım" : ""}`;
                const url = `mailto:${selectedUserItem.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                Linking.openURL(url).catch(err => {
                    Toast.show({ text1: "Email Açılamadı", type: 'error' })
                });
            }
            else {
                Toast.show({ text1: "Kullanılan Email Hatalı", text2: selectedUserItem.email, type: 'error' })
            }
        }
    };

    const handleSendUserInfo = async (selectedUserItem: GetUserDto) => {
        let genderTitle = ""
        if (selectedUserItem.gender === "Erkek") {
            genderTitle = "Bey"
        }
        if (selectedUserItem.gender === "Kadın") {
            genderTitle = "Hanım"
        }
        let modalifeAppDownloadLink = "https://www.google.com.tr"
        let phoneNumber = selectedUserItem.phoneNumber.startsWith("9") && selectedUserItem.phoneNumber[3] !== "0" ? selectedUserItem.phoneNumber : "90" + selectedUserItem.phoneNumber
        let message = `Merhaba ${selectedUserItem?.firstName} ${selectedUserItem?.lastName} ${genderTitle}\n` +
            `Kullanıcı bilgileriniz:\n` +
            `Kullanıcı Adı: ${selectedUserItem.userName}\n` +
            `Şifre: ${selectedUserItem.password}\n\n\n` +
            `Modalife uygulamasını indirmek için linke tıklayın \n\n\n` +
            modalifeAppDownloadLink
            ;

        let appUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        try {
            const supported = await Linking.canOpenURL(appUrl);
            await Linking.openURL(supported ? appUrl : webUrl);
        } catch (err) {
            Toast.show({ text1: "Whatsapp Açılamadı", type: 'error' })
        }

        //   const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        // Linking.canOpenURL(url)
        //     .then((supported) => {
        //         if (supported) {
        //             return Linking.openURL(url);
        //         } else {
        //             alert("WhatsApp yüklü değil.");
        //         }
        //     })
        //     .catch((err) => console.error("Hata:", err));
    };

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
                    flex: 3 / 5,
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
                    <Card elevation={5} style={{ flex: 1, backgroundColor: '#e5e6e4' }}>
                        <Card.Title subtitleStyle={{ opacity: 0.5, color: "#fe7f2d", fontFamily: 'fantasy', fontWeight: 'bold' }} titleStyle={{ fontWeight: 'bold', color: "#9d4edd", marginTop: 20 }} title="KULLANICI BİLGİLERİ" subtitle={`${selectedUserItem.firstName} ${selectedUserItem.lastName} `} left={UpdateUserLeftContent} right={() => {
                            return <View style={{ alignItems: 'flex-end' }}>
                                <IconButton
                                    icon="close"
                                    selected
                                    iconColor={'red'}
                                    style={{ marginHorizontal: 10, position: 'static' }}
                                    size={30}
                                    onPress={() => {
                                        handleCloseModal()
                                    }} />
                            </View>
                        }} />
                        <Divider />
                        <Card.Content style={{ flex: 1, minWidth: '100%', gap: 20 }}>
                            <Button buttonColor='#006494' mode='contained' textColor='black' style={{ marginTop: 20 }} onPress={() => { handleSendUserInfo(selectedUserItem) }}> Kullanıcı Bilgilerini Gönder</Button>
                            <Button buttonColor='#7b2cbf' mode='contained' textColor='black' onPress={() => { handlePrivateMessage(selectedUserItem) }}  > Özel Mesaj Gönder</Button>
                        </Card.Content>
                    </Card>
                </View>
            </View>
        </Modal>



    )
}