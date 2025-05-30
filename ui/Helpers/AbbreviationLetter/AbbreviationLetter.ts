import { DaysOfWeekShortKeyEnumEN, DaysOfWeekShortKeyEnumTR, DaysOfWeekShortValueEnumEN, PermissionsShortKeyEnum, PermissionsShortValueEnum,  } from "../../Enums/AbbreviationsEnum"

export type AbbreviationLetterDto = {
  title: string,
  key: string
}

export const abbreviationLetterPermissions: AbbreviationLetterDto[] = [
  { key: PermissionsShortKeyEnum.Ücretsiz_İzin, title: PermissionsShortValueEnum.ÜSZİ },
  { key: PermissionsShortKeyEnum.Ücretli_İzin, title: PermissionsShortValueEnum.Üİ },
  { key: PermissionsShortKeyEnum.Yıllık_İzin, title: PermissionsShortValueEnum.Yİ },
  { key: PermissionsShortKeyEnum.Raporlu, title: PermissionsShortValueEnum.R },
  { key: PermissionsShortKeyEnum.Hafta_Sonu_Tatili, title: PermissionsShortValueEnum.HST },
  { key: PermissionsShortKeyEnum.Resmi_Tatil, title: PermissionsShortValueEnum.RT },
  { key: PermissionsShortKeyEnum.Vardiya, title: PermissionsShortValueEnum.V },
]

export type DaysOfWeekDto = {
  titleTR: string,
  titleEN: string,
  key: string
}

export const daysOfWeek: DaysOfWeekDto[] = [
  { key: DaysOfWeekShortKeyEnumEN.monday, titleEN: DaysOfWeekShortValueEnumEN.PZT, titleTR: DaysOfWeekShortKeyEnumTR.PZT, },
  { key: DaysOfWeekShortKeyEnumEN.tuesday, titleEN: DaysOfWeekShortValueEnumEN.S, titleTR: DaysOfWeekShortKeyEnumTR.S},
  { key:DaysOfWeekShortKeyEnumEN.wednesday, titleEN: DaysOfWeekShortValueEnumEN.ÇRŞ, titleTR: DaysOfWeekShortKeyEnumTR.ÇRŞ },
  { key: DaysOfWeekShortKeyEnumEN.thursday, titleEN: DaysOfWeekShortValueEnumEN.PRŞ, titleTR: DaysOfWeekShortKeyEnumTR.PRŞ },
  { key: DaysOfWeekShortKeyEnumEN.friday, titleEN: DaysOfWeekShortValueEnumEN.C, titleTR: DaysOfWeekShortKeyEnumTR.C },
  { key: DaysOfWeekShortKeyEnumEN.saturday, titleEN: DaysOfWeekShortValueEnumEN.CRT, titleTR: DaysOfWeekShortKeyEnumTR.CRT},
  { key: DaysOfWeekShortKeyEnumEN.sunday, titleEN: DaysOfWeekShortValueEnumEN.P, titleTR: DaysOfWeekShortKeyEnumTR.P }
];

