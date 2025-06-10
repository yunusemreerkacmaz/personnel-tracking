import { Linking } from "react-native";
import { IconButton } from "react-native-paper";
import { GetUserDto } from "../Admin/AddUser/Dtos/userDto";
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import SendUserInfoModal from "./sendUserInfo";
import { ContactTypeEnum } from "../../Enums/ContactTypeEnum";
import Animated, { FadeInLeft } from "react-native-reanimated";

export default function WhatsappScreen({ selectedUserItem }: { selectedUserItem: GetUserDto }) {
    const [visible, setVisible] = useState<boolean>(false)
    const handleOpenModal = () => setVisible(true)
    const handleCloseModal = () => setVisible(false)
    return (
        <Animated.View entering={FadeInLeft.delay(200).duration(1500)}>
            <IconButton
                icon="whatsapp"
                selected
                iconColor={"green"}
                size={24}
                onPress={() => {
                    handleOpenModal()
                }} />
            {visible && <SendUserInfoModal handleCloseModal={handleCloseModal} visible={visible} selectedUserItem={selectedUserItem} contactTypeEnum={ContactTypeEnum.Whatsapp} />}
        </Animated.View>
    );
}





