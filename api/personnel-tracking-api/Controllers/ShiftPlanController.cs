using Bussiness.ServiceResults;
using Bussiness.Services.ShiftPlanService;
using Bussiness.Services.ShiftPlanService.Dtos;
using Bussiness.Services.UserService.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftPlanController(IShiftPlanService shiftPlanService) : ControllerBase
    {
        private readonly IShiftPlanService _shiftPlanService = shiftPlanService;
        [HttpGet("GetWeekShiftPlans/{userId}")]
        public async Task<ServiceResult<ShiftPlanDto>> GetWeekShiftPlans(int userId)        // Kullanıcının bulunduğu haftanın verileri
        {
            var result = await _shiftPlanService.GetWeekShiftPlansService(userId);
            return result;
        }
        [HttpGet("GetShiftPlans")]
        public async Task<ServiceResult<TableBodyDto>> GetShiftPlans()                      // Tüm vardiyalar
        {
            var result = await _shiftPlanService.GetShiftPlansService();
            return result;
        }
        [HttpGet("GetUsersShiftPlan")]
        public async Task<ServiceResult<TableBodyDto>> GetUsersShiftPlan()                  // Kullanıcıların vardiyalarının listesi(Tüm kullanıcılar listelendi)
        {
            var result = await _shiftPlanService.GetUsersShiftPlanService();
            return result;
        }
        [HttpPost("CreateShiftPlan")]
        public async Task<ServiceResult<CreateShiftDto>> CreateShiftPlan([FromBody] CreateShiftDto createShiftDto)  // Vardiya oluşturuldu
        {
            var result = await _shiftPlanService.CreateShiftPlanService(createShiftDto);
            return result;
        }
        [HttpPost("GetUsers")]
        public async Task<ServiceResult<UserDto>> GetUsers([FromBody] FilterShiftPlanDto filterDto)     // Kullanıcılar
        {
            var result = await _shiftPlanService.GetUsersService(filterDto);
            return result;
        }
    }
}
