//using Bussiness.ServiceResults;
//using Bussiness.Services.BarcodeService;
//using Bussiness.Services.BarcodeService.Dtos;
//using Microsoft.AspNetCore.Mvc;

//namespace personnel_tracking_api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class BarcodeController(IBarcodeService barcodeService) : Controller
//    {
//        private readonly IBarcodeService _barcodeService = barcodeService;

//        [HttpPost("BarcodeReadAsync")]
//        public async Task<ServiceResult<BarcodeDto>> BarcodeReadAsync([FromBody] BarcodeDto barcodeDto)
//        {
//            var barcode = await _barcodeService.BarcodeReadAsync(barcodeDto);
//            return barcode;
//        }
//        [HttpPost("BarcodeCheckAsync")]
//        public async Task<ServiceResult<BarcodeDto>> BarcodeCheckAsync([FromBody] BarcodeDto barcodeDto)
//        {
//            var barcode = await _barcodeService.BarcodeCheckAsync(barcodeDto);
//            return barcode;
//        }
//    }
//}
