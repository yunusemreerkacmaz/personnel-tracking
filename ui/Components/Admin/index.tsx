import React, { } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import AddUserComponent from './AddUser/addUser';
import DeleteUserComponent from './AddUser/deleteUser';
import UpdateStoreComponent from './AddUser/updateUser';

export default function Index() {
    const [value, setValue] = React.useState('ekle');

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
                style={{ width: '95%', marginTop: 10, borderWidth: 0 }}
                buttons={[
                    {
                        value: 'ekle',
                        label: 'Ekle',
                        labelStyle: [{ fontSize: 13,color:'black' }, (value === "ekle" ? { fontWeight: 'bold' } : { fontWeight: 'thin' })],
                        style: [{ backgroundColor: '#B0DBA4' }, value !== "ekle" ? { opacity: 0.5 } : {}],
                    },
                    {
                        value: 'güncelle',
                        label: 'Güncelle',
                        labelStyle: [{ fontSize: 13, borderColor: "#ACC8E5",color:'black' }, value === "güncelle" ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
                        style: [{ backgroundColor: '#ACC8E5' }, value !== "güncelle" ? { opacity: 0.5, } : {}]
                    },
                    {
                        value: 'sil',
                        label: 'Sil',
                        labelStyle: [{ fontSize: 13,color:'black' }, value === "sil" ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
                        style: [{ backgroundColor: '#DC6F6F' }, value !== "sil" ? { opacity: 0.5 } : {}]
                    },
                ]}
            />}
            {value === "ekle" && <AddUserComponent />}
            {value === "güncelle" && <UpdateStoreComponent />}
            {value === "sil" && <DeleteUserComponent />}
        </View>
    )
}
