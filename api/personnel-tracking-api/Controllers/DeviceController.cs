using Bussiness.ServiceResults;
using Bussiness.Services.DeviceService;
using Bussiness.Services.DeviceService.Dtos;
using Bussiness.Services.UserService.Dtos;
using Entity;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController(IDeviceService deviceService) : ControllerBase
    {
        private readonly IDeviceService _deviceService = deviceService;

        [HttpGet("GetDistinctDevices")]
        public async Task<ServiceResult<DeviceDto>> GetDistinctDevices()
        {
            var getDistinctDevices = await _deviceService.GetDistinctDevicesService();
            return getDistinctDevices;
        }

        [HttpGet("GetDevices")]
        public async Task<ServiceResult<UserDto>> GetDevices()
        {
            var getApprovedUser = await _deviceService.GetDevicesService();
            return getApprovedUser;
        }

        [HttpPost("UpdateDevice")]
        public async Task<ServiceResult<DeviceDto>> UpdateDevice([FromBody] DeviceDto deviceDto)
        {
            var updateDevice = await _deviceService.UpdateDeviceService(deviceDto);
            return updateDevice;
        }
        [HttpDelete("DeleteDevice/{userId}")]
        public async Task<ServiceResult<bool>> DeleteDevice(int userId)
        {
            var deleteDevice = await _deviceService.DeleteDeviceService(userId);
            return deleteDevice;
        }
        [HttpPost("CheckDevice")]
        public async Task<ServiceResult<DeviceDto>> CheckDevice(DeviceDto deviceDto)
        {
            var checkDevice = await _deviceService.CheckDeviceService(deviceDto);
            return checkDevice;
        }
    }
}
