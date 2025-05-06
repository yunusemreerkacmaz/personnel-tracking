import React, { useState } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import UserLoginComponent from './UserLoginComponent';
import UserExitComponent from './UserExitComponent';

enum AdminBarcodeEnum {
    UserLogin = "Login",
    UserExit = "Exit",
}

export default function AdminBarcodeIndex() {
    const [value, setValue] = useState<string>(AdminBarcodeEnum.UserLogin);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
    });

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                {<SegmentedButtons
                    value={value}
                    onValueChange={setValue}
                    style={{  margin:10}}
                    buttons={[
                        {
                            value: AdminBarcodeEnum.UserLogin,
                            label: 'Kullancı Girişi',
                            labelStyle: [{ fontSize: 13, color: 'black' }, (value === AdminBarcodeEnum.UserLogin ? { fontWeight: 'bold' } : { fontWeight: 'thin' })],
                            style: [{ backgroundColor: '#B0DBA4' }, value !== AdminBarcodeEnum.UserLogin ? { opacity: 0.5 } : {}],
                        },
                        {
                            value: AdminBarcodeEnum.UserExit,
                            label: 'Kullanıcı Çıkışı',
                            labelStyle: [{ fontSize: 13, color: 'black' }, value === AdminBarcodeEnum.UserExit ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
                            style: [{ backgroundColor: '#DC6F6F' }, value !== AdminBarcodeEnum.UserExit ? { opacity: 0.5 } : {}]
                        },
                    ]}
                />}
                <View style={{ flex: 1,margin:10,marginTop:0 }}>
                    {value === AdminBarcodeEnum.UserLogin && <UserLoginComponent />}
                    {value === AdminBarcodeEnum.UserExit && <UserExitComponent />}
                </View>
            </View>
        </SafeAreaView>

    )
}
