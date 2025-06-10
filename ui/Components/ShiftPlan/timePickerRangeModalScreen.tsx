import { useCallback, useEffect, useMemo, useState } from "react"
import { HelperTextTimeDto, initialHelperTextTimeDto, initialTimeDto, TimeDto } from "../../Helpers/DataGrid/CrudTimeDto"
import { CreateShiftDto, initialCreateShiftDto, TableBodyHelperTextDto } from "./Dtos/shipPlanDto"
import { Avatar, Button, Card, Chip, Divider, IconButton, RadioButton, Text } from "react-native-paper"
import { Modal, View } from "react-native"
import TimePickerRangeModal from "../Stores/timePickerRangeModal"
import { DaysOfWeekShortKeyEnumEN, DaysOfWeekShortValueEnumEN } from "../../Enums/AbbreviationsEnum"
import { useFocusEffect } from "@react-navigation/native"

type ITimeRangeProps = {
    shiftPlan: CreateShiftDto,
    setShiftPlan: React.Dispatch<React.SetStateAction<CreateShiftDto>>
    handleCloseModal: () => void,
    visible: boolean,
    day: DaysOfWeekShortKeyEnumEN | null
    setFormHelperText: React.Dispatch<React.SetStateAction<TableBodyHelperTextDto>>
}
export const TimePickerRangeModalView = (props: ITimeRangeProps) => {
    const { handleCloseModal, visible, shiftPlan, setShiftPlan, day, setFormHelperText, } = props
    const [helperTextTimeDto, setHelperTextTimeDto] = useState<HelperTextTimeDto>(initialHelperTextTimeDto)
    const [reset, setReset] = useState<boolean>(false)
    const [shiftTime, setShiftTime] = useState<TimeDto>(initialTimeDto)
    // const value = shiftPlan.permissions[DaysOfWeekShortValueEnumEN[day as keyof typeof day]]
    const key = DaysOfWeekShortValueEnumEN[day as keyof typeof day]
    const data : string = shiftPlan.permissions[key]

    useFocusEffect(
        useCallback(
            () => {
                if (!data) {
                    setShiftTime(initialTimeDto)
                }
                else{
                    if (data!=="İzinli") {
                       let time = data.split("-")
                    setShiftTime({startDate:time[0],endDate:time[1]})
                    }
                }
            },
            [day],
        )
    )

    const handleChange = () => {
        if (data !== "") {
            setShiftTime(prev => ({ ...prev, startDate: null, endDate: null }))
            setShiftPlan(prev => ({ ...prev, permissions: { ...prev.permissions, [key]: null } }))
        }
        setShiftPlan(prev => ({ ...prev, permissions: { ...prev.permissions, [key]: data === "" || (shiftTime.startDate != null || shiftTime.endDate != null) ? "İzinli" : "" } }))
    }
    useEffect(() => {
        if (shiftTime.startDate || shiftTime.endDate) {
            if (shiftTime.startDate && shiftTime.endDate) {
                setShiftPlan(prev => ({ ...prev, permissions: { ...prev.permissions, [key]: `${shiftTime.startDate}-${shiftTime.endDate}` } }))
            }
            else if (shiftTime.startDate) {
                setShiftPlan(prev => ({ ...prev, permissions: { ...prev.permissions, [key]: shiftTime.startDate } }))
            }
            else if (shiftTime.endDate) {
                setShiftPlan(prev => ({ ...prev, permissions: { ...prev.permissions, [key]: `-${shiftTime.endDate}` } }))
            }
        }
    }, [shiftTime])

    const titleText = useMemo(() => {
        switch (day) {
            case DaysOfWeekShortKeyEnumEN.monday: return "Pazartesi Vardiyasını Girin";
            case DaysOfWeekShortKeyEnumEN.tuesday: return "Salı Vardiyasını Girin";
            case DaysOfWeekShortKeyEnumEN.wednesday: return "Çarşamba Vardiyasını Girin";
            case DaysOfWeekShortKeyEnumEN.thursday: return "Perşembe Vardiyasını Girin";
            case DaysOfWeekShortKeyEnumEN.friday: return "Cuma Vardiyasını Girin";
            case DaysOfWeekShortKeyEnumEN.saturday: return "Cumartesi Vardiyasını Girin";
            case DaysOfWeekShortKeyEnumEN.sunday: return "Pazar Vardiyasını Girin";
            default: return "Hata Oluştu";
        }
    }, [day]);

    const handleReset = () => {
        handleChange()
        setReset(true)
        setShiftPlan(initialCreateShiftDto)
        setShiftTime(prev => ({ ...prev, startDate: null, endDate: null }))
    }
    const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} style={{ marginTop: 20, marginBottom: 10 }} color='#5a189a' icon="account" />

    return <Modal
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
                <Card elevation={5} style={{ backgroundColor: '#1b263b' }}>
                    <Card.Title subtitleStyle={{ opacity: 0.5, color: "#fe7f2d", fontFamily: 'fantasy', fontWeight: 'bold', marginBottom: 10 }} titleStyle={{ fontWeight: 'bold', color: "#9d4edd", marginTop: 20 }} title="VARDİYA BİLGİLERİ" subtitle={`${titleText} `} left={UpdateUserLeftContent} right={() => {
                        return <View style={{ alignItems: 'flex-end' }}>
                            <IconButton
                                icon="close"
                                selected
                                iconColor={'red'}
                                style={{ marginHorizontal: 10, position: 'static' }}
                                size={30}
                                onPress={() => {
                                    handleCloseModal()
                                    if ((shiftTime.startDate && shiftTime.endDate) || data === "İzinli") {
                                        setFormHelperText(prev => ({ ...prev, [key]: false }))
                                    }
                                    else {
                                        setFormHelperText(prev => ({ ...prev, [key]: true }))
                                    }
                                }} />
                        </View>
                    }} />
                    <Divider />
                    <Card.Content style={{ flex: 1, minWidth: '100%' }}>
                        <Chip style={[{ width: '100%', marginTop: 10 }, data === "" ? { backgroundColor: "#fb8500" } : { backgroundColor: "#34a0a4", marginTop: 10 }]} textStyle={{ fontStyle: 'italic', color: "#34a0a4", fontSize: 12, }} mode='flat'>
                            <View style={{ width: '99%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text variant='titleMedium' style={{ color: '' }}>{data === "" ? "İzin Durumu" : data}</Text>
                                <RadioButton
                                    value={data}
                                    status={data === "İzinli" ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleChange()
                                    }}
                                />
                            </View>
                        </Chip>
                        {data !== "İzinli" && <TimePickerRangeModal setStoreTime={setShiftTime} storeTime={shiftTime} reset={reset} helperTextTimeDto={helperTextTimeDto} setHelperTextTimeDto={setHelperTextTimeDto} key={data} />}
                        <Card.Actions >
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Button icon="delete" mode="contained" onPress={() => {
                                    handleReset()
                                }} style={{ marginVertical: 10 }}>
                                    Formu Resetle
                                </Button>
                            </View>
                        </Card.Actions>
                    </Card.Content>
                </Card>
            </View>
        </View>
    </Modal>
}