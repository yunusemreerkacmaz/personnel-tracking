export enum BarcodeDataEnum {
    InputData = "Modalife Giriş",
    OutData = "Modalife Çıkış"
}
export enum BarcodeReadEnum {
    Entreance = 1,                 // Barcode sabah giriş
    Exit = 2,                       //  Barcode akşam çıkış
    Default = 3
}
export enum InputOrOutStatus {
    Input = "Giriş Yapıldı",
    Out = "Çıkış Yapıldı",
    Default = "Giriş veya çıkış yapılmadı"
}