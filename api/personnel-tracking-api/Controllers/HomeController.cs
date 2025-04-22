using Bussiness.ServiceResults;
using Bussiness.Services.HomeService;
using Bussiness.Services.HomeService.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController(IHomeService homeService) : ControllerBase
    {
        private readonly IHomeService _homeService = homeService;

        [HttpPost("GetPersonnelIO")]
        public async Task<ServiceResult<DataGridDto<PersonnelDto>>> GetPersonnelIO([FromBody] PaginationDto pagination)
        {
            var personnelsIO = await _homeService.GetPersonnelIO(pagination);
            return personnelsIO;
        }
    }
}
