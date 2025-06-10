import React, { useCallback } from 'react';
import { useState } from 'react';
import { BottomNavigation, Provider, IconButton } from 'react-native-paper';
import PhoneScreen from './phone';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import WhatsappScreen from './whatsapp';
import MessageScreen from './message';
import HomeScreen from './Requests/home';
import EmailScreen from './email';
import Animated, { FadeInLeft } from 'react-native-reanimated';

export default function ContactComponent() {
    const [index, setIndex] = useState(0);
    const navigation = useNavigation<any>();
    const [animatedKey, setAnimatedKey] = useState(0)

    useFocusEffect(
        useCallback(
            () => {
                setAnimatedKey(prev => prev + 1)
            },
            [],
        )
    )

    const routes = [
        { key: 'phone', title: 'Telefon', icon: 'phone', color: '#0E6FD6' },
        { key: 'message', title: 'Mesaj', icon: 'message', color: '#FFB800' },
        { key: 'whatsapp', title: 'Whatsapp', icon: 'whatsapp', color: 'green' },
        { key: 'mail', title: 'Mail', icon: 'email', color: '#e63946' },
    ];

    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'phone':
                return <HomeScreen renderItem={(selectedUserItem) => <PhoneScreen selectedUserItem={selectedUserItem} />} />
            case 'whatsapp':
                return <HomeScreen renderItem={(selectedUserItem) => <WhatsappScreen selectedUserItem={selectedUserItem} />} />
            case 'message':
                return <HomeScreen renderItem={(selectedUserItem) => <MessageScreen selectedUserItem={selectedUserItem} />} />
            case 'mail':
                return <HomeScreen renderItem={(selectedUserItem) => <EmailScreen selectedUserItem={selectedUserItem} />} />
            default:
                return null;
        }
    };

    return (
        <Provider>

            {renderScene({ route: routes[index] })}
            <BottomNavigation.Bar
                navigationState={{ index, routes }}
                onTabPress={({ route }) => {
                    const newIndex = routes.findIndex((r) => r.key === route.key);
                    if (newIndex !== -1) {
                        setIndex(newIndex);
                    }
                }}
                renderIcon={({ route, color, }) => (
                    <Animated.View entering={FadeInLeft.duration(500).delay(500)} key={animatedKey}>
                        <IconButton
                            icon={route.icon}
                            iconColor={route.color}
                            size={24}
                            style={{ bottom: 12 }}
                        />
                    </Animated.View>
                )}
                getLabelText={({ route }) => route.title}
            />
        </Provider>
    );
}