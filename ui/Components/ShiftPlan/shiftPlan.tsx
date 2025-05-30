import React, { useCallback, useState } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { GetShiftPlans } from './Requests/store'
import { initialShiftPlanDto, ShiftPlanDto, TableBodyDto } from './Dtos/shipPlanDto'
import { ResponseStatus } from '../../ServiceResults/serviceResult'
import Toast from 'react-native-toast-message'
import { daysOfWeek, DaysOfWeekDto } from '../../Helpers/AbbreviationLetter/AbbreviationLetter'
import moment from 'moment'
import { AbbreviationLetterDto, abbreviationLetterPermissions } from '../../Helpers/AbbreviationLetter/AbbreviationLetter'
import { useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { Avatar, Card, Chip, Text } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { DaysOfWeekShortValueEnumEN, PermissionsShortKeyEnum, PermissionsShortValueEnum } from '../../Enums/AbbreviationsEnum'

export default function ShiftPlanComponent() {
  const loginState = useSelector((state: RootState) => state.login)
  const [headers, setHeaders] = useState<DaysOfWeekDto[]>([loginState.userDto.id !== 1 ? { key: "H", titleTR: "Haftalar", titleEN: "weeks" } : { key: "K", titleEN: "users", titleTR: "Kullanıcılar" }, ...daysOfWeek, { key: "TS", titleEN: "totalTime", titleTR: "Toplam Saat" }])
  const [shiftPlans, setShiftPlans] = useState<ShiftPlanDto>(initialShiftPlanDto)
  const screenOrientation = useSelector((state: RootState) => state.screenOrientationSlice)
  const [abbreviationPermissions, setAbbreviationPermissions] = useState<AbbreviationLetterDto[]>([loginState.userDto.id !== 1 ? { key: "H", title: "Haftalar" } : { key: "K", title: "Kullanıcılar" },...abbreviationLetterPermissions, { key: "TS", title: "Toplam Saat" }])

  useFocusEffect(
    React.useCallback(() => {
      let getPersonnels = async () => {
        let response = await GetShiftPlans(loginState.isLoggedIn ? loginState.userDto.id : 0)
        if (response?.responseStatus === ResponseStatus.IsSuccess) {
          setShiftPlans(response.result)
        }
        else if (response?.responseStatus === ResponseStatus.IsWarning) {
          Toast.show({
            text1: "Uyarı !",
            type: 'info',
            text2: response.responseMessage
          })
        }
      }
      getPersonnels()
    }, [])
  );
  const styles = StyleSheet.create({
    table: {
      borderWidth: 0.5,
      borderColor: '#000',
    },
    row: {
      flexDirection: 'row',
    },
    cell: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // padding: 8,
      // height: windowHeight / 5.36,
      borderWidth: 0.5,
      borderColor: 'rgba(0, 0, 0, 0.3)',
    },
    headerCell: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      backgroundColor: '#62b6cb',
      borderWidth: 0.5,
      borderColor: 'rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      // paddingTop: 20,
      fontSize: 10
    },
  });
  {/* Tablo Body de hücrelerdeki sitiller */ }
  const handleCustomCellStyle = (item: TableBodyDto, header: DaysOfWeekDto) => {
    const cellValue = item[header.titleEN as keyof typeof item]
    if (cellValue === "Ücretsiz İzin") {
      return { backgroundColor: '#ff7d00' }
    }
    else if (cellValue === "Ücretli İzin") {
      return { backgroundColor: '#9d4edd' }
    }
    else if (cellValue === "Yıllık İzin") {
      return { backgroundColor: '#f4cae0' }
    }
    else if (cellValue === "Raporlu") {
      return { backgroundColor: '#fcca46' }
    }
    else if (cellValue === "Hafta Sonu Tatili") {
      return { backgroundColor: '#dd2d4a' }
    }
    else if (cellValue === "Resmi Tatil") {
      return { backgroundColor: '#c97c5d' }
    }
    else if (header.titleEN === "weeks" || header.titleEN === "users") {
      return { backgroundColor: '#faedcd' }
    }
    else if (header.titleEN === "totalTime") {
      return { backgroundColor: '#bbdefb' }
    }
    else {
      return { backgroundColor: '#92e6a7' }
    }
  }
  {/* Tablo Body de hücrelerdeki veriler */ }
  const handleCustomCellValue = useCallback(
    (item: TableBodyDto, header: DaysOfWeekDto, userId: number) => {
      const cellValue = item[header.titleEN as keyof typeof item]
      if (screenOrientation.isPortrait) {                                                 // Telefon Dikey konumda ise
        if (userId === 1 && item.lastName && item.firstName) {                           // Admin ise
          if (header.titleEN === "users") {
            const fullName = item.firstName.split(" ")
            if (fullName.length > 1) {
              return `${fullName[0][0]} ${fullName[1][0]} ${item.lastName[0]}`
            }
            else {
              return `${item.firstName[0]} ${item.lastName[0]}`
            }
          }
        }
        else {                                                                           // Personnel ise
            if (header.key === "H") {
            return <Text style={{fontSize:8}}>{moment(item["createTime"] as Date | null).format('DD.MM.YYYY')}</Text>
          }
        }
        if (cellValue === PermissionsShortValueEnum.ÜSZİ) {
          return PermissionsShortKeyEnum.Ücretsiz_İzin
        }
        if (cellValue === PermissionsShortValueEnum.Üİ) {
          return PermissionsShortKeyEnum.Ücretli_İzin
        }
        if (cellValue === PermissionsShortValueEnum.Yİ) {
          return PermissionsShortKeyEnum.Yıllık_İzin
        }
        if (cellValue === PermissionsShortValueEnum.R) {
          return PermissionsShortKeyEnum.Raporlu
        }
        if (cellValue === PermissionsShortValueEnum.HST) {
          return PermissionsShortKeyEnum.Hafta_Sonu_Tatili
        }
        if (cellValue === PermissionsShortValueEnum.RT) {
          return PermissionsShortKeyEnum.Resmi_Tatil
        }
        if (header.titleEN === "totalTime") {
          return item.totalTime
        }
        if (cellValue?.toString().includes("-")) {                                     // Vardiyaların harfi
          return PermissionsShortKeyEnum.Vardiya
        }
      }
      else {                                                                           // Telefon Yatay konumda ise
        if (userId === 1) {                                                            // Admin ise
          if (header.titleEN === "users") {
            return `${item.firstName} ${item.lastName}`
          }
          else {
            return cellValue
          }
        }
        else {                                                                         // Personel ise
          if (header.key === "H") {
            return moment(item["createTime"] as Date | null).format('DD.MM.YYYY')
          }
          else {
            return cellValue
          }
        }

      }
    },
    [screenOrientation.isPortrait],
  )
  {/* Tablo Card kısmı ve kısaltmaları sitiller */ }
  const handleAbbreviationStyle = (letter: DaysOfWeekDto | AbbreviationLetterDto, isPermissionOrDays: string) => {
    if (isPermissionOrDays === "Permission") {
      if (letter.key == PermissionsShortKeyEnum.Ücretsiz_İzin) {
        return { backgroundColor: '#ff7d00' }
      }
      else if (letter.key == PermissionsShortKeyEnum.Ücretli_İzin) {
        return { backgroundColor: '#9d4edd' }
      }
      else if (letter.key == PermissionsShortKeyEnum.Yıllık_İzin) {
        return { backgroundColor: '#f4cae0' }
      }
      else if (letter.key == PermissionsShortKeyEnum.Raporlu) {
        return { backgroundColor: '#fcca46' }
      }
      else if (letter.key == PermissionsShortKeyEnum.Hafta_Sonu_Tatili) {
        return { backgroundColor: '#dd2d4a' }
      }
      else if (letter.key == PermissionsShortKeyEnum.Resmi_Tatil) {
        return { backgroundColor: '#c97c5d' }
      }
       else if (letter.key == PermissionsShortKeyEnum.Vardiya) {
        return { backgroundColor: '#92e6a7' }
      }
      else if (letter.key == "TS") {
        return { backgroundColor: '#bbdefb' }
      }
      else if (letter.key == "K" ||letter.key=="H") {
        return { backgroundColor: '#faedcd' }
      }
    }
    if (isPermissionOrDays === "Days") {
      return { backgroundColor: '#62b6cb' }
    }
  }
  {/* Tablo Header kısmı Tarihleri ve kısaltmaları */ }
  const handleCustomHeaderValue = useCallback(
    (header: DaysOfWeekDto) => {
      let filter = headers.find(x => x.titleTR === header.titleTR)
      let date: string | null = null
      if (header.titleEN === DaysOfWeekShortValueEnumEN.PZT) {
        date = shiftPlans.tableHeader.mondayDate
      }
      else if (header.titleEN === DaysOfWeekShortValueEnumEN.S) {
        date = shiftPlans.tableHeader.tuesdayDate
      }
      else if (header.titleEN === DaysOfWeekShortValueEnumEN.ÇRŞ) {
        date = shiftPlans.tableHeader.wednesdayDate
      }
      else if (header.titleEN === DaysOfWeekShortValueEnumEN.PRŞ) {
        date = shiftPlans.tableHeader.thursdayDate
      }
      else if (header.titleEN === DaysOfWeekShortValueEnumEN.C) {
        date = shiftPlans.tableHeader.fridayDate
      }
      else if (header.titleEN === DaysOfWeekShortValueEnumEN.CRT) {
        date = shiftPlans.tableHeader.saturdayDate
      }
      else if (header.titleEN === DaysOfWeekShortValueEnumEN.S) {
        date = shiftPlans.tableHeader.sundayDate
      }
      if (screenOrientation.isPortrait) {  // Telefon Dikey ise
        if (loginState.userDto.id === 1) {
          return <>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#dd1c1a' }}>{filter?.key}</Text>
            <Text style={{ fontSize: 7, fontWeight: 'bold' }}>{date ? moment(date).format('DD.MM.YYYY') : ""}</Text>
          </>
        }
        else {
          return <>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#dd1c1a' }}>{filter?.key}</Text>
          </>
        }
      }
      else {                                // Telefon yatay ise
        if (loginState.userDto.id === 1) {
          return <>
            <Text style={{ fontSize: 13, color: '#dd1c1a' }}>{filter?.titleTR}</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{date ? moment(date).format('DD.MM.YYYY') : ""}</Text>
          </>
        }
        else {
          return <>
            <Text style={{ fontSize: 13, color: '#dd1c1a' }}>{filter?.titleTR}</Text>
          </>
        }
      }
    },
    [screenOrientation.isPortrait, shiftPlans],
  )
  {/* Card kısmındaki Kısaltmalar */ }
  const LeftContent = (props: any) => <Avatar.Icon {...props} icon="text-short" />
  const TableAbbreviation = () => (
    <Card style={{ backgroundColor: '#cfd7c7', borderRadius: 30, marginTop: 10 }}>
      <Card.Title title="Tablo Kısaltmaları ve Anlamları" subtitle="" left={LeftContent} />
      <Card.Content style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 10 }}>
          <View style={{ width: '48%', alignItems: 'center', margin: 0, padding: 0 }}>
            {
              headers.map((letter, index) => (
                <View key={index} style={{ flexDirection: 'row', gap: 5, margin: 2 }}>
                  <Chip style={[{ width: '65%' }, handleAbbreviationStyle(letter, "Days")]} textStyle={{ fontSize: 10 }} key={index + letter.titleTR} >{letter.titleTR}</Chip>
                  <Chip style={[{ width: '40%' }, handleAbbreviationStyle(letter, "Days")]} textStyle={{ fontSize: 10 }} key={index + letter.key} >{letter.key}</Chip>
                </View>
              ))
            }
          </View>
          <View style={{ width: '48%' }}>
            {
              abbreviationPermissions.map((letter, index) => (
                <View key={index} style={{ flexDirection: 'row', gap: 5, margin: 2 }}>
                  <Chip style={[{ width: '65%' }, handleAbbreviationStyle(letter, "Permission")]} textStyle={{ fontSize: 10 }} key={index + letter.title} >{letter.title}</Chip>
                  <Chip style={[{ width: '35%' }, handleAbbreviationStyle(letter, "Permission")]} textStyle={{ fontSize: 10 }} key={index + letter.key} >{letter.key}</Chip>
                </View>
              ))
            }
          </View>
        </View>
      </Card.Content>
    </Card>
  );
  {/* Tablo  */ }
  const UserShiftPlanComponent = () => {
    return (
      <View style={styles.table}>
        {/* Başlık */}
        <View style={styles.row}>
          {headers.map((header, index) => (
            <View key={index} style={[styles.cell, styles.headerCell]}>
              {handleCustomHeaderValue(header)}
            </View>
          ))}
        </View>

        {/* Satırlar */}
        {shiftPlans.tableBody.map((item, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {headers.map((header, colIndex) => (
              <TouchableOpacity style={[styles.cell, handleCustomCellStyle(item, header)]} key={colIndex} >
                <Text>{handleCustomCellValue(item, header, loginState.userDto.id)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    )
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <UserShiftPlanComponent />
        <TableAbbreviation />
      </ScrollView>
    </View>
  );
}