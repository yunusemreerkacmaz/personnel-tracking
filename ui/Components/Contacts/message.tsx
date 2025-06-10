import React, { useState } from 'react'
import { IconButton } from 'react-native-paper';
import { GetUserDto } from '../Admin/AddUser/Dtos/userDto';
import { ContactTypeEnum } from '../../Enums/ContactTypeEnum';
import SendUserInfoModal from './sendUserInfo';
import Animated, { FadeInLeft } from 'react-native-reanimated';

export default function MessageScreen({ selectedUserItem }: { selectedUserItem: GetUserDto }) {
    const [visible, setVisible] = useState<boolean>(false)
    const handleOpenModal = () => setVisible(true)
    const handleCloseModal = () => setVisible(false)

    return (
        <Animated.View entering={FadeInLeft.delay(200).duration(1500)}>
            <IconButton
                icon="message"
                selected
                iconColor={"#FFB800"}
                size={24}
                onPress={() => {
                    handleOpenModal()
                }} />
            {visible && <SendUserInfoModal handleCloseModal={handleCloseModal} visible={visible} selectedUserItem={selectedUserItem} contactTypeEnum={ContactTypeEnum.Whatsapp} />}
        </Animated.View>
    )
}
