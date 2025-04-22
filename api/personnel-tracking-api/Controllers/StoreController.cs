using Bussiness.ServiceResults;
using Bussiness.Services.Stores;
using Bussiness.Services.Stores.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly IStoreService _storeService;
        public StoreController(IStoreService storeService)
        {
            _storeService = storeService;
        }
        [HttpPost("GetStores")]
        public async Task<ServiceResult<StoreDto>> GetStores([FromBody] StoreFilterDto storeFilterDto)
        {
            var getStores = await _storeService.GetStores(storeFilterDto);
            return getStores;
        }
        [HttpPost("AddStore")]
        public async Task<ServiceResult<StoreDto>> AddStore([FromBody] StoreDto storeDto)
        {
            var addedStore = await _storeService.AddStore(storeDto);
            return addedStore;
        }
        [HttpPut("UpdateStore")]
        public async Task<ServiceResult<StoreDto>> UpdateStore([FromBody] StoreDto storeDto)
        {
            var addedStore = await _storeService.UpdateStore(storeDto);
            return addedStore;
        }
        [HttpDelete("DeleteStore")]
        public async Task<ServiceResult<StoreDto>> DeleteStore([FromBody] List<StoreDto> storeDto)
        {
            var addedStore = await _storeService.DeleteStore(storeDto);
            return addedStore;
        }
    }
}
