import React, { useState } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import UserLoginComponent from './UserLoginComponent';
import UserExitComponent from './UserExitComponent';

enum AdminBarcodeEnum {
    UserLogin="Login",
    UserExit="Exit",
}

export default function AdminBarcodeIndex() {
    const [value, setValue] = useState<string>(AdminBarcodeEnum.UserLogin);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
        },
    });

    return (
        <View style={styles.container}>
            {<SegmentedButtons
                value={value}
                onValueChange={setValue}
                style={{ width: '95%', marginVertical: 10, borderWidth: 0 }}
                buttons={[
                    {
                        value: AdminBarcodeEnum.UserLogin,
                        label: 'Kullancı Girişi',
                        labelStyle: [{ fontSize: 13,color:'black' }, (value === AdminBarcodeEnum.UserLogin ? { fontWeight: 'bold' } : { fontWeight: 'thin' })],
                        style: [{ backgroundColor: '#B0DBA4' }, value !== AdminBarcodeEnum.UserLogin ? { opacity: 0.5 } : {}],
                    },
                    {
                        value: AdminBarcodeEnum.UserExit,
                        label: 'Kullanıcı Çıkışı',
                        labelStyle: [{ fontSize: 13,color:'black' }, value === AdminBarcodeEnum.UserExit ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
                        style: [{ backgroundColor: '#DC6F6F' }, value !== AdminBarcodeEnum.UserExit ? { opacity: 0.5 } : {}]
                    },
                ]}
            />}
            {value === AdminBarcodeEnum.UserLogin && <UserLoginComponent />}
            {value === AdminBarcodeEnum.UserExit && <UserExitComponent />}
        </View>
    )
}
