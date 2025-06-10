import React, { useState } from 'react'
import { Avatar, Card, Chip, Divider, IconButton } from 'react-native-paper'
import { Modal, ScrollView, View,StyleSheet } from 'react-native'
import { CreateShiftDto, initialCreateShiftDto, initialTableBodyDto, initialTableBodyHelperTextDto, TableBodyDto, TableBodyHelperTextDto } from './Dtos/shipPlanDto'
import { TimePickerRangeModalView } from './timePickerRangeModalScreen'
import { DaysOfWeekShortKeyEnumEN } from '../../Enums/AbbreviationsEnum'
import { LinearGradient } from 'expo-linear-gradient'

type IProps = {
    shiftPlanItem: TableBodyDto,
    handleCloseModal: () => void,
    visible: boolean,
}

export default function UpdateShiftPlanModal(props: IProps) {
    const { handleCloseModal, shiftPlanItem, visible } = props
    const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} style={{ marginTop: 20 }} color='#5a189a' icon="account" />
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const handleCloseTimeModal = () => { setToggleModal(false) }
    const handleOpenTimeModal = () => { setToggleModal(true) }
    const [shiftPlan, setShiftPlan] = useState<CreateShiftDto>(initialCreateShiftDto)
    const [day, setDay] = useState<DaysOfWeekShortKeyEnumEN | null>(null)
    const [formHelperText, setFormHelperText] = useState<TableBodyHelperTextDto>(initialTableBodyHelperTextDto)


 
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleCloseModal}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    margin: 10,
                    borderRadius: 10,
                }}
                >
                    <ScrollView>
                        <Card elevation={5} style={{ flex: 1, backgroundColor: '#1b263b' }}>
                            <Card.Title subtitleStyle={{ opacity: 0.5, color: "#fe7f2d", fontFamily: 'fantasy', fontWeight: 'bold' }} titleStyle={{ fontWeight: 'bold', color: "#9d4edd", marginTop: 20 }} title="KULLANICI BİLGİLERİ" subtitle={`${shiftPlanItem.id} - ${shiftPlanItem.shiftPlanName} `} left={UpdateUserLeftContent} right={() => {
                                return <View style={{ alignItems: 'flex-end' }}>
                                    <IconButton
                                        icon="close"
                                        selected
                                        iconColor={'red'}
                                        style={{ marginHorizontal: 10, position: 'static' }}
                                        size={30}
                                        onPress={() => {
                                            handleCloseModal()
                                        }} />
                                </View>
                            }} />
                            <Divider />
                            <Card.Content style={{ flex: 1, minWidth: '100%' }}>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Pazartesi</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={"#8ecae6"}
                                            size={20}
                                            onPress={() => setToggleModal(true)}
                                        />
                                    </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Salı</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={"#8ecae6"}
                                            size={20}
                                            onPress={() => setToggleModal(true)}
                                        />
                                    </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Çarşamba</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={"#8ecae6"}
                                            size={20}
                                            onPress={() => setToggleModal(true)}
                                        />
                                    </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Perşembe</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={"#8ecae6"}
                                            size={20}
                                            onPress={() => setToggleModal(true)}
                                        />
                                    </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Cuma</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={"#8ecae6"}
                                            size={20}
                                            onPress={() => setToggleModal(true)}
                                        />
                                    </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Cumartesi</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={"#8ecae6"}
                                            size={20}
                                            onPress={() => setToggleModal(true)}
                                        />
                                    </Chip>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Chip style={{ width: '35%', backgroundColor: '#343a40', paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }} textStyle={{ fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'fantasy', color: "#34a0a4", fontSize: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }} mode='flat'>Pazar</Chip>
                                    <Chip style={{ width: '60%', backgroundColor: '#343a40' }} textStyle={{ color: 'white' }} mode='flat'>
                                        <IconButton
                                            icon="calendar-edit"
                                            iconColor={"#8ecae6"}
                                            size={20}
                                            onPress={() => setToggleModal(true)}
                                        />
                                    </Chip>
                                </View>
                            </Card.Content>
                            <TimePickerRangeModalView handleCloseModal={handleCloseTimeModal} shiftPlan={shiftPlan} visible={toggleModal} setShiftPlan={setShiftPlan} day={day}  setFormHelperText={setFormHelperText} />
                        </Card>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

