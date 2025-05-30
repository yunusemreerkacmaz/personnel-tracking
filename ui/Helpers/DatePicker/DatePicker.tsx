import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Chip } from 'react-native-paper';
import { DatePickerModal,registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";

interface IProps {
    range: {
        startDate: undefined;
        endDate: undefined;
    },
    setRange: React.Dispatch<React.SetStateAction<{
        startDate: undefined;
        endDate: undefined;
    }>>
}

registerTranslation('tr', {
  save: 'Kaydet',
  selectSingle: 'Tarih seçin',
  selectMultiple: 'Tarihler seçin',
  selectRange: 'Tarih aralığı seçin',
  notAccordingToDateFormat: input => `Geçersiz format: ${input}`,
  mustBeHigherThan: date => `${date} tarihinden sonra olmalı`,
  mustBeLowerThan: date => `${date} tarihinden önce olmalı`,
  mustBeBetween: (startDate, endDate) => `${startDate} - ${endDate} arasında olmalı`,
  dateIsDisabled: 'Bu tarih seçilemez',
  previous: 'Önceki',
  next: 'Sonraki',
  typeInDate: 'Tarihi girin',
  pickDateFromCalendar: 'Takvimden tarih seçin',
  close: 'Kapat',
  hour:"saat",
  minute:"Dakika"
})

export default function DatePicker(props: IProps) {
    const { range, setRange }: any = props
    const [open, setOpen] = React.useState(false);
    
    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = React.useCallback(
        ({ startDate, endDate }: any) => {
            setOpen(false);
            setRange({ startDate, endDate });
        },
        [setOpen, setRange]
    );
    return (
        <SafeAreaProvider>
            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <Chip style={{ marginTop: 5 }} icon="calendar-month" onPress={() => setOpen(true)}>{range.startDate && range.endDate ? `${moment(range.startDate).format('DD.MM.YYYY')} - ${moment(range.endDate).format('DD.MM.YYYY')}` : "Tarih Aralığı Seçin"}</Chip>
                <DatePickerModal
                    locale="tr"
                    mode="range"
                    visible={open}
                    onDismiss={onDismiss}
                    startDate={range.startDate}
                    endDate={range.endDate}
                    onConfirm={onConfirm}
                />
            </View>
        </SafeAreaProvider>
    )
}