import React, { } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import DistinctDevice from './distinctDevice';
import ChangeDeviceToken from './changeDeviceToken';

export default function Index() {
    const [value, setValue] = React.useState('distinctDevice');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                {<SegmentedButtons
                    value={value}
                    onValueChange={setValue}
                    style={{ margin: 10, borderWidth: 0, }}
                    buttons={[
                        {
                            value: 'distinctDevice',
                            label: 'Cihaz Onayla',
                            labelStyle: [{ fontSize: 13, color: 'black' }, (value === "distinctDevice" ? { fontWeight: 'bold' } : { fontWeight: 'thin' })],
                            style: [{ backgroundColor: '#B0DBA4' }, value !== "distinctDevice" ? { opacity: 0.5 } : {}],
                        },
                        {
                            value: 'changeDeviceToken',
                            label: 'Cihaz Sil',
                            labelStyle: [{ fontSize: 13, color: 'black' }, value === "changeDeviceToken" ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
                            style: [{ backgroundColor: '#DC6F6F' }, value !== "changeDeviceToken" ? { opacity: 0.5 } : {}]
                        },
                    ]}
                />}
                <View style={styles.container}>
                    {value === "distinctDevice" && <DistinctDevice />}
                    {value === "changeDeviceToken" && <ChangeDeviceToken />}
                </View>
            </View>
        </SafeAreaView>
    )
}
