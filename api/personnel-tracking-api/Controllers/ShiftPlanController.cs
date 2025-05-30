using Bussiness.ServiceResults;
using Bussiness.Services.ShiftPlanService;
using Bussiness.Services.ShiftPlanService.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftPlanController(IShiftPlanService shiftPlanService) : ControllerBase
    {
        private readonly IShiftPlanService _shiftPlanService = shiftPlanService;
        [HttpGet("GetShiftPlans/{userId}")]
        public async Task<ServiceResult<ShiftPlanDto>> GetShiftPlans(int userId)
        {
            var result = await _shiftPlanService.GetShiftPlansService(userId);
            return result;
        }
    }
}
