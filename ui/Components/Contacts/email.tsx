import { Linking } from "react-native";
import { GetUserDto } from "../Admin/AddUser/Dtos/userDto";
import { IconButton } from "react-native-paper";
import React, { useState } from "react";
import { ContactTypeEnum } from "../../Enums/ContactTypeEnum";
import SendUserInfoModal from "./sendUserInfo";
import Animated, { FadeInLeft } from "react-native-reanimated";

export default function EmailScreen({ selectedUserItem }: { selectedUserItem: GetUserDto }) {
    const [visible, setVisible] = useState<boolean>(false)
    const handleOpenModal = () => setVisible(true)
    const handleCloseModal = () => setVisible(false)
    return (
        <Animated.View entering={FadeInLeft.delay(200).duration(1500)}>
            <IconButton
                icon="email"
                selected
                iconColor={"#e63946"}
                size={24}
                onPress={() => {
                    handleOpenModal()
                }} />
            {visible && <SendUserInfoModal handleCloseModal={handleCloseModal} visible={visible} selectedUserItem={selectedUserItem} contactTypeEnum={ContactTypeEnum.Email} />}
        </Animated.View>
    );
}
