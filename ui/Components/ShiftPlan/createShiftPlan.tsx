import React, { useState } from 'react'
import { FlatList, ScrollView, View, StyleSheet } from 'react-native'
import { Avatar, Button, Card, Chip, Divider, HelperText, IconButton, Searchbar, Text, TextInput } from 'react-native-paper'
import { CreateShiftDto, initialCreateShiftDto, initialTableBodyDto, initialTableBodyHelperTextDto, ShiftPlanDto, TableBodyDto, TableBodyHelperTextDto } from './Dtos/shipPlanDto'
import { TimePickerRangeModalView } from './timePickerRangeModalScreen'
import { DaysOfWeekShortKeyEnumEN } from '../../Enums/AbbreviationsEnum'
import { CreateShiftPlan } from './Requests/store'
import { ResponseStatus } from '../../ServiceResults/serviceResult'
import Toast from 'react-native-toast-message'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FlipInEasyX, FlipInEasyY } from 'react-native-reanimated'
import AniamtedButton from '../../Helpers/Button/animatedButton'

export default function CreateShiftPlanComponent() {
    const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} color='#5a189a' icon="account" />
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const handleCloseTimeModal = () => { setToggleModal(false) }
    const handleOpenTimeModal = () => { setToggleModal(true) }
    const [formHelperText, setFormHelperText] = useState<TableBodyHelperTextDto>(initialTableBodyHelperTextDto)
    const [day, setDay] = useState<DaysOfWeekShortKeyEnumEN | null>(null)
    const [shiftPlan, setShiftPlan] = useState<CreateShiftDto>(initialCreateShiftDto)
    const [visible, setVisible] = useState(true)

    const handleChange = (text: string, name: string) => {
        setShiftPlan(prev => ({ ...prev, [name]: text }))
        setFormHelperText(prev => ({ ...prev, shiftPlanName: text ? false : true }))
    }

    const handleSubmit = async () => {
        let formTextHelperControl = Object.values(formHelperText).every(x => x === false) && shiftPlan.shiftPlanName != ""
        setVisible(!visible)
        // setTimeout(() => {
        //     setVisible(true)
        // }, 1000);
        if (formTextHelperControl) {
            let response = await CreateShiftPlan(shiftPlan)
            if (response?.responseStatus === ResponseStatus.IsSuccess) {
                Toast.show({ text1: "Ekleme İşlemi", text2: response.responseMessage, type: 'success' })
                setShiftPlan(initialCreateShiftDto)
                setFormHelperText(initialTableBodyHelperTextDto)
            }
            else if (response?.responseStatus === ResponseStatus.IsWarning) {
                Toast.show({ text1: "Güncelleme", text2: response.responseMessage, type: 'info' })
            }
            else {
                Toast.show({ text1: "Hata Oluştu", type: 'error' })
            }
        }
    }
    const styles = StyleSheet.create({
        linearGradient: {
            flex: 1,
            opacity: 1.5,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20
        }
    })

    const createShipPlanAnimation = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                // entering={FadeInDown.delay(500)}
            >
                <ScrollView>
                    <Card elevation={5} style={{ flex: 1, marginTop: 10, margin: 10, backgroundColor: '#1b263b', borderRadius: 20 }}>
                        <LinearGradient colors={['black', '#3F638C', "#012a4a"]} style={styles.linearGradient}>
                            <Card.Title subtitleStyle={{ opacity: 0.5, color: 'white' }} titleStyle={{ fontWeight: 'bold', color: 'white' }} title="VARDİYA EKLE" subtitle="Vardiya eklemek için aşağıdakileri doldur" left={UpdateUserLeftContent} />
                            <Divider />
                            <Card.Content>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Vardiya Adı</Chip>
                                    <TextInput
                                        onBlur={() => { shiftPlan.shiftPlanName && setFormHelperText({ ...formHelperText, shiftPlanName: shiftPlan.shiftPlanName === "" ? true : false }) }}
                                        mode='outlined'
                                        activeOutlineColor='green'
                                        onChangeText={text => { handleChange(text, 'shiftPlanName') }}
                                        value={shiftPlan.shiftPlanName ?? ""}
                                        label="Vardiya adı girin . . ."
                                        style={{ width: 90, minWidth: '60%', height: 40, backgroundColor: "white" }}
                                        error={formHelperText.shiftPlanName === true}
                                    />
                                </View>
                                {formHelperText.shiftPlanName && <HelperText style={{ color: "#d00000" }} type="error" visible={formHelperText.shiftPlanName}>Lütfen Vardiya adı girin...</HelperText>}
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Pazartesi</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={formHelperText.monday === true ? "red" : formHelperText.monday === false ? "green" : "#8ecae6"}
                                            size={20}
                                            onPress={() => {
                                                setDay(DaysOfWeekShortKeyEnumEN.monday)
                                                setToggleModal(true)
                                            }}
                                        />
                                        {shiftPlan.permissions.monday && <Chip style={shiftPlan.permissions.monday === "İzinli" ? { backgroundColor: '#ffca3a' } : { backgroundColor: '#a7c957' }}>{shiftPlan.permissions.monday}</Chip>}
                                    </Chip>
                                </View>
                                {formHelperText.monday && <HelperText style={{ color: "#d00000" }} type="error" visible={formHelperText.monday}>Lütfen pazartesi verilerini girin...</HelperText>}
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Salı</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={formHelperText.tuesday === true ? "red" : formHelperText.tuesday === false ? "green" : "#8ecae6"}
                                            size={20}
                                            onPress={() => {
                                                setDay(DaysOfWeekShortKeyEnumEN.tuesday)
                                                setToggleModal(true)
                                            }}
                                        />
                                        {shiftPlan.permissions.tuesday && <Chip style={shiftPlan.permissions.tuesday === "İzinli" ? { backgroundColor: '#ffca3a' } : { backgroundColor: '#a7c957' }}>{shiftPlan.permissions.tuesday}</Chip>}
                                    </Chip>
                                </View>
                                {formHelperText.tuesday && <HelperText style={{ color: "#d00000" }} type="error" visible={formHelperText.tuesday}>Lütfen salı verilerini girin...</HelperText>}
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Çarşamba</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={formHelperText.wednesday === true ? "red" : formHelperText.wednesday === false ? "green" : "#8ecae6"}
                                            size={20}
                                            onPress={() => {
                                                setDay(DaysOfWeekShortKeyEnumEN.wednesday)
                                                setToggleModal(true)
                                            }}
                                        />
                                        {shiftPlan.permissions.wednesday && <Chip style={shiftPlan.permissions.wednesday === "İzinli" ? { backgroundColor: '#ffca3a' } : { backgroundColor: '#a7c957' }}>{shiftPlan.permissions.wednesday}</Chip>}
                                    </Chip>
                                </View>
                                {formHelperText.wednesday && <HelperText style={{ color: "#d00000" }} type="error" visible={formHelperText.wednesday}>Lütfen çarşama verilerini girin...</HelperText>}
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Perşembe</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={formHelperText.thursday === true ? "red" : formHelperText.thursday === false ? "green" : "#8ecae6"}
                                            size={20}
                                            onPress={() => {
                                                setDay(DaysOfWeekShortKeyEnumEN.thursday)
                                                setToggleModal(true)
                                            }}
                                        />
                                        {shiftPlan.permissions.thursday && <Chip style={shiftPlan.permissions.thursday === "İzinli" ? { backgroundColor: '#ffca3a' } : { backgroundColor: '#a7c957' }}>{shiftPlan.permissions.thursday}</Chip>}
                                    </Chip>
                                </View>
                                {formHelperText.thursday && <HelperText style={{ color: "#d00000" }} type="error" visible={formHelperText.thursday}>Lütfen perşembe verilerini girin...</HelperText>}
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Cuma</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={formHelperText.friday === true ? "red" : formHelperText.friday === false ? "green" : "#8ecae6"}
                                            size={20}
                                            onPress={() => {
                                                setDay(DaysOfWeekShortKeyEnumEN.friday)
                                                setToggleModal(true)
                                            }}
                                        />
                                        {shiftPlan.permissions.friday && <Chip style={shiftPlan.permissions.friday === "İzinli" ? { backgroundColor: '#ffca3a' } : { backgroundColor: '#a7c957' }}>{shiftPlan.permissions.friday}</Chip>}
                                    </Chip>
                                </View>
                                {formHelperText.friday && <HelperText style={{ color: "#d00000" }} type="error" visible={formHelperText.friday}>Lütfen cuma verilerini girin...</HelperText>}
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Cumartesi</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={formHelperText.saturday === true ? "red" : formHelperText.saturday === false ? "green" : "#8ecae6"}
                                            size={20}
                                            onPress={() => {
                                                setDay(DaysOfWeekShortKeyEnumEN.saturday)
                                                setToggleModal(true)
                                            }}
                                        />
                                        {shiftPlan.permissions.saturday && <Chip style={shiftPlan.permissions.saturday === "İzinli" ? { backgroundColor: '#ffca3a' } : { backgroundColor: '#a7c957' }}>{shiftPlan.permissions.saturday}</Chip>}
                                    </Chip>
                                </View>
                                {formHelperText.saturday && <HelperText style={{ color: "#d00000" }} type="error" visible={formHelperText.saturday}>Lütfen cumartesi verilerini girin...</HelperText>}
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Pazar</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={formHelperText.sunday === true ? "red" : formHelperText.sunday === false ? "green" : "#8ecae6"}
                                            size={20}
                                            onPress={() => {
                                                setDay(DaysOfWeekShortKeyEnumEN.sunday)
                                                setToggleModal(true)
                                            }}
                                        />
                                        {shiftPlan.permissions.sunday && <Chip style={shiftPlan.permissions.sunday === "İzinli" ? { backgroundColor: '#ffca3a' } : { backgroundColor: '#a7c957' }}>{shiftPlan.permissions.sunday}</Chip>}
                                    </Chip>
                                </View>
                                {formHelperText.sunday && <HelperText style={{ color: "#d00000" }} type="error" visible={formHelperText.sunday}>Lütfen pazar verilerini girin...</HelperText>}
                            </Card.Content>
                            <TimePickerRangeModalView handleCloseModal={handleCloseTimeModal} shiftPlan={shiftPlan} visible={toggleModal} setShiftPlan={setShiftPlan} day={day} setFormHelperText={setFormHelperText} />
                            <Card.Actions style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>
                                <Button buttonColor='#6a994e' icon="content-save" mode="contained" onPress={() => handleSubmit()} style={{ marginVertical: 10 }}>
                                    Kaydet
                                </Button>
                            </Card.Actions>
                        </LinearGradient>
                    </Card>
                </ScrollView>
            </View >
        )
    }

    return <AniamtedButton visible={visible} setVisible={setVisible} key={visible ? "A":"B"}>
        {createShipPlanAnimation}
    </AniamtedButton>
}
