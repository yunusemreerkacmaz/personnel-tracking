import React, { useState } from 'react'
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { HelperTextTimeDto, initialTimeDto, TimeDto } from '../../Helpers/DataGrid/CrudTimeDto';
import { HelperTextDto } from '../Admin/AddUser/Dtos/userDto';

interface IProps {
    reset: boolean,
    setStoreTime: React.Dispatch<React.SetStateAction<TimeDto>>,
    storeTime: TimeDto,
    setHelperTextTimeDto: React.Dispatch<React.SetStateAction<HelperTextTimeDto>>,
    helperTextTimeDto: HelperTextDto
}

export default function TimePickerRangeModal(props: IProps) {
    const { reset, setStoreTime, storeTime, helperTextTimeDto, setHelperTextTimeDto } = props
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const [localTime, setLocalTime] = useState<TimeDto>(initialTimeDto)

    if (storeTime.startDate != localTime.startDate || storeTime.endDate != localTime.endDate) {  // localtime değiştiğinde çalışacak alan
        if (true) {  // storeTime.startDate && storeTime.endDate
            setLocalTime(prev => ({
                ...prev,
                endDate: storeTime.endDate,
                startDate: storeTime.startDate,
                showStartDate: `${storeTime.startDate && new Date(storeTime.startDate).getHours() < 10 ? "0" + new Date(storeTime.startDate).getHours() : storeTime.startDate && new Date(storeTime.startDate).getHours()}:${storeTime.startDate && new Date(storeTime.startDate).getMinutes() < 10 ? "0" + new Date(storeTime.startDate).getMinutes() : storeTime.startDate && new Date(storeTime.startDate).getMinutes()}`,
                showEndDate: `${storeTime.endDate && new Date(storeTime.endDate).getHours() < 10 ? "0" + new Date(storeTime.endDate).getHours() : storeTime.endDate && new Date(storeTime.endDate).getHours()}:${storeTime.endDate && new Date(storeTime.endDate).getMinutes() < 10 ? "0" + new Date(storeTime.endDate).getMinutes() : storeTime.endDate && new Date(storeTime.endDate).getMinutes()}`
            }))
        }
        if (reset) {
            setLocalTime(initialTimeDto)
        }
    }

    const onStartConfirm = ({ hours, minutes }: any) => { // Modal kapandığında (startDate)
        let startDate = new Date();
        startDate.setHours(hours);
        startDate.setMinutes(minutes);

        setStoreTime(prev => ({
            ...prev,
            startDate: `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`
        }))
        setLocalTime(prev => ({
            ...prev,
            startDate: `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`
        }))
        setHelperTextTimeDto(prev => ({ ...prev, startDate: false }))
        setStartOpen(false);
    };

    const onEndConfirm = ({ hours, minutes }: any) => {                                                          // Modal kapandığında (endDate)
        let endDate = new Date();
        endDate.setHours(hours);
        endDate.setMinutes(minutes);

        setStoreTime(prev => ({
            ...prev,
            endDate: `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`
        }))
        setLocalTime(prev => ({
            ...prev,
            endDate: `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`
        }))
        setHelperTextTimeDto(prev => ({ ...prev, endDate: false }))
        setEndOpen(false);
    };

    return <View style={{}}>
        {/* Başlangıç Saati Seçici */}
        <TextInput                                                                                              // saatin yazıldığı text (startDate)
            label="Başlangıç Saati"
            onBlur={() => { localTime.startDate && setHelperTextTimeDto({ ...helperTextTimeDto, startDate: storeTime.startDate ? false : true }) }}
            value={localTime.startDate?.substring(0,5) || ""}
            mode="outlined"
            right={<TextInput.Icon icon="clock" onPress={() => {                                                // Saat ikonuna tıklandığında (startDate)
                setStartOpen(true)
                if (!localTime.startDate) {
                    setHelperTextTimeDto(prev => ({ ...prev, startDate: true }))
                }
            }} />}
            editable={false}
        />
        {helperTextTimeDto.startDate && <HelperText type="error" visible={helperTextTimeDto.startDate}>Lütfen başlangıç saati girin </HelperText>}
        {/* Bitiş Saati Seçici */}
        <TextInput
            label="Bitiş Saati"                                                                                 // saatin yazıldığı text (endDate)
            onBlur={() => { localTime.endDate && setHelperTextTimeDto({ ...helperTextTimeDto, endDate: storeTime.endDate ? false : true }) }}
            value={localTime.endDate?.substring(0,5) || ""}
            mode="outlined"
            right={<TextInput.Icon icon="clock" onPress={() => {                                                 // Saat ikonuna tıklandığında (startDate)
                setEndOpen(true)
                if (!localTime.endDate) {
                    setHelperTextTimeDto(prev => ({ ...prev, endDate: true }))
                }
            }} />}
            editable={false}
        />
        {helperTextTimeDto.endDate && <HelperText type="error" visible={helperTextTimeDto.endDate}>Lütfen bitiş saati girin </HelperText>}
        {/* Başlangıç Saati  modalı */}
        <TimePickerModal
            locale="tr"
            visible={startOpen}
            onDismiss={() => setStartOpen(false)}
            onConfirm={onStartConfirm}
            hours={localTime.startDate ? parseInt(localTime.startDate.substring(0, 2)) : 8} // Varsayılan saat
            minutes={localTime.startDate ? parseInt(localTime.startDate.substring(3, 5)) : 30} // Varsayılan dakika
        />
        {/* Bitiş Saati Seçici modalı*/}
        <TimePickerModal
            locale="tr"
            visible={endOpen}
            onDismiss={() => setEndOpen(false)}
            onConfirm={onEndConfirm}
            hours={localTime.endDate ? parseInt(localTime.endDate.substring(0, 2)) : 18}
            minutes={localTime.endDate ? parseInt(localTime.endDate.substring(3, 5)) : 45}
        />
    </View>
}
