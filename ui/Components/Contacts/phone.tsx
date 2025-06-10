import { Linking } from "react-native";
import { GetUserDto } from "../Admin/AddUser/Dtos/userDto";
import { IconButton } from "react-native-paper";
import React from "react";
import Toast from "react-native-toast-message";
import { TextStyle } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";

export default function PhoneScreen({ selectedUserItem }: { selectedUserItem: GetUserDto }) {
    const makePhoneCall = (phoneNumber: string) => {
        phoneNumber = phoneNumber.startsWith("0") ? phoneNumber : "0" + phoneNumber
        phoneNumber = `tel:${phoneNumber}`; // 0 ile başlarsa da çalışır
        Linking.openURL(phoneNumber).catch(err => {
            Toast.show({ text1: "Arama Yapılamadı.", text2Style: phoneNumber as TextStyle })
        });
    };

    return (
        <Animated.View entering={FadeInLeft.delay(200).duration(1500)}>
            <IconButton
                icon="phone"
                selected
                iconColor={"#0E6FD6"}
                size={24}
                onPress={() => {
                    makePhoneCall(selectedUserItem.phoneNumber)
                }} />
        </Animated.View>

    );
}
