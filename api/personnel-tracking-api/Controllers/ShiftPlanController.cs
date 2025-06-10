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
        [HttpGet("GetUserShiftPlans/{userId}")]
        public async Task<ServiceResult<ShiftPlanDto>> GetUserShiftPlans(int userId)
        {
            var result = await _shiftPlanService.GetUserShiftPlansService(userId);
            return result;
        }
        [HttpGet("GetShiftPlans")]
        public async Task<ServiceResult<TableBodyDto>> GetShiftPlans()
        {
            var result = await _shiftPlanService.GetShiftPlansService();
            return result;
        }
        [HttpPost("GetUsers")]
        public async Task<ServiceResult<UserDto>> GetUsers([FromBody] FilterShiftPlanDto filterDto)
        {
            var result = await _shiftPlanService.GetUsersService(filterDto);
            return result;
        }
        [HttpPost("CreateShiftPlan")]
        public async Task<ServiceResult<CreateShiftDto>> CreateShiftPlan([FromBody] CreateShiftDto createShiftDto)
        {
            var result = await _shiftPlanService.CreateShiftPlanService(createShiftDto);
            return result;
        }
    }
}
