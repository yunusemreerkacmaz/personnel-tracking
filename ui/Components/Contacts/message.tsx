import React, { useState } from 'react'
import { IconButton } from 'react-native-paper';
import { GetUserDto } from '../Admin/AddUser/Dtos/userDto';
import { ContactTypeEnum } from '../../Enums/ContactTypeEnum';
import SendUserInfoModal from './sendUserInfo';

export default function MessageScreen({ selectedUserItem }: { selectedUserItem: GetUserDto }) {
    const [visible, setVisible] = useState<boolean>(false)
    const handleOpenModal = () => setVisible(true)
    const handleCloseModal = () => setVisible(false)

    return (
        <>
            <IconButton
                icon="message"
                selected
                iconColor={"#FFB800"}
                size={24}
                onPress={() => {
                    handleOpenModal()
                }} />
            {visible && <SendUserInfoModal handleCloseModal={handleCloseModal} visible={visible} selectedUserItem={selectedUserItem} contactTypeEnum={ContactTypeEnum.Whatsapp} />}
        </>


    )
}
