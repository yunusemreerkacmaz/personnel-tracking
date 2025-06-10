import React, { } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import ShiftPlanComponent from './shiftPlan';
import UpdateShiftPlan from './updateShiftPlan';
import CreateShiftPlanComponent from './createShiftPlan';

export default function Index() {
  const [value, setValue] = React.useState('getAll');
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
          style={{ margin: 10 }}
          buttons={[
            {
              value: 'getAll',
              label: 'Tümü',
              labelStyle: [{ fontSize: 13, color: 'black' }, (value === "getAll" ? { fontWeight: 'bold' } : { fontWeight: 'thin' })],
              style: [{ backgroundColor: '#B0DBA4' }, value !== "getAll" ? { opacity: 0.5 } : {}],
            },
            {
              value: 'create',
              label: 'Ekle',
              labelStyle: [{ fontSize: 13, borderColor: "#ACC8E5", color: 'black' }, value === "create" ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
              style: [{ backgroundColor: '#ACC8E5' }, value !== "create" ? { opacity: 0.5, } : {}]
            },
            {
              value: 'update',
              label: 'Güncelle',
              labelStyle: [{ fontSize: 13, borderColor: "#ACC8E5", color: 'black' }, value === "create" ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
              style: [{ backgroundColor: '#ACC8E5' }, value !== "create" ? { opacity: 0.5, } : {}]
            },
            {
              value: 'delete',
              label: 'Sil',
              labelStyle: [{ fontSize: 13, borderColor: "#ACC8E5", color: 'black' }, value === "create" ? { fontWeight: 'bold' } : { fontWeight: 'thin' }],
              style: [{ backgroundColor: '#ACC8E5' }, value !== "create" ? { opacity: 0.5, } : {}]
            },
          ]}
        />}
        <View style={{ flex: 1 }}>
          {value === "getAll" && <ShiftPlanComponent />}
          {value === "create" && <CreateShiftPlanComponent />}
          {value === "update" && <UpdateShiftPlan />}
        </View>
      </View>
    </SafeAreaView>
  )
}
