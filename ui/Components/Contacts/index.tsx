import React from 'react';
import { useState } from 'react';
import { BottomNavigation, Provider, IconButton } from 'react-native-paper';
import PhoneScreen from './phone';
import { useNavigation } from '@react-navigation/native';
import WhatsappScreen from './whatsapp';
import MessageScreen from './message';
import HomeScreen from './Requests/home';
import EmailScreen from './email';

export default function ContactComponent() {
    const [index, setIndex] = useState(0);
    const navigation = useNavigation<any>();

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
                return <HomeScreen renderItem={(selectedUserItem) => <WhatsappScreen selectedUserItem={selectedUserItem} />} />;
            case 'message':
                return <HomeScreen renderItem={(selectedUserItem) => <MessageScreen selectedUserItem={selectedUserItem} />} />;
            case 'mail':
                return <HomeScreen renderItem={(selectedUserItem) => <EmailScreen selectedUserItem={selectedUserItem} />} />;
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
                renderIcon={({ route, color }) => (
                    <IconButton
                        icon={route.icon}
                        iconColor={route.color}
                        size={24}
                        style={{ bottom: 12 }}
                        />
                )}
                getLabelText={({ route }) => route.title}
            />
        </Provider>
    );
}