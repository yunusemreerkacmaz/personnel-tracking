namespace Bussiness.Helper.Enums
{
    public enum EntryExitEnum
    {
        Entreance = 1,           // Barcode sabah giriş
        Exit = 2,               //  Barcode akşam çıkış
        Default = 3
    }

    public enum EntranceOrExitTypeEnum
    {
        Biometric = 1,           // Biometric giriş
        Barcode = 2,             // Barcode giriş
        AdminApprove = 3,
        Default = 4
    }

    public static class ExitEntryConvert
    {
        public static string EnumConvertToString(EntranceOrExitTypeEnum entranceOrExitTypeEnum)
        {
            switch (entranceOrExitTypeEnum)
            {
                case EntranceOrExitTypeEnum.Biometric:
                    return "Biyometrik";
                case EntranceOrExitTypeEnum.Barcode:
                    return "Barkod";
                case EntranceOrExitTypeEnum.AdminApprove:
                    return "Admin Onay";
                case EntranceOrExitTypeEnum.Default:
                    return "";
                default:
                    return "";
            }
        }
        public static EntranceOrExitTypeEnum StringConvertToEnum(string? entranceOrExitTypeEnum)
        {
            switch (entranceOrExitTypeEnum)
            {
                case "Biyometrik":
                    return EntranceOrExitTypeEnum.Biometric;
                case "Barkod":
                    return EntranceOrExitTypeEnum.Barcode;
                case "Admin Onay":
                    return EntranceOrExitTypeEnum.AdminApprove;
                case null:
                    return EntranceOrExitTypeEnum.Default;
                case "":
                    return EntranceOrExitTypeEnum.Default;
                default:
                    return EntranceOrExitTypeEnum.Default;
            }
        }
    }

}
