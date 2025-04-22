using Bussiness.Helper.Enums;
using Bussiness.Services.LoginService.Dtos;
using Bussiness.Services.Stores.Dtos;

namespace Bussiness.Services.BarcodeService.Dtos
{
    public class BarcodeDto
    {
        public int Id { get; set; }
        public LocationDto LocationDto { get; set; }     // Cihaz kullanıcısının koordinatları
        public string Data { get; set; }
        public BarcodeReadEnum? BarcodeReadEnum { get; set; }
        //public string? DeviceBrand { get; set; }
        //public string? DeviceToken { get; set; }
        //public string DeviceModelName { get; set; }
        public LoginDto LoginDto { get; set; } = new LoginDto();
        public StoreDto StoreDto { get; set; } = new StoreDto();          // Mağazanın koordinatları
        public int DeviceId { get; set; }
    }
}
