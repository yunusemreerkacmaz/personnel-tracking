using Bussiness.Services.UserService.Dtos;

namespace Bussiness.Services.DeviceService.Dtos
{
    public class DeviceDto
    {
        public int Id { get; set; }
        public string? DeviceBrand { get; set; }
        public string? DeviceModelName { get; set; }
        public string?  DeviceToken { get; set; }
        public bool? TokenDeletionStatus { get; set; } // Frontend den tokeni silme durumu
        public UserDto? UserDto { get; set; }
        public bool IsDeleted { get; set; }
        public string? DistinctDeviceModelName { get; set; } // sonradan girdiği cihazın modeli
        public string? DistinctDeviceBrand { get; set; }    // sonradan girdiği cihazın markası
    }

    public class DeviceHashDto
    {
        public int UserId { get; set; }
        public string DeviceBrand { get; set; }
        public string? DeviceModelName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
