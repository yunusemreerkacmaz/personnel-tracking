import React, { } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import AddStoreComponent from '../Stores/addStore';
import UpdateStoreComponent from './updateStore';
import DeleteStoreComponent from './deleteStore';

export default function Index() {
    const [value, setValue] = React.useState('ekle');
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                    <SegmentedButtons
                        value={value}
                        onValueChange={setValue}
                        style={{ margin: 10, borderWidth: 0, }}
                        buttons={[
                            {
                                value: 'ekle',
                                label: 'Ekle',
                                labelStyle: [{ fontSize: 13, color: 'black' }, (value === "ekle" ? { fontWeight: 'bold' } : { fontWeight: 'thin' })],
                                style: [{ backgroundColor: '#B0DBA4' }, value !== "ekle" ? { opacity: 0.5 } : {}],
                            },
                            {
                                value: 'güncelle',
                                label: 'Güncelle',
                                labelStyle: [{ fontSize: 13, borderColor: "#ACC8E5", color: 'black' }, value === "güncelle" ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
                                style: [{ backgroundColor: '#ACC8E5' }, value !== "güncelle" ? { opacity: 0.5, } : {}]
                            },
                            {
                                value: 'sil',
                                label: 'Sil',
                                labelStyle: [{ fontSize: 13, color: 'black' }, value === "sil" ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
                                style: [{ backgroundColor: '#DC6F6F' }, value !== "sil" ? { opacity: 0.5 } : {}]
                            },
                        ]}
                    />
                <View style={styles.container}>
                    {value === "ekle" && <AddStoreComponent />}
                    {value === "güncelle" && <UpdateStoreComponent />}
                    {value === "sil" && <DeleteStoreComponent />}
                </View>
            </View>
        </SafeAreaView>
    )
}
