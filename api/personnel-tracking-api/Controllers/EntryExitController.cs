using Bussiness.ServiceResults;
using Bussiness.Services.EntryExitService;
using Bussiness.Services.EntryExitService.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntryExitController(IEntryExitService entryExitService) : ControllerBase
    {
     private readonly IEntryExitService _entryExitService=entryExitService;
        [HttpPost("EntryExitRead")]
        public async Task<ServiceResult<EntryExitDto>> EntryExitRead([FromBody] EntryExitDto entryExitDto)
        {
            var entryExitReadService = await _entryExitService.EntryExitReadService(entryExitDto);
            return entryExitReadService;
        }
        [HttpPost("EntryExitCheck")]
        public async Task<ServiceResult<EntryExitDto>> EntryExitCheck([FromBody] EntryExitDto entryExitDto)
        {
            var entryExitCheckService = await _entryExitService.EntryExitCheckService(entryExitDto);
            return entryExitCheckService;
        }
    }
}
