using Bussiness.Helper.Dtos;
using Bussiness.Helper.Enums;
namespace Bussiness.Services.EntryExitService.Dtos
{
    public class EntryExitDto
    {
        public int Id { get; set; }
        public LocationDto LocationDto { get; set; }     // Cihaz kullanıcısının koordinatları
        public EntryExitEnum? BarcodeReadEnum { get; set; }
        public EntryExitEnum? BiometricEnum { get; set; }
        public EntryExitEnum? AdminApproveEnum { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public int DeviceId { get; set; }
        public bool IsUserCompleteShift { get; set; }
    }
}
